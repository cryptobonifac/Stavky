-- Verify and ensure RLS policies allow nested queries for sports and leagues
-- This migration ensures that nested queries (sports with leagues) work correctly

-- Drop existing policies if they exist (to recreate them)
DROP POLICY IF EXISTS "public can view sports" ON public.sports;
DROP POLICY IF EXISTS "public can view leagues" ON public.leagues;

-- Recreate sports policy - ensure it allows all reads
CREATE POLICY "public can view sports"
  ON public.sports
  FOR SELECT
  USING (true);

-- Recreate leagues policy - ensure it allows all reads (needed for nested queries)
CREATE POLICY "public can view leagues"
  ON public.leagues
  FOR SELECT
  USING (true);

-- Verify policies are enabled
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;

-- Add a comment explaining the policies
COMMENT ON POLICY "public can view sports" ON public.sports IS 
  'Allows public read access to sports table. Required for nested queries with leagues.';

COMMENT ON POLICY "public can view leagues" ON public.leagues IS 
  'Allows public read access to leagues table. Required for nested queries from sports.';


