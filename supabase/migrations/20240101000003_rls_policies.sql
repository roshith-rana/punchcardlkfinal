-- ============================================================
-- Migration: 20240101000003_rls_policies.sql
-- Description: Enable RLS and apply all security policies
-- ============================================================

-- ──────────────────────────────────────────────
-- Enable RLS on all tables
-- ──────────────────────────────────────────────
ALTER TABLE public.users                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.superadmins               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outlets                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_outlet_assignments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_cards             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_card_outlets      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_cards            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_pins                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_recipients         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports             ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────
-- Helper: is the current user a superadmin?
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.superadmins
    WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get business_id for current admin user
CREATE OR REPLACE FUNCTION public.get_admin_business_id()
RETURNS uuid AS $$
  SELECT business_id FROM public.business_users
  WHERE user_id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is current user an admin of a given business?
CREATE OR REPLACE FUNCTION public.is_admin_of(p_business_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_users
    WHERE user_id = auth.uid()
      AND business_id = p_business_id
      AND role = 'admin'
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is current user a staff member of a given business?
CREATE OR REPLACE FUNCTION public.is_staff_of(p_business_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_users
    WHERE user_id = auth.uid()
      AND business_id = p_business_id
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ──────────────────────────────────────────────
-- POLICIES: users
-- ──────────────────────────────────────────────
CREATE POLICY "Users can read own row"
  ON public.users FOR SELECT
  USING (id = auth.uid() OR public.is_superadmin());

CREATE POLICY "Users can update own row"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ──────────────────────────────────────────────
-- POLICIES: superadmins
-- ──────────────────────────────────────────────
CREATE POLICY "Superadmins can read superadmins"
  ON public.superadmins FOR SELECT
  USING (public.is_superadmin());

-- ──────────────────────────────────────────────
-- POLICIES: businesses
-- ──────────────────────────────────────────────
CREATE POLICY "Business admin can read own business"
  ON public.businesses FOR SELECT
  USING (public.is_admin_of(id) OR public.is_staff_of(id) OR public.is_superadmin());

CREATE POLICY "Business admin can update own business"
  ON public.businesses FOR UPDATE
  USING (public.is_admin_of(id) OR public.is_superadmin());

CREATE POLICY "Superadmin can insert business"
  ON public.businesses FOR INSERT
  WITH CHECK (public.is_superadmin());

-- ──────────────────────────────────────────────
-- POLICIES: business_users
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can read business_users in their business"
  ON public.business_users FOR SELECT
  USING (
    public.is_admin_of(business_id)
    OR user_id = auth.uid()
    OR public.is_superadmin()
  );

CREATE POLICY "Admins can insert business_users"
  ON public.business_users FOR INSERT
  WITH CHECK (public.is_admin_of(business_id) OR public.is_superadmin());

CREATE POLICY "Admins can update business_users"
  ON public.business_users FOR UPDATE
  USING (public.is_admin_of(business_id) OR public.is_superadmin());

-- ──────────────────────────────────────────────
-- POLICIES: outlets
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can CRUD outlets"
  ON public.outlets FOR ALL
  USING (public.is_admin_of(business_id) OR public.is_superadmin())
  WITH CHECK (public.is_admin_of(business_id) OR public.is_superadmin());

CREATE POLICY "Staff can read assigned outlets"
  ON public.outlets FOR SELECT
  USING (
    public.is_staff_of(business_id)
    OR public.is_superadmin()
  );

-- ──────────────────────────────────────────────
-- POLICIES: staff_outlet_assignments
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can manage staff outlet assignments"
  ON public.staff_outlet_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users bu
      WHERE bu.id = business_user_id
        AND public.is_admin_of(bu.business_id)
    )
    OR public.is_superadmin()
  );

CREATE POLICY "Staff can read own assignments"
  ON public.staff_outlet_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users bu
      WHERE bu.id = business_user_id
        AND bu.user_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────
