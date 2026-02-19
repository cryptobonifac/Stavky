-- Migration: Consolidate betting_tips and betting_tip_items into single betting_tip table
-- Created: 2025-01-24
--
-- This migration consolidates the two-table structure into a single betting_tip table.
-- All tip data (sport, league, match, odds, match_date, status, betting_company_id, stake, total_win)
-- will be stored directly in the betting_tip table.

-- Step 1: Delete all existing data from both tables
DELETE FROM public.betting_tip_items;
DELETE FROM public.betting_tips;

-- Step 2: Drop old RLS policies on betting_tips (before dropping the table)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'betting_tips') THEN
    DROP POLICY IF EXISTS "betting role manage betting tips" ON public.betting_tips;
    DROP POLICY IF EXISTS "active customers view pending tips" ON public.betting_tips;
    DROP POLICY IF EXISTS "public homepage tips preview" ON public.betting_tips;
    DROP POLICY IF EXISTS "active customers view history" ON public.betting_tips;
    DROP POLICY IF EXISTS "public can view all tips for statistics" ON public.betting_tips;
  END IF;
END $$;

-- Step 3: Drop old RLS policies on betting_tip_items (before renaming)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'betting_tip_items') THEN
    DROP POLICY IF EXISTS "Betting admins can manage betting_tip_items" ON public.betting_tip_items;
    DROP POLICY IF EXISTS "Customers can view betting_tip_items of active bets" ON public.betting_tip_items;
    DROP POLICY IF EXISTS "public can view all tip items for statistics" ON public.betting_tip_items;
  END IF;
END $$;

-- Step 4: Drop foreign key constraint from betting_tip_items
ALTER TABLE public.betting_tip_items 
  DROP CONSTRAINT IF EXISTS betting_tip_items_betting_tip_id_fkey;

-- Step 5: Drop the betting_tips table
DROP TABLE IF EXISTS public.betting_tips CASCADE;

-- Step 6: Rename betting_tip_items to betting_tip
ALTER TABLE public.betting_tip_items RENAME TO betting_tip;

-- Step 7: Drop betting_tip_id column (no longer needed)
ALTER TABLE public.betting_tip DROP COLUMN IF EXISTS betting_tip_id;

-- Step 8: Add new columns with foreign key constraint
ALTER TABLE public.betting_tip 
  ADD COLUMN IF NOT EXISTS betting_company_id uuid REFERENCES public.betting_companies(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS stake numeric,
  ADD COLUMN IF NOT EXISTS total_win numeric;

-- Step 9: Make betting_company_id required (after data migration)
-- Note: We'll set it to NOT NULL after seed data is inserted
-- ALTER TABLE public.betting_tip ALTER COLUMN betting_company_id SET NOT NULL;

-- Step 10: Create index on betting_company_id for better query performance
CREATE INDEX IF NOT EXISTS betting_tip_company_idx ON public.betting_tip(betting_company_id);

-- Step 11: Update trigger name
DROP TRIGGER IF EXISTS set_betting_tip_items_updated_at ON public.betting_tip;
CREATE TRIGGER set_betting_tip_updated_at
BEFORE UPDATE ON public.betting_tip
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Step 12: Update indexes (rename existing ones)
DROP INDEX IF EXISTS public.betting_tip_items_betting_tip_id_idx;
DROP INDEX IF EXISTS public.betting_tip_items_status_idx;

CREATE INDEX IF NOT EXISTS betting_tip_status_idx ON public.betting_tip(status);
CREATE INDEX IF NOT EXISTS betting_tip_match_date_idx ON public.betting_tip(match_date);

-- Step 13: Enable RLS on betting_tip table
ALTER TABLE public.betting_tip ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.betting_tip FORCE ROW LEVEL SECURITY;

-- Step 14: Create new RLS policies for betting_tip table
-- Policy: Betting role can manage all betting tips
CREATE POLICY "betting role manage betting tips"
  ON public.betting_tip
  FOR ALL
  USING (public.has_role('betting'))
  WITH CHECK (public.has_role('betting'));

-- Policy: Active customers can view pending tips
CREATE POLICY "active customers view pending tips"
  ON public.betting_tip
  FOR SELECT
  USING (
    public.is_active_customer()
    AND status = 'pending'
  );

-- Policy: Public homepage tips preview (anonymous users can see pending tips)
CREATE POLICY "public homepage tips preview"
  ON public.betting_tip
  FOR SELECT
  USING (
    coalesce(auth.role(), 'anon') = 'anon'
    AND status = 'pending'
  );

-- Policy: Active customers can view history (win/loss tips)
CREATE POLICY "active customers view history"
  ON public.betting_tip
  FOR SELECT
  USING (
    public.is_active_customer()
    AND status IN ('win', 'loss')
  );

-- Policy: Public can view all tips for statistics (all statuses)
CREATE POLICY "public can view all tips for statistics"
  ON public.betting_tip
  FOR SELECT
  USING (true);

-- Policy: Public can view evaluated bets (win/loss, excluding pending)
-- This allows anyone (authenticated or anonymous) to view all evaluated bets
CREATE POLICY "public can view evaluated bets"
  ON public.betting_tip
  FOR SELECT
  USING (status IN ('win', 'loss'));

-- Step 15: Update database functions to query betting_tip directly
-- Fix month_has_losing_tip function
CREATE OR REPLACE FUNCTION public.month_has_losing_tip(
  target_month date DEFAULT date_trunc('month', timezone('utc', now()) - interval '1 month')
)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.betting_tip bt
    WHERE bt.status = 'loss'
      AND date_trunc('month', bt.match_date) = date_trunc('month', target_month)
  );
