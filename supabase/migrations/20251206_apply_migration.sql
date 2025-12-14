-- Apply migration for betting_tip_items
-- Run this in Supabase SQL Editor if migration didn't apply automatically

-- betting_tip_items table is already created by 20241203_betting_tip_items.sql
-- and updated by 20251215_change_sports_leagues_to_text.sql to use text fields
-- No need to recreate it here

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_betting_tip_items_updated_at ON public.betting_tip_items;
CREATE TRIGGER set_betting_tip_items_updated_at
BEFORE UPDATE ON public.betting_tip_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS betting_tip_items_betting_tip_id_idx
  ON public.betting_tip_items (betting_tip_id);

CREATE INDEX IF NOT EXISTS betting_tip_items_status_idx
  ON public.betting_tip_items (status);

-- Add description column to betting_tips
ALTER TABLE public.betting_tips
  ADD COLUMN IF NOT EXISTS description text;

-- Make individual fields nullable (if they exist and are not null)
DO $$
BEGIN
  ALTER TABLE public.betting_tips ALTER COLUMN betting_company_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.betting_tips ALTER COLUMN sport_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- league_id column has been removed - leagues are now text in betting_tip_items

DO $$
BEGIN
  ALTER TABLE public.betting_tips ALTER COLUMN match DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.betting_tips ALTER COLUMN match_date DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Drop old constraint (referenced deleted columns)
ALTER TABLE public.betting_tips
  DROP CONSTRAINT IF EXISTS betting_tips_structure_check;

-- Enable RLS
ALTER TABLE public.betting_tip_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Betting admins can manage betting_tip_items" ON public.betting_tip_items;
DROP POLICY IF EXISTS "Customers can view betting_tip_items of active bets" ON public.betting_tip_items;

-- Policy: Betting admins can do everything
CREATE POLICY "Betting admins can manage betting_tip_items"
  ON public.betting_tip_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'betting'
    )
  );

-- Policy: Customers can view items of active bets
CREATE POLICY "Customers can view betting_tip_items of active bets"
  ON public.betting_tip_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.betting_tips
      WHERE betting_tips.id = betting_tip_items.betting_tip_id
      AND betting_tips.status = 'pending'
      AND EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND (
          users.role = 'betting'
          OR (
            users.role = 'customer'
            AND users.account_active_until >= timezone('utc', now())
          )
        )
      )
    )
  );


