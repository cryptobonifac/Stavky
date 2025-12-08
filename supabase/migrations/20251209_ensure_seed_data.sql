-- Ensure seed data exists in production database
-- This migration is idempotent and safe to run multiple times
-- It will insert data only if it doesn't already exist

-- Betting Companies
do $$
declare
  inserted_count integer;
begin
  insert into public.betting_companies (name)
  select name from (values ('Bet365'), ('Tipsport'), ('Fortuna'), ('Nike')) as v(name)
  where not exists (select 1 from public.betting_companies where public.betting_companies.name = v.name);
  
  get diagnostics inserted_count = row_count;
  raise notice 'Betting companies: % inserted', inserted_count;
end $$;

-- Sports
do $$
declare
  inserted_count integer;
begin
  insert into public.sports (name)
  select name from (values ('Soccer'), ('Tennis'), ('Basketball'), ('Ice Hockey'), ('Volleyball')) as v(name)
  where not exists (select 1 from public.sports where lower(public.sports.name) = lower(v.name));
  
  get diagnostics inserted_count = row_count;
  raise notice 'Sports: % inserted', inserted_count;
end $$;

-- Leagues (dependent on sports)
do $$
declare
  soccer_id uuid;
  basketball_id uuid;
  hockey_id uuid;
  tennis_id uuid;
  volleyball_id uuid;
  inserted_count integer;
begin
  -- Get sport IDs
  select id into soccer_id from public.sports where lower(name) = lower('Soccer');
  select id into basketball_id from public.sports where lower(name) = lower('Basketball');
  select id into hockey_id from public.sports where lower(name) = lower('Ice Hockey');
  select id into tennis_id from public.sports where lower(name) = lower('Tennis');
  select id into volleyball_id from public.sports where lower(name) = lower('Volleyball');

  -- Soccer leagues
  if soccer_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('Premier League', soccer_id),
      ('La Liga', soccer_id),
      ('Champions League', soccer_id),
      ('Serie A', soccer_id)
    ) as v(name, sport_id)
    where not exists (
      select 1 from public.leagues 
      where public.leagues.sport_id = v.sport_id 
      and lower(public.leagues.name) = lower(v.name)
    );
    get diagnostics inserted_count = row_count;
    raise notice 'Soccer leagues: % inserted', inserted_count;
  end if;

  -- Basketball leagues
  if basketball_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('NBA', basketball_id),
      ('EuroLeague', basketball_id)
    ) as v(name, sport_id)
    where not exists (
      select 1 from public.leagues 
      where public.leagues.sport_id = v.sport_id 
      and lower(public.leagues.name) = lower(v.name)
    );
    get diagnostics inserted_count = row_count;
    raise notice 'Basketball leagues: % inserted', inserted_count;
  end if;

  -- Ice Hockey leagues
  if hockey_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('NHL', hockey_id),
      ('KHL', hockey_id)
    ) as v(name, sport_id)
    where not exists (
      select 1 from public.leagues 
      where public.leagues.sport_id = v.sport_id 
      and lower(public.leagues.name) = lower(v.name)
    );
    get diagnostics inserted_count = row_count;
    raise notice 'Ice Hockey leagues: % inserted', inserted_count;
  end if;

  -- Tennis leagues
  if tennis_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('ATP', tennis_id),
      ('WTA', tennis_id)
    ) as v(name, sport_id)
    where not exists (
      select 1 from public.leagues 
      where public.leagues.sport_id = v.sport_id 
      and lower(public.leagues.name) = lower(v.name)
    );
    get diagnostics inserted_count = row_count;
    raise notice 'Tennis leagues: % inserted', inserted_count;
  end if;
end $$;

-- Verification query (for logging/debugging)
do $$
declare
  companies_count integer;
  sports_count integer;
  leagues_count integer;
begin
  select count(*) into companies_count from public.betting_companies;
  select count(*) into sports_count from public.sports;
  select count(*) into leagues_count from public.leagues;
  
  raise notice 'Final counts - Companies: %, Sports: %, Leagues: %', 
    companies_count, sports_count, leagues_count;
end $$;

