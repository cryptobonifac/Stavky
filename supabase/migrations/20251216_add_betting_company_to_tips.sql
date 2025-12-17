-- Migration: Add betting_company_id back to betting_tips table
-- NOTE: This migration is now obsolete after table consolidation (20250124_consolidate_betting_tables.sql)
-- Tables betting_tips and betting_tip_items have been consolidated into betting_tip
-- The betting_company_id column is already added to betting_tip in the consolidation migration
-- This migration is kept for historical reference but does nothing

-- No-op migration - tables have been consolidated
DO $$
BEGIN
  -- This migration is intentionally empty as the tables it references
  -- have been consolidated into betting_tip table with betting_company_id already included
  NULL;
END $$;
