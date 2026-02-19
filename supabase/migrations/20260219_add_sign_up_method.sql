-- Add sign_up_method column to users table
-- This stores how the user registered (email, google, etc.)

-- Add the column if it doesn't exist
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

-- Update existing users with their sign-up method from auth.users
UPDATE public.users u
SET sign_up_method = COALESCE(
  (SELECT raw_app_meta_data->>'provider' FROM auth.users au WHERE au.id = u.id),
  'email'
)
WHERE u.sign_up_method IS NULL OR u.sign_up_method = 'email';

-- Update the trigger function to capture sign_up_method on new user creation
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

  INSERT INTO public.users (id, email, role, account_active_until, sign_up_method)
  VALUES (new.id, new.email, 'customer', '2099-12-31 23:59:59+00'::timestamptz, provider_value)
  ON CONFLICT (id) DO UPDATE SET
    sign_up_method = COALESCE(EXCLUDED.sign_up_method, public.users.sign_up_method);
  RETURN new;
END;
$$;
