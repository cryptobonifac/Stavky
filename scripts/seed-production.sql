-- Manual Production Seeding Script
-- Copy and paste this entire script into Supabase Dashboard SQL Editor
-- This script is idempotent and safe to run multiple times

-- Betting Companies
INSERT INTO public.betting_companies (name)
SELECT name FROM (VALUES ('Bet365'), ('Tipsport'), ('Fortuna'), ('Nike')) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.betting_companies 
  WHERE public.betting_companies.name = v.name
);

-- Sports
INSERT INTO public.sports (name)
SELECT name FROM (VALUES ('Soccer'), ('Tennis'), ('Basketball'), ('Ice Hockey'), ('Volleyball')) AS v(name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.sports 
  WHERE LOWER(public.sports.name) = LOWER(v.name)
);

-- Leagues (dependent on sports)
DO $$
DECLARE
  soccer_id uuid;
  basketball_id uuid;
  hockey_id uuid;
  tennis_id uuid;
  volleyball_id uuid;
BEGIN
  -- Get sport IDs
  SELECT id INTO soccer_id FROM public.sports WHERE LOWER(name) = LOWER('Soccer');
  SELECT id INTO basketball_id FROM public.sports WHERE LOWER(name) = LOWER('Basketball');
  SELECT id INTO hockey_id FROM public.sports WHERE LOWER(name) = LOWER('Ice Hockey');
  SELECT id INTO tennis_id FROM public.sports WHERE LOWER(name) = LOWER('Tennis');
  SELECT id INTO volleyball_id FROM public.sports WHERE LOWER(name) = LOWER('Volleyball');

  -- Soccer leagues
  IF soccer_id IS NOT NULL THEN
    INSERT INTO public.leagues (name, sport_id)
    SELECT name, sport_id FROM (VALUES 
      ('Premier League', soccer_id),
      ('La Liga', soccer_id),
      ('Champions League', soccer_id),
      ('Serie A', soccer_id)
    ) AS v(name, sport_id)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.leagues 
      WHERE public.leagues.sport_id = v.sport_id 
      AND LOWER(public.leagues.name) = LOWER(v.name)
    );
  END IF;

  -- Basketball leagues
  IF basketball_id IS NOT NULL THEN
    INSERT INTO public.leagues (name, sport_id)
    SELECT name, sport_id FROM (VALUES 
      ('NBA', basketball_id),
      ('EuroLeague', basketball_id)
    ) AS v(name, sport_id)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.leagues 
      WHERE public.leagues.sport_id = v.sport_id 
      AND LOWER(public.leagues.name) = LOWER(v.name)
    );
  END IF;

  -- Ice Hockey leagues
  IF hockey_id IS NOT NULL THEN
    INSERT INTO public.leagues (name, sport_id)
    SELECT name, sport_id FROM (VALUES 
      ('NHL', hockey_id),
      ('KHL', hockey_id)
    ) AS v(name, sport_id)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.leagues 
      WHERE public.leagues.sport_id = v.sport_id 
      AND LOWER(public.leagues.name) = LOWER(v.name)
    );
  END IF;

  -- Tennis leagues
  IF tennis_id IS NOT NULL THEN
    INSERT INTO public.leagues (name, sport_id)
    SELECT name, sport_id FROM (VALUES 
      ('ATP', tennis_id),
      ('WTA', tennis_id)
    ) AS v(name, sport_id)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.leagues 
      WHERE public.leagues.sport_id = v.sport_id 
      AND LOWER(public.leagues.name) = LOWER(v.name)
    );
  END IF;
END $$;

-- Verification queries (run these after the script to verify data)
-- SELECT COUNT(*) as companies_count FROM public.betting_companies;
-- SELECT COUNT(*) as sports_count FROM public.sports;
-- SELECT COUNT(*) as leagues_count FROM public.leagues;
-- SELECT s.name as sport, COUNT(l.id) as leagues_count 
-- FROM public.sports s 
-- LEFT JOIN public.leagues l ON s.id = l.sport_id 
-- GROUP BY s.id, s.name 
-- ORDER BY s.name;










