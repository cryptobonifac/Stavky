-- Migration: Remove leagues table
-- Created: 2025-01-16
-- This migration removes the leagues table as leagues are now stored as text in betting_tip_items

-- Step 1: Drop foreign key constraints that reference leagues table
-- Check if betting_tips has league_id column and drop constraint if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'betting_tips' 
    AND column_name = 'league_id'
  ) THEN
    ALTER TABLE public.betting_tips
      DROP CONSTRAINT IF EXISTS betting_tips_league_id_fkey;
    
    ALTER TABLE public.betting_tips
      DROP COLUMN IF EXISTS league_id;
  END IF;
END $$;

-- Step 2: Drop indexes on leagues
DROP INDEX IF EXISTS public.leagues_sport_id_idx;

-- Step 3: Drop the leagues table
DROP TABLE IF EXISTS public.leagues CASCADE;

-- Step 4: Update RLS policies that might reference leagues
-- Note: RLS policies on betting_tips and betting_tip_items don't directly reference leagues,
-- so they should continue to work

-- Step 5: Clean up any functions that reference leagues
-- (None expected, but this is a placeholder for any cleanup needed)