-- POLICIES: loyalty_cards
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can CRUD loyalty cards"
  ON public.loyalty_cards FOR ALL
  USING (public.is_admin_of(business_id) OR public.is_superadmin())
  WITH CHECK (public.is_admin_of(business_id) OR public.is_superadmin());

CREATE POLICY "Staff can read active cards for their business"
  ON public.loyalty_cards FOR SELECT
  USING (
    is_active = true AND public.is_staff_of(business_id)
  );

CREATE POLICY "Customers can read active cards for businesses they have a profile with"
  ON public.loyalty_cards FOR SELECT
  USING (
    is_active = true AND EXISTS (
      SELECT 1 FROM public.customer_business_profiles cbp
      WHERE cbp.business_id = loyalty_cards.business_id
        AND cbp.user_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────
-- POLICIES: loyalty_card_outlets
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can manage loyalty card outlets"
  ON public.loyalty_card_outlets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_cards lc
      WHERE lc.id = loyalty_card_id
        AND public.is_admin_of(lc.business_id)
    )
    OR public.is_superadmin()
  );

CREATE POLICY "Anyone with access to card can read card outlets"
  ON public.loyalty_card_outlets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.loyalty_cards lc
      WHERE lc.id = loyalty_card_id
        AND public.is_staff_of(lc.business_id)
    )
  );

-- ──────────────────────────────────────────────
-- POLICIES: customer_business_profiles
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can read/update profiles for their business"
  ON public.customer_business_profiles FOR ALL
  USING (public.is_admin_of(business_id) OR public.is_superadmin())
  WITH CHECK (public.is_admin_of(business_id) OR public.is_superadmin());

CREATE POLICY "Customers can read own profiles"
  ON public.customer_business_profiles FOR SELECT
  USING (user_id = auth.uid());

-- ──────────────────────────────────────────────
-- POLICIES: customer_cards
-- ──────────────────────────────────────────────
CREATE POLICY "Customers can read own customer cards"
  ON public.customer_cards FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins and staff can read customer cards for their business"
  ON public.customer_cards FOR SELECT
  USING (public.is_staff_of(business_id) OR public.is_superadmin());

CREATE POLICY "Staff can insert customer cards"
  ON public.customer_cards FOR INSERT
  WITH CHECK (public.is_staff_of(business_id) OR public.is_superadmin());

CREATE POLICY "Staff can update customer cards"
  ON public.customer_cards FOR UPDATE
  USING (public.is_staff_of(business_id) OR public.is_superadmin());

-- ──────────────────────────────────────────────
-- POLICIES: transactions
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can read all transactions for their business"
  ON public.transactions FOR SELECT
  USING (public.is_admin_of(business_id) OR public.is_superadmin());

CREATE POLICY "Staff can read and insert transactions for their outlet"
  ON public.transactions FOR SELECT
  USING (public.is_staff_of(business_id));

CREATE POLICY "Staff can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (public.is_staff_of(business_id));

-- ──────────────────────────────────────────────
-- POLICIES: staff_pins
-- ──────────────────────────────────────────────
CREATE POLICY "Users can read own PIN record"
  ON public.staff_pins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users bu
      WHERE bu.id = business_user_id
        AND bu.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own PIN"
  ON public.staff_pins FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_users bu
      WHERE bu.id = business_user_id
        AND bu.user_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────
-- POLICIES: report_recipients
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can manage report recipients"
  ON public.report_recipients FOR ALL
  USING (public.is_admin_of(business_id) OR public.is_superadmin())
  WITH CHECK (public.is_admin_of(business_id) OR public.is_superadmin());

-- ──────────────────────────────────────────────
-- POLICIES: daily_reports
-- ──────────────────────────────────────────────
CREATE POLICY "Admins can read daily reports"
  ON public.daily_reports FOR SELECT
  USING (public.is_admin_of(business_id) OR public.is_superadmin());

CREATE POLICY "Service role can insert daily reports"
  ON public.daily_reports FOR INSERT
  WITH CHECK (public.is_superadmin());
