-- Migration: Remove betting_company_id, sport_id, match, match_date from betting_tips table
-- Created: 2025-01-20
-- 
-- These columns are no longer needed as the betting_tips table now uses
-- betting_tip_items for individual tip details. The betting_tips table
-- only needs description, odds, stake, total_win, and status.

-- Step 1: Drop indexes on columns that will be removed
drop index if exists public.betting_tips_company_idx;
drop index if exists public.betting_tips_sport_idx;

-- Step 2: Drop foreign key constraints
alter table public.betting_tips
  drop constraint if exists betting_tips_betting_company_id_fkey,
  drop constraint if exists betting_tips_sport_id_fkey;

-- Step 3: Drop the structure check constraint that references these columns
alter table public.betting_tips
  drop constraint if exists betting_tips_structure_check;

-- Step 4: Drop the columns
alter table public.betting_tips
  drop column if exists betting_company_id,
  drop column if exists sport_id,
  drop column if exists match,
  drop column if exists match_date;
