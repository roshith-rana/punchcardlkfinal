-- ============================================================
-- Migration: 20240101000001_initial_schema.sql
-- Description: Create all core tables for PunchCardLK
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- TABLE: public.users
-- Mirrors auth.users; populated via trigger
-- ──────────────────────────────────────────────
CREATE TABLE public.users (
  id            uuid         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  mobile_number text         NOT NULL UNIQUE,
  first_name    text,
  last_name     text,
  birthday      date,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TABLE: public.superadmins
-- ──────────────────────────────────────────────
CREATE TABLE public.superadmins (
  id         uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TABLE: public.businesses
-- ──────────────────────────────────────────────
CREATE TABLE public.businesses (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text        NOT NULL,
  contact_email       text,
  contact_phone       text,
  address             text,
  logo_url            text,
  trial_start_date    date,
  trial_end_date      date,
  subscription_status text        NOT NULL DEFAULT 'trial'
    CHECK (subscription_status IN ('trial', 'active', 'expired', 'forever_free')),
  forever_free        boolean     NOT NULL DEFAULT false,
  is_active           boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TABLE: public.business_users
-- ──────────────────────────────────────────────
CREATE TABLE public.business_users (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid        NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text        NOT NULL CHECK (role IN ('admin', 'staff')),
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, user_id)
);

-- ──────────────────────────────────────────────
-- TABLE: public.outlets
-- ──────────────────────────────────────────────
CREATE TABLE public.outlets (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid        NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  address     text,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TABLE: public.staff_outlet_assignments
-- ──────────────────────────────────────────────
CREATE TABLE public.staff_outlet_assignments (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_user_id uuid        NOT NULL REFERENCES public.business_users(id) ON DELETE CASCADE,
  outlet_id        uuid        NOT NULL REFERENCES public.outlets(id) ON DELETE CASCADE,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_user_id, outlet_id)
);

-- ──────────────────────────────────────────────
-- TABLE: public.loyalty_cards
-- ──────────────────────────────────────────────
CREATE TABLE public.loyalty_cards (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           uuid        NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name                  text        NOT NULL,
  description           text,
  image_url             text,
  stamps_required       int         NOT NULL,
  reward_title          text        NOT NULL,
  reward_description    text,
  max_stamps_per_visit  int         NOT NULL DEFAULT 1,
  collect_bill_value    boolean     NOT NULL DEFAULT false,
  terms_and_conditions  text,
  is_active             boolean     NOT NULL DEFAULT true,
  start_date            date,
  end_date              date,
  outlet_scope          text        NOT NULL DEFAULT 'all' CHECK (outlet_scope IN ('all', 'selected')),
  redemption_scope      text        NOT NULL DEFAULT 'all' CHECK (redemption_scope IN ('all', 'selected')),
  auto_renew            boolean     NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TABLE: public.loyalty_card_outlets
-- ──────────────────────────────────────────────
CREATE TABLE public.loyalty_card_outlets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_card_id uuid NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  outlet_id       uuid NOT NULL REFERENCES public.outlets(id) ON DELETE CASCADE,
  UNIQUE (loyalty_card_id, outlet_id)
);

-- ──────────────────────────────────────────────
-- TABLE: public.customer_business_profiles
-- ──────────────────────────────────────────────
CREATE TABLE public.customer_business_profiles (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           uuid        NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id               uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notes                 text,
  birthday              date,
  visit_count           int         NOT NULL DEFAULT 0,
  first_visit_at        timestamptz,
  last_visit_at         timestamptz,
  total_stamps_earned   int         NOT NULL DEFAULT 0,
  total_rewards_redeemed int        NOT NULL DEFAULT 0,
  total_cards_issued    int         NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, user_id)
);

-- ──────────────────────────────────────────────
-- TABLE: public.customer_cards
-- ──────────────────────────────────────────────
CREATE TABLE public.customer_cards (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  loyalty_card_id  uuid        NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  business_id      uuid        NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  stamps_collected int         NOT NULL DEFAULT 0,
  status           text        NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'reward_available', 'completed', 'redeemed')),
  cycle_number     int         NOT NULL DEFAULT 1,
  issued_at        timestamptz NOT NULL DEFAULT now(),
  completed_at     timestamptz,
  redeemed_at      timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TABLE: public.transactions
-- ──────────────────────────────────────────────
CREATE TABLE public.transactions (
  id                    uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           uuid           NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  outlet_id             uuid           REFERENCES public.outlets(id) ON DELETE SET NULL,
  loyalty_card_id       uuid           NOT NULL REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  customer_card_id      uuid           NOT NULL REFERENCES public.customer_cards(id) ON DELETE CASCADE,
  user_id               uuid           NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  staff_business_user_id uuid          NOT NULL REFERENCES public.business_users(id) ON DELETE CASCADE,
  transaction_type      text           NOT NULL CHECK (transaction_type IN ('stamp', 'redeem')),
  quantity              int            NOT NULL DEFAULT 1,
  bill_value            numeric(10, 2),
  notes                 text,
  created_at            timestamptz    NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TABLE: public.staff_pins
-- ──────────────────────────────────────────────
CREATE TABLE public.staff_pins (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_user_id uuid        NOT NULL REFERENCES public.business_users(id) ON DELETE CASCADE UNIQUE,
  pin_hash         text        NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- TABLE: public.report_recipients
-- ──────────────────────────────────────────────
CREATE TABLE public.report_recipients (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid        NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, email)
);

-- ──────────────────────────────────────────────
-- TABLE: public.daily_reports
-- ──────────────────────────────────────────────
CREATE TABLE public.daily_reports (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id            uuid        NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  report_date            date        NOT NULL,
  total_transactions     int         NOT NULL DEFAULT 0,
  total_stamps           int         NOT NULL DEFAULT 0,
  total_redemptions      int         NOT NULL DEFAULT 0,
  total_customers_served int         NOT NULL DEFAULT 0,
  report_data            jsonb,
  sent_at                timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, report_date)
);

-- ──────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────
CREATE INDEX idx_business_users_business_id ON public.business_users(business_id);
CREATE INDEX idx_business_users_user_id ON public.business_users(user_id);
CREATE INDEX idx_outlets_business_id ON public.outlets(business_id);
CREATE INDEX idx_loyalty_cards_business_id ON public.loyalty_cards(business_id);
CREATE INDEX idx_customer_cards_user_id ON public.customer_cards(user_id);
CREATE INDEX idx_customer_cards_business_id ON public.customer_cards(business_id);
CREATE INDEX idx_customer_cards_loyalty_card_id ON public.customer_cards(loyalty_card_id);
CREATE INDEX idx_transactions_business_id ON public.transactions(business_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_customer_business_profiles_business_id ON public.customer_business_profiles(business_id);
CREATE INDEX idx_customer_business_profiles_user_id ON public.customer_business_profiles(user_id);
