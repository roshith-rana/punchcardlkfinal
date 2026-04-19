-- ============================================================
-- Migration: 20240101000002_functions_and_triggers.sql
-- Description: DB functions and triggers
-- ============================================================

-- ──────────────────────────────────────────────
-- FUNCTION: updated_at trigger
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.outlets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.loyalty_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.customer_business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.customer_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.staff_pins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ──────────────────────────────────────────────
-- FUNCTION: handle_new_user
-- Syncs auth.users → public.users on signup
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, mobile_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, NEW.email, '')  -- phone for OTP users, email for admin/staff
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ──────────────────────────────────────────────
-- FUNCTION: handle_redemption
-- On customer_cards status → 'redeemed':
--   - auto-renew if configured
--   - update customer_business_profiles
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_redemption()
RETURNS TRIGGER AS $$
DECLARE
  v_loyalty_card    public.loyalty_cards%ROWTYPE;
  v_profile_exists  boolean;
BEGIN
  -- Only act when status changes to 'redeemed'
  IF OLD.status = NEW.status OR NEW.status != 'redeemed' THEN
    RETURN NEW;
  END IF;

  -- Fetch the loyalty card config
  SELECT * INTO v_loyalty_card
  FROM public.loyalty_cards
  WHERE id = NEW.loyalty_card_id;

  -- Update customer_business_profiles: increment total_rewards_redeemed
  UPDATE public.customer_business_profiles
  SET
    total_rewards_redeemed = total_rewards_redeemed + 1,
    updated_at = now()
  WHERE business_id = NEW.business_id AND user_id = NEW.user_id;

  -- Auto-renew: create a new customer_cards row
  IF v_loyalty_card.auto_renew THEN
    INSERT INTO public.customer_cards (
      user_id,
      loyalty_card_id,
      business_id,
      stamps_collected,
      status,
      cycle_number,
      issued_at
    ) VALUES (
      NEW.user_id,
      NEW.loyalty_card_id,
      NEW.business_id,
      0,
      'active',
      NEW.cycle_number + 1,
      now()
    );

    -- Also increment total_cards_issued
    UPDATE public.customer_business_profiles
    SET
      total_cards_issued = total_cards_issued + 1,
      updated_at = now()
    WHERE business_id = NEW.business_id AND user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_customer_card_redeemed
  AFTER UPDATE ON public.customer_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_redemption();

-- ──────────────────────────────────────────────
-- FUNCTION: update_customer_profile_on_stamp
-- On stamp transaction insert, update profile stats
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_customer_profile_on_stamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_type != 'stamp' THEN
    RETURN NEW;
  END IF;

  -- Upsert customer_business_profiles
  INSERT INTO public.customer_business_profiles (
    business_id, user_id, visit_count, first_visit_at, last_visit_at, total_stamps_earned
  )
  VALUES (
    NEW.business_id,
    NEW.user_id,
    1,
    now(),
    now(),
    NEW.quantity
  )
  ON CONFLICT (business_id, user_id)
  DO UPDATE SET
    visit_count         = public.customer_business_profiles.visit_count + 1,
    last_visit_at       = now(),
    first_visit_at      = COALESCE(public.customer_business_profiles.first_visit_at, now()),
    total_stamps_earned = public.customer_business_profiles.total_stamps_earned + NEW.quantity,
    updated_at          = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_stamp_transaction_created
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_customer_profile_on_stamp();
