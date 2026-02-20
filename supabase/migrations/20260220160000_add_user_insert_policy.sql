-- Allow users to insert their own profile (failsafe for trigger failures)
-- This policy ensures users can create their own profile if the auth trigger didn't fire

DROP POLICY IF EXISTS "users can insert own profile" ON public.users;
CREATE POLICY "users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also allow users to update their own profile (for profile edits)
DROP POLICY IF EXISTS "users can update own profile" ON public.users;
CREATE POLICY "users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
