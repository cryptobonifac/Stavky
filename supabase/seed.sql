-- Seed production database with betting tips from stavky.txt
-- Generated from: data/stavky.txt
-- Total records: 18
-- Only tab-separated lines (1-18) are processed

-- Ensure betting companies exist
DO $$
BEGIN
  INSERT INTO public.betting_companies (name)
  SELECT name FROM (VALUES 
    ('tipsport'), 
    ('bet365'), 
    ('nike')
  ) AS v(name)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.betting_companies WHERE LOWER(public.betting_companies.name) = LOWER(v.name)
  );
END $$;

-- Insert betting tips into betting_tip table
DO $$
DECLARE
  company_id uuid;
  tip_count integer := 0;
  match_date_val timestamptz;
  sport_val text;
  league_val text;
  match_val text;
  odds_val numeric(5,3);
  stake_val numeric;
  total_win_val numeric;
  status_val public.tip_status;
BEGIN

  -- Row 1: Chrudim-Chomutov 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  match_date_val := '2025-12-05'::timestamptz;
  sport_val := 'Futsal';
  league_val := 'Cesko';
  match_val := 'Chrudim-Chomutov 1';
  odds_val := 1.12::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 224::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 2: Borac-Napredak 2
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-05'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Bosna m';
  match_val := 'Borac-Napredak 2';
  odds_val := 1.04::numeric(5,3);
  stake_val := 800::numeric;
  total_win_val := 832::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 3: Olimpik-Kastela 2
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-06'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Chorvatsko ž';
  match_val := 'Olimpik-Kastela 2';
  odds_val := 1.05::numeric(5,3);
  stake_val := 800::numeric;
  total_win_val := 840::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 4: Sanok-Katowice 2
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  match_date_val := '2025-12-07'::timestamptz;
  sport_val := 'Hokej';
  league_val := 'Polsko';
  match_val := 'Sanok-Katowice 2';
  odds_val := 1.03::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 412::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 5: Mandelikova-Perhacova 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-08'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Olomouc ž';
  match_val := 'Mandelikova-Perhacova 1';
  odds_val := 1.06::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 212::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 6: Kotzen-Cohen 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-08'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Knoxwille m';
  match_val := 'Kotzen-Cohen 1';
  odds_val := 1.07::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 214::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 7: Mate Asher-Kiryat 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  match_date_val := '2025-12-09'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Izrael m';
  match_val := 'Mate Asher-Kiryat 1';
  odds_val := 1.03::numeric(5,3);
  stake_val := 600::numeric;
  total_win_val := 618::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 8: Dean-Takahashi 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-09'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Honolulu m';
  match_val := 'Dean-Takahashi 1';
  odds_val := 1.06::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 212::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 9: Ivanov-Missaoui 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-10'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'ITF Monastir m';
  match_val := 'Ivanov-Missaoui 1';
  odds_val := 1.04::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 312::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 10: Holubova-Hatouka 2
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-11'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Olomouc ž';
  match_val := 'Holubova-Hatouka 2';
  odds_val := 1.05::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 315::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 11: Budko-Hewitt 2
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-12'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Knoxwille ž';
  match_val := 'Budko-Hewitt 2';
  odds_val := 1.04::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 416::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 12: Bedard-Frey 2
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-12'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Knoxwille ž';
  match_val := 'Bedard-Frey 2';
  odds_val := 1.05::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 315::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 13: Kucmova-Wirglerova 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  match_date_val := '2025-12-12'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Olomouc ž';
  match_val := 'Kucmova-Wirglerova 1';
  odds_val := 1.39::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 139::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 14: Nové Mesto-Presov 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-14'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'SVK ž';
  match_val := 'Nové Mesto-Presov 1';
  odds_val := 1.05::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 315::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 15: Cvijanovic-McPhee 2
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-16'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Craigieburn ž';
  match_val := 'Cvijanovic-McPhee 2';
  odds_val := 1.06::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 318::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 16: Al Ahly-Sporting 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-16'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Egypt m';
  match_val := 'Al Ahly-Sporting 1';
  odds_val := 1.10::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 330::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 17: Grechkina-Maunupau 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-16'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Newport ž';
  match_val := 'Grechkina-Maunupau 1';
  odds_val := 1.07::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 0::numeric;
  status_val := 'loss'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  -- Row 18: Pecotic-Das 1
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  match_date_val := '2025-12-17'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Boca Raton m';
  match_val := 'Pecotic-Das 1';
  odds_val := 1.03::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 412::numeric;
  status_val := 'win'::public.tip_status;
  
  INSERT INTO public.betting_tip (
    betting_company_id,
    sport,
    league,
    match,
    odds,
    match_date,
    stake,
    total_win,
    status
  ) VALUES (
    company_id,
    sport_val,
    league_val,
    match_val,
    odds_val,
    match_date_val,
    stake_val,
    total_win_val,
    status_val
  );
  
  tip_count := tip_count + 1;

  RAISE NOTICE 'Inserted % betting tips', tip_count;
END $$;

-- Verification
SELECT 
  COUNT(*) as total_tips,
  COUNT(DISTINCT betting_company_id) as companies_used,
  COUNT(*) FILTER (WHERE status = 'win') as wins,
  COUNT(*) FILTER (WHERE status = 'loss') as losses,
  COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM public.betting_tip;
