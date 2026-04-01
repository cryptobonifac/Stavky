-- Remove payment provider tables/columns and add manual activation settings
-- The payment system (Stripe/Polar) is replaced by manual bank transfer activation.
-- account_active_until and is_active_customer() are KEPT for access control.

-- ============================================================
-- 1. Drop user_subscriptions table (triggers, policies, table)
-- ============================================================

DROP TRIGGER IF EXISTS trg_user_subscriptions_free_month ON public.user_subscriptions;

DROP POLICY IF EXISTS "betting role manage user subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "customers view own subscriptions" ON public.user_subscriptions;

DROP TABLE IF EXISTS public.user_subscriptions;

-- ============================================================
-- 2. Drop payment-related functions
-- ============================================================

DROP FUNCTION IF EXISTS public.is_user_account_active(uuid);
DROP FUNCTION IF EXISTS public.month_has_losing_tip(date);
DROP FUNCTION IF EXISTS public.month_loss_count(date);
DROP FUNCTION IF EXISTS public.should_grant_free_month(date);
DROP FUNCTION IF EXISTS public.extend_account_on_free_month();
DROP FUNCTION IF EXISTS public.activate_account_by_email(text, timestamptz);

-- ============================================================
-- 3. Remove payment provider columns from users table
-- ============================================================

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_subscription_plan_type_check;
DROP INDEX IF EXISTS users_polar_customer_id_idx;
DROP INDEX IF EXISTS users_subscription_plan_type_idx;

ALTER TABLE public.users DROP COLUMN IF EXISTS provider_customer_id;
ALTER TABLE public.users DROP COLUMN IF EXISTS provider_subscription_id;
ALTER TABLE public.users DROP COLUMN IF EXISTS subscription_plan_type;

-- ============================================================
-- 4. Drop marketing_settings table (free month rules - obsolete)
-- ============================================================

DROP TRIGGER IF EXISTS set_marketing_settings_updated_at ON public.marketing_settings;
DROP POLICY IF EXISTS "betting role manage marketing settings" ON public.marketing_settings;
DROP POLICY IF EXISTS "homepage marketing settings" ON public.marketing_settings;

DROP TABLE IF EXISTS public.marketing_settings;

-- ============================================================
-- 5. Create activation_settings table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.activation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_price numeric(10,2) NOT NULL DEFAULT 40.00,
  yearly_price numeric(10,2) NOT NULL DEFAULT 360.00,
  iban text NOT NULL DEFAULT '',
  message_en text NOT NULL DEFAULT '',
  message_cs text NOT NULL DEFAULT '',
  message_sk text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

DROP TRIGGER IF EXISTS set_activation_settings_updated_at ON public.activation_settings;
CREATE TRIGGER set_activation_settings_updated_at
BEFORE UPDATE ON public.activation_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.activation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_settings FORCE ROW LEVEL SECURITY;

-- Admin can read and write
CREATE POLICY "betting role manage activation settings"
  ON public.activation_settings
  FOR ALL
  USING (public.has_role('betting'))
  WITH CHECK (public.has_role('betting'));

-- Authenticated users can read (to display activation info page)
CREATE POLICY "authenticated users view activation settings"
  ON public.activation_settings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert default row
INSERT INTO public.activation_settings (monthly_price, yearly_price, iban, message_en, message_cs, message_sk)
VALUES (
  40.00,
  360.00,
  'CZ00 0000 0000 0000 0000 0000',
  'To activate your account, please transfer the subscription fee to the following IBAN. Once we confirm your payment, your account will be activated.',
  'Pro aktivaci uctu prosim prevedte castku predplatneho na nasledujici IBAN. Jakmile potvrdime vasi platbu, vas ucet bude aktivovan.',
  'Pre aktivaciu uctu prosim prevedte ciastku predplatneho na nasledujuci IBAN. Hned ako potvrdime vasu platbu, vas ucet bude aktivovany.'
);
