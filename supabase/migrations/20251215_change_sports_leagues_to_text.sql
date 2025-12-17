-- Migration: Change sports and leagues from foreign keys to text fields
-- NOTE: This migration is now obsolete after table consolidation (20250124_consolidate_betting_tables.sql)
-- Tables betting_tips and betting_tip_items have been consolidated into betting_tip
-- Sport and league are already text fields in the consolidated betting_tip table
-- This migration is kept for historical reference but does nothing

-- No-op migration - tables have been consolidated
DO $$
BEGIN
  -- This migration is intentionally empty as the tables it references
  -- have been consolidated into betting_tip table with sport/league as text fields
  NULL;
END $$;

