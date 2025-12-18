-- Seed production database with betting tips from november.txt and december.txt
-- Generated from: data/november.txt, data/december.txt
-- Total records: 57

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
  result_id_var uuid;
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

  -- Row 1 (november): Gasanova A. - Boyer L.
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-01'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Newport';
  match_val := 'Gasanova A. - Boyer L.';
  odds_val := 1.04::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 312::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 2 (november): SR R. Šramková - A. L. Nita
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-04'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'W75 Trnava';
  match_val := 'SR R. Šramková - A. L. Nita';
  odds_val := 1.25::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 125::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 3 (november): Most - Michalovce
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-05'::timestamptz;
  sport_val := 'hadzana';
  league_val := 'mol liga';
  match_val := 'Most - Michalovce';
  odds_val := 1.6::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 160::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 4 (november): India P. Honova - M. Ozeki
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-06'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'W35 Pune';
  match_val := 'India P. Honova - M. Ozeki';
  odds_val := 1.08::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 324::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 5 (november): Fínsko Z. Vancouverová - L. Laboutkova
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-07'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'W50 Helsinki';
  match_val := 'Fínsko Z. Vancouverová - L. Laboutkova';
  odds_val := 1.15::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 230::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 6 (november): Poruba - Slavia
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-09'::timestamptz;
  sport_val := 'hadzana';
  league_val := 'mol liga';
  match_val := 'Poruba - Slavia';
  odds_val := 1.21::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 121::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 7 (november): USA A. Walton - T. Zink
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-10'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'Challenger Knoxville';
  match_val := 'USA A. Walton - T. Zink';
  odds_val := 1.28::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 128::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 8 (november): Masters Alcaraz - Fritz
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-11'::timestamptz;
  sport_val := 'Tenis';
  league_val := '';
  match_val := 'Masters Alcaraz - Fritz';
  odds_val := 1.21::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 121::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 9 (november): el Sheik Biryukov - Kaufman
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-12'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'ITF Sharm';
  match_val := 'el Sheik Biryukov - Kaufman';
  odds_val := 1.04::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 312::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 10 (november): Masters Sinner - Zverev
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-12'::timestamptz;
  sport_val := 'Tenis';
  league_val := '';
  match_val := 'Masters Sinner - Zverev';
  odds_val := 1.11::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 222::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 11 (november): Ambrogi - Dreer
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-13'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'ITF Azul';
  match_val := 'Ambrogi - Dreer';
  odds_val := 1.04::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 312::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 12 (november): Moldavsko - Taliansko
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-13'::timestamptz;
  sport_val := 'Futbal';
  league_val := '';
  match_val := 'Moldavsko - Taliansko';
  odds_val := 1.1::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 110::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 13 (november): Sahnis - Jackson
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-14'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Boca';
  match_val := 'Sahnis - Jackson';
  odds_val := 1.083::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 324::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 14 (november): Capogroso/Capogroso - Mondlane/Mungoi
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-14'::timestamptz;
  sport_val := 'Beachvolleyball';
  league_val := '';
  match_val := 'Capogroso/Capogroso - Mondlane/Mungoi';
  odds_val := 1.05::numeric(5,3);
  stake_val := 600::numeric;
  total_win_val := 630::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 15 (november): Sanok - Jastrzbie
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-14'::timestamptz;
  sport_val := 'Hokej';
  league_val := '';
  match_val := 'Sanok - Jastrzbie';
  odds_val := 1.03::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 412::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 16 (november): Plzen - Usti
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-14'::timestamptz;
  sport_val := 'Futsal';
  league_val := '';
  match_val := 'Plzen - Usti';
  odds_val := 1.12::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 224::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 17 (november): Sinner - DeMinaur
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-15'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'Masters';
  match_val := 'Sinner - DeMinaur';
  odds_val := 1.08::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 216::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 18 (november): Metz - DVSC
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-15'::timestamptz;
  sport_val := 'Hadzana';
  league_val := '';
  match_val := 'Metz - DVSC';
  odds_val := 1.05::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 210::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 19 (november): Vyskov - Chrudim
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-15'::timestamptz;
  sport_val := 'Futsal';
  league_val := '';
  match_val := 'Vyskov - Chrudim';
  odds_val := 1.1::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 220::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 20 (november): Dansko - Bielorusko
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-15'::timestamptz;
  sport_val := 'Futbal';
  league_val := '';
  match_val := 'Dansko - Bielorusko';
  odds_val := 1.08::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 216::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 21 (november): Sinner - Alcaraz
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-16'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'Masters';
  match_val := 'Sinner - Alcaraz';
  odds_val := 1.6::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 160::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 22 (november): Havlickova - Kovacicova
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-17'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'ITF Trnava';
  match_val := 'Havlickova - Kovacicova';
  odds_val := 1.03::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 412::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 23 (november): Choi - Grumet
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-18'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'ITF Austin';
  match_val := 'Choi - Grumet';
  odds_val := 1.08::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 216::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 24 (november): Taliansko - Rakúsko
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-19'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'Davis cup';
  match_val := 'Taliansko - Rakúsko';
  odds_val := 1.083::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 216::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 25 (november): KP Brno 1.polčas
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-19'::timestamptz;
  sport_val := 'Basketbal';
  league_val := 'USK';
  match_val := 'KP Brno 1.polčas';
  odds_val := 1.05::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 420::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 26 (november): Strumica - Budejovice
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-19'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'CEV';
  match_val := 'Strumica - Budejovice';
  odds_val := 1.11::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 222::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 27 (november): Kilmer - Fernandes
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-21'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Ithaca';
  match_val := 'Kilmer - Fernandes';
  odds_val := 1.04::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 312::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 28 (november): Torun - Sanok
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-21'::timestamptz;
  sport_val := 'Hokej';
  league_val := '';
  match_val := 'Torun - Sanok';
  odds_val := 1.03::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 412::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 29 (november): Plzeň - Brno
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-21'::timestamptz;
  sport_val := 'Futsal';
  league_val := '';
  match_val := 'Plzeň - Brno';
  odds_val := 1.1::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 220::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 30 (november): Schinas - Casanova
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-23'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'Ateny';
  match_val := 'Schinas - Casanova';
  odds_val := 1.03::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 412::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 31 (november): Legionowo - Kielce
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-23'::timestamptz;
  sport_val := 'Hadzana';
  league_val := '';
  match_val := 'Legionowo - Kielce';
  odds_val := 1.03::numeric(5,3);
  stake_val := 800::numeric;
  total_win_val := 824::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 32 (november): Orkelljunga - Hasthagen
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-23'::timestamptz;
  sport_val := 'Volejbal';
  league_val := '';
  match_val := 'Orkelljunga - Hasthagen';
  odds_val := 1.04::numeric(5,3);
  stake_val := 800::numeric;
  total_win_val := 832::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 33 (november): Vazqez - Dolehide
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-25'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'WTA Buenos Aires';
  match_val := 'Vazqez - Dolehide';
  odds_val := 1.04::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 416::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 34 (november): Olyinikova - Nahimana
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-25'::timestamptz;
  sport_val := 'Tenis';
  league_val := '';
  match_val := 'Olyinikova - Nahimana';
  odds_val := 1.04::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 416::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 35 (november): rayyan -  shamal
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-25'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Al';
  match_val := 'rayyan -  shamal';
  odds_val := 1.04::numeric(5,3);
  stake_val := 500::numeric;
  total_win_val := 520::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 36 (november): Janta - Mladost
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-11-26'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'CEV';
  match_val := 'Janta - Mladost';
  odds_val := 1.03::numeric(5,3);
  stake_val := 600::numeric;
  total_win_val := 618::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 37 (november): Recek/Siniakov - Blazka/Homola
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-27'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'ITF Hradec';
  match_val := 'Recek/Siniakov - Blazka/Homola';
  odds_val := 1.04::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 416::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 38 (november): Aich - Bisamberg
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-29'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Rakusko';
  match_val := 'Aich - Bisamberg';
  odds_val := 1.03::numeric(5,3);
  stake_val := 600::numeric;
  total_win_val := 618::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 39 (november): Pires - Whitwell
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-30'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Oxford';
  match_val := 'Pires - Whitwell';
  odds_val := 1.04::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 416::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 40 (november): Aarhus - Amager
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-11-30'::timestamptz;
  sport_val := 'Volejbal';
  league_val := '';
  match_val := 'Aarhus - Amager';
  odds_val := 1.05::numeric(5,3);
  stake_val := 600::numeric;
  total_win_val := 630::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 41 (december): Chrudim-Chomutov
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'tipsport';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'tipsport';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-05'::timestamptz;
  sport_val := 'Futsal';
  league_val := 'Cesko';
  match_val := 'Chrudim-Chomutov';
  odds_val := 1.12::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 224::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 42 (december): Borac-Napredak
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-12-05'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Bosna men';
  match_val := 'Borac-Napredak';
  odds_val := 1.04::numeric(5,3);
  stake_val := 800::numeric;
  total_win_val := 832::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 43 (december): Olimpik-Kastela
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-12-06'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Chorvatsko women';
  match_val := 'Olimpik-Kastela';
  odds_val := 1.05::numeric(5,3);
  stake_val := 800::numeric;
  total_win_val := 840::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 44 (december): Sanok-Katowice
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-12-07'::timestamptz;
  sport_val := 'Hokej';
  league_val := 'Polsko';
  match_val := 'Sanok-Katowice';
  odds_val := 1.03::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 412::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 45 (december): Mandelikova-Perhacova
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-08'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Olomouc women';
  match_val := 'Mandelikova-Perhacova';
  odds_val := 1.06::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 212::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 46 (december): Kotzen-Cohen
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-08'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Knoxwille m';
  match_val := 'Kotzen-Cohen';
  odds_val := 1.07::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 214::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 47 (december): Asher-Kiryat
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-09'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Izrael m Mate';
  match_val := 'Asher-Kiryat';
  odds_val := 1.03::numeric(5,3);
  stake_val := 600::numeric;
  total_win_val := 618::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 48 (december): Dean-Takahashi
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-09'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Honolulu m';
  match_val := 'Dean-Takahashi';
  odds_val := 1.06::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 212::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 49 (december): Ivanov-Missaoui
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-10'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'ITF Monastir m';
  match_val := 'Ivanov-Missaoui';
  odds_val := 1.04::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 312::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 50 (december): Holubova-Hatouka
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-12-11'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Olomouc ž';
  match_val := 'Holubova-Hatouka';
  odds_val := 1.05::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 315::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 51 (december): Budko-Hewitt
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-12-12'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Knoxwille ž';
  match_val := 'Budko-Hewitt';
  odds_val := 1.04::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 416::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 52 (december): Bedard-Frey
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('2');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '2';
  END IF;
  
  match_date_val := '2025-12-12'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Knoxwille ž';
  match_val := 'Bedard-Frey';
  odds_val := 1.05::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 315::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 53 (december): Kucmova-Wirglerova
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'nike';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'nike';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-12'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Olomouc ž';
  match_val := 'Kucmova-Wirglerova';
  odds_val := 1.39::numeric(5,3);
  stake_val := 100::numeric;
  total_win_val := 139::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 54 (december): Nové Mesto-Presov
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-14'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'SVK ž';
  match_val := 'Nové Mesto-Presov';
  odds_val := 1.05::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 315::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 56 (december): Al Ahly-Sporting
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-16'::timestamptz;
  sport_val := 'Volejbal';
  league_val := 'Egypt m';
  match_val := 'Al Ahly-Sporting';
  odds_val := 1.1::numeric(5,3);
  stake_val := 300::numeric;
  total_win_val := 330::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 57 (december): Grechkina-Maunupau
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-16'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Newport ž';
  match_val := 'Grechkina-Maunupau';
  odds_val := 1.07::numeric(5,3);
  stake_val := 200::numeric;
  total_win_val := 214::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 58 (december): Pecotic-Das
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = 'bet365';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', 'bet365';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('1');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '1';
  END IF;
  
  match_date_val := '2025-12-17'::timestamptz;
  sport_val := 'Tenis';
  league_val := 'UTR Boca Raton m';
  match_val := 'Pecotic-Das';
  odds_val := 1.03::numeric(5,3);
  stake_val := 400::numeric;
  total_win_val := 412::numeric;
  status_val := 'win'::public.tip_status;
  
  -- Check if record already exists (idempotent insert)
  IF NOT EXISTS (
    SELECT 1 FROM public.betting_tip
    WHERE betting_company_id = company_id
      AND match_date = match_date_val
      AND match = match_val
      AND result_id = result_id_var
      AND odds = odds_val
  ) THEN
    INSERT INTO public.betting_tip (
      betting_company_id,
      sport,
      league,
      match,
      result_id,
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
      result_id_var,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;

  RAISE NOTICE 'Inserted % betting tips', tip_count;
END $$;

-- Verification
SELECT 
  COUNT(*) as total_tips,
  COUNT(DISTINCT betting_company_id) as companies_used,
  COUNT(*) FILTER (WHERE status = 'win') as wins,
  COUNT(*) FILTER (WHERE status = 'loss') as losses,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE result_id IS NULL) as tips_without_result
FROM public.betting_tip;
