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

-- Leagues table has been removed - leagues are now stored as text in betting_tip_items
-- This section is no longer needed

-- Verification query (for logging/debugging)
do $$
declare
  companies_count integer;
  sports_count integer;
begin
  select count(*) into companies_count from public.betting_companies;
  select count(*) into sports_count from public.sports;
  
  raise notice 'Final counts - Companies: %, Sports: %', 
    companies_count, sports_count;
end $$;







