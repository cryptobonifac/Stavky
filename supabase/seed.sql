-- Seed data for betting companies, sports, and leagues
-- This file runs automatically after migrations during db reset

-- Betting Companies
do $$
begin
  insert into public.betting_companies (name)
  select name from (values ('Bet365'), ('Tipsport'), ('Fortuna'), ('Nike')) as v(name)
  where not exists (select 1 from public.betting_companies where public.betting_companies.name = v.name);
  
  raise notice 'Inserted betting companies: %', (select count(*) from public.betting_companies);
end $$;

-- Sports
insert into public.sports (name)
select name from (values ('Soccer'), ('Tennis'), ('Basketball'), ('Ice Hockey'), ('Volleyball')) as v(name)
where not exists (select 1 from public.sports where lower(public.sports.name) = lower(v.name));

-- Leagues (dependent on sports)
do $$
declare
  soccer_id uuid;
  basketball_id uuid;
  hockey_id uuid;
  tennis_id uuid;
begin
  select id into soccer_id from public.sports where lower(name) = lower('Soccer');
  select id into basketball_id from public.sports where lower(name) = lower('Basketball');
  select id into hockey_id from public.sports where lower(name) = lower('Ice Hockey');
  select id into tennis_id from public.sports where lower(name) = lower('Tennis');

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
  end if;

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
  end if;

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
  end if;

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
  end if;
end $$;

