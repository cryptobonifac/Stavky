-- Add unique payment reference number (variabilny symbol) per customer
-- This allows customers to include a reference in bank transfers,
-- and admins to search/identify payments by reference number.

-- 1. Create sequence for generating 6+ digit reference numbers
CREATE SEQUENCE IF NOT EXISTS public.user_reference_number_seq
  START WITH 100000
  INCREMENT BY 1
  NO MAXVALUE
  NO CYCLE;

-- 2. Add reference_number column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS reference_number text UNIQUE;

-- 3. Backfill existing users with sequential reference numbers
UPDATE public.users
SET reference_number = nextval('public.user_reference_number_seq')::text
WHERE reference_number IS NULL;

-- 4. Set NOT NULL after backfill
ALTER TABLE public.users
  ALTER COLUMN reference_number SET NOT NULL;

-- 5. Set default for the column using the sequence
ALTER TABLE public.users
  ALTER COLUMN reference_number SET DEFAULT nextval('public.user_reference_number_seq')::text;

-- 6. Update trigger function to assign reference_number on new user registration
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
  -- reference_number is auto-assigned from the sequence
  INSERT INTO public.users (id, email, role, account_active_until, sign_up_method, reference_number)
  VALUES (new.id, new.email, 'customer', null, provider_value, nextval('public.user_reference_number_seq')::text)
  ON CONFLICT (id) DO UPDATE SET
    sign_up_method = COALESCE(EXCLUDED.sign_up_method, public.users.sign_up_method);
  RETURN new;
END;
$$;

-- 7. Re-create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
