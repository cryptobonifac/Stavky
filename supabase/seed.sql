-- Seed data for betting companies, sports, leagues, and betting tips
-- This file runs automatically after migrations during db reset
-- Extracted from WhatsApp chat conversation with Igor Stavky

-- Betting Companies
do $$
begin
  insert into public.betting_companies (name)
  select name from (values ('Bet365'), ('Tipsport'), ('Fortuna'), ('Nike')) as v(name)
  where not exists (select 1 from public.betting_companies where public.betting_companies.name = v.name);
  
  raise notice 'Inserted betting companies: %', (select count(*) from public.betting_companies);
end $$;

-- Sports and Leagues seed data - DEPRECATED
-- Sports and leagues are now stored as text fields in betting_tip_items
-- This seed data is kept for reference but is no longer used by the application
-- 
-- insert into public.sports (name)
-- select name from (values 
--   ('Soccer'), 
--   ('Tennis'), 
--   ('Basketball'), 
--   ('Ice Hockey'), 
--   ('Volleyball'),
--   ('Handball'),
--   ('Rugby'),
--   ('Badminton'),
--   ('Squash'),
--   ('Water Polo'),
--   ('Floorball'),
--   ('Futsal'),
--   ('Beach Volleyball'),
--   ('Athletics'),
--   ('Softball'),
--   ('Politics')
-- ) as v(name)
-- where not exists (select 1 from public.sports where lower(public.sports.name) = lower(v.name));

-- Leagues seed data - DEPRECATED
-- Leagues are now stored as text fields in betting_tip_items
-- This seed data is kept for reference but is no longer used by the application
--
-- do $$
declare
  soccer_id uuid;
  basketball_id uuid;
  hockey_id uuid;
  tennis_id uuid;
  volleyball_id uuid;
  handball_id uuid;
  rugby_id uuid;
  badminton_id uuid;
  squash_id uuid;
  water_polo_id uuid;
  floorball_id uuid;
  futsal_id uuid;
  beach_volleyball_id uuid;
  athletics_id uuid;
  softball_id uuid;
  politics_id uuid;
