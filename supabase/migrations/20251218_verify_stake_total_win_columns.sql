-- Migration: Verify stake and total_win columns exist in betting_tip table
-- Created: 2025-12-18
--
-- This migration documents that stake and total_win columns were added
-- in migration 20250124_consolidate_betting_tables.sql
-- This file ensures the columns exist and are properly configured

-- Verify stake column exists and is numeric
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'betting_tip'
      AND column_name = 'stake'
  ) THEN
    ALTER TABLE public.betting_tip
      ADD COLUMN stake numeric;
  END IF;
END $$;

-- Verify total_win column exists and is numeric
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'betting_tip'
      AND column_name = 'total_win'
  ) THEN
    ALTER TABLE public.betting_tip
      ADD COLUMN total_win numeric;
  END IF;
END $$;
