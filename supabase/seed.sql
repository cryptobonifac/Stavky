-- Seed data for betting companies, sports, and betting tips
-- This file runs automatically after migrations during db reset
-- Uses the new schema with betting_tip_items (sport and league as text fields)

-- Betting Companies
do $$
begin
  insert into public.betting_companies (name)
  select name from (values ('Bet365'), ('Tipsport'), ('Fortuna'), ('Nike')) as v(name)
  where not exists (select 1 from public.betting_companies where public.betting_companies.name = v.name);
  
  raise notice 'Inserted betting companies: %', (select count(*) from public.betting_companies);
end $$;

-- Sports (stored in English in the database)
-- Translations are handled in the application layer via message files
-- Using case-insensitive uniqueness check to prevent duplicates
do $$
begin
  insert into public.sports (name)
  select name from (values 
    ('Soccer'), 
    ('Tennis'), 
    ('Basketball'), 
    ('Ice Hockey'), 
    ('Volleyball'),
    ('Handball'),
    ('Rugby'),
    ('Badminton'),
    ('Squash'),
    ('Water Polo'),
    ('Floorball'),
    ('Futsal'),
    ('Beach Volleyball'),
    ('Athletics'),
    ('Softball'),
    ('Politics')
  ) as v(name)
  where not exists (
    select 1 from public.sports 
    where lower(public.sports.name) = lower(v.name)
  );
  
  raise notice 'Inserted sports: %', (select count(*) from public.sports);
end $$;

-- Leagues table has been removed - leagues are now stored as text in betting_tip_items
-- This section is no longer needed

-- Betting Tips using new schema with betting_tip_items
-- Example betting tips using the new structure:
-- - betting_tips table: description, odds, stake, total_win, status, created_by
-- - betting_tip_items table: betting_company_id, sport (text), league (text), match, odds, match_date, status
do $$
declare
  bet365_id uuid;
  nike_id uuid;
  tipsport_id uuid;
  fortuna_id uuid;
  tip_id uuid;
  tip_count integer := 0;
begin
  -- Get betting company IDs
  select id into bet365_id from public.betting_companies where name = 'Bet365';
  select id into nike_id from public.betting_companies where name = 'Nike';
  select id into tipsport_id from public.betting_companies where name = 'Tipsport';
  select id into fortuna_id from public.betting_companies where name = 'Fortuna';

  -- Example betting tip 1: Single tip
  insert into public.betting_tips (description, odds, stake, total_win, status)
  values ('Volejbal tip - Kakanj vs Borac', 1.05, 800, 840, 'pending')
  returning id into tip_id;

  if tip_id is not null then
    insert into public.betting_tip_items (
      betting_tip_id, betting_company_id, sport, league, match, odds, match_date, status
    )
    values (
      tip_id, bet365_id, 'Volejbal', 'Bosna m', 'Kakanj-Borac', 1.05, 
      '2025-12-03T10:00:00+01:00'::timestamptz, 'pending'
    );
    tip_count := tip_count + 1;
  end if;

  -- Example betting tip 2: Single tip
  insert into public.betting_tips (description, odds, stake, total_win, status)
  values ('Tenis tip - UTR Dallas ž', 1.1, 300, 330, 'pending')
  returning id into tip_id;

  if tip_id is not null then
    insert into public.betting_tip_items (
      betting_tip_id, betting_company_id, sport, league, match, odds, match_date, status
    )
    values (
      tip_id, bet365_id, 'Tenis', 'UTR Dallas ž', 'Kook-Colling', 1.1, 
      '2025-12-04T14:00:00+01:00'::timestamptz, 'pending'
    );
    tip_count := tip_count + 1;
  end if;

  -- Example betting tip 3: Single tip
  insert into public.betting_tips (description, odds, stake, total_win, status)
  values ('Futsal tip - Česká republika', 1.12, 200, 224, 'pending')
  returning id into tip_id;

  if tip_id is not null then
    insert into public.betting_tip_items (
      betting_tip_id, betting_company_id, sport, league, match, odds, match_date, status
    )
    values (
      tip_id, tipsport_id, 'Futsal', 'Česko', 'Chrudim-Chomutov', 1.12, 
      '2025-12-05T18:00:00+01:00'::timestamptz, 'pending'
    );
    tip_count := tip_count + 1;
  end if;

  -- Example betting tip 4: Combined bet with multiple tips
  insert into public.betting_tips (description, odds, stake, total_win, status)
  values ('Combined bet: Volejbal + Tenis', 1.134, 500, 567, 'pending')
  returning id into tip_id;

  if tip_id is not null then
    -- First tip item
    insert into public.betting_tip_items (
      betting_tip_id, betting_company_id, sport, league, match, odds, match_date, status
    )
    values (
      tip_id, bet365_id, 'Volejbal', 'Bosna m', 'Borac-Napredak', 1.04, 
      '2025-12-05T16:00:00+01:00'::timestamptz, 'pending'
    );

    -- Second tip item
    insert into public.betting_tip_items (
      betting_tip_id, betting_company_id, sport, league, match, odds, match_date, status
    )
    values (
      tip_id, bet365_id, 'Tenis', 'UTR Olomouc ž', 'Mandelikova-Perhacova', 1.06, 
      '2025-12-08T12:00:00+01:00'::timestamptz, 'pending'
    );
    tip_count := tip_count + 1;
  end if;

  raise notice 'Inserted % betting tips with new schema', tip_count;
end $$;
