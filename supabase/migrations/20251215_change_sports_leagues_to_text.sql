-- Migration: Change sports and leagues from foreign keys to text fields
-- Add stake and total_win fields to betting_tips
-- Created: 2025-12-12

-- Step 1: Add new text columns to betting_tip_items
alter table public.betting_tip_items
  add column if not exists sport text,
  add column if not exists league text;

-- Step 2: Migrate existing data from foreign keys to text fields
-- Copy sport and league names from related tables (only if columns and tables exist)
do $$
begin
  -- Check if sport_id column exists and leagues table exists
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'betting_tip_items' 
    and column_name = 'sport_id'
  ) and exists (
    select 1 from information_schema.tables
    where table_schema = 'public'
    and table_name = 'leagues'
  ) then
    -- Migrate from both sport and league tables
    update public.betting_tip_items bti
    set
      sport = s.name,
      league = l.name
    from public.sports s, public.leagues l
    where bti.sport_id = s.id
      and bti.league_id = l.id;
  elsif exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'betting_tip_items' 
    and column_name = 'sport_id'
  ) then
    -- Leagues table doesn't exist, only migrate sport
    update public.betting_tip_items bti
    set
      sport = s.name
    from public.sports s
    where bti.sport_id = s.id;
    -- Set league to empty string or a default value for existing records
    update public.betting_tip_items
    set league = ''
    where league IS NULL;
  end if;
end $$;

-- Step 3: Make new columns NOT NULL after data migration
-- Only set NOT NULL if columns exist and have data
do $$
begin
  -- Set sport to NOT NULL if it exists
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'betting_tip_items' 
    and column_name = 'sport'
  ) then
    -- Update any NULL values first
    update public.betting_tip_items set sport = '' where sport IS NULL;
    alter table public.betting_tip_items alter column sport set not null;
  end if;
  
  -- Set league to NOT NULL if it exists
  if exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'betting_tip_items' 
    and column_name = 'league'
  ) then
    -- Update any NULL values first
    update public.betting_tip_items set league = '' where league IS NULL;
    alter table public.betting_tip_items alter column league set not null;
  end if;
end $$;

-- Step 4: Drop foreign key constraints and indexes
alter table public.betting_tip_items
  drop constraint if exists betting_tip_items_sport_id_fkey,
  drop constraint if exists betting_tip_items_league_id_fkey;

drop index if exists public.betting_tip_items_sport_id_idx;
drop index if exists public.betting_tip_items_league_id_idx;

-- Step 5: Drop old columns
alter table public.betting_tip_items
  drop column if exists sport_id,
  drop column if exists league_id;

-- Step 6: Add stake and total_win to betting_tips
alter table public.betting_tips
  add column if not exists stake numeric(10,2),
  add column if not exists total_win numeric(10,2);

-- Step 7: Update RLS policies if they reference sport_id/league_id
-- Check existing policies and update if needed
-- Note: RLS policies on betting_tip_items don't directly reference sport_id/league_id,
-- so they should continue to work with the new structure