begin
  -- Get sport IDs (using English names)
  select id into soccer_id from public.sports where lower(name) = lower('Soccer');
  select id into basketball_id from public.sports where lower(name) = lower('Basketball');
  select id into hockey_id from public.sports where lower(name) = lower('Ice Hockey');
  select id into tennis_id from public.sports where lower(name) = lower('Tennis');
  select id into volleyball_id from public.sports where lower(name) = lower('Volleyball');
  select id into handball_id from public.sports where lower(name) = lower('Handball');
  select id into rugby_id from public.sports where lower(name) = lower('Rugby');
  select id into badminton_id from public.sports where lower(name) = lower('Badminton');
  select id into squash_id from public.sports where lower(name) = lower('Squash');
  select id into water_polo_id from public.sports where lower(name) = lower('Water Polo');
  select id into floorball_id from public.sports where lower(name) = lower('Floorball');
  select id into futsal_id from public.sports where lower(name) = lower('Futsal');
  select id into beach_volleyball_id from public.sports where lower(name) = lower('Beach Volleyball');
  select id into athletics_id from public.sports where lower(name) = lower('Athletics');
  select id into softball_id from public.sports where lower(name) = lower('Softball');
  select id into politics_id from public.sports where lower(name) = lower('Politics');

  -- Soccer leagues
  if soccer_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('Premier League', soccer_id),
      ('La Liga', soccer_id),
      ('Champions League', soccer_id),
      ('Serie A', soccer_id),
      ('World Cup Qualifiers', soccer_id),
      ('European Championship Qualifiers', soccer_id),
      ('European Championship U17 Qualifiers', soccer_id),
      ('Spain Women', soccer_id),
      ('Malaysia Cup', soccer_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Basketball leagues
  if basketball_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('NBA', basketball_id),
      ('EuroLeague', basketball_id),
      ('Slovakia Women', basketball_id),
      ('Norway Men', basketball_id),
      ('Czech Republic Women', basketball_id),
      ('Brazil Paulista Women', basketball_id),
      ('Euro Cup Women', basketball_id),
      ('El Salvador Men', basketball_id),
      ('World Cup Oceania Asia Qualifiers Men', basketball_id),
      ('Italy Women', basketball_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Ice Hockey leagues
  if hockey_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('NHL', hockey_id),
      ('KHL', hockey_id),
      ('Latvia', hockey_id),
      ('Russia Women', hockey_id),
      ('Poland Men', hockey_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Tennis leagues
  if tennis_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('ATP', tennis_id),
      ('WTA', tennis_id),
      ('UTR', tennis_id),
      ('ITF', tennis_id),
      ('Davis Cup', tennis_id),
      ('Masters', tennis_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Volleyball leagues (many found in chat)
  if volleyball_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('Brasil Paulista', volleyball_id),
      ('Brasil Paulista U19', volleyball_id),
      ('Brazil Paulista U19 Women', volleyball_id),
      ('Brazil Paulista U19 Men', volleyball_id),
      ('Brazil Paulista U21 Women', volleyball_id),
      ('Brazil RDJ U19 Men', volleyball_id),
      ('Thailand Women', volleyball_id),
      ('Thailand Men', volleyball_id),
      ('Thailand Pro League Men', volleyball_id),
      ('NCAA Women', volleyball_id),
      ('NCAA 2 Women', volleyball_id),
      ('Slovakia Women', volleyball_id),
      ('Slovakia Men', volleyball_id),
      ('Slovakia Junior League', volleyball_id),
      ('Poland Men', volleyball_id),
      ('Poland Women', volleyball_id),
      ('Denmark Women', volleyball_id),
      ('Denmark Men', volleyball_id),
      ('Denmark 1 Men', volleyball_id),
      ('Denmark 1 Women', volleyball_id),
      ('Argentina de Honor Women', volleyball_id),
      ('Costa Rica Men', volleyball_id),
      ('Costa Rica Women', volleyball_id),
      ('Uruguay Women', volleyball_id),
      ('Uruguay Clausura Primera Women', volleyball_id),
      ('Uruguay Clausura Men', volleyball_id),
      ('Indonesia Women', volleyball_id),
      ('Philippines MPVA Women', volleyball_id),
      ('Philippines PVL Women', volleyball_id),
      ('Philippines WNCAA Scorpions', volleyball_id),
      ('Philippines SSL Women', volleyball_id),
      ('Philippines Spikers Men', volleyball_id),
      ('Matches ZEN', volleyball_id),
      ('Matches Men', volleyball_id),
      ('Champions League Men', volleyball_id),
      ('Champions League Women', volleyball_id),
      ('Challenge Cup Men', volleyball_id),
      ('Challenge Cup Women', volleyball_id),
      ('CEV Men', volleyball_id),
      ('CEV Women', volleyball_id),
      ('CEV Cup Women', volleyball_id),
      ('Norceca', volleyball_id),
      ('Hungary Women', volleyball_id),
      ('Hungary Men', volleyball_id),
      ('Hungary NB I Women', volleyball_id),
      ('Hungary Cup Women', volleyball_id),
      ('Hungary Cup Men', volleyball_id),
      ('Montenegro Women', volleyball_id),
      ('Montenegro Men', volleyball_id),
      ('Serbia Women', volleyball_id),
      ('Slovenia Women', volleyball_id),
      ('Slovenia 1B Women', volleyball_id),
      ('Slovenia Cup Women', volleyball_id),
      ('Slovenia Men', volleyball_id),
      ('Sweden Women', volleyball_id),
      ('Sweden Men', volleyball_id),
      ('Germany Women', volleyball_id),
      ('Germany Cup Women', volleyball_id),
      ('Germany NC U20 Women', volleyball_id),
      ('Austria Women', volleyball_id),
      ('Austria Men', volleyball_id),
      ('Austria Cup Women', volleyball_id),
      ('Austria Cup Men', volleyball_id),
      ('Croatia Women', volleyball_id),
      ('Croatia Men', volleyball_id),
      ('Croatia Cup Women', volleyball_id),
      ('Croatia Cup Men', volleyball_id),
      ('Croatia 1 Women', volleyball_id),
      ('Portugal Women', volleyball_id),
      ('Portugal Men', volleyball_id),
      ('Portugal A2 Women', volleyball_id),
      ('Portugal A2 Men', volleyball_id),
      ('Portugal Cup Men', volleyball_id),
      ('Portugal 2 Women', volleyball_id),
      ('Iceland Women', volleyball_id),
      ('Iceland Men', volleyball_id),
      ('Malta Women', volleyball_id),
      ('Malta Men', volleyball_id),
      ('Cyprus Women', volleyball_id),
      ('Cyprus Men', volleyball_id),
      ('Greece 3rd Division Women', volleyball_id),
      ('Greece NC U20 Women', volleyball_id),
      ('Bulgaria Women', volleyball_id),
      ('Bulgaria Men', volleyball_id),
      ('Romania Women', volleyball_id),
      ('Romania A2 Men', volleyball_id),
      ('Romania A2 Women', volleyball_id),
      ('Estonia Cup Men', volleyball_id),
      ('Estonia Cup Women', volleyball_id),
      ('Lithuania Women', volleyball_id),
      ('Latvia Women', volleyball_id),
      ('Latvia Cup Men', volleyball_id),
      ('Kazakhstan Women', volleyball_id),
      ('Kazakhstan Men', volleyball_id),
      ('Peru Women', volleyball_id),
      ('Peru Men', volleyball_id),
      ('Rwanda Women', volleyball_id),
      ('Rwanda Men', volleyball_id),
      ('Kenya Men', volleyball_id),
      ('Kenya Women', volleyball_id),
      ('Uganda Women', volleyball_id),
      ('Tunisia Men', volleyball_id),
      ('Egypt Men', volleyball_id),
      ('Egypt Women', volleyball_id),
      ('Iraq Men', volleyball_id),
      ('Qatar Men', volleyball_id),
      ('Taipei Women', volleyball_id),
      ('Vietnam Women', volleyball_id),
      ('Vietnam Men', volleyball_id),
      ('Thailand Women', volleyball_id),
      ('Thailand Men', volleyball_id),
      ('Nicaragua', volleyball_id),
      ('Costa Rica', volleyball_id),
      ('Dominican Republic', volleyball_id),
      ('Albania Women', volleyball_id),
      ('Albania Men', volleyball_id),
      ('Albania Cup Men', volleyball_id),
      ('Bosnia Women', volleyball_id),
      ('Bosnia Men', volleyball_id),
      ('Czech Republic Women', volleyball_id),
      ('International U19 Women', volleyball_id),
      ('International U19 Men', volleyball_id),
      ('International U21 Men', volleyball_id),
      ('Arab Club Women', volleyball_id),
      ('Arab Club Men', volleyball_id),
      ('Islamic Games Men', volleyball_id),
      ('Islamic Games Women', volleyball_id),
      ('Faroe Men', volleyball_id),
      ('Faroe Women', volleyball_id),
      ('Norway 1st Division Women', volleyball_id),
      ('Norway 1st Division Men', volleyball_id),
      ('Switzerland Women', volleyball_id),
      ('Switzerland Men', volleyball_id),
      ('Finland Women', volleyball_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Handball leagues
  if handball_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('MOL League', handball_id),
      ('Slovakia Extraliga Men', handball_id),
      ('Slovakia Men', handball_id),
      ('Poland Men', handball_id),
      ('Poland Women', handball_id),
      ('Denmark Women', handball_id),
      ('Denmark 1st Division Women', handball_id),
      ('France Men', handball_id),
      ('France Women', handball_id),
      ('Hungary Women', handball_id),
      ('Norway Women', handball_id),
      ('Super Globe Men', handball_id),
      ('Super Globe Women', handball_id),
      ('Champions League Women', handball_id),
      ('World Championship Women', handball_id),
      ('World Championship Men', handball_id),
      ('European Championship Women', handball_id),
      ('European Championship Men', handball_id),
      ('Czech Republic Cup Men', handball_id),
      ('Portugal Men', handball_id),
      ('Greece Men', handball_id),
      ('Russia Women', handball_id),
      ('Uruguay Women', handball_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Rugby leagues
  if rugby_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('Super League', rugby_id),
      ('Interstate', rugby_id),
      ('South Africa', rugby_id),
      ('Georgia', rugby_id),
      ('Ireland', rugby_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Badminton leagues
  if badminton_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('Hylo', badminton_id),
      ('Qatar', badminton_id),
      ('Canadian', badminton_id),
      ('India', badminton_id),
      ('Welsh', badminton_id),
      ('Norway', badminton_id),
      ('Australia', badminton_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Squash leagues
  if squash_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('US Open', squash_id),
      ('Qatar', squash_id),
      ('Canadian', squash_id),
      ('Marche', squash_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Water Polo leagues
  if water_polo_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('RWP', water_polo_id),
      ('Liga majstrov', water_polo_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Floorball leagues
  if floorball_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('Sweden Men', floorball_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Futsal leagues
  if futsal_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('Champions League', futsal_id),
      ('World Championship Women', futsal_id),
      ('Slovakia Men', futsal_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Beach Volleyball leagues
  if beach_volleyball_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('General', beach_volleyball_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Athletics leagues
  if athletics_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('MS', athletics_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Softball leagues
  if softball_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('European Championship Women', softball_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;

  -- Politics leagues
  if politics_id is not null then
    insert into public.leagues (name, sport_id)
    select name, sport_id from (values 
      ('ÄŒesko voÄ¾by', politics_id),
      ('Ãrsko prezidentskÃ© voÄ¾by', politics_id)
    ) as v(name, sport_id)
    on conflict (sport_id, name) do nothing;
  end if;
-- end $$;

-- Betting Tips extracted from WhatsApp chat
-- All tips are set to pending status
-- Match dates use the message timestamp when the tip was sent
do $$
declare
  bet365_id uuid;
  nike_id uuid;
  tipsport_id uuid;
  fortuna_id uuid;
  atletika_id uuid;
  badminton_id uuid;
  basketbal_id uuid;
  florbal_id uuid;
  futbal_id uuid;
  futsal_id uuid;
  hadzana_id uuid;
  padel_id uuid;
  politika_id uuid;
  softbal_id uuid;
  squash_id uuid;
  tenis_id uuid;
  vodne_polo_id uuid;
  volejbal_id uuid;
  league_id_var uuid;
  tip_count integer := 0;
begin
  -- Get betting company IDs
  select id into bet365_id from public.betting_companies where name = 'Bet365';
  select id into nike_id from public.betting_companies where name = 'Nike';
  select id into tipsport_id from public.betting_companies where name = 'Tipsport';
  select id into fortuna_id from public.betting_companies where name = 'Fortuna';

  -- Get sport IDs (using English names)
  select id into atletika_id from public.sports where lower(name) = lower('Athletics');
  select id into badminton_id from public.sports where lower(name) = lower('Badminton');
  select id into basketbal_id from public.sports where lower(name) = lower('Basketball');
  select id into florbal_id from public.sports where lower(name) = lower('Floorball');
  select id into futbal_id from public.sports where lower(name) = lower('Soccer');
  select id into futsal_id from public.sports where lower(name) = lower('Futsal');
  select id into hadzana_id from public.sports where lower(name) = lower('Handball');
  select id into padel_id from public.sports where lower(name) = lower('Padel');
  select id into politika_id from public.sports where lower(name) = lower('Politics');
  select id into softbal_id from public.sports where lower(name) = lower('Softball');
  select id into squash_id from public.sports where lower(name) = lower('Squash');
  select id into tenis_id from public.sports where lower(name) = lower('Tennis');
  select id into vodne_polo_id from public.sports where lower(name) = lower('Water Polo');
  select id into volejbal_id from public.sports where lower(name) = lower('Volleyball');

  -- Insert betting tips
  -- 2025-09-10 Nike Softbal me Å¾eny Holandsko 1.01
  if softbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = softbal_id and lower(name) = lower('European Championship Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, softbal_id, league_id_var, 'Holandsko', 1.01, '2025-09-10T10:23:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-10 Nike Softbal me Å¾eny Holandsko 1.01
  if softbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = softbal_id and lower(name) = lower('European Championship Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, softbal_id, league_id_var, 'Holandsko', 1.01, '2025-09-10T10:23:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-10 Nike Softbal me Å¾eny Holandsko 1.01
  if softbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = softbal_id and lower(name) = lower('European Championship Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, softbal_id, league_id_var, 'Holandsko', 1.01, '2025-09-10T10:23:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-10 Bet365 Volejbal Thajsko Å¾eny rangsit 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rangsit', 1.05, '2025-09-10T16:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-10 Bet365 Volejbal Thajsko Å¾eny rangsit 1,05 dhurakij 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rangsit 1,05 dhurakij', 1.015, '2025-09-10T16:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-11 Bet365 Volejbal Thajsko muÅ¾i nakhon 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nakhon', 1.02, '2025-09-11T06:06:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-11 Bet365 Volejbal ArgentÃ­na de honor Å¾eny estudiantes 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Argentina de Honor Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'estudiantes', 1.02, '2025-09-11T14:31:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-11 Bet365 Volejbal Kostarika muÅ¾i uned 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Costa Rica Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'uned', 1.02, '2025-09-11T17:27:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-11 Bet365 Volejbal Thajsko Å¾eny rajamangla 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rajamangla', 1.03, '2025-09-11T21:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-11 Bet365 Volejbal Thajsko Å¾eny rajamangla 1,03 sripatum 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rajamangla 1,03 sripatum', 1.025, '2025-09-11T21:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-12 Nike Tenis utr skopje madarasz 1.04
  if tenis_id is not null then
    select id into league_id_var from public.leagues where sport_id = tenis_id and lower(name) = lower('utr');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, tenis_id, league_id_var, 'skopje madarasz', 1.04, '2025-09-12T09:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-12 Nike Tenis Davis cup Srbsko 1.02
  if tenis_id is not null then
    select id into league_id_var from public.leagues where sport_id = tenis_id and lower(name) = lower('Davis cup');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, tenis_id, league_id_var, 'Srbsko', 1.02, '2025-09-12T10:34:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-12 Nike Futbal Å panielsko Å¾eny Barcelona 1.01
  if futbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = futbal_id and lower(name) = lower('Spain Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, futbal_id, league_id_var, 'Barcelona', 1.01, '2025-09-12T14:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-12 Bet365 Volejbal brasil paulista U19 olimpico 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('brasil paulista U19');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'olimpico', 1.015, '2025-09-12T17:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-12 Bet365 Volejbal brasil paulista U19 olimpico 1,015 a Thajsko rajapruk 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('brasil paulista U19');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'olimpico 1,015 a Thajsko rajapruk', 1.012, '2025-09-12T17:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-13 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i plock 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'plock', 1.01, '2025-09-13T10:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-13 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i kielce 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'kielce', 1.01, '2025-09-13T20:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-14 Bet365 Volejbal Thajsko muÅ¾i sukhothai 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'sukhothai', 1.015, '2025-09-14T07:37:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-14 Nike HÃ¡dzanÃ¡ mol liga most 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('mol liga');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'most', 1.01, '2025-09-14T07:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-14 Nike HÃ¡dzanÃ¡ mol liga most 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('mol liga');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'most', 1.01, '2025-09-14T07:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-16 Nike Tenis WTA caldas Å¾eny kalieva 1.set 1.03
  if tenis_id is not null then
    select id into league_id_var from public.leagues where sport_id = tenis_id and lower(name) = lower('WTA');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, tenis_id, league_id_var, 'caldas Å¾eny kalieva 1.set', 1.03, '2025-09-16T09:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-16 Nike Tenis WTA caldas Å¾eny kalieva 1.set 1,03 a tenis kursumlijska muÅ¾i maksimovic 1.01
  if tenis_id is not null then
    select id into league_id_var from public.leagues where sport_id = tenis_id and lower(name) = lower('WTA');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, tenis_id, league_id_var, 'caldas Å¾eny kalieva 1.set 1,03 a tenis kursumlijska muÅ¾i maksimovic', 1.01, '2025-09-16T09:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-16 Bet365 Volejbal zÃ¡pasy zen zen 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'zen', 1.025, '2025-09-16T16:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-16 Bet365 Volejbal zÃ¡pasy zen 1,025 supreme 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, '1,025 supreme', 1.05, '2025-09-16T16:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-16 Bet365 Volejbal zÃ¡pasy zen 1,025 supreme 1,05 sisaket 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, '1,025 supreme 1,05 sisaket', 1.04, '2025-09-16T16:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-17 Bet365 Volejbal brasil U19 Å¾eny barueri 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'barueri', 1.025, '2025-09-17T13:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-17 Bet365 Volejbal brasil U19 Å¾eny barueri 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'barueri', 1.025, '2025-09-17T13:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-17 Bet365 Volejbal ncaa Å¾eny michigan 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'michigan', 1.04, '2025-09-17T13:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-19 Nike Atletika ms 400m prekÃ¡Å¾ky Å¾eny rozklikni celkovo vÃ­Å¥az bol Ã¡no 1.08
  if atletika_id is not null then
    select id into league_id_var from public.leagues where sport_id = atletika_id and lower(name) = lower('ms');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, atletika_id, league_id_var, '400m prekÃ¡Å¾ky Å¾eny rozklikni celkovo vÃ­Å¥az bol Ã¡no', 1.08, '2025-09-19T06:21:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-19 Bet365 Volejbal ncaa Å¾eny Boston college 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Boston college', 1.015, '2025-09-19T13:34:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-20 Bet365 Volejbal zÃ¡pasy zen sisaket 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'sisaket', 1.015, '2025-09-20T09:14:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-20 Bet365 Volejbal uruguay clausura a muÅ¾i cbps 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Uruguay clausura Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cbps', 1.01, '2025-09-20T17:27:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-20 Bet365 Volejbal uruguay clausura a muÅ¾i cbps 1,01 zÃ¡pasy muÅ¾i volei nova 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Uruguay clausura Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cbps 1,01 zÃ¡pasy muÅ¾i volei nova', 1.012, '2025-09-20T17:27:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-21 Bet365 Volejbal indonÃ©zia Å¾eny gresik 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Indonesia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'gresik', 1.02, '2025-09-21T09:25:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-21 Nike HÃ¡dzanÃ¡ SVK extraliga muÅ¾i PreÅ¡ov 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Slovakia Extraliga Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'PreÅ¡ov', 1.01, '2025-09-21T11:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-21 Bet365 Volejbal ncaa Å¾eny arizona 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'arizona', 1.012, '2025-09-21T15:58:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-23 Nike Basketbal NÃ³rsko muÅ¾i kongsberg 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('Norway Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'kongsberg', 1.01, '2025-09-23T09:51:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-24 Nike Basketbal NÃ³rsko muÅ¾i kongsberg 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('Norway Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'kongsberg', 1.01, '2025-09-24T10:09:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-24 Nike Basketbal MaÄarsko Å¾eny ftc 1.02
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('Hungary Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'ftc', 1.02, '2025-09-24T10:09:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-24 Nike Basketbal NÃ³rsko muÅ¾i kongsberg 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('Norway Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'kongsberg', 1.01, '2025-09-24T10:09:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-25 Bet365 Volejbal ArgentÃ­na de honor Å¾eny san lorenzo 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Argentina de Honor Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'san lorenzo', 1.02, '2025-09-25T10:21:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-25 Bet365 Volejbal brasil paulista U19 muÅ¾i Centro olimpico 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Centro olimpico', 1.05, '2025-09-25T12:59:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-25 Bet365 Volejbal uruguay clausura Primera Å¾eny cdv 1.071
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Uruguay Clausura Primera Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cdv', 1.071, '2025-09-25T16:40:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-26 Bet365 Volejbal ncaa Å¾eny wisconsin 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'wisconsin', 1.03, '2025-09-26T11:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-26 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i kielce 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'kielce', 1.01, '2025-09-26T16:38:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-27 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i kielce 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'kielce', 1.01, '2025-09-27T08:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-27 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i kielce 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'kielce', 1.01, '2025-09-27T08:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-27 Nike HÃ¡dzanÃ¡ SVK extraliga muÅ¾i PovaÅ¾skÃ¡ 1,01 a basketbal ÄŒesko Å¾eny kp Brno 1.05
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Slovakia Extraliga Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'PovaÅ¾skÃ¡ 1,01 a basketbal ÄŒesko Å¾eny kp Brno', 1.05, '2025-09-27T08:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-27 Bet365 Volejbal brasil paulista U19 Å¾eny louveira 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'louveira', 1.015, '2025-09-27T13:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-27 Bet365 Volejbal uruguay zeny nautico 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('uruguay zeny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nautico', 1.05, '2025-09-27T18:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-28 Nike Squash Å¾eny qatar el hammamy 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('Qatar Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'hammamy', 1.02, '2025-09-28T10:53:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-28 Nike Squash Å¾eny qatar el hammamy 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('Qatar Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'hammamy', 1.02, '2025-09-28T10:53:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-28 Bet365 Volejbal zÃ¡pasy zen nicaragua 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nicaragua', 1.02, '2025-09-28T17:34:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-28 Bet365 Volejbal zÃ¡pasy zen nicaragua 1,02 a costarica 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nicaragua 1,02 a costarica', 1.012, '2025-09-28T17:34:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-09-30 Nike HÃ¡dzanÃ¡ super globe taubate 1.02
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('super globe');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'taubate', 1.02, '2025-09-30T09:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-01 Nike HÃ¡dzanÃ¡ DÃ¡nsko Å¾eny 1.divizia holstebro 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, '1.divizia holstebro', 1.01, '2025-10-01T09:34:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-02 Nike Basketbal me tapan 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('me');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'tapan', 1.01, '2025-10-02T10:20:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-02 Nike Basketbal super globe muÅ¾i taubate 1.04
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('Super Globe Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'taubate', 1.04, '2025-10-02T10:20:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-03 Nike Politika ÄŒesko voÄ¾by ANO vÃ­Å¥az 1.01
  if politika_id is not null then
    select id into league_id_var from public.leagues where sport_id = politika_id and lower(name) = lower('ÄŒesko voÄ¾by ANO');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, politika_id, league_id_var, 'vÃ­Å¥az', 1.01, '2025-10-03T10:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-03 Nike HÃ¡dzanÃ¡ FrancÃºzsko muÅ¾i Paris 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('France Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'Paris', 1.01, '2025-10-03T10:42:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-04 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i kielce 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'kielce', 1.01, '2025-10-04T11:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-04 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i kielce 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'kielce', 1.01, '2025-10-04T11:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-05 Nike Volejbal DÃ¡nsko Å¾eny asv elite 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'asv elite', 1.02, '2025-10-05T10:28:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-07 Bet365 Volejbal norceca DominikÃ¡nska 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('norceca');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'DominikÃ¡nska', 1.015, '2025-10-07T20:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-09 Nike Futbal ms RakÃºsko 1.01
  if futbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = futbal_id and lower(name) = lower('ms');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, futbal_id, league_id_var, 'RakÃºsko', 1.01, '2025-10-09T10:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-09 Nike Futbal ms RakÃºsko 1.01
  if futbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = futbal_id and lower(name) = lower('ms');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, futbal_id, league_id_var, 'RakÃºsko', 1.01, '2025-10-09T10:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-09 Bet365 Volejbal MaÄarsko Å¾eny bekescaba 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Hungary Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bekescaba', 1.01, '2025-10-09T10:20:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-09 Bet365 Volejbal MaÄarsko Å¾eny bekescaba 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Hungary Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bekescaba', 1.01, '2025-10-09T10:20:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-09 Bet365 Volejbal Kostarika Å¾eny san jose 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Costa Rica Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'san jose', 1.05, '2025-10-09T15:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-10 Nike HÃ¡dzanÃ¡ SVK muÅ¾i PreÅ¡ov 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Slovakia Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'PreÅ¡ov', 1.01, '2025-10-10T10:17:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-10 Nike HÃ¡dzanÃ¡ SVK muÅ¾i PreÅ¡ov 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Slovakia Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'PreÅ¡ov', 1.01, '2025-10-10T10:17:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-10 Bet365 Volejbal AlbÃ¡nsko Å¾eny skanderbeu 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Albania Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'skanderbeu', 1.02, '2025-10-10T10:42:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-10 Bet365 Volejbal ncaa Å¾eny lousville 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'lousville', 1.02, '2025-10-10T12:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-10 Bet365 Volejbal ncaa Å¾eny lousville 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'lousville', 1.02, '2025-10-10T12:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-11 Bet365 Volejbal SVK Å¾eny Slovan 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Slovan', 1.01, '2025-10-11T10:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-11 Bet365 Volejbal SVK Å¾eny Slovan 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Slovan', 1.01, '2025-10-11T10:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-11 Bet365 Volejbal SVK Å¾eny Slovan 1,01 Srbsko Å¾eny tent 1,01 Å vÃ©dsko Å¾eny hylte 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Slovan 1,01 Srbsko Å¾eny tent 1,01 Å vÃ©dsko Å¾eny hylte', 1.02, '2025-10-11T10:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-11 Bet365 Volejbal SVK Å¾eny Slovan 1,01 Srbsko Å¾eny tent 1,01 Å vÃ©dsko Å¾eny hylte 1,02 Å vÃ©dsko muÅ¾i floby 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Slovan 1,01 Srbsko Å¾eny tent 1,01 Å vÃ©dsko Å¾eny hylte 1,02 Å vÃ©dsko muÅ¾i floby', 1.04, '2025-10-11T10:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-11 Nike Tenis WTA tampico Å¾eny Scott 1.01
  if tenis_id is not null then
    select id into league_id_var from public.leagues where sport_id = tenis_id and lower(name) = lower('WTA');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, tenis_id, league_id_var, 'tampico Å¾eny Scott', 1.01, '2025-10-11T15:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-11 Bet365 Volejbal FilipÃ­ny wncaa scorpions 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny wncaa');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'scorpions', 1.03, '2025-10-11T21:00:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-12 Bet365 Volejbal DÃ¡nsko Å¾eny holte 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'holte', 1.05, '2025-10-12T09:58:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-12 Nike Florbal Å vÃ©dsko muÅ¾i storvreta 1.01
  if florbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = florbal_id and lower(name) = lower('Sweden Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, florbal_id, league_id_var, 'storvreta', 1.01, '2025-10-12T11:21:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-12 Bet365 Volejbal Å vÃ©dsko muÅ¾i solentuna 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Sweden Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'solentuna', 1.03, '2025-10-12T12:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-12 Bet365 Volejbal Å vÃ©dsko muÅ¾i solentuna 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Sweden Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'solentuna', 1.03, '2025-10-12T12:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-12 Bet365 Volejbal Äierna hora Budva 1,03 podgorica 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Budva 1,03 podgorica', 1.02, '2025-10-12T12:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-12 Nike Futbal ms ChorvÃ¡tsko 1.01
  if futbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = futbal_id and lower(name) = lower('ms');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, futbal_id, league_id_var, 'ChorvÃ¡tsko', 1.01, '2025-10-12T12:48:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-13 Bet365 Volejbal brasil paulista U21 Å¾eny osasco 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U21 Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'osasco', 1.03, '2025-10-13T09:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-14 Bet365 Volejbal brasil paulista U19 muÅ¾i Centro 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Centro', 1.015, '2025-10-14T14:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-14 Bet365 Volejbal brasil paulista U19 muÅ¾i Centro 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Centro', 1.01, '2025-10-14T14:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-14 Bet365 Volejbal brasil paulista U19 muÅ¾i Centro 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Centro', 1.01, '2025-10-14T14:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-15 Bet365 Volejbal Island Å¾eny ka 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Island Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ka', 1.02, '2025-10-15T09:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-15 Nike Basketbal euro cup Å¾eny avenida 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'avenida', 1.01, '2025-10-15T13:28:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-15 Bet365 Volejbal Slovinsko Å¾eny branik 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovinsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'branik', 1.03, '2025-10-15T16:33:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-15 Bet365 Volejbal Slovinsko Å¾eny branik 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovinsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'branik', 1.03, '2025-10-15T16:33:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-16 Bet365 Volejbal Kazachstan Å¾eny berel 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'berel', 1.01, '2025-10-16T15:08:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-16 Bet365 Volejbal Kazachstan Å¾eny berel 1,01 a kuanysh 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'berel 1,01 a kuanysh', 1.025, '2025-10-16T15:08:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-18 Bet365 Volejbal Ãrsko gardians 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Ãrsko');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'gardians', 1.01, '2025-10-18T11:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-18 Bet365 Volejbal Izrael Å¾eny haoel kfar 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Izrael Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'haoel kfar', 1.015, '2025-10-18T11:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-18 Bet365 Volejbal DÃ¡nsko Å¾eny asv aarhus 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'asv aarhus', 1.025, '2025-10-18T11:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-18 Bet365 Volejbal ÄŒesko Å¾eny Liberec 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('ÄŒesko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Liberec', 1.015, '2025-10-18T11:48:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-18 Bet365 Volejbal SVK Å¾eny Å½ilina 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Å½ilina', 1.03, '2025-10-18T11:48:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-18 Bet365 Volejbal SVK Å¾eny Å½ilina 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Å½ilina', 1.03, '2025-10-18T11:48:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-19 Bet365 Volejbal Srbsko Å¾eny tent 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Srbsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'tent', 1.01, '2025-10-19T08:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-19 Bet365 Volejbal Srbsko Å¾eny tent 1,01 Portugalsko Å¾eny Porto 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Srbsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'tent 1,01 Portugalsko Å¾eny Porto', 1.015, '2025-10-19T08:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-19 Nike Squash us open asal 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('us open');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'asal', 1.02, '2025-10-19T10:12:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-19 Nike Squash us open asal 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('us open');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'asal', 1.02, '2025-10-19T10:12:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-19 Bet365 Volejbal montenegro muÅ¾i muÅ¾i 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('montenegro muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'muÅ¾i', 1.05, '2025-10-19T12:38:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-19 Nike HÃ¡dzanÃ¡ SVK muÅ¾i PreÅ¡ov 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Slovakia Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'PreÅ¡ov', 1.01, '2025-10-19T12:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-19 Bet365 Volejbal Kazachstan Å¾eny zhetysu 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'zhetysu', 1.01, '2025-10-19T22:28:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-19 Bet365 Volejbal Kazachstan Å¾eny zhetysu 1,01 turan 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'zhetysu 1,01 turan', 1.04, '2025-10-19T22:28:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-20 Bet365 Volejbal GrÃ©cko nc U20 Å¾eny deka 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('GrÃ©cko nc U20 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'deka', 1.025, '2025-10-20T14:43:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-20 Nike Squash us open asal 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('us open');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'asal', 1.02, '2025-10-20T19:28:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-20 Nike Squash us open asal 1,02 el hammamy 1.03
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('us open');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'asal 1,02 el hammamy', 1.03, '2025-10-20T19:28:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-21 Bet365 Volejbal Izrael muÅ¾i hapoel kfar 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Izrael muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'hapoel kfar', 1.025, '2025-10-21T10:40:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-21 Nike Squash us open el sherbini 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('us open');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'el sherbini', 1.02, '2025-10-21T16:17:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-22 Nike HÃ¡dzanÃ¡ NÃ³rsko Å¾eny storhamar 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('NÃ³rsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'storhamar', 1.01, '2025-10-22T13:03:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-22 Nike HÃ¡dzanÃ¡ NÃ³rsko Å¾eny storhamar 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('NÃ³rsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'storhamar', 1.01, '2025-10-22T13:03:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-22 Bet365 Volejbal Slovinsko Å¾eny calcit 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovinsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'calcit', 1.04, '2025-10-22T13:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-22 Bet365 Volejbal MaÄarsko nb I Å¾eny vesc 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MaÄarsko nb I Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vesc', 1.01, '2025-10-22T13:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-23 Bet365 Volejbal brasil paulista U19 Å¾eny pinheiros 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pinheiros', 1.05, '2025-10-23T09:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-23 Nike Basketbal BrazÃ­lia paulista Å¾eny ourinhos 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('BrazÃ­lia paulista Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'ourinhos', 1.01, '2025-10-23T10:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-23 Nike Basketbal BrazÃ­lia paulista Å¾eny ourinhos 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('BrazÃ­lia paulista Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'ourinhos', 1.01, '2025-10-23T10:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-23 Bet365 Volejbal brasil rdj U19 muÅ¾i fluminense 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('brasil rdj U19 muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'fluminense', 1.025, '2025-10-23T15:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-23 Bet365 Volejbal brasil rdj U19 muÅ¾i fluminense 1,025 a Kosovo Å¾eny kv fer 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('brasil rdj U19 muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'fluminense 1,025 a Kosovo Å¾eny kv fer', 1.01, '2025-10-23T15:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-24 Nike HÃ¡dzanÃ¡ NÃ³rsko Å¾eny larvik 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('NÃ³rsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'larvik', 1.01, '2025-10-24T10:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-24 Bet365 Volejbal Bulharsko Å¾eny cska 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bulharsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cska', 1.025, '2025-10-24T10:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-24 Bet365 Volejbal Bulharsko Å¾eny cska 1,025 maritza 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bulharsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cska 1,025 maritza', 1.012, '2025-10-24T10:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-24 Bet365 Volejbal Bulharsko Å¾eny cska 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bulharsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cska', 1.02, '2025-10-24T10:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-25 Nike HÃ¡dzanÃ¡ Portugalsko muÅ¾i Porto 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Portugalsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'Porto', 1.01, '2025-10-25T10:00:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-25 Nike HÃ¡dzanÃ¡ Portugalsko muÅ¾i Porto 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Portugalsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'Porto', 1.01, '2025-10-25T10:00:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-25 Bet365 Volejbal Cyprus Å¾eny aek larnaca 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Cyprus Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'aek larnaca', 1.02, '2025-10-25T13:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-25 Bet365 Volejbal Äierna hora Å¾eny luka bar 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'luka bar', 1.05, '2025-10-25T13:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-25 Bet365 Volejbal Portugalsko 2 Å¾eny Santa Cruz 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko 2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Santa Cruz', 1.04, '2025-10-25T20:13:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-25 Bet365 Volejbal Portugalsko 2 Å¾eny Santa Cruz 1,04 praiense 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko 2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Santa Cruz 1,04 praiense', 1.015, '2025-10-25T20:13:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-26 Bet365 Volejbal Portugalsko Å¾eny Santa anta Cruz 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko Å¾eny Santa');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'anta Cruz', 1.012, '2025-10-26T12:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-26 Bet365 Volejbal RakÃºsko Å¾eny Linz 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Linz', 1.03, '2025-10-26T13:02:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-26 Bet365 Volejbal RakÃºsko Å¾eny Linz 1,03 Portugalsko Å¾eny Vitoria 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Linz 1,03 Portugalsko Å¾eny Vitoria', 1.02, '2025-10-26T13:02:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-26 Bet365 Volejbal peru Å¾eny regatas 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('peru Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'regatas', 1.02, '2025-10-26T15:07:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-26 Bet365 Volejbal brasil paulista U19 Å¾eny pinheiros 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pinheiros', 1.05, '2025-10-26T15:07:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-26 Bet365 Volejbal brasil paulista U19 Å¾eny pinheiros 1,05 ncaa Å¾eny Pittsburgh 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pinheiros 1,05 ncaa Å¾eny Pittsburgh', 1.015, '2025-10-26T15:07:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-26 Bet365 Volejbal brasil paulista U19 Å¾eny pinheiros 1,05 ncaa Å¾eny Pittsburgh 1,015 smu 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Brazil Paulista U19 Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pinheiros 1,05 ncaa Å¾eny Pittsburgh 1,015 smu', 1.025, '2025-10-26T15:07:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-27 Bet365 Volejbal arabskÃ© klubovÃ© Å¾eny africain 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('arabskÃ© klubovÃ© Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'africain', 1.01, '2025-10-27T09:42:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-27 Bet365 Volejbal arabskÃ© klubovÃ© Å¾eny africain 1,01 carthage 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('arabskÃ© klubovÃ© Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'africain 1,01 carthage', 1.03, '2025-10-27T09:42:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-27 Nike Squash canadian orfi 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('canadian');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'orfi', 1.02, '2025-10-27T09:43:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-27 Bet365 Volejbal GrÃ©cko 3.division Å¾eny papagou 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('GrÃ©cko 3.division Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'papagou', 1.04, '2025-10-27T15:07:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-27 Bet365 Volejbal me lisiakos 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('me');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'lisiakos', 1.03, '2025-10-27T15:07:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-27 Bet365 Volejbal FilipÃ­ny mpva Å¾eny pasay 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny mpva Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pasay', 1.03, '2025-10-27T21:02:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-27 Bet365 Volejbal FilipÃ­ny mpva Å¾eny pasay 1,03 a FilipÃ­ny pvl Å¾eny akari 1.062
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny mpva Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pasay 1,03 a FilipÃ­ny pvl Å¾eny akari', 1.062, '2025-10-27T21:02:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-28 Bet365 Volejbal Vietnam Å¾eny nguyen 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Vietnam Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nguyen', 1.025, '2025-10-28T09:53:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-28 Nike Futbal Malajzia pohÃ¡r johor stÃ¡vka bez remÃ­zy 1.01
  if futbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = futbal_id and lower(name) = lower('Malajzia pohÃ¡r');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, futbal_id, league_id_var, 'johor stÃ¡vka bez remÃ­zy', 1.01, '2025-10-28T10:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-28 Nike Futbal Malajzia pohÃ¡r johor stÃ¡vka bez remÃ­zy 1.01
  if futbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = futbal_id and lower(name) = lower('Malajzia pohÃ¡r');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, futbal_id, league_id_var, 'johor stÃ¡vka bez remÃ­zy', 1.01, '2025-10-28T10:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-28 Bet365 Volejbal liga majstrov muÅ¾i Dinamo 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('liga majstrov muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Dinamo', 1.05, '2025-10-28T15:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-28 Bet365 Volejbal liga majstrov muÅ¾i Dinamo 1,05 Slovinsko pohÃ¡r Å¾eny gen-i 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('liga majstrov muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Dinamo 1,05 Slovinsko pohÃ¡r Å¾eny gen-i', 1.025, '2025-10-28T15:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-28 Bet365 Volejbal liga majstrov muÅ¾i Dinamo 1,05 Slovinsko pohÃ¡r Å¾eny gen-i 1,025 calcit 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('liga majstrov muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Dinamo 1,05 Slovinsko pohÃ¡r Å¾eny gen-i 1,025 calcit', 1.015, '2025-10-28T15:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-29 Nike Volejbal Challenge cup Å¾eny tchalou 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'tchalou', 1.02, '2025-10-29T11:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-29 Nike Volejbal Challenge cup Å¾eny tchalou 1,02 Nemecko Å¾eny schwerin 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'tchalou 1,02 Nemecko Å¾eny schwerin', 1.01, '2025-10-29T11:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-29 Nike Volejbal Challenge cup Å¾eny tchalou 1,02 Nemecko Å¾eny schwerin 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'tchalou 1,02 Nemecko Å¾eny schwerin', 1.01, '2025-10-29T11:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-29 Nike Futsal liga majstrov sk.4 sporting 1.04
  if futsal_id is not null then
    select id into league_id_var from public.leagues where sport_id = futsal_id and lower(name) = lower('liga majstrov');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, futsal_id, league_id_var, 'sk.4 sporting', 1.04, '2025-10-29T11:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-29 Bet365 Volejbal muÅ¾i muÅ¾i vegyez 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('muÅ¾i muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vegyez', 1.04, '2025-10-29T17:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-29 Bet365 Volejbal MaÄarsko pohÃ¡r Å¾eny vesc 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MaÄarsko pohÃ¡r Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vesc', 1.05, '2025-10-29T17:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Bet365 Volejbal Vietnam muÅ¾i vinh 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Vietnam muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vinh', 1.015, '2025-10-30T08:03:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Bet365 Volejbal Vietnam Å¾eny bac 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Vietnam Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bac', 1.05, '2025-10-30T08:03:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Bet365 Volejbal arabskÃ© klubovÃ© bejaia 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('arabskÃ© klubovÃ©');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bejaia', 1.025, '2025-10-30T08:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Bet365 Volejbal arabskÃ© klubovÃ© bejaia 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('arabskÃ© klubovÃ©');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bejaia', 1.02, '2025-10-30T08:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Bet365 Volejbal DÃ¡nsko pohÃ¡r Å¾eny gentofte 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('DÃ¡nsko pohÃ¡r Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'gentofte', 1.01, '2025-10-30T08:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Nike Badminton Hylo Å¡tvorhra astrup/rasmusen 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Hylo');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'Å¡tvorhra astrup/rasmusen', 1.01, '2025-10-30T09:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Nike Badminton Hylo Å¡tvorhra astrup/rasmusen 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Hylo');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'Å¡tvorhra astrup/rasmusen', 1.01, '2025-10-30T09:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Nike Badminton Hylo Å¡tvorhra astrup/rasmusen 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Hylo');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'Å¡tvorhra astrup/rasmusen', 1.01, '2025-10-30T09:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Nike Badminton Hylo Å¡tvorhra astrup/rasmusen 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Hylo');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'Å¡tvorhra astrup/rasmusen', 1.01, '2025-10-30T09:54:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-30 Bet365 Volejbal Slovinsko 1B Å¾eny krim 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovinsko 1B Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'krim', 1.05, '2025-10-30T17:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-31 Nike HÃ¡dzanÃ¡ PoÄ¾sko Å¾eny zaglebie 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('PoÄ¾sko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'zaglebie', 1.01, '2025-10-31T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-31 Nike HÃ¡dzanÃ¡ PoÄ¾sko Å¾eny zaglebie 1,01 volejbal Bulharsko Å¾eny vk marica 1.02
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('PoÄ¾sko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'zaglebie 1,01 volejbal Bulharsko Å¾eny vk marica', 1.02, '2025-10-31T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-31 Bet365 Volejbal AlbÃ¡nsko cup muÅ¾i tirana 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('AlbÃ¡nsko cup muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'tirana', 1.04, '2025-10-31T10:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-31 Bet365 Volejbal AlbÃ¡nsko cup muÅ¾i tirana 1,04 AlbÃ¡nsko Å¾eny tirana 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('AlbÃ¡nsko cup muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'tirana 1,04 AlbÃ¡nsko Å¾eny tirana', 1.025, '2025-10-31T10:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-10-31 Bet365 Volejbal ChorvÃ¡tsko Å¾eny nebo 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('ChorvÃ¡tsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nebo', 1.03, '2025-10-31T10:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Nike Basketbal SVK Å¾eny Slovan 1.02
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'Slovan', 1.02, '2025-11-01T08:31:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Bet365 Volejbal arabskÃ© klubovÃ© Å¾eny nc bejaia 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('arabskÃ© klubovÃ© Å¾eny nc');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bejaia', 1.01, '2025-11-01T10:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Bet365 Volejbal arabskÃ© klubovÃ© Å¾eny nc bejaia 1,01 FrancÃºzsko Å¾eny levallois 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('arabskÃ© klubovÃ© Å¾eny nc');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bejaia 1,01 FrancÃºzsko Å¾eny levallois', 1.015, '2025-11-01T10:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Bet365 Volejbal arabskÃ© klubovÃ© Å¾eny nc bejaia 1,01 FrancÃºzsko Å¾eny levallois 1,015 EstÃ³nsko pohÃ¡r barrus 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('arabskÃ© klubovÃ© Å¾eny nc');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bejaia 1,01 FrancÃºzsko Å¾eny levallois 1,015 EstÃ³nsko pohÃ¡r barrus', 1.025, '2025-11-01T10:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Nike Volejbal Rumunsko Å¾eny Dinamo 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Rumunsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'Dinamo', 1.02, '2025-11-01T13:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Bet365 Volejbal Portugalsko A2 muÅ¾i ginastica 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ginastica', 1.02, '2025-11-01T14:06:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Bet365 Volejbal Portugalsko A2 muÅ¾i ginastica 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ginastica', 1.02, '2025-11-01T14:06:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Bet365 Volejbal peru Å¾eny alianza 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('peru Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'alianza', 1.03, '2025-11-01T19:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-01 Bet365 Volejbal Thajsko Å¾eny rattana 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rattana', 1.015, '2025-11-01T19:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-02 Bet365 Volejbal EstÃ³nsko pohÃ¡r muÅ¾i bigbank 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('EstÃ³nsko pohÃ¡r muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bigbank', 1.015, '2025-11-02T07:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-02 Bet365 Volejbal EstÃ³nsko pohÃ¡r muÅ¾i bigbank 1,015 Å vajÄiarsko Å¾eny neuchatel 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('EstÃ³nsko pohÃ¡r muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bigbank 1,015 Å vajÄiarsko Å¾eny neuchatel', 1.02, '2025-11-02T07:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-02 Bet365 Volejbal EstÃ³nsko pohÃ¡r muÅ¾i bigbank 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('EstÃ³nsko pohÃ¡r muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bigbank', 1.015, '2025-11-02T07:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-02 Bet365 Volejbal Island Å¾eny HK 1,015 Island muÅ¾i ka 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Island Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'HK 1,015 Island muÅ¾i ka', 1.03, '2025-11-02T07:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-03 Bet365 Volejbal RakÃºsko pohÃ¡r Å¾eny bad radkersburg 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko pohÃ¡r Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bad radkersburg', 1.02, '2025-11-03T13:40:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-03 Bet365 Volejbal ncaa 2 Å¾aby fayetevile 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('ncaa 2 Å¾aby');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'fayetevile', 1.04, '2025-11-03T18:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-03 Nike Basketbal BrazÃ­lia muÅ¾i corinthians 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('BrazÃ­lia muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'corinthians', 1.01, '2025-11-03T20:40:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-04 Nike Volejbal Kazachstan Å¾eny zhetysu 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'zhetysu', 1.01, '2025-11-04T10:08:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-04 Bet365 Volejbal Izrael muÅ¾i maccabi aviv 1.11
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Izrael muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'maccabi aviv', 1.11, '2025-11-04T10:34:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-04 Bet365 Volejbal Egypt muÅ¾i ak ahly 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Egypt muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ak ahly', 1.02, '2025-11-04T14:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-04 Bet365 Volejbal Egypt muÅ¾i ak ahly 1,02 zamalek 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Egypt muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ak ahly 1,02 zamalek', 1.01, '2025-11-04T14:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Nike VodnÃ© pÃ³lo rwp novi beograd 1.01
  if vodne_polo_id is not null then
    select id into league_id_var from public.leagues where sport_id = vodne_polo_id and lower(name) = lower('rwp');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, vodne_polo_id, league_id_var, 'novi beograd', 1.01, '2025-11-05T10:30:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Nike VodnÃ© pÃ³lo ÄŒesko pohÃ¡r muÅ¾i KarvinÃ¡ 1.02
  if vodne_polo_id is not null then
    select id into league_id_var from public.leagues where sport_id = vodne_polo_id and lower(name) = lower('ÄŒesko pohÃ¡r muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, vodne_polo_id, league_id_var, 'KarvinÃ¡', 1.02, '2025-11-05T10:30:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal DÃ¡nsko Å¾eny aarhus 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'aarhus', 1.04, '2025-11-05T10:58:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal DÃ¡nsko Å¾eny aarhus 1,04 Kazachstan Å¾eny kuanysh 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'aarhus 1,04 Kazachstan Å¾eny kuanysh', 1.01, '2025-11-05T10:58:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal Kazachstan Å¾eny kuanysh 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kuanysh', 1.015, '2025-11-05T18:51:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal Kazachstan Å¾eny kuanysh 1,015 berel 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kuanysh 1,015 berel', 1.025, '2025-11-05T18:51:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal Kazachstan Å¾eny zhetysu 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'zhetysu', 1.03, '2025-11-05T18:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal Kazachstan Å¾eny zhetysu 1,03 karaganda 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'zhetysu 1,03 karaganda', 1.04, '2025-11-05T18:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal Kazachstan Å¾eny zhetysu 1,03 karaganda 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'zhetysu 1,03 karaganda', 1.04, '2025-11-05T18:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal ncaa Å¾eny arizona 1,04 peru muÅ¾i mb volley 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'arizona 1,04 peru muÅ¾i mb volley', 1.015, '2025-11-05T18:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Bet365 Volejbal ncaa Å¾eny arizona 1,04 peru muÅ¾i mb volley 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'arizona 1,04 peru muÅ¾i mb volley', 1.01, '2025-11-05T18:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-05 Nike VodnÃ© pÃ³lo rwp novi beograd 1.01
  if vodne_polo_id is not null then
    select id into league_id_var from public.leagues where sport_id = vodne_polo_id and lower(name) = lower('rwp');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, vodne_polo_id, league_id_var, 'novi beograd', 1.01, '2025-11-05T20:34:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-06 Bet365 Volejbal ncaa Å¾eny nebraska 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nebraska', 1.02, '2025-11-06T15:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-06 Bet365 Volejbal kenya muÅ¾i kdf 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('kenya muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kdf', 1.02, '2025-11-06T19:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-06 Bet365 Volejbal SVK muÅ¾i KomÃ¡rno 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'KomÃ¡rno', 1.01, '2025-11-06T19:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-06 Bet365 Volejbal SVK muÅ¾i KomÃ¡rno 1,01 Izrael muÅ¾i maccabi 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'KomÃ¡rno 1,01 Izrael muÅ¾i maccabi', 1.05, '2025-11-06T19:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Nike Badminton Å¡tvorhra muÅ¾i klingard/rasmusen 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Å¡tvorhra muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'klingard/rasmusen', 1.01, '2025-11-07T06:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Nike Badminton Å¡tvorhra muÅ¾i klingard/rasmusen 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Å¡tvorhra muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'klingard/rasmusen', 1.01, '2025-11-07T06:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Nike Badminton Å¡tvorhra muÅ¾i klingard/rasmusen 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Å¡tvorhra muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'klingard/rasmusen', 1.01, '2025-11-07T06:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Nike Badminton Å¡tvorhra muÅ¾i klingard/rasmusen 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Å¡tvorhra muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'klingard/rasmusen', 1.01, '2025-11-07T06:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Bet365 Volejbal Izrael Å¾eny maccabi 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Izrael Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'maccabi', 1.012, '2025-11-07T10:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Bet365 Volejbal Srbsko Å¾eny jedinstvo 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Srbsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'jedinstvo', 1.02, '2025-11-07T10:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Bet365 Volejbal Srbsko Å¾eny jedinstvo 1,02 KeÅˆa muÅ¾i kenya prisons 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Srbsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'jedinstvo 1,02 KeÅˆa muÅ¾i kenya prisons', 1.03, '2025-11-07T10:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Bet365 Volejbal Rumunsko A2 muÅ¾i timisoara 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Rumunsko A2 muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'timisoara', 1.01, '2025-11-07T14:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Bet365 Volejbal Srbsko Å¾eny jedinstvo 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Srbsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'jedinstvo', 1.02, '2025-11-07T14:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Bet365 Volejbal MaÄarsko muÅ¾i kaposvar 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MaÄarsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kaposvar', 1.05, '2025-11-07T14:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-07 Bet365 Volejbal ncaa Å¾eny Pittsburgh 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Pittsburgh', 1.015, '2025-11-07T14:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-08 Bet365 Volejbal DÃ¡nsko Å¾eny holte 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'holte', 1.01, '2025-11-08T08:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-08 Bet365 Volejbal DÃ¡nsko Å¾eny holte 1,01 Å vÃ©dsko Å¾eny hylte 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'holte 1,01 Å vÃ©dsko Å¾eny hylte', 1.012, '2025-11-08T08:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-08 Bet365 Volejbal DÃ¡nsko Å¾eny holte 1,01 Å vÃ©dsko Å¾eny hylte 1,012 linkopings 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'holte 1,01 Å vÃ©dsko Å¾eny hylte 1,012 linkopings', 1.02, '2025-11-08T08:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-08 Bet365 Volejbal DÃ¡nsko Å¾eny holte 1,01 Å vÃ©dsko Å¾eny hylte 1,012 linkopings 1,02 NÃ³rsko Å¾eny 1.div. finstad 1.005
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'holte 1,01 Å vÃ©dsko Å¾eny hylte 1,012 linkopings 1,02 NÃ³rsko Å¾eny 1.div. finstad', 1.005, '2025-11-08T08:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-08 Nike Volejbal Rumunsko Å¾eny Alba blaj 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Rumunsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'Alba blaj', 1.01, '2025-11-08T11:03:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-08 Nike Volejbal Rumunsko Å¾eny Alba blaj 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Rumunsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'Alba blaj', 1.01, '2025-11-08T11:03:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-08 Nike Volejbal Rumunsko Å¾eny Alba blaj 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Rumunsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'Alba blaj', 1.01, '2025-11-08T11:03:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-08 Bet365 Volejbal Å vajÄiarsko Å¾eny schafhausen 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Å vajÄiarsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'schafhausen', 1.015, '2025-11-08T11:11:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal RakÃºsko Å¾eny pohÃ¡r ti-volley 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pohÃ¡r ti-volley', 1.01, '2025-11-09T09:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal RakÃºsko Å¾eny pohÃ¡r ti-volley 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pohÃ¡r ti-volley', 1.01, '2025-11-09T09:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal RakÃºsko Å¾eny pohÃ¡r ti-volley 1,01 Island Å¾eny ka 1,01 malta Å¾eny swieqi 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pohÃ¡r ti-volley 1,01 Island Å¾eny ka 1,01 malta Å¾eny swieqi', 1.04, '2025-11-09T09:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal RakÃºsko Å¾eny pohÃ¡r ti-volley 1,01 Island Å¾eny ka 1,01 malta Å¾eny swieqi 1,04 islamskÃ© hry muÅ¾i Turecko 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pohÃ¡r ti-volley 1,01 Island Å¾eny ka 1,01 malta Å¾eny swieqi 1,04 islamskÃ© hry muÅ¾i Turecko', 1.015, '2025-11-09T09:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal RakÃºsko Å¾eny pohÃ¡r ti-volley 1,01 Island Å¾eny ka 1,01 malta Å¾eny swieqi 1,04 islamskÃ© hry muÅ¾i Turecko 1,015 NÃ³rsko 1.div. Å¾eny osi 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pohÃ¡r ti-volley 1,01 Island Å¾eny ka 1,01 malta Å¾eny swieqi 1,04 islamskÃ© hry muÅ¾i Turecko 1,015 NÃ³rsko 1.div. Å¾eny osi', 1.03, '2025-11-09T09:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal ncaa Å¾eny Pittsburgh 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Pittsburgh', 1.025, '2025-11-09T11:25:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal ncaa Å¾eny Pittsburgh 1,025 creighton 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Pittsburgh 1,025 creighton', 1.015, '2025-11-09T11:25:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal ncaa Å¾eny Pittsburgh 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Pittsburgh', 1.02, '2025-11-09T11:25:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal ncaa Å¾eny smu 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'smu', 1.02, '2025-11-09T15:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-09 Bet365 Volejbal ncaa Å¾eny smu 1,02 peru muÅ¾i peerles 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'smu 1,02 peru muÅ¾i peerles', 1.03, '2025-11-09T15:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-10 Bet365 Volejbal MacedÃ³nsko Å¾eny rabotnicki 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MacedÃ³nsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rabotnicki', 1.03, '2025-11-10T08:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-10 Bet365 Volejbal islamskÃ© hry IrÃ¡n 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('islamskÃ© hry');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'IrÃ¡n', 1.015, '2025-11-10T08:03:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-11 Nike Squash marche marche 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('marche');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'marche', 1.02, '2025-11-11T07:08:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-11 Nike Squash marche marche 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('marche');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'marche', 1.02, '2025-11-11T07:08:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-11 Bet365 Volejbal MaÄarsko pohÃ¡r Å¾eny bekescaba 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MaÄarsko pohÃ¡r Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bekescaba', 1.05, '2025-11-11T16:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-11 Bet365 Volejbal MaÄarsko pohÃ¡r Å¾eny bekescaba 1,05 Izrael muÅ¾i mate asher 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MaÄarsko pohÃ¡r Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'bekescaba 1,05 Izrael muÅ¾i mate asher', 1.04, '2025-11-11T16:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-11 Bet365 Volejbal ncaa Å¾eny lipscomb 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'lipscomb', 1.05, '2025-11-11T16:20:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-11 Bet365 Volejbal FilipÃ­ny mpva Å¾eny quezon 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny mpva Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'quezon', 1.04, '2025-11-11T21:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Nike Padel General Manso/tapia 1.03
  if padel_id is not null then
    select id into league_id_var from public.leagues where sport_id = padel_id and lower(name) = lower('General');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, padel_id, league_id_var, 'Manso/tapia', 1.03, '2025-11-12T10:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Nike Padel me tz 1.01
  if padel_id is not null then
    select id into league_id_var from public.leagues where sport_id = padel_id and lower(name) = lower('me');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, padel_id, league_id_var, 'tz', 1.01, '2025-11-12T10:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Nike Padel me tz 1.01
  if padel_id is not null then
    select id into league_id_var from public.leagues where sport_id = padel_id and lower(name) = lower('me');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, padel_id, league_id_var, 'tz', 1.01, '2025-11-12T10:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Nike Padel PoÄ¾sko Å¾eny zaglebie 1,01 basketbal kvali me Å¾eny Bulharsko 1.02
  if padel_id is not null then
    select id into league_id_var from public.leagues where sport_id = padel_id and lower(name) = lower('PoÄ¾sko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, padel_id, league_id_var, 'zaglebie 1,01 basketbal kvali me Å¾eny Bulharsko', 1.02, '2025-11-12T10:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal Turecko Å¾eny ny buyuksehir 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Turecko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ny buyuksehir', 1.02, '2025-11-12T11:43:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal Turecko Å¾eny ny buyuksehir 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Turecko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ny buyuksehir', 1.02, '2025-11-12T11:43:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal Challenge cup sliedrecht 1,02 Bosna Å¾eny gacko 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'sliedrecht 1,02 Bosna Å¾eny gacko', 1.05, '2025-11-12T11:43:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal Turecko Å¾eny ny buyuksehir 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Turecko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ny buyuksehir', 1.02, '2025-11-12T11:43:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal cev muÅ¾i Budejovice 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('cev muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Budejovice', 1.02, '2025-11-12T11:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal cev muÅ¾i Budejovice 1,02 Kosovo Å¾eny fer 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('cev muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Budejovice 1,02 Kosovo Å¾eny fer', 1.03, '2025-11-12T11:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal cev muÅ¾i Budejovice 1,02 Kosovo Å¾eny fer 1,03 Turecko 2 Å¾eny kocaeli 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('cev muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Budejovice 1,02 Kosovo Å¾eny fer 1,03 Turecko 2 Å¾eny kocaeli', 1.012, '2025-11-12T11:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal peru Å¾eny alianza Lima 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('peru Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'alianza Lima', 1.03, '2025-11-12T18:09:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-12 Bet365 Volejbal Thajsko Å¾eny naresuan 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'naresuan', 1.015, '2025-11-12T18:22:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-13 Bet365 Volejbal DÃ¡nsko Å¾eny holte 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'holte', 1.03, '2025-11-13T07:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-13 Bet365 Volejbal DÃ¡nsko Å¾eny holte 1,03 Äierna hora Å¾eny pohÃ¡r moraca 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'holte 1,03 Äierna hora Å¾eny pohÃ¡r moraca', 1.015, '2025-11-13T07:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-13 Bet365 Volejbal DÃ¡nsko Å¾eny holte 1,03 Äierna hora Å¾eny pohÃ¡r moraca 1,015 buducnost 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'holte 1,03 Äierna hora Å¾eny pohÃ¡r moraca 1,015 buducnost', 1.025, '2025-11-13T07:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-13 Bet365 Volejbal zÃ¡pasy zen nogueira 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nogueira', 1.015, '2025-11-13T20:46:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-14 Nike Basketbal DÃ¡nsko muÅ¾i bakken 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('DÃ¡nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'bakken', 1.01, '2025-11-14T10:18:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-14 Nike Basketbal DÃ¡nsko muÅ¾i bakken 1,01 hÃ¡dzanÃ¡ FÃ­nsko muÅ¾i HIFK 1.02
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('DÃ¡nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'bakken 1,01 hÃ¡dzanÃ¡ FÃ­nsko muÅ¾i HIFK', 1.02, '2025-11-14T10:18:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-14 Nike Basketbal DÃ¡nsko muÅ¾i bakken 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('DÃ¡nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'bakken', 1.01, '2025-11-14T10:18:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-14 Nike Basketbal DÃ¡nsko muÅ¾i bakken 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('DÃ¡nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'bakken', 1.01, '2025-11-14T10:18:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-14 Nike Basketbal DÃ¡nsko muÅ¾i bakken 1,01 hÃ¡dzanÃ¡ FÃ­nsko muÅ¾i HIFK 1.02
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('DÃ¡nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'bakken 1,01 hÃ¡dzanÃ¡ FÃ­nsko muÅ¾i HIFK', 1.02, '2025-11-14T10:18:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-14 Bet365 Volejbal DÃ¡nsko Å¾eny aarhus 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Denmark Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'aarhus', 1.04, '2025-11-14T10:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-14 Bet365 Volejbal ncaa Å¾eny creighton 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'creighton', 1.02, '2025-11-14T16:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-14 Bet365 Volejbal ncaa Å¾eny creighton 1,02 peru muÅ¾i regatas 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'creighton 1,02 peru muÅ¾i regatas', 1.015, '2025-11-14T16:04:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Nike Volejbal Nemecko Å¾eny Stuttgart 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Nemecko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'Stuttgart', 1.01, '2025-11-15T11:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Nike Volejbal Nemecko Å¾eny Stuttgart 1,01 dresdner 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Nemecko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'Stuttgart 1,01 dresdner', 1.02, '2025-11-15T11:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Nike Volejbal Nemecko Å¾eny Stuttgart 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Nemecko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'Stuttgart', 1.01, '2025-11-15T11:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Bet365 Volejbal RakÃºsko muÅ¾i aich/dob 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'aich/dob', 1.04, '2025-11-15T12:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Bet365 Volejbal Å vÃ©dsko Å¾eny orebro 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Å vÃ©dsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'orebro', 1.02, '2025-11-15T12:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Bet365 Volejbal RakÃºsko muÅ¾i aich/dob 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'aich/dob', 1.04, '2025-11-15T12:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Bet365 Volejbal RakÃºsko muÅ¾i aich/dob 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'aich/dob', 1.04, '2025-11-15T12:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Bet365 Volejbal Å vÃ©dsko Å¾eny orebro 1,02 Å vÃ©dsko muÅ¾i hylte 1,04 ChorvÃ¡tsko Å¾eny pohÃ¡r brda 1,04 rwanda muÅ¾i gisagara 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Å vÃ©dsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'orebro 1,02 Å vÃ©dsko muÅ¾i hylte 1,04 ChorvÃ¡tsko Å¾eny pohÃ¡r brda 1,04 rwanda muÅ¾i gisagara', 1.015, '2025-11-15T12:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Bet365 Volejbal Portugalsko A2 Å¾eny Santa Cruz 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Santa Cruz', 1.04, '2025-11-15T12:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Bet365 Volejbal Portugalsko A2 Å¾eny Santa Cruz 1,04 Å vajÄiarsko Å¾eny dudingen 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Santa Cruz 1,04 Å vajÄiarsko Å¾eny dudingen', 1.025, '2025-11-15T12:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-15 Bet365 Volejbal Portugalsko A2 Å¾eny Santa Cruz 1,04 Å vajÄiarsko Å¾eny dudingen 1,025 peru Å¾eny atenea 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Santa Cruz 1,04 Å vajÄiarsko Å¾eny dudingen 1,025 peru Å¾eny atenea', 1.03, '2025-11-15T12:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-16 Bet365 Volejbal Portugalsko Å¾eny fc Porto 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'fc Porto', 1.03, '2025-11-16T08:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-16 Bet365 Volejbal Portugalsko Å¾eny fc Porto 1,03 sporting 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'fc Porto 1,03 sporting', 1.025, '2025-11-16T08:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-16 Bet365 Volejbal Portugalsko A2 Å¾eny Santa Cruz 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Santa Cruz', 1.04, '2025-11-16T08:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-16 Bet365 Volejbal ncaa Å¾eny prairie view 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'prairie view', 1.025, '2025-11-16T18:57:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-16 Bet365 Volejbal Thajsko Å¾eny rajapruk 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rajapruk', 1.015, '2025-11-16T21:59:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-16 Bet365 Volejbal Thajsko muÅ¾i kanchanaburi 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kanchanaburi', 1.025, '2025-11-16T22:02:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-16 Bet365 Volejbal Thajsko muÅ¾i kanchanaburi 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Thailand Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kanchanaburi', 1.025, '2025-11-16T22:02:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-17 Bet365 Volejbal Challenge cup muÅ¾i Pafos 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Pafos', 1.03, '2025-11-17T07:17:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-17 Bet365 Volejbal FilipÃ­ny mpva Å¾eny dasmarinas 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny mpva Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'dasmarinas', 1.04, '2025-11-17T07:17:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-17 Bet365 Tenis utr Malibu miroshnicenko 1.14
  if tenis_id is not null then
    select id into league_id_var from public.leagues where sport_id = tenis_id and lower(name) = lower('utr');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, tenis_id, league_id_var, 'Malibu miroshnicenko', 1.14, '2025-11-17T10:21:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-17 Bet365 Volejbal GrÃ©cko 3.div. Å¾eny Apollon 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('GrÃ©cko 3.div. Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Apollon', 1.02, '2025-11-17T14:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Nike HÃ¡dzanÃ¡ eurÃ³pska liga muÅ¾i flensburg 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('eurÃ³pska liga muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'flensburg', 1.01, '2025-11-18T10:14:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Nike HÃ¡dzanÃ¡ eurÃ³pska liga muÅ¾i flensburg 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('eurÃ³pska liga muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'flensburg', 1.01, '2025-11-18T10:14:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Nike HÃ¡dzanÃ¡ eurÃ³pska liga muÅ¾i flensburg 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('eurÃ³pska liga muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'flensburg', 1.01, '2025-11-18T10:14:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Bet365 Volejbal Izrael muÅ¾i mate asher 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Izrael muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'mate asher', 1.01, '2025-11-18T12:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Bet365 Volejbal Challenge cup muÅ¾i Pafos 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Pafos', 1.02, '2025-11-18T12:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Bet365 Volejbal Kazachstan Å¾eny kuanysh 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kuanysh', 1.012, '2025-11-18T18:33:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Bet365 Volejbal Kazachstan Å¾eny kuanysh 1,012 berel 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kuanysh 1,012 berel', 1.02, '2025-11-18T18:33:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Bet365 Volejbal Kazachstan Å¾eny kuanysh 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'kuanysh', 1.012, '2025-11-18T18:33:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Bet365 Volejbal MaÄarsko pohÃ¡r Å¾eny vasus 1,012 Slovinsko Å¾eny branik 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MaÄarsko pohÃ¡r Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vasus 1,012 Slovinsko Å¾eny branik', 1.025, '2025-11-18T18:33:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Nike Badminton Å¾eny ongbanrungpham 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'ongbanrungpham', 1.01, '2025-11-18T21:42:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Nike Badminton Å¾eny ongbanrungpham 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'ongbanrungpham', 1.01, '2025-11-18T21:42:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-18 Nike Badminton Å¾eny ongbanrungpham 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'ongbanrungpham', 1.01, '2025-11-18T21:42:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Nike Basketbal ÄŒesko muÅ¾i nymburk 1.02
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('ÄŒesko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'nymburk', 1.02, '2025-11-19T10:58:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Bet365 Volejbal Portugalsko U21 Å¾eny Porto volei 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko U21 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Porto volei', 1.015, '2025-11-19T11:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Bet365 Volejbal Portugalsko U21 Å¾eny Porto volei 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko U21 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Porto volei', 1.01, '2025-11-19T11:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Bet365 Volejbal Challenge cup muÅ¾i benfica 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'benfica', 1.02, '2025-11-19T11:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Bet365 Volejbal Challenge cup muÅ¾i benfica 1,02 MaÄarsko pohÃ¡r Å¾eny vasus 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'benfica 1,02 MaÄarsko pohÃ¡r Å¾eny vasus', 1.012, '2025-11-19T11:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Bet365 Volejbal Kazachstan Å¾eny turan 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'turan', 1.02, '2025-11-19T19:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Bet365 Volejbal Kazachstan Å¾eny turan 1,02 peru Å¾eny alianza Lima 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Kazachstan Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'turan 1,02 peru Å¾eny alianza Lima', 1.015, '2025-11-19T19:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Nike Badminton AustrÃ¡lia intanon 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('AustrÃ¡lia');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'intanon', 1.01, '2025-11-19T20:17:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-19 Nike Badminton AustrÃ¡lia intanon 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('AustrÃ¡lia');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'intanon', 1.01, '2025-11-19T20:17:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-20 Bet365 Volejbal faroe muÅ¾i sorvagur 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('faroe muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'sorvagur', 1.025, '2025-11-20T06:52:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-20 Bet365 Volejbal Litva Å¾eny ktu kaunas 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Litva Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'ktu kaunas', 1.04, '2025-11-20T15:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-20 Bet365 Volejbal MaÄarsko pohÃ¡r Å¾eny knrc 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MaÄarsko pohÃ¡r Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'knrc', 1.012, '2025-11-20T15:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-22 Bet365 Volejbal Srbsko Å¾eny radnicki 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Srbsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'radnicki', 1.01, '2025-11-22T11:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-22 Bet365 Volejbal SVK Å¾eny Slovan 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Slovan', 1.025, '2025-11-22T11:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-22 Bet365 Volejbal Srbsko Å¾eny radnicki 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Srbsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'radnicki', 1.01, '2025-11-22T11:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-22 Bet365 Volejbal SVK Å¾eny Slovan 1,025 slÃ¡via 1,01 Rumunsko Å¾eny Alba blaj 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Slovan 1,025 slÃ¡via 1,01 Rumunsko Å¾eny Alba blaj', 1.012, '2025-11-22T11:01:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-22 Bet365 Volejbal Portugalsko A2 Å¾eny vilacondense 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vilacondense', 1.012, '2025-11-22T12:51:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-22 Bet365 Volejbal Portugalsko A2 muÅ¾i vilacondense 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vilacondense', 1.04, '2025-11-22T15:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i kielce 1.03
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'kielce', 1.03, '2025-11-23T07:35:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal RakÃºsko Å¾eny Graz 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Graz', 1.015, '2025-11-23T09:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal RakÃºsko Å¾eny Graz 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Graz', 1.015, '2025-11-23T09:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal RakÃºsko Å¾eny Graz 1,015 Portugalsko Å¾eny Porto 1,015 benfica 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Graz 1,015 Portugalsko Å¾eny Porto 1,015 benfica', 1.012, '2025-11-23T09:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal Å vÃ©dsko Å¾eny linkopings 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Å vÃ©dsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'linkopings', 1.025, '2025-11-23T09:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal faerske Å¾eny mjolnir 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('faerske Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'mjolnir', 1.04, '2025-11-23T09:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal faerske Å¾eny mjolnir 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('faerske Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'mjolnir', 1.04, '2025-11-23T09:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal Å vÃ©dsko muÅ¾i Orkelljunga 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Sweden Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Orkelljunga', 1.03, '2025-11-23T09:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal Portugalsko A2 Å¾eny Santa Cruz 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Santa Cruz', 1.015, '2025-11-23T11:27:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal Portugalsko A2 Å¾eny vilacondense 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vilacondense', 1.015, '2025-11-23T15:29:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal Portugalsko A2 Å¾eny vilacondense 1,015 peru Å¾eny universitario 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vilacondense 1,015 peru Å¾eny universitario', 1.02, '2025-11-23T15:29:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-23 Bet365 Volejbal ncaa Å¾eny Pittsburgh 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Pittsburgh', 1.03, '2025-11-23T15:29:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-24 Bet365 Volejbal GrÃ©cko 3.div. Å¾eny papagou 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('GrÃ©cko 3.div. Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'papagou', 1.02, '2025-11-24T10:40:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-25 Nike Badminton India Å¡tvorhra lin/Wang 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('India');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'Å¡tvorhra lin/Wang', 1.01, '2025-11-25T10:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-25 Bet365 Volejbal qatar muÅ¾i al rayan 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('qatar muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'al rayan', 1.025, '2025-11-25T14:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-25 Bet365 Volejbal taipei Å¾eny national tsing hua 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('taipei Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'national tsing hua', 1.012, '2025-11-25T14:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-25 Bet365 Volejbal taipei Å¾eny national tsing hua 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('taipei Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'national tsing hua', 1.012, '2025-11-25T14:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-25 Nike Badminton India mix ferdinansyah/wardana 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('India');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'mix ferdinansyah/wardana', 1.01, '2025-11-25T20:13:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-25 Bet365 Volejbal zÃ¡pasy zen armada 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'armada', 1.015, '2025-11-25T20:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-25 Bet365 Volejbal zÃ¡pasy zen armada 1,015 kharisma 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Matches ZEN');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'armada 1,015 kharisma', 1.025, '2025-11-25T20:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-26 Bet365 Volejbal Challenge cup Å¾eny niyregihaza 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'niyregihaza', 1.012, '2025-11-26T09:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-26 Bet365 Volejbal Challenge cup Å¾eny niyregihaza 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'niyregihaza', 1.01, '2025-11-26T09:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-26 Bet365 Volejbal Challenge cup Å¾eny niyregihaza 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'niyregihaza', 1.01, '2025-11-26T09:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-26 Bet365 Volejbal Challenge cup Å¾eny niyregihaza 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'niyregihaza', 1.012, '2025-11-26T09:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-26 Bet365 Volejbal FilipÃ­ny spikers muÅ¾i cignal 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny spikers muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cignal', 1.025, '2025-11-26T14:41:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-26 Bet365 Volejbal FilipÃ­ny spikers muÅ¾i cignal 1,025 taipei Å¾eny Taiwan normal university 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny spikers muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cignal 1,025 taipei Å¾eny Taiwan normal university', 1.012, '2025-11-26T14:41:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-27 Nike Basketbal euro cup Å¾eny keltern 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'keltern', 1.01, '2025-11-27T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-27 Nike Basketbal euro cup Å¾eny keltern 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'keltern', 1.01, '2025-11-27T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-27 Nike Basketbal euro cup Å¾eny keltern 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'keltern', 1.01, '2025-11-27T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-27 Nike Basketbal euro cup Å¾eny keltern 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'keltern', 1.01, '2025-11-27T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-27 Nike Basketbal euro cup Å¾eny keltern 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'keltern', 1.01, '2025-11-27T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-27 Nike Basketbal euro cup Å¾eny keltern 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'keltern', 1.01, '2025-11-27T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-27 Nike Basketbal euro cup Å¾eny keltern 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'keltern', 1.01, '2025-11-27T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-27 Nike Basketbal euro cup Å¾eny keltern 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('euro cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'keltern', 1.01, '2025-11-27T09:56:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-28 Nike HÃ¡dzanÃ¡ ms Å¾eny Nemecko 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'Nemecko', 1.01, '2025-11-28T09:25:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-28 Nike HÃ¡dzanÃ¡ ms Å¾eny Nemecko 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'Nemecko', 1.01, '2025-11-28T10:26:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-28 Nike HÃ¡dzanÃ¡ ms Å¾eny Nemecko 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'Nemecko', 1.01, '2025-11-28T10:26:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-28 Nike HÃ¡dzanÃ¡ ms Å¾eny Nemecko 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'Nemecko', 1.01, '2025-11-28T10:26:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-28 Nike HÃ¡dzanÃ¡ ms Å¾eny Nemecko 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'Nemecko', 1.01, '2025-11-28T10:26:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-28 Bet365 Volejbal Izrael muÅ¾i maccabi tel aviv 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Izrael muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'maccabi tel aviv', 1.03, '2025-11-28T10:42:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Bet365 Volejbal RakÃºsko muÅ¾i aich dob 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'aich dob', 1.03, '2025-11-29T09:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Bet365 Volejbal RakÃºsko Å¾eny Linz 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Linz', 1.02, '2025-11-29T09:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Bet365 Volejbal RakÃºsko Å¾eny Linz 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Linz', 1.02, '2025-11-29T09:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Bet365 Volejbal RakÃºsko Å¾eny Linz 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Linz', 1.02, '2025-11-29T09:44:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Nike HÃ¡dzanÃ¡ ms Å¾eny FrancÃºzsko 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'FrancÃºzsko', 1.01, '2025-11-29T10:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Nike HÃ¡dzanÃ¡ ms Å¾eny FrancÃºzsko 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'FrancÃºzsko', 1.01, '2025-11-29T10:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Nike HÃ¡dzanÃ¡ SVK Å¾eny y.a.kosice 1.02
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'y.a.kosice', 1.02, '2025-11-29T10:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Nike HÃ¡dzanÃ¡ PoÄ¾sko muÅ¾i kielce 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Poland Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'kielce', 1.01, '2025-11-29T10:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Bet365 Volejbal Cyprus Å¾eny anorthosis 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Cyprus Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'anorthosis', 1.01, '2025-11-29T10:53:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Bet365 Volejbal Portugalsko A2 muÅ¾i viana 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'viana', 1.015, '2025-11-29T10:53:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Nike HÃ¡dzanÃ¡ ms Å¾eny PoÄ¾sko 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'PoÄ¾sko', 1.01, '2025-11-29T19:47:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Bet365 Volejbal FilipÃ­ny Å¾eny wncaa Scorpions 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny Å¾eny wncaa');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Scorpions', 1.02, '2025-11-29T19:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-29 Bet365 Volejbal ncaa Å¾eny nebraska 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'nebraska', 1.012, '2025-11-29T19:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal DÃ¡nsko 1 Å¾eny vli 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('DÃ¡nsko 1 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vli', 1.012, '2025-11-30T08:59:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal DÃ¡nsko 1 Å¾eny vli 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('DÃ¡nsko 1 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'vli', 1.01, '2025-11-30T08:59:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal Rumunsko muÅ¾i Å¾i timisoara 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Rumunsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Å¾i timisoara', 1.012, '2025-11-30T09:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal Rumunsko muÅ¾i Å¾i timisoara 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Rumunsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Å¾i timisoara', 1.01, '2025-11-30T09:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal Rumunsko muÅ¾i Å¾i timisoara 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Rumunsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Å¾i timisoara', 1.01, '2025-11-30T09:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal Portugalsko A2 Å¾eny praiense 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'praiense', 1.05, '2025-11-30T09:10:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal EstÃ³nsko muÅ¾i tallina 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('EstÃ³nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'tallina', 1.015, '2025-11-30T09:13:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal EstÃ³nsko muÅ¾i tallina 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('EstÃ³nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'tallina', 1.01, '2025-11-30T09:13:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal DÃ¡nsko muÅ¾i asv aarhus 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('DÃ¡nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'asv aarhus', 1.05, '2025-11-30T09:13:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Bet365 Volejbal SVK Å¾eny Nitra 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Nitra', 1.03, '2025-11-30T09:13:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Nike Basketbal ms oceania asia muÅ¾i FilipÃ­ny 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('ms');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'oceania asia muÅ¾i FilipÃ­ny', 1.01, '2025-11-30T11:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Nike Basketbal ms oceania asia muÅ¾i FilipÃ­ny 1.01
  if basketbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = basketbal_id and lower(name) = lower('ms');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, basketbal_id, league_id_var, 'oceania asia muÅ¾i FilipÃ­ny', 1.01, '2025-11-30T11:05:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-11-30 Nike Squash muÅ¾i asal 1.02
  if squash_id is not null then
    select id into league_id_var from public.leagues where sport_id = squash_id and lower(name) = lower('muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, squash_id, league_id_var, 'asal', 1.02, '2025-11-30T19:00:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-01 Nike HÃ¡dzanÃ¡ ms Å¾eny NÃ³rsko 1.02
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'NÃ³rsko', 1.02, '2025-12-01T10:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-01 Bet365 Volejbal FilipÃ­ny mpva Å¾eny dasmarinas 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('FilipÃ­ny mpva Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'dasmarinas', 1.04, '2025-12-01T19:08:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-02 Nike Futsal ms Å¾eny BrazÃ­lia 1.04
  if futsal_id is not null then
    select id into league_id_var from public.leagues where sport_id = futsal_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, futsal_id, league_id_var, 'BrazÃ­lia', 1.04, '2025-12-02T10:15:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-02 Bet365 Volejbal Izrael muÅ¾i mate asher 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Izrael muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'mate asher', 1.01, '2025-12-02T10:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-02 Bet365 Volejbal Challenge cup Å¾eny niyregihaza 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Challenge cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'niyregihaza', 1.025, '2025-12-02T10:49:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-02 Bet365 Volejbal uruguay Å¾eny cbr 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('uruguay Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'cbr', 1.04, '2025-12-02T14:37:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-03 Nike Volejbal cev cup Å¾eny chieri 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('cev cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, volejbal_id, league_id_var, 'chieri', 1.01, '2025-12-03T09:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-03 Bet365 Volejbal Katar muÅ¾i al rayyan 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Katar muÅ¾i al');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rayyan', 1.03, '2025-12-03T09:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-03 Bet365 Volejbal Katar muÅ¾i al rayyan 1,03 Slovinsko 1b muÅ¾i Brezovica 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Katar muÅ¾i al');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rayyan 1,03 Slovinsko 1b muÅ¾i Brezovica', 1.025, '2025-12-03T09:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-03 Bet365 Volejbal cev cup Å¾eny neuchatel 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('cev cup Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'neuchatel', 1.01, '2025-12-03T09:55:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-03 Bet365 Volejbal MacedÃ³nsko muÅ¾i rabotnicki 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MacedÃ³nsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'rabotnicki', 1.05, '2025-12-03T18:02:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-04 Nike Badminton muÅ¾i Å¡tvorhra Krishnamurty/pratheek 1.01
  if badminton_id is not null then
    select id into league_id_var from public.leagues where sport_id = badminton_id and lower(name) = lower('muÅ¾i Å¡tvorhra');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, badminton_id, league_id_var, 'Krishnamurty/pratheek', 1.01, '2025-12-04T09:48:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-04 Bet365 Volejbal MaÄarsko muÅ¾i dag 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('MaÄarsko muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'dag', 1.015, '2025-12-04T10:32:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-04 Bet365 Volejbal Bulharsko Å¾eny maritza 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bulharsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'maritza', 1.02, '2025-12-04T18:16:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Bosna Å¾eny gacko 1.03
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bosna Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'gacko', 1.03, '2025-12-05T08:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Äierna hora muÅ¾i podgorica 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'podgorica', 1.01, '2025-12-05T08:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Äierna hora muÅ¾i podgorica 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'podgorica', 1.01, '2025-12-05T08:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Äierna hora muÅ¾i podgorica 1,01 Budva 1,01 Bosna muÅ¾i napredak 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'podgorica 1,01 Budva 1,01 Bosna muÅ¾i napredak', 1.04, '2025-12-05T08:24:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Bosna muÅ¾i napredak 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bosna muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'napredak', 1.04, '2025-12-05T11:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Bulharsko Å¾eny maritza 1.015
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bulharsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'maritza', 1.015, '2025-12-05T11:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Bulharsko Å¾eny maritza 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bulharsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'maritza', 1.01, '2025-12-05T11:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Bulharsko Å¾eny maritza 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bulharsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'maritza', 1.01, '2025-12-05T11:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal Bulharsko Å¾eny maritza 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Bulharsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'maritza', 1.01, '2025-12-05T11:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-05 Bet365 Volejbal ncaa Å¾eny stanford 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('NCAA Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'stanford', 1.02, '2025-12-05T11:50:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Bet365 Volejbal RakÃºsko Å¾eny Graz 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('RakÃºsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Graz', 1.02, '2025-12-06T09:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Bet365 Volejbal Äierna hora Å¾eny moraca 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'moraca', 1.01, '2025-12-06T09:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Bet365 Volejbal Äierna hora Å¾eny moraca 1,01 Å vÃ©dsko Å¾eny engelholm 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'moraca 1,01 Å vÃ©dsko Å¾eny engelholm', 1.012, '2025-12-06T09:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Bet365 Volejbal Äierna hora Å¾eny moraca 1,01 Å vÃ©dsko Å¾eny engelholm 1.012
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'moraca 1,01 Å vÃ©dsko Å¾eny engelholm', 1.012, '2025-12-06T09:39:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Bet365 Volejbal Portugalsko A2 Å¾eny praiense 1.01
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Portugalsko A2 Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'praiense', 1.01, '2025-12-06T10:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Bet365 Volejbal ChorvÃ¡tsko Å¾eny pohÃ¡r kastela 1.05
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('ChorvÃ¡tsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pohÃ¡r kastela', 1.05, '2025-12-06T10:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Bet365 Volejbal ChorvÃ¡tsko Å¾eny pohÃ¡r kastela 1,05 Rumunsko A2 Å¾eny galati 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('ChorvÃ¡tsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pohÃ¡r kastela 1,05 Rumunsko A2 Å¾eny galati', 1.04, '2025-12-06T10:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Bet365 Volejbal ChorvÃ¡tsko Å¾eny pohÃ¡r kastela 1,05 Rumunsko A2 Å¾eny galati 1,04 Izrael Å¾eny ashdod 1.062
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('ChorvÃ¡tsko Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'pohÃ¡r kastela 1,05 Rumunsko A2 Å¾eny galati 1,04 Izrael Å¾eny ashdod', 1.062, '2025-12-06T10:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-06 Nike HÃ¡dzanÃ¡ SVK muÅ¾i PreÅ¡ov 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('Slovakia Men');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'PreÅ¡ov', 1.01, '2025-12-06T11:36:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-07 Bet365 Volejbal SVK Å¾eny Å½ilina 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Å½ilina', 1.025, '2025-12-07T13:25:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-07 Bet365 Volejbal SVK Å¾eny Å½ilina 1,025 faerske Å¾eny mjolnir 1.005
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Å½ilina 1,025 faerske Å¾eny mjolnir', 1.005, '2025-12-07T13:25:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-07 Bet365 Volejbal SVK Å¾eny Å½ilina 1,025 faerske Å¾eny mjolnir 1.005
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Slovakia Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'Å½ilina 1,025 faerske Å¾eny mjolnir', 1.005, '2025-12-07T13:25:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-07 Bet365 Volejbal Äierna hora muÅ¾i jedinstvo 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'jedinstvo', 1.025, '2025-12-07T13:29:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-07 Bet365 Volejbal Äierna hora muÅ¾i jedinstvo 1,025 international U19 Å¾eny Columbia 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'jedinstvo 1,025 international U19 Å¾eny Columbia', 1.04, '2025-12-07T13:29:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-07 Bet365 Volejbal Äierna hora muÅ¾i jedinstvo 1,025 international U19 Å¾eny Columbia 1.04
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Äierna hora muÅ¾i');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'jedinstvo 1,025 international U19 Å¾eny Columbia', 1.04, '2025-12-07T13:29:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-07 Nike HÃ¡dzanÃ¡ ms Å¾eny uruguay 1.01
  if hadzana_id is not null then
    select id into league_id_var from public.leagues where sport_id = hadzana_id and lower(name) = lower('ms Å¾eny');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (nike_id, hadzana_id, league_id_var, 'uruguay', 1.01, '2025-12-07T18:19:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-08 Bet365 Volejbal MaÄarsko Å¾eny NyÃ­regyhÃ¡za 1.02
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Hungary Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'NyÃ­regyhÃ¡za', 1.02, '2025-12-08T06:41:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  -- 2025-12-08 Bet365 Volejbal MaÄarsko Å¾eny NyÃ­regyhÃ¡za 1,02 Portugalsko pohÃ¡r muÅ¾i esmoriz 1.025
  if volejbal_id is not null then
    select id into league_id_var from public.leagues where sport_id = volejbal_id and lower(name) = lower('Hungary Women');
    if league_id_var is not null then
      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)
      values (bet365_id, volejbal_id, league_id_var, 'NyÃ­regyhÃ¡za 1,02 Portugalsko pohÃ¡r muÅ¾i esmoriz', 1.025, '2025-12-08T06:41:00+01:00'::timestamptz, 'pending');
      tip_count := tip_count + 1;
    end if;
  end if;

  raise notice 'Inserted % betting tips', tip_count;
end $$;
