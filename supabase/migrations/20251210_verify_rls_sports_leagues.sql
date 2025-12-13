-- Verify and ensure RLS policies allow public read access to sports
-- Note: Leagues table has been removed - leagues are now stored as text in betting_tip_items

-- Drop existing policy if it exists (to recreate it)
DROP POLICY IF EXISTS "public can view sports" ON public.sports;

-- Recreate sports policy - ensure it allows all reads
CREATE POLICY "public can view sports"
  ON public.sports
  FOR SELECT
  USING (true);

-- Verify policy is enabled
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;

-- Add a comment explaining the policy
COMMENT ON POLICY "public can view sports" ON public.sports IS 
  'Allows public read access to sports table. Required for dropdowns in the application.';