$$;

-- Fix month_loss_count function
CREATE OR REPLACE FUNCTION public.month_loss_count(target_month date)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::integer
  FROM public.betting_tip bt
  WHERE bt.status = 'loss'
    AND date_trunc('month', bt.match_date) = date_trunc('month', target_month);
$$;

-- Fix tip_monthly_summary function
CREATE OR REPLACE FUNCTION public.tip_monthly_summary(months_back integer DEFAULT 12)
RETURNS TABLE (
  month_start date,
  wins integer,
  losses integer,
  pending integer,
  total integer,
  success_rate numeric
)
LANGUAGE sql
STABLE
AS $$
  WITH month_limits AS (
    SELECT GREATEST(months_back, 1) AS months_to_show
  ),
  cutoff_date AS (
    SELECT date_trunc(
      'month',
      timezone('utc', now())
      - ((month_limits.months_to_show - 1) * interval '1 month')
    ) AS cutoff
    FROM month_limits
  )
  SELECT
    date_trunc('month', bt.match_date)::date AS month_start,
    COUNT(*) FILTER (WHERE bt.status = 'win')::integer AS wins,
    COUNT(*) FILTER (WHERE bt.status = 'loss')::integer AS losses,
    COUNT(*) FILTER (WHERE bt.status = 'pending')::integer AS pending,
    COUNT(*)::integer AS total,
    CASE
      WHEN COUNT(*) FILTER (WHERE bt.status IN ('win', 'loss')) = 0 THEN 0
      ELSE ROUND(
        COUNT(*) FILTER (WHERE bt.status = 'win')::numeric
        / NULLIF(COUNT(*) FILTER (WHERE bt.status IN ('win', 'loss')), 0)
        * 100,
        2
      )
    END AS success_rate
  FROM public.betting_tip bt, month_limits, cutoff_date
  WHERE bt.match_date >= cutoff_date.cutoff
  GROUP BY month_start
  ORDER BY month_start DESC
  LIMIT (SELECT months_to_show FROM month_limits);
$$;

-- Fix tip_success_rate function
CREATE OR REPLACE FUNCTION public.tip_success_rate(target_month date)
RETURNS TABLE (
  month_start date,
  wins integer,
  losses integer,
  pending integer,
  total integer,
  success_rate numeric
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    date_trunc('month', target_month)::date AS month_start,
    COALESCE(SUM(CASE WHEN status = 'win' THEN 1 ELSE 0 END), 0) AS wins,
    COALESCE(SUM(CASE WHEN status = 'loss' THEN 1 ELSE 0 END), 0) AS losses,
    COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) AS pending,
    COUNT(*) AS total,
    CASE
      WHEN COUNT(*) FILTER (WHERE status IN ('win', 'loss')) = 0 THEN 0
      ELSE ROUND(
        COALESCE(SUM(CASE WHEN status = 'win' THEN 1 ELSE 0 END), 0)::numeric
        / NULLIF(COUNT(*) FILTER (WHERE status IN ('win', 'loss')), 0)
        * 100,
        2
      )
    END AS success_rate
  FROM public.betting_tip
  WHERE date_trunc('month', match_date) = date_trunc('month', target_month);
$$;

-- Fix apply_free_month_from_loss trigger function
CREATE OR REPLACE FUNCTION public.apply_free_month_from_loss()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_month date;
BEGIN
  IF COALESCE(old.status, 'pending') = new.status THEN
    RETURN new;
  END IF;

  IF new.status <> 'loss' THEN
    RETURN new;
  END IF;

  target_month := date_trunc('month', new.match_date)::date;

  IF public.should_grant_free_month(target_month) THEN
    UPDATE public.user_subscriptions
    SET next_month_free = true
    WHERE month = target_month
      AND next_month_free = false;
  END IF;

  RETURN new;
END;
$$;

-- Update the trigger to work with betting_tip table
-- Drop old trigger on betting_tips if table exists (wrapped in DO block to avoid error)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'betting_tips') THEN
    DROP TRIGGER IF EXISTS trg_betting_tips_loss_free_month ON public.betting_tips;
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_betting_tip_loss_free_month ON public.betting_tip;

CREATE TRIGGER trg_betting_tip_loss_free_month
AFTER UPDATE ON public.betting_tip
FOR EACH ROW
EXECUTE FUNCTION public.apply_free_month_from_loss();









