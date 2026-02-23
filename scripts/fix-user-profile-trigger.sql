-- ============================================================
-- FIX: User Profile Auto-Creation for OAuth Login
-- Run this in Supabase Dashboard → SQL Editor (Production)
-- ============================================================

-- STEP 1: Ensure sign_up_method column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'sign_up_method'
  ) THEN
    ALTER TABLE public.users ADD COLUMN sign_up_method text DEFAULT 'email';
  END IF;
END $$;

-- STEP 2: Create/Update the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  provider_value text;
BEGIN
  -- Get the provider from raw_app_meta_data
  provider_value := COALESCE(new.raw_app_meta_data->>'provider', 'email');

  -- New customers start with account_active_until = null (no subscription)
  -- Account is only activated after successful payment via Polar webhook
  INSERT INTO public.users (id, email, role, account_active_until, sign_up_method)
  VALUES (new.id, new.email, 'customer', null, provider_value)
  ON CONFLICT (id) DO UPDATE SET
    sign_up_method = COALESCE(EXCLUDED.sign_up_method, public.users.sign_up_method);
  RETURN new;
END;
$$;

-- STEP 3: Drop existing trigger and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- STEP 4: Fix existing users - create profiles for users in auth.users but not in public.users
INSERT INTO public.users (id, email, role, account_active_until, sign_up_method)
SELECT
  id,
  email,
  'customer',
  null,
  COALESCE(raw_app_meta_data->>'provider', 'email')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFICATION QUERIES (run separately after the above)
-- ============================================================

-- Check trigger exists:
-- SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';

-- Check user profiles:
-- SELECT u.id, u.email, u.role, u.sign_up_method FROM public.users u;

-- Check for orphaned auth users (should return 0 rows after fix):
-- SELECT au.id, au.email FROM auth.users au WHERE au.id NOT IN (SELECT id FROM public.users);
