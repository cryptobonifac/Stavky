-- Migration: Restrict betting_tip access to active subscribers only
-- Purpose: Ensure only users with active subscriptions can view betting tips
-- Date: 2026-02-19
-- Note: Table was renamed from betting_tips to betting_tip in consolidation migration

-- Drop old policies if they exist (from before table consolidation)
DROP POLICY IF EXISTS "public homepage tips preview" ON public.betting_tip;
DROP POLICY IF EXISTS "active customers view pending tips" ON public.betting_tip;
DROP POLICY IF EXISTS "public can view all tips for statistics" ON public.betting_tip;

-- Recreate policies for betting_tip table
-- Policy: Only active subscribers and betting role can view tips
DROP POLICY IF EXISTS "active_subscribers_can_view_betting_tips" ON public.betting_tip;
CREATE POLICY "active_subscribers_can_view_betting_tips"
  ON public.betting_tip
  FOR SELECT
  USING (
    -- Betting admins can always view
    public.has_role('betting')
    OR
    -- Only active customers can view
    public.is_active_customer()
  );

-- Ensure the betting role manage policy exists
DROP POLICY IF EXISTS "betting_role_full_access" ON public.betting_tip;
CREATE POLICY "betting_role_full_access"
  ON public.betting_tip
  FOR ALL
  USING (public.has_role('betting'))
  WITH CHECK (public.has_role('betting'));

-- Add comment for documentation
COMMENT ON POLICY "active_subscribers_can_view_betting_tips" ON public.betting_tip IS
  'Only users with active subscriptions (account_active_until >= now) or betting role can view betting tips';
