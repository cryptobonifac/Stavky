-- Seed production database with betting tips from CSV
-- Generated from: betting_tips.csv
-- Total records: 581
-- Date: 2025-12-17T14:26:03.796Z

-- Ensure betting companies exist
DO $$
BEGIN
  INSERT INTO public.betting_companies (name)
  SELECT name FROM (VALUES ('Nike'), ('Bet365')) AS v(name)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.betting_companies WHERE public.betting_companies.name = v.name
  );
END $$;

-- Insert betting tips and tip items
DO $$
DECLARE
  tip_id uuid;
  company_id uuid;
  tip_count integer := 0;
  row_data record;
BEGIN

  -- Row 1: Holandsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Holandsko',
      '2025-09-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'softball',
      'me ženy',
      'Holandsko',
      1.01::numeric(5,3),
      '2025-09-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 2: Taliansko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Taliansko',
      '2025-09-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'softball',
      'me ženy',
      'Taliansko',
      1.01::numeric(5,3),
      '2025-09-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 3: esbjerg
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'esbjerg',
      '2025-09-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Dánsko ženy',
      'esbjerg',
      1.01::numeric(5,3),
      '2025-09-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 4: osasco
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'osasco',
      '2025-09-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista ženy',
      'osasco',
      1.04::numeric(5,3),
      '2025-09-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 5: rangsit
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      212::numeric,
      'win'::public.tip_status,
      'rangsit',
      '2025-09-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko ženy',
      'rangsit',
      1.05::numeric(5,3),
      '2025-09-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 6: dhurakij
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'dhurakij',
      '2025-09-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko ženy',
      'dhurakij',
      1.015::numeric(5,3),
      '2025-09-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 7: nakhon
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'nakhon',
      '2025-09-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko muži',
      'nakhon',
      1.02::numeric(5,3),
      '2025-09-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 8: wigan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'wigan',
      '2025-09-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'rugby',
      'super League',
      'wigan',
      1.01::numeric(5,3),
      '2025-09-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 9: estudiantes
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      700::numeric,
      'win'::public.tip_status,
      'estudiantes',
      '2025-09-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Argentína de honor ženy',
      'estudiantes',
      1.02::numeric(5,3),
      '2025-09-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 10: uned
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      700::numeric,
      'win'::public.tip_status,
      'uned',
      '2025-09-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kostarika muži',
      'uned',
      1.02::numeric(5,3),
      '2025-09-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 11: rajamangla
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      216::numeric,
      'win'::public.tip_status,
      'rajamangla',
      '2025-09-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko ženy',
      'rajamangla',
      1.03::numeric(5,3),
      '2025-09-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 12: sripatum
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'sripatum',
      '2025-09-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko ženy',
      'sripatum',
      1.025::numeric(5,3),
      '2025-09-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 13: madarasz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'madarasz',
      '2025-09-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'utr skopje',
      'madarasz',
      1.04::numeric(5,3),
      '2025-09-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 14: Srbsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Srbsko',
      '2025-09-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'Davis cup',
      'Srbsko',
      1.02::numeric(5,3),
      '2025-09-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 15: Barcelona
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Barcelona',
      '2025-09-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'Španielsko ženy',
      'Barcelona',
      1.01::numeric(5,3),
      '2025-09-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 16: olimpico
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'olimpico',
      '2025-09-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U19',
      'olimpico',
      1.015::numeric(5,3),
      '2025-09-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 17: rajapruk
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'rajapruk',
      '2025-09-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko',
      'rajapruk',
      1.012::numeric(5,3),
      '2025-09-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 18: plock
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      900::numeric,
      'win'::public.tip_status,
      'plock',
      '2025-09-13'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko muži',
      'plock',
      1.01::numeric(5,3),
      '2025-09-13'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 19: kielce
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'kielce',
      '2025-09-13'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko muži',
      'kielce',
      1.01::numeric(5,3),
      '2025-09-13'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 20: sukhothai
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'sukhothai',
      '2025-09-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko muži',
      'sukhothai',
      1.015::numeric(5,3),
      '2025-09-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 21: most
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'most',
      '2025-09-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'mol liga',
      'most',
      1.01::numeric(5,3),
      '2025-09-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 22: mks lublin
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'mks lublin',
      '2025-09-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko ženy',
      'mks lublin',
      1.01::numeric(5,3),
      '2025-09-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 23: kalieva 1.set
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'kalieva 1.set',
      '2025-09-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'WTA caldas ženy',
      'kalieva 1.set',
      1.03::numeric(5,3),
      '2025-09-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 24: maksimovic
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'maksimovic',
      '2025-09-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'kursumlijska muži',
      'maksimovic',
      1.01::numeric(5,3),
      '2025-09-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 25: nozdrachova vyhra aspoň set
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.09::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'nozdrachova vyhra aspoň set',
      '2025-09-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'WTA caldas ženy',
      'nozdrachova vyhra aspoň set',
      1.09::numeric(5,3),
      '2025-09-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 26: vtv binh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'vtv binh',
      '2025-09-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'vtv binh',
      1.025::numeric(5,3),
      '2025-09-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 27: supreme
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'supreme',
      '2025-09-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'supreme',
      1.05::numeric(5,3),
      '2025-09-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 28: sisaket
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'sisaket',
      '2025-09-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'sisaket',
      1.04::numeric(5,3),
      '2025-09-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 29: vtv binh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      440::numeric,
      'win'::public.tip_status,
      'vtv binh',
      '2025-09-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'vtv binh',
      1.025::numeric(5,3),
      '2025-09-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 30: barueri
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      306::numeric,
      'win'::public.tip_status,
      'barueri',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil U19 ženy',
      'barueri',
      1.025::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 31: osasco
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      306::numeric,
      'win'::public.tip_status,
      'osasco',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil U19 ženy',
      'osasco',
      1.025::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 32: michigan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      306::numeric,
      'win'::public.tip_status,
      'michigan',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'michigan',
      1.04::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 33: barueri
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'barueri',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil U19 ženy',
      'barueri',
      1.025::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 34: osasco
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'osasco',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil U19 ženy',
      'osasco',
      1.025::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 35: hull
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'hull',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'rugby',
      'super league',
      'hull',
      1.01::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 36: khonkaen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      405::numeric,
      'win'::public.tip_status,
      'khonkaen',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'khonkaen',
      1.03::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 37: aranmare
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      405::numeric,
      'win'::public.tip_status,
      'aranmare',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'aranmare',
      1.025::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 38: sisaket
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      405::numeric,
      'win'::public.tip_status,
      'sisaket',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'sisaket',
      1.01::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 39: barueri
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      405::numeric,
      'win'::public.tip_status,
      'barueri',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U19 ženy',
      'barueri',
      1.015::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 40: osasco
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      405::numeric,
      'win'::public.tip_status,
      'osasco',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U19 ženy',
      'osasco',
      1.015::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 41: khonkaen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      560::numeric,
      'win'::public.tip_status,
      'khonkaen',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'khonkaen',
      1.03::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 42: aranmare
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      560::numeric,
      'win'::public.tip_status,
      'aranmare',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'aranmare',
      1.025::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 43: sisaket
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      560::numeric,
      'win'::public.tip_status,
      'sisaket',
      '2025-09-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'sisaket',
      1.01::numeric(5,3),
      '2025-09-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 44: celkovo víťaz bol áno
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.08::numeric(5,3),
      150::numeric,
      'win'::public.tip_status,
      'celkovo víťaz bol áno',
      '2025-09-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'atletika',
      'ms 400m prekážky ženy',
      'celkovo víťaz bol áno',
      1.08::numeric(5,3),
      '2025-09-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 45: Boston college
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      680::numeric,
      'win'::public.tip_status,
      'Boston college',
      '2025-09-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'Boston college',
      1.015::numeric(5,3),
      '2025-09-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 46: sisaket
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'sisaket',
      '2025-09-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'sisaket',
      1.015::numeric(5,3),
      '2025-09-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 47: gremio
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      405::numeric,
      'win'::public.tip_status,
      'gremio',
      '2025-09-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy muži',
      'gremio',
      1.012::numeric(5,3),
      '2025-09-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 48: petrokimia
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      405::numeric,
      'win'::public.tip_status,
      'petrokimia',
      '2025-09-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'indonézia ženy',
      'petrokimia',
      1.04::numeric(5,3),
      '2025-09-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 49: cdv
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      405::numeric,
      'win'::public.tip_status,
      'cdv',
      '2025-09-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'uruguay ženy',
      'cdv',
      1.03::numeric(5,3),
      '2025-09-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 50: cdv
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'cdv',
      '2025-09-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'uruguay ženy',
      'cdv',
      1.03::numeric(5,3),
      '2025-09-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 51: cbps
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      810::numeric,
      'win'::public.tip_status,
      'cbps',
      '2025-09-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'uruguay clausura',
      'cbps',
      1.01::numeric(5,3),
      '2025-09-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 52: volei nova
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      810::numeric,
      'win'::public.tip_status,
      'volei nova',
      '2025-09-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy muži',
      'volei nova',
      1.012::numeric(5,3),
      '2025-09-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 53: gresik
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'gresik',
      '2025-09-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'indonézia ženy',
      'gresik',
      1.02::numeric(5,3),
      '2025-09-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 54: Prešov
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'Prešov',
      '2025-09-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'SVK extraliga muži',
      'Prešov',
      1.01::numeric(5,3),
      '2025-09-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 55: arizona
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'arizona',
      '2025-09-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'arizona',
      1.012::numeric(5,3),
      '2025-09-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 56: kongsberg
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'kongsberg',
      '2025-09-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Nórsko muži',
      'kongsberg',
      1.01::numeric(5,3),
      '2025-09-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 57: kongsberg
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'kongsberg',
      '2025-09-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Nórsko muži',
      'kongsberg',
      1.01::numeric(5,3),
      '2025-09-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 58: ftc
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'ftc',
      '2025-09-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Maďarsko ženy',
      'ftc',
      1.02::numeric(5,3),
      '2025-09-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 59: brest
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'brest',
      '2025-09-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Francúzsko ženy',
      'brest',
      1.01::numeric(5,3),
      '2025-09-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 60: san lorenzo
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'san lorenzo',
      '2025-09-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Argentína de honor ženy',
      'san lorenzo',
      1.02::numeric(5,3),
      '2025-09-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 61: Centro olimpico
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'Centro olimpico',
      '2025-09-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U19 muži',
      'Centro olimpico',
      1.05::numeric(5,3),
      '2025-09-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 62: cdv
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.071::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'cdv',
      '2025-09-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'uruguay clausura Primera ženy',
      'cdv',
      1.071::numeric(5,3),
      '2025-09-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 63: kyiv
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'kyiv',
      '2025-09-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hokej',
      'Lotyšsko',
      'kyiv',
      1.01::numeric(5,3),
      '2025-09-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 64: wisconsin
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'wisconsin',
      '2025-09-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'wisconsin',
      1.03::numeric(5,3),
      '2025-09-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 65: kielce
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'kielce',
      '2025-09-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko muži',
      'kielce',
      1.01::numeric(5,3),
      '2025-09-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 66: kielce
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'kielce',
      '2025-09-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko muži',
      'kielce',
      1.01::numeric(5,3),
      '2025-09-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 67: Považská
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Považská',
      '2025-09-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'SVK extraliga muži',
      'Považská',
      1.01::numeric(5,3),
      '2025-09-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 68: kp Brno
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'kp Brno',
      '2025-09-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Česko ženy',
      'kp Brno',
      1.05::numeric(5,3),
      '2025-09-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 69: Ružomberok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      37::numeric,
      'win'::public.tip_status,
      'Ružomberok',
      '2025-09-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'Ružomberok',
      1.01::numeric(5,3),
      '2025-09-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 70: Piešťany
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      37::numeric,
      'win'::public.tip_status,
      'Piešťany',
      '2025-09-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'Piešťany',
      1.01::numeric(5,3),
      '2025-09-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 71: louveira
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      670::numeric,
      'win'::public.tip_status,
      'louveira',
      '2025-09-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U19 ženy',
      'louveira',
      1.015::numeric(5,3),
      '2025-09-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 72: nautico
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'nautico',
      '2025-09-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'uruguay ženy',
      'nautico',
      1.05::numeric(5,3),
      '2025-09-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 73: el hammamy
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      630::numeric,
      'win'::public.tip_status,
      'el hammamy',
      '2025-09-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'ženy qatar',
      'el hammamy',
      1.02::numeric(5,3),
      '2025-09-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 74: ambrogi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      630::numeric,
      'win'::public.tip_status,
      'ambrogi',
      '2025-09-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'antofagasta muži kvali',
      'ambrogi',
      1.02::numeric(5,3),
      '2025-09-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 75: nicaragua
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      440::numeric,
      'win'::public.tip_status,
      'nicaragua',
      '2025-09-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'nicaragua',
      1.02::numeric(5,3),
      '2025-09-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 76: costarica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      440::numeric,
      'win'::public.tip_status,
      'costarica',
      '2025-09-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'costarica',
      1.012::numeric(5,3),
      '2025-09-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 77: ufa
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'ufa',
      '2025-09-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hokej',
      'Rusko ženy',
      'ufa',
      1.04::numeric(5,3),
      '2025-09-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 78: taubate
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'taubate',
      '2025-09-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'super globe',
      'taubate',
      1.02::numeric(5,3),
      '2025-09-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 79: holstebro
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'holstebro',
      '2025-10-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Dánsko ženy 1.divizia',
      'holstebro',
      1.01::numeric(5,3),
      '2025-10-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 80: metapan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'metapan',
      '2025-10-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'el Salvador muži',
      'metapan',
      1.01::numeric(5,3),
      '2025-10-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 81: taubate
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'taubate',
      '2025-10-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'super globe muži',
      'taubate',
      1.04::numeric(5,3),
      '2025-10-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 82: vukovic
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'vukovic',
      '2025-10-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'utr belehrad ženy',
      'vukovic',
      1.01::numeric(5,3),
      '2025-10-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 83: ANO víťaz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'ANO víťaz',
      '2025-10-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'politika',
      'Česko voľby',
      'ANO víťaz',
      1.01::numeric(5,3),
      '2025-10-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 84: Paris
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Paris',
      '2025-10-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Francúzsko muži',
      'Paris',
      1.01::numeric(5,3),
      '2025-10-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 85: kielce
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'kielce',
      '2025-10-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko muži',
      'kielce',
      1.01::numeric(5,3),
      '2025-10-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 86: metz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'metz',
      '2025-10-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'liga majstrov ženy',
      'metz',
      1.01::numeric(5,3),
      '2025-10-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 87: asv elite
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'asv elite',
      '2025-10-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'asv elite',
      1.02::numeric(5,3),
      '2025-10-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 88: Dominikánska
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Dominikánska',
      '2025-10-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'norceca',
      'Dominikánska',
      1.015::numeric(5,3),
      '2025-10-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 89: Rakúsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'Rakúsko',
      '2025-10-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'kvali ms',
      'Rakúsko',
      1.01::numeric(5,3),
      '2025-10-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 90: Prešov
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'Prešov',
      '2025-10-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'SVK muži',
      'Prešov',
      1.01::numeric(5,3),
      '2025-10-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 91: bekescaba
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      700::numeric,
      'win'::public.tip_status,
      'bekescaba',
      '2025-10-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko ženy',
      'bekescaba',
      1.01::numeric(5,3),
      '2025-10-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 92: luka bar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      700::numeric,
      'win'::public.tip_status,
      'luka bar',
      '2025-10-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Čierna hora ženy',
      'luka bar',
      1.01::numeric(5,3),
      '2025-10-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 93: san jose
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'san jose',
      '2025-10-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kostarika ženy',
      'san jose',
      1.05::numeric(5,3),
      '2025-10-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 94: Prešov
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'Prešov',
      '2025-10-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'SVK muži',
      'Prešov',
      1.01::numeric(5,3),
      '2025-10-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 95: Maďarsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'Maďarsko',
      '2025-10-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'kvali me U17',
      'Maďarsko',
      1.01::numeric(5,3),
      '2025-10-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 96: skanderbeu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'skanderbeu',
      '2025-10-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Albánsko ženy',
      'skanderbeu',
      1.02::numeric(5,3),
      '2025-10-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 97: partizani
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'partizani',
      '2025-10-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Albánsko muži',
      'partizani',
      1.02::numeric(5,3),
      '2025-10-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 98: lousville
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'lousville',
      '2025-10-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'lousville',
      1.02::numeric(5,3),
      '2025-10-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 99: partizani
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'partizani',
      '2025-10-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Albánsko muži',
      'partizani',
      1.02::numeric(5,3),
      '2025-10-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 100: Ružomberok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'Ružomberok',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'Ružomberok',
      1.01::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 101: slávia Bystrica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'slávia Bystrica',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'slávia Bystrica',
      1.05::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 102: Slovan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'Slovan',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK ženy',
      'Slovan',
      1.01::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 103: tent
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'tent',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Srbsko ženy',
      'tent',
      1.01::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 104: hylte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'hylte',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko ženy',
      'hylte',
      1.02::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 105: floby
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'floby',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko muži',
      'floby',
      1.04::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 106: Ružomberok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'Ružomberok',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'Ružomberok',
      1.01::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 107: zabiny
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'zabiny',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Česko ženy',
      'zabiny',
      1.05::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 108: Maďarsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'Maďarsko',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'kvali me U17',
      'Maďarsko',
      1.01::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 109: Scott
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Scott',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'WTA tampico ženy',
      'Scott',
      1.01::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 110: gonzales vyhra aspoň set
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.1::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'gonzales vyhra aspoň set',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'WTA tampico ženy',
      'gonzales vyhra aspoň set',
      1.1::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 111: scorpions
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'scorpions',
      '2025-10-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny wncaa',
      'scorpions',
      1.03::numeric(5,3),
      '2025-10-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 112: holte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'holte',
      '2025-10-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'holte',
      1.05::numeric(5,3),
      '2025-10-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 113: storvreta
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'storvreta',
      '2025-10-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'florbal',
      'Švédsko muži',
      'storvreta',
      1.01::numeric(5,3),
      '2025-10-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 114: solentuna
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      320::numeric,
      'win'::public.tip_status,
      'solentuna',
      '2025-10-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko muži',
      'solentuna',
      1.03::numeric(5,3),
      '2025-10-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 115: Budva
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      320::numeric,
      'win'::public.tip_status,
      'Budva',
      '2025-10-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora',
      'Budva',
      1.03::numeric(5,3),
      '2025-10-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 116: podgorica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      320::numeric,
      'win'::public.tip_status,
      'podgorica',
      '2025-10-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora',
      'podgorica',
      1.02::numeric(5,3),
      '2025-10-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 117: podgorica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'podgorica',
      '2025-10-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora',
      'podgorica',
      1.02::numeric(5,3),
      '2025-10-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 118: Chorvátsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Chorvátsko',
      '2025-10-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'kvali ms',
      'Chorvátsko',
      1.01::numeric(5,3),
      '2025-10-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 119: osasco
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'osasco',
      '2025-10-13'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U21 ženy',
      'osasco',
      1.03::numeric(5,3),
      '2025-10-13'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 120: Centro
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Centro',
      '2025-10-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U19 muži',
      'Centro',
      1.015::numeric(5,3),
      '2025-10-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 121: osasco
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'osasco',
      '2025-10-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U21 ženy',
      'osasco',
      1.01::numeric(5,3),
      '2025-10-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 122: HK
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'HK',
      '2025-10-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Island ženy',
      'HK',
      1.01::numeric(5,3),
      '2025-10-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 123: muang
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'muang',
      '2025-10-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko pro League muži',
      'muang',
      1.01::numeric(5,3),
      '2025-10-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 124: ka
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'ka',
      '2025-10-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Island ženy',
      'ka',
      1.02::numeric(5,3),
      '2025-10-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 125: avenida
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'avenida',
      '2025-10-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'euro cup ženy',
      'avenida',
      1.01::numeric(5,3),
      '2025-10-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 126: branik
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'branik',
      '2025-10-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko ženy',
      'branik',
      1.03::numeric(5,3),
      '2025-10-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 127: coastal
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'coastal',
      '2025-10-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'coastal',
      1.03::numeric(5,3),
      '2025-10-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 128: berel
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      630::numeric,
      'win'::public.tip_status,
      'berel',
      '2025-10-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'berel',
      1.01::numeric(5,3),
      '2025-10-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 129: kuanysh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      630::numeric,
      'win'::public.tip_status,
      'kuanysh',
      '2025-10-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'kuanysh',
      1.025::numeric(5,3),
      '2025-10-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 130: gardians
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      830::numeric,
      'win'::public.tip_status,
      'gardians',
      '2025-10-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Írsko ženy',
      'gardians',
      1.01::numeric(5,3),
      '2025-10-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 131: haoel kfar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      830::numeric,
      'win'::public.tip_status,
      'haoel kfar',
      '2025-10-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael ženy',
      'haoel kfar',
      1.015::numeric(5,3),
      '2025-10-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 132: asv aarhus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      830::numeric,
      'win'::public.tip_status,
      'asv aarhus',
      '2025-10-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'asv aarhus',
      1.025::numeric(5,3),
      '2025-10-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 133: Liberec
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      520::numeric,
      'win'::public.tip_status,
      'Liberec',
      '2025-10-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Česko ženy',
      'Liberec',
      1.015::numeric(5,3),
      '2025-10-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 134: Žilina
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      520::numeric,
      'win'::public.tip_status,
      'Žilina',
      '2025-10-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK ženy',
      'Žilina',
      1.03::numeric(5,3),
      '2025-10-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 135: police
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      520::numeric,
      'win'::public.tip_status,
      'police',
      '2025-10-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'rwanda ženy',
      'police',
      1.03::numeric(5,3),
      '2025-10-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 136: dasmarinas
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'dasmarinas',
      '2025-10-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny mpva ženy',
      'dasmarinas',
      1.04::numeric(5,3),
      '2025-10-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 137: Porto
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'Porto',
      '2025-10-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'Porto',
      1.015::numeric(5,3),
      '2025-10-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 138: tent
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      560::numeric,
      'win'::public.tip_status,
      'tent',
      '2025-10-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Srbsko ženy',
      'tent',
      1.01::numeric(5,3),
      '2025-10-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 139: Porto
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      560::numeric,
      'win'::public.tip_status,
      'Porto',
      '2025-10-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'Porto',
      1.015::numeric(5,3),
      '2025-10-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 140: asal
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'asal',
      '2025-10-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'us open muži',
      'asal',
      1.02::numeric(5,3),
      '2025-10-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 141: el sherbini
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'el sherbini',
      '2025-10-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'us open ženy',
      'el sherbini',
      1.02::numeric(5,3),
      '2025-10-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 142: mornar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'mornar',
      '2025-10-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'montenegro muži',
      'mornar',
      1.05::numeric(5,3),
      '2025-10-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 143: Prešov
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Prešov',
      '2025-10-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'SVK muži',
      'Prešov',
      1.01::numeric(5,3),
      '2025-10-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 144: zhetysu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'zhetysu',
      '2025-10-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'zhetysu',
      1.01::numeric(5,3),
      '2025-10-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 145: turan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'turan',
      '2025-10-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'turan',
      1.04::numeric(5,3),
      '2025-10-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 146: garibay vyhra aspoň set
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'garibay vyhra aspoň set',
      '2025-10-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'WTA queretaro',
      'garibay vyhra aspoň set',
      1.03::numeric(5,3),
      '2025-10-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 147: deka
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'deka',
      '2025-10-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Grécko nc U20 ženy',
      'deka',
      1.025::numeric(5,3),
      '2025-10-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 148: asal
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'asal',
      '2025-10-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'us open muži',
      'asal',
      1.02::numeric(5,3),
      '2025-10-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 149: el hammamy
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'el hammamy',
      '2025-10-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'us open muži',
      'el hammamy',
      1.03::numeric(5,3),
      '2025-10-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 150: bulldogs
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      720::numeric,
      'win'::public.tip_status,
      'bulldogs',
      '2025-10-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny SSL ženy',
      'bulldogs',
      1.04::numeric(5,3),
      '2025-10-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 151: hapoel kfar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'hapoel kfar',
      '2025-10-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael muži',
      'hapoel kfar',
      1.025::numeric(5,3),
      '2025-10-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 152: el sherbini
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'el sherbini',
      '2025-10-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'us open ženy',
      'el sherbini',
      1.02::numeric(5,3),
      '2025-10-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 153: storhamar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'storhamar',
      '2025-10-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Nórsko ženy',
      'storhamar',
      1.01::numeric(5,3),
      '2025-10-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 154: esbjerg
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'esbjerg',
      '2025-10-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Dánsko ženy',
      'esbjerg',
      1.01::numeric(5,3),
      '2025-10-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 155: calcit
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      220::numeric,
      'win'::public.tip_status,
      'calcit',
      '2025-10-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko ženy',
      'calcit',
      1.04::numeric(5,3),
      '2025-10-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 156: vesc
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      220::numeric,
      'win'::public.tip_status,
      'vesc',
      '2025-10-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko nb I ženy',
      'vesc',
      1.01::numeric(5,3),
      '2025-10-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 157: pinheiros
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'pinheiros',
      '2025-10-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U19 ženy',
      'pinheiros',
      1.05::numeric(5,3),
      '2025-10-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 158: ourinhos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'ourinhos',
      '2025-10-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Brazília paulista ženy',
      'ourinhos',
      1.01::numeric(5,3),
      '2025-10-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 159: sao jose
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'sao jose',
      '2025-10-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Brazília paulista ženy',
      'sao jose',
      1.01::numeric(5,3),
      '2025-10-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 160: connoly
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'connoly',
      '2025-10-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'politika',
      'Írsko prezidentské voľby',
      'connoly',
      1.05::numeric(5,3),
      '2025-10-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 161: fluminense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      624::numeric,
      'win'::public.tip_status,
      'fluminense',
      '2025-10-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil rdj U19 muži',
      'fluminense',
      1.025::numeric(5,3),
      '2025-10-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 162: kv fer
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      624::numeric,
      'win'::public.tip_status,
      'kv fer',
      '2025-10-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kosovo ženy',
      'kv fer',
      1.01::numeric(5,3),
      '2025-10-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 163: cska
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      624::numeric,
      'win'::public.tip_status,
      'cska',
      '2025-10-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bulharsko ženy',
      'cska',
      1.025::numeric(5,3),
      '2025-10-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 164: maritza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      624::numeric,
      'win'::public.tip_status,
      'maritza',
      '2025-10-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bulharsko ženy',
      'maritza',
      1.012::numeric(5,3),
      '2025-10-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 165: Považská
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.1::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'Považská',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'SVK muži',
      'Považská',
      1.1::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 166: larvik
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'larvik',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Nórsko ženy',
      'larvik',
      1.01::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 167: cska
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      586::numeric,
      'win'::public.tip_status,
      'cska',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bulharsko ženy',
      'cska',
      1.025::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 168: maritza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      586::numeric,
      'win'::public.tip_status,
      'maritza',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bulharsko ženy',
      'maritza',
      1.012::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 169: Dánsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      586::numeric,
      'win'::public.tip_status,
      'Dánsko',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'Dánsko',
      1.02::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 170: napredak
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      595::numeric,
      'win'::public.tip_status,
      'napredak',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bosna muži',
      'napredak',
      1.05::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 171: nebraska
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      590::numeric,
      'win'::public.tip_status,
      'nebraska',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'nebraska',
      1.015::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 172: pittsburgh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      590::numeric,
      'win'::public.tip_status,
      'pittsburgh',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'pittsburgh',
      1.02::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 173: Texas
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      590::numeric,
      'win'::public.tip_status,
      'Texas',
      '2025-10-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'Texas',
      1.025::numeric(5,3),
      '2025-10-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 174: apr
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'apr',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'rwanda ženy',
      'apr',
      1.015::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 175: sokol post
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'sokol post',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'sokol post',
      1.012::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 176: haok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      402::numeric,
      'win'::public.tip_status,
      'haok',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko muži',
      'haok',
      1.04::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 177: Stuttgart
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      402::numeric,
      'win'::public.tip_status,
      'Stuttgart',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nemecko ženy',
      'Stuttgart',
      1.01::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 178: police
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      402::numeric,
      'win'::public.tip_status,
      'police',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'rwanda muži',
      'police',
      1.025::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 179: gentofte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.062::numeric(5,3),
      402::numeric,
      'win'::public.tip_status,
      'gentofte',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'gentofte',
      1.062::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 180: sport-s
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.062::numeric(5,3),
      402::numeric,
      'win'::public.tip_status,
      'sport-s',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'uganda ženy',
      'sport-s',
      1.062::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 181: Porto
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'Porto',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Portugalsko muži',
      'Porto',
      1.01::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 182: most
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'most',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'mol ženy',
      'most',
      1.01::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 183: aek larnaca
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      396::numeric,
      'win'::public.tip_status,
      'aek larnaca',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Cyprus ženy',
      'aek larnaca',
      1.02::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 184: luka bar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      396::numeric,
      'win'::public.tip_status,
      'luka bar',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora ženy',
      'luka bar',
      1.05::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 185: Santa Cruz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'Santa Cruz',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko 2 ženy',
      'Santa Cruz',
      1.04::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 186: praiense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'praiense',
      '2025-10-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko 2 ženy',
      'praiense',
      1.015::numeric(5,3),
      '2025-10-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 187: Santa Cruz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'Santa Cruz',
      '2025-10-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko 2 ženy',
      'Santa Cruz',
      1.012::numeric(5,3),
      '2025-10-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 188: Linz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Linz',
      '2025-10-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'Linz',
      1.03::numeric(5,3),
      '2025-10-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 189: Vitoria
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Vitoria',
      '2025-10-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'Vitoria',
      1.02::numeric(5,3),
      '2025-10-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 190: regatas
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      526::numeric,
      'win'::public.tip_status,
      'regatas',
      '2025-10-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru ženy',
      'regatas',
      1.02::numeric(5,3),
      '2025-10-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 191: pinheiros
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      526::numeric,
      'win'::public.tip_status,
      'pinheiros',
      '2025-10-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'brasil paulista U19 ženy',
      'pinheiros',
      1.05::numeric(5,3),
      '2025-10-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 192: Pittsburgh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      526::numeric,
      'win'::public.tip_status,
      'Pittsburgh',
      '2025-10-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'Pittsburgh',
      1.015::numeric(5,3),
      '2025-10-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 193: smu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      526::numeric,
      'win'::public.tip_status,
      'smu',
      '2025-10-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'smu',
      1.025::numeric(5,3),
      '2025-10-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 194: africain
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'africain',
      '2025-10-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'arabské klubové ženy',
      'africain',
      1.01::numeric(5,3),
      '2025-10-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 195: carthage
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'carthage',
      '2025-10-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'arabské klubové ženy',
      'carthage',
      1.03::numeric(5,3),
      '2025-10-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 196: orfi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'orfi',
      '2025-10-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'canadian ženy',
      'orfi',
      1.02::numeric(5,3),
      '2025-10-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 197: papagou
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'papagou',
      '2025-10-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Grécko 3.division ženy',
      'papagou',
      1.04::numeric(5,3),
      '2025-10-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 198: melisiakos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'melisiakos',
      '2025-10-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Grécko 3.division ženy',
      'melisiakos',
      1.03::numeric(5,3),
      '2025-10-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 199: pasay
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      490::numeric,
      'win'::public.tip_status,
      'pasay',
      '2025-10-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny mpva ženy',
      'pasay',
      1.03::numeric(5,3),
      '2025-10-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 200: akari
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.062::numeric(5,3),
      490::numeric,
      'win'::public.tip_status,
      'akari',
      '2025-10-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny pvl ženy',
      'akari',
      1.062::numeric(5,3),
      '2025-10-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 201: nguyen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'nguyen',
      '2025-10-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Vietnam ženy',
      'nguyen',
      1.025::numeric(5,3),
      '2025-10-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 202: johor stávka bez remízy
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'johor stávka bez remízy',
      '2025-10-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'Malajzia pohár',
      'johor stávka bez remízy',
      1.01::numeric(5,3),
      '2025-10-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 203: Švajčiarsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Švajčiarsko',
      '2025-10-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'kvali me sk.10 U17',
      'Švajčiarsko',
      1.01::numeric(5,3),
      '2025-10-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 204: Dinamo
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      394::numeric,
      'win'::public.tip_status,
      'Dinamo',
      '2025-10-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'liga majstrov muži',
      'Dinamo',
      1.05::numeric(5,3),
      '2025-10-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 205: gen-i
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      394::numeric,
      'win'::public.tip_status,
      'gen-i',
      '2025-10-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko pohár ženy',
      'gen-i',
      1.025::numeric(5,3),
      '2025-10-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 206: calcit
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      394::numeric,
      'win'::public.tip_status,
      'calcit',
      '2025-10-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko pohár ženy',
      'calcit',
      1.015::numeric(5,3),
      '2025-10-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 207: gen-i
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'gen-i',
      '2025-10-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko pohár ženy',
      'gen-i',
      1.025::numeric(5,3),
      '2025-10-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 208: calcit
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'calcit',
      '2025-10-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko pohár ženy',
      'calcit',
      1.015::numeric(5,3),
      '2025-10-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 209: tchalou
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'tchalou',
      '2025-10-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup ženy',
      'tchalou',
      1.02::numeric(5,3),
      '2025-10-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 210: schwerin
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'schwerin',
      '2025-10-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nemecko ženy',
      'schwerin',
      1.01::numeric(5,3),
      '2025-10-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 211: bilbao
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'bilbao',
      '2025-10-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'fiba cup muži',
      'bilbao',
      1.01::numeric(5,3),
      '2025-10-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 212: sporting
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'sporting',
      '2025-10-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futsal',
      'liga majstrov sk.4',
      'sporting',
      1.04::numeric(5,3),
      '2025-10-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 213: vegyez
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      428::numeric,
      'win'::public.tip_status,
      'vegyez',
      '2025-10-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko muži',
      'vegyez',
      1.04::numeric(5,3),
      '2025-10-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 214: vesc
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      428::numeric,
      'win'::public.tip_status,
      'vesc',
      '2025-10-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko pohár ženy',
      'vesc',
      1.05::numeric(5,3),
      '2025-10-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 215: vinh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'vinh',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Vietnam muži',
      'vinh',
      1.015::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 216: bac
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'bac',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Vietnam ženy',
      'bac',
      1.05::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 217: bejaia
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'bejaia',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'arabské klubové',
      'bejaia',
      1.025::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 218: olympiakos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'olympiakos',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'liga majstrov muži',
      'olympiakos',
      1.02::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 219: gentofte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'gentofte',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko pohár ženy',
      'gentofte',
      1.01::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 220: astrup/rasmusen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'astrup/rasmusen',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'Hylo muži štvorhra',
      'astrup/rasmusen',
      1.01::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 221: chia/soh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'chia/soh',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'Hylo muži štvorhra',
      'chia/soh',
      1.01::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 222: togliatti
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'togliatti',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Rusko ženy',
      'togliatti',
      1.01::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 223: horsens
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'horsens',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Dánsko muži',
      'horsens',
      1.01::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 224: astrup/rasmusen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'astrup/rasmusen',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'Hylo muži štvorhra',
      'astrup/rasmusen',
      1.01::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 225: krim
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'krim',
      '2025-10-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko 1B ženy',
      'krim',
      1.05::numeric(5,3),
      '2025-10-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 226: zaglebie
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'zaglebie',
      '2025-10-31'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko ženy',
      'zaglebie',
      1.01::numeric(5,3),
      '2025-10-31'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 227: vk marica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'vk marica',
      '2025-10-31'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bulharsko ženy',
      'vk marica',
      1.02::numeric(5,3),
      '2025-10-31'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 228: tirana
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'tirana',
      '2025-10-31'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Albánsko cup muži',
      'tirana',
      1.04::numeric(5,3),
      '2025-10-31'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 229: tirana
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'tirana',
      '2025-10-31'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Albánsko ženy',
      'tirana',
      1.025::numeric(5,3),
      '2025-10-31'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 230: nebo
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'nebo',
      '2025-10-31'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko ženy',
      'nebo',
      1.03::numeric(5,3),
      '2025-10-31'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 231: Slovan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'Slovan',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'Slovan',
      1.02::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 232: y.a.kosice
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.1::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'y.a.kosice',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'y.a.kosice',
      1.1::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 233: bar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      840::numeric,
      'win'::public.tip_status,
      'bar',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora ženy',
      'bar',
      1.01::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 234: peerles
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      840::numeric,
      'win'::public.tip_status,
      'peerles',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru muži',
      'peerles',
      1.01::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 235: haok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      840::numeric,
      'win'::public.tip_status,
      'haok',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko muži',
      'haok',
      1.01::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 236: hapoel kfar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      840::numeric,
      'win'::public.tip_status,
      'hapoel kfar',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael ženy',
      'hapoel kfar',
      1.01::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 237: bejaia
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      394::numeric,
      'win'::public.tip_status,
      'bejaia',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'arabské klubové ženy nc',
      'bejaia',
      1.01::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 238: levallois
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      394::numeric,
      'win'::public.tip_status,
      'levallois',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Francúzsko ženy',
      'levallois',
      1.015::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 239: barrus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      394::numeric,
      'win'::public.tip_status,
      'barrus',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Estónsko pohár',
      'barrus',
      1.025::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 240: Dinamo
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'Dinamo',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rumunsko ženy',
      'Dinamo',
      1.02::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 241: ginastica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'ginastica',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 muži',
      'ginastica',
      1.02::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 242: lemesos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'lemesos',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Cyprus ženy',
      'lemesos',
      1.02::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 243: lemesos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.44::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'lemesos',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Cyprus ženy',
      'lemesos',
      1.44::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 244: lemesos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.2::numeric(5,3),
      392::numeric,
      'win'::public.tip_status,
      'lemesos',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Cyprus ženy',
      'lemesos',
      1.2::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 245: alianza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'alianza',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru ženy',
      'alianza',
      1.03::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 246: rattana
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'rattana',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko ženy',
      'rattana',
      1.015::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 247: rattana
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      530::numeric,
      'win'::public.tip_status,
      'rattana',
      '2025-11-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko ženy',
      'rattana',
      1.015::numeric(5,3),
      '2025-11-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 248: bigbank
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      705::numeric,
      'win'::public.tip_status,
      'bigbank',
      '2025-11-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Estónsko pohár muži',
      'bigbank',
      1.015::numeric(5,3),
      '2025-11-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 249: neuchatel
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      705::numeric,
      'win'::public.tip_status,
      'neuchatel',
      '2025-11-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švajčiarsko ženy',
      'neuchatel',
      1.02::numeric(5,3),
      '2025-11-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 250: HK
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      705::numeric,
      'win'::public.tip_status,
      'HK',
      '2025-11-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Island ženy',
      'HK',
      1.015::numeric(5,3),
      '2025-11-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 251: ka
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      705::numeric,
      'win'::public.tip_status,
      'ka',
      '2025-11-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Island muži',
      'ka',
      1.03::numeric(5,3),
      '2025-11-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 252: HK
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      700::numeric,
      'win'::public.tip_status,
      'HK',
      '2025-11-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Island ženy',
      'HK',
      1.015::numeric(5,3),
      '2025-11-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 253: ka
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      700::numeric,
      'win'::public.tip_status,
      'ka',
      '2025-11-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Island muži',
      'ka',
      1.03::numeric(5,3),
      '2025-11-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 254: haok mladost
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'haok mladost',
      '2025-11-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko ženy',
      'haok mladost',
      1.05::numeric(5,3),
      '2025-11-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 255: buducnost
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.071::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'buducnost',
      '2025-11-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora ženy',
      'buducnost',
      1.071::numeric(5,3),
      '2025-11-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 256: bad radkersburg
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'bad radkersburg',
      '2025-11-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko pohár ženy',
      'bad radkersburg',
      1.02::numeric(5,3),
      '2025-11-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 257: fayetevile
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'fayetevile',
      '2025-11-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa 2 ženy',
      'fayetevile',
      1.04::numeric(5,3),
      '2025-11-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 258: corinthians
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'corinthians',
      '2025-11-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Brazília muži',
      'corinthians',
      1.01::numeric(5,3),
      '2025-11-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 259: zhetysu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'zhetysu',
      '2025-11-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'zhetysu',
      1.01::numeric(5,3),
      '2025-11-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 260: maccabi aviv
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.11::numeric(5,3),
      346::numeric,
      'win'::public.tip_status,
      'maccabi aviv',
      '2025-11-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael muži',
      'maccabi aviv',
      1.11::numeric(5,3),
      '2025-11-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 261: hapoel asher
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.14::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'hapoel asher',
      '2025-11-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael muži',
      'hapoel asher',
      1.14::numeric(5,3),
      '2025-11-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 262: ak ahly
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'ak ahly',
      '2025-11-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Egypt muži',
      'ak ahly',
      1.02::numeric(5,3),
      '2025-11-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 263: zamalek
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'zamalek',
      '2025-11-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Egypt muži',
      'zamalek',
      1.01::numeric(5,3),
      '2025-11-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 264: le cannet
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'le cannet',
      '2025-11-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'liga majstrov ženy',
      'le cannet',
      1.01::numeric(5,3),
      '2025-11-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 265: novi beograd
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'novi beograd',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'vodné pólo',
      'rwp',
      'novi beograd',
      1.01::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 266: Karviná
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Karviná',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Česko pohár muži',
      'Karviná',
      1.02::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 267: aarhus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'aarhus',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'aarhus',
      1.04::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 268: kuanysh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'kuanysh',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'kuanysh',
      1.01::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 269: aktobe
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'aktobe',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'aktobe',
      1.04::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 270: vegyez
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'vegyez',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko pohár muži',
      'vegyez',
      1.02::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 271: bousaid
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'bousaid',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Tunis muži',
      'bousaid',
      1.025::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 272: jekabpils
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'jekabpils',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Lotyšsko pohár muži',
      'jekabpils',
      1.025::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 273: Ostrava
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      310::numeric,
      'win'::public.tip_status,
      'Ostrava',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup ženy',
      'Ostrava',
      1.015::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 274: neapolis
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      310::numeric,
      'win'::public.tip_status,
      'neapolis',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup ženy',
      'neapolis',
      1.03::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 275: kuanysh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1190::numeric,
      'win'::public.tip_status,
      'kuanysh',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'kuanysh',
      1.015::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 276: berel
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1190::numeric,
      'win'::public.tip_status,
      'berel',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'berel',
      1.025::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 277: zhetysu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'zhetysu',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'zhetysu',
      1.03::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 278: karaganda
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'karaganda',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'karaganda',
      1.04::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 279: arizona
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'arizona',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'arizona',
      1.04::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 280: mb volley
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'mb volley',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru muži',
      'mb volley',
      1.015::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 281: nepal
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'nepal',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'international U19 ženy',
      'nepal',
      1.01::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 282: novi beograd
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'novi beograd',
      '2025-11-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'vodné pólo',
      'rwp',
      'novi beograd',
      1.01::numeric(5,3),
      '2025-11-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 283: nebraska
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'nebraska',
      '2025-11-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'nebraska',
      1.02::numeric(5,3),
      '2025-11-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 284: kdf
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'kdf',
      '2025-11-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'kenya muži',
      'kdf',
      1.02::numeric(5,3),
      '2025-11-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 285: Komárno
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'Komárno',
      '2025-11-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK muži',
      'Komárno',
      1.01::numeric(5,3),
      '2025-11-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 286: maccabi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      610::numeric,
      'win'::public.tip_status,
      'maccabi',
      '2025-11-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael muži',
      'maccabi',
      1.05::numeric(5,3),
      '2025-11-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 287: klingard/rasmusen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'klingard/rasmusen',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'Nórsko štvorhra muži',
      'klingard/rasmusen',
      1.01::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 288: Norman/sjoo
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Norman/sjoo',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'Nórsko štvorhra ženy',
      'Norman/sjoo',
      1.01::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 289: podedworny
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'podedworny',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'Nórsko dvojhra ženy',
      'podedworny',
      1.01::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 290: Írsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Írsko',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'rugby',
      'medzištátne',
      'Írsko',
      1.01::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 291: maccabi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      284::numeric,
      'win'::public.tip_status,
      'maccabi',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael ženy',
      'maccabi',
      1.012::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 292: jedinstvo
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      284::numeric,
      'win'::public.tip_status,
      'jedinstvo',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Srbsko ženy',
      'jedinstvo',
      1.02::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 293: kenya prisons
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      284::numeric,
      'win'::public.tip_status,
      'kenya prisons',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Keňa muži',
      'kenya prisons',
      1.03::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 294: timisoara
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      392::numeric,
      'win'::public.tip_status,
      'timisoara',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rumunsko A2 muži',
      'timisoara',
      1.01::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 295: jedinstvo
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      392::numeric,
      'win'::public.tip_status,
      'jedinstvo',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Srbsko ženy',
      'jedinstvo',
      1.02::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 296: kaposvar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      392::numeric,
      'win'::public.tip_status,
      'kaposvar',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko muži',
      'kaposvar',
      1.05::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 297: Pittsburgh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'Pittsburgh',
      '2025-11-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'Pittsburgh',
      1.015::numeric(5,3),
      '2025-11-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 298: holte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1216::numeric,
      'win'::public.tip_status,
      'holte',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'holte',
      1.01::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 299: hylte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1216::numeric,
      'win'::public.tip_status,
      'hylte',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko ženy',
      'hylte',
      1.012::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 300: linkopings
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1216::numeric,
      'win'::public.tip_status,
      'linkopings',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko ženy',
      'linkopings',
      1.02::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 301: finstad
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.005::numeric(5,3),
      1216::numeric,
      'win'::public.tip_status,
      'finstad',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nórsko ženy 1.div.',
      'finstad',
      1.005::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 302: haok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      510::numeric,
      'win'::public.tip_status,
      'haok',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko ženy',
      'haok',
      1.025::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 303: dziko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      510::numeric,
      'win'::public.tip_status,
      'dziko',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Gruzínsko ženy',
      'dziko',
      1.05::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 304: kpa
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      510::numeric,
      'win'::public.tip_status,
      'kpa',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Keňa muži',
      'kpa',
      1.03::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 305: east african
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      510::numeric,
      'win'::public.tip_status,
      'east african',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'rwanda ženy',
      'east african',
      1.04::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 306: Alba blaj
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Alba blaj',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rumunsko ženy',
      'Alba blaj',
      1.01::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 307: Stuttgart
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Stuttgart',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nemecko ženy pohár',
      'Stuttgart',
      1.01::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 308: suhl
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'suhl',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nemecko ženy pohár',
      'suhl',
      1.01::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 309: schafhausen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'schafhausen',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švajčiarsko ženy',
      'schafhausen',
      1.015::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 310: Lučenec
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.2::numeric(5,3),
      50::numeric,
      'win'::public.tip_status,
      'Lučenec',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futsal',
      'SVK muži',
      'Lučenec',
      1.2::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 311: cbr
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'cbr',
      '2025-11-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'cbr',
      1.05::numeric(5,3),
      '2025-11-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 312: ti-volley
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'ti-volley',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy pohár',
      'ti-volley',
      1.01::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 313: ka
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'ka',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Island ženy',
      'ka',
      1.01::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 314: swieqi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'swieqi',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'malta ženy',
      'swieqi',
      1.04::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 315: Turecko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'Turecko',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'islamské hry muži',
      'Turecko',
      1.015::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 316: osi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      790::numeric,
      'win'::public.tip_status,
      'osi',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nórsko 1.div. ženy',
      'osi',
      1.03::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 317: ti-volley
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'ti-volley',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy pohár',
      'ti-volley',
      1.01::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 318: Pittsburgh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1180::numeric,
      'win'::public.tip_status,
      'Pittsburgh',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'Pittsburgh',
      1.025::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 319: creighton
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1180::numeric,
      'win'::public.tip_status,
      'creighton',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'creighton',
      1.015::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 320: kif
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1180::numeric,
      'win'::public.tip_status,
      'kif',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'faerske ženy',
      'kif',
      1.02::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 321: smu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      710::numeric,
      'win'::public.tip_status,
      'smu',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'smu',
      1.02::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 322: peerles
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      710::numeric,
      'win'::public.tip_status,
      'peerles',
      '2025-11-09'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru muži',
      'peerles',
      1.03::numeric(5,3),
      '2025-11-09'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 323: rabotnicki
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'rabotnicki',
      '2025-11-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Macedónsko ženy',
      'rabotnicki',
      1.03::numeric(5,3),
      '2025-11-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 324: Irán
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      660::numeric,
      'win'::public.tip_status,
      'Irán',
      '2025-11-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'islamské hry',
      'Irán',
      1.015::numeric(5,3),
      '2025-11-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 325: melisiakos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1010::numeric,
      'win'::public.tip_status,
      'melisiakos',
      '2025-11-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'greece 3.div. ženy',
      'melisiakos',
      1.025::numeric(5,3),
      '2025-11-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 326: euosmou
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1010::numeric,
      'win'::public.tip_status,
      'euosmou',
      '2025-11-10'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'greece nc U20 ženy',
      'euosmou',
      1.02::numeric(5,3),
      '2025-11-10'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 327: marche
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'marche',
      '2025-11-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'muži',
      'marche',
      1.02::numeric(5,3),
      '2025-11-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 328: Lee
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Lee',
      '2025-11-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'ženy',
      'Lee',
      1.02::numeric(5,3),
      '2025-11-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 329: bekescaba
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      350::numeric,
      'win'::public.tip_status,
      'bekescaba',
      '2025-11-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko pohár ženy',
      'bekescaba',
      1.05::numeric(5,3),
      '2025-11-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 330: mate asher
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      350::numeric,
      'win'::public.tip_status,
      'mate asher',
      '2025-11-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael muži',
      'mate asher',
      1.04::numeric(5,3),
      '2025-11-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 331: lipscomb
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'lipscomb',
      '2025-11-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'lipscomb',
      1.05::numeric(5,3),
      '2025-11-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 332: quezon
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'quezon',
      '2025-11-11'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny mpva ženy',
      'quezon',
      1.04::numeric(5,3),
      '2025-11-11'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 334: metz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      514::numeric,
      'win'::public.tip_status,
      'metz',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Francúzsko ženy',
      'metz',
      1.01::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 335: zaglebie
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      514::numeric,
      'win'::public.tip_status,
      'zaglebie',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko ženy',
      'zaglebie',
      1.01::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 336: Bulharsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      514::numeric,
      'win'::public.tip_status,
      'Bulharsko',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'kvali me ženy',
      'Bulharsko',
      1.02::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 337: Bulharsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'Bulharsko',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'kvali me ženy',
      'Bulharsko',
      1.02::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 338: buyuksehir
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      596::numeric,
      'win'::public.tip_status,
      'buyuksehir',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Turecko 2 ženy',
      'buyuksehir',
      1.02::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 339: sliedrecht
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      596::numeric,
      'win'::public.tip_status,
      'sliedrecht',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup',
      'sliedrecht',
      1.02::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 340: gacko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      596::numeric,
      'win'::public.tip_status,
      'gacko',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bosna ženy',
      'gacko',
      1.05::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 341: maritza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      596::numeric,
      'win'::public.tip_status,
      'maritza',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'liga majstrov ženy',
      'maritza',
      1.02::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 342: Budejovice
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      822::numeric,
      'win'::public.tip_status,
      'Budejovice',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'cev muži',
      'Budejovice',
      1.02::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 343: fer
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      822::numeric,
      'win'::public.tip_status,
      'fer',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kosovo ženy',
      'fer',
      1.03::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 344: kocaeli
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      822::numeric,
      'win'::public.tip_status,
      'kocaeli',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Turecko 2 ženy',
      'kocaeli',
      1.012::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 345: alianza Lima
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'alianza Lima',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru ženy',
      'alianza Lima',
      1.03::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 346: naresuan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      740::numeric,
      'win'::public.tip_status,
      'naresuan',
      '2025-11-12'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko ženy',
      'naresuan',
      1.015::numeric(5,3),
      '2025-11-12'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 347: holte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      1400::numeric,
      'win'::public.tip_status,
      'holte',
      '2025-11-13'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'holte',
      1.03::numeric(5,3),
      '2025-11-13'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 348: moraca
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1400::numeric,
      'win'::public.tip_status,
      'moraca',
      '2025-11-13'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora ženy pohár',
      'moraca',
      1.015::numeric(5,3),
      '2025-11-13'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 349: buducnost
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1400::numeric,
      'win'::public.tip_status,
      'buducnost',
      '2025-11-13'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora ženy pohár',
      'buducnost',
      1.025::numeric(5,3),
      '2025-11-13'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 350: nogueira
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'nogueira',
      '2025-11-13'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'nogueira',
      1.015::numeric(5,3),
      '2025-11-13'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 351: bakken
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'bakken',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Dánsko muži',
      'bakken',
      1.01::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 352: HIFK
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'HIFK',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Fínsko muži',
      'HIFK',
      1.02::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 353: zeleznicar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'zeleznicar',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Srbsko ženy',
      'zeleznicar',
      1.01::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 354: cheng/sun
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'cheng/sun',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'Írsko štvorhra ženy',
      'cheng/sun',
      1.01::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 355: perusic/schweiner
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'perusic/schweiner',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'plážový volejbal',
      'muži',
      'perusic/schweiner',
      1.02::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 356: perusic/schweiner
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'perusic/schweiner',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'plážový volejbal',
      'muži',
      'perusic/schweiner',
      1.02::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 357: aarhus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'aarhus',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'aarhus',
      1.04::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 358: creighton
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      624::numeric,
      'win'::public.tip_status,
      'creighton',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'creighton',
      1.02::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 359: regatas
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      624::numeric,
      'win'::public.tip_status,
      'regatas',
      '2025-11-14'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru muži',
      'regatas',
      1.015::numeric(5,3),
      '2025-11-14'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 360: Stuttgart
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Stuttgart',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nemecko ženy',
      'Stuttgart',
      1.01::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 361: dresdner
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'dresdner',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nemecko ženy',
      'dresdner',
      1.02::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 362: Gruzínsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Gruzínsko',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'rugby',
      'medzištátne',
      'Gruzínsko',
      1.01::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 363: Stuttgart
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'Stuttgart',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nemecko ženy',
      'Stuttgart',
      1.01::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 364: aich/dob
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'aich/dob',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko muži',
      'aich/dob',
      1.04::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 365: orebro
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'orebro',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko ženy',
      'orebro',
      1.02::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 366: hylte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'hylte',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko muži',
      'hylte',
      1.04::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 367: brda
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'brda',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko ženy pohár',
      'brda',
      1.04::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 368: gisagara
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'gisagara',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'rwanda muži',
      'gisagara',
      1.015::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 369: Santa Cruz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      390::numeric,
      'win'::public.tip_status,
      'Santa Cruz',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 ženy',
      'Santa Cruz',
      1.04::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 370: dudingen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      390::numeric,
      'win'::public.tip_status,
      'dudingen',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švajčiarsko ženy',
      'dudingen',
      1.025::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 371: atenea
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      390::numeric,
      'win'::public.tip_status,
      'atenea',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru ženy',
      'atenea',
      1.03::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 372: fokerots/plavins
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'fokerots/plavins',
      '2025-11-15'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'plážový volejbal',
      'muži',
      'fokerots/plavins',
      1.01::numeric(5,3),
      '2025-11-15'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 373: sokol post
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      820::numeric,
      'win'::public.tip_status,
      'sokol post',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'sokol post',
      1.025::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 374: dubrovnik
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      820::numeric,
      'win'::public.tip_status,
      'dubrovnik',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko ženy pohár',
      'dubrovnik',
      1.01::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 375: kastela
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      820::numeric,
      'win'::public.tip_status,
      'kastela',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko ženy pohár',
      'kastela',
      1.01::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 376: leixoes
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      820::numeric,
      'win'::public.tip_status,
      'leixoes',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'leixoes',
      1.01::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 377: fc Porto
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'fc Porto',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'fc Porto',
      1.03::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 378: sporting
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'sporting',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'sporting',
      1.025::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 379: Santa Cruz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      410::numeric,
      'win'::public.tip_status,
      'Santa Cruz',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 ženy',
      'Santa Cruz',
      1.04::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 380: prairie view
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      560::numeric,
      'win'::public.tip_status,
      'prairie view',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'prairie view',
      1.025::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 381: rajapruk
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1460::numeric,
      'win'::public.tip_status,
      'rajapruk',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko ženy',
      'rajapruk',
      1.015::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 382: kanchanaburi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'kanchanaburi',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko muži',
      'kanchanaburi',
      1.025::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 383: rmut
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'rmut',
      '2025-11-16'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Thajsko muži',
      'rmut',
      1.025::numeric(5,3),
      '2025-11-16'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 384: Pafos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'Pafos',
      '2025-11-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup muži',
      'Pafos',
      1.03::numeric(5,3),
      '2025-11-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 385: dasmarinas
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'dasmarinas',
      '2025-11-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny mpva ženy',
      'dasmarinas',
      1.04::numeric(5,3),
      '2025-11-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 386: miroshnicenko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.14::numeric(5,3),
      660::numeric,
      'win'::public.tip_status,
      'miroshnicenko',
      '2025-11-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'ženy utr Malibu',
      'miroshnicenko',
      1.14::numeric(5,3),
      '2025-11-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 387: Apollon
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      669::numeric,
      'win'::public.tip_status,
      'Apollon',
      '2025-11-17'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Grécko 3.div. ženy',
      'Apollon',
      1.02::numeric(5,3),
      '2025-11-17'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 388: flensburg
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'flensburg',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'európska liga muži',
      'flensburg',
      1.01::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 389: Belgicko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Belgicko',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'kvali ms',
      'Belgicko',
      1.01::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 390: ftc
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'ftc',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'vodné pólo',
      'liga majstrov',
      'ftc',
      1.01::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 391: mate asher
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      630::numeric,
      'win'::public.tip_status,
      'mate asher',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael muži',
      'mate asher',
      1.01::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 392: Pafos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      630::numeric,
      'win'::public.tip_status,
      'Pafos',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup muži',
      'Pafos',
      1.02::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 393: kuanysh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1190::numeric,
      'win'::public.tip_status,
      'kuanysh',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'kuanysh',
      1.012::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 394: berel
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1190::numeric,
      'win'::public.tip_status,
      'berel',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'berel',
      1.02::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 395: vasus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1190::numeric,
      'win'::public.tip_status,
      'vasus',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko pohár ženy',
      'vasus',
      1.012::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 396: branik
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1190::numeric,
      'win'::public.tip_status,
      'branik',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko ženy',
      'branik',
      1.025::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 397: vasus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'vasus',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko pohár ženy',
      'vasus',
      1.012::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 398: kuanysh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'kuanysh',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'kuanysh',
      1.012::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 399: ongbanrungpham
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'ongbanrungpham',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'ženy',
      'ongbanrungpham',
      1.01::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 400: an se young
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'an se young',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'ženy',
      'an se young',
      1.01::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 401: mayasari/pratiwi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'mayasari/pratiwi',
      '2025-11-18'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'ženy štvorhra',
      'mayasari/pratiwi',
      1.01::numeric(5,3),
      '2025-11-18'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 402: nymburk
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'nymburk',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Česko muži',
      'nymburk',
      1.02::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 403: Porto volei
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      720::numeric,
      'win'::public.tip_status,
      'Porto volei',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko U21 ženy',
      'Porto volei',
      1.015::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 404: bellona
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      720::numeric,
      'win'::public.tip_status,
      'bellona',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Litva ženy',
      'bellona',
      1.01::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 405: benfica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      720::numeric,
      'win'::public.tip_status,
      'benfica',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup muži',
      'benfica',
      1.02::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 406: vasus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      720::numeric,
      'win'::public.tip_status,
      'vasus',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko pohár ženy',
      'vasus',
      1.012::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 407: Porto volei
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Porto volei',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko U21 ženy',
      'Porto volei',
      1.015::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 408: turan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      690::numeric,
      'win'::public.tip_status,
      'turan',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'turan',
      1.02::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 409: alianza Lima
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      690::numeric,
      'win'::public.tip_status,
      'alianza Lima',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru ženy',
      'alianza Lima',
      1.015::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 410: intanon
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'intanon',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'ženy Austrália',
      'intanon',
      1.01::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 411: Chou tien
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'Chou tien',
      '2025-11-19'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'muži',
      'Chou tien',
      1.01::numeric(5,3),
      '2025-11-19'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 412: sorvagur
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'sorvagur',
      '2025-11-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'faroe muži',
      'sorvagur',
      1.025::numeric(5,3),
      '2025-11-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 413: ktu kaunas
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      380::numeric,
      'win'::public.tip_status,
      'ktu kaunas',
      '2025-11-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Litva ženy',
      'ktu kaunas',
      1.04::numeric(5,3),
      '2025-11-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 414: knrc
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      380::numeric,
      'win'::public.tip_status,
      'knrc',
      '2025-11-20'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko pohár ženy',
      'knrc',
      1.012::numeric(5,3),
      '2025-11-20'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 415: mokawloon
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      306::numeric,
      'win'::public.tip_status,
      'mokawloon',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Egypt ženy',
      'mokawloon',
      1.05::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 416: zamalek
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      306::numeric,
      'win'::public.tip_status,
      'zamalek',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Egypt ženy',
      'zamalek',
      1.03::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 417: al masafee
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      306::numeric,
      'win'::public.tip_status,
      'al masafee',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'iraq muži',
      'al masafee',
      1.03::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 418: pafiakos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      306::numeric,
      'win'::public.tip_status,
      'pafiakos',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Cyprus muži',
      'pafiakos',
      1.015::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 419: pafiakos
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      930::numeric,
      'win'::public.tip_status,
      'pafiakos',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Cyprus muži',
      'pafiakos',
      1.015::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 420: Ružomberok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'Ružomberok',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'Ružomberok',
      1.01::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 421: y.a. Košice
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'y.a. Košice',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'y.a. Košice',
      1.02::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 422: savouge
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'savouge',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny muži',
      'savouge',
      1.012::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 423: smu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'smu',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'smu',
      1.025::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 424: zhetysu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'zhetysu',
      '2025-11-21'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'zhetysu',
      1.012::numeric(5,3),
      '2025-11-21'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 425: Ružomberok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'Ružomberok',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'Ružomberok',
      1.01::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 426: Slavia
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'Slavia',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK ženy',
      'Slavia',
      1.01::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 427: Žilina-Bystrica 2
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1030::numeric,
      'win'::public.tip_status,
      'Žilina-Bystrica 2',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK juniorská liga',
      'Žilina-Bystrica 2',
      1.02::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 428: zhetysu
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1030::numeric,
      'win'::public.tip_status,
      'zhetysu',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Kazachstan ženy',
      'zhetysu',
      1.012::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 429: haok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1030::numeric,
      'win'::public.tip_status,
      'haok',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko muži',
      'haok',
      1.01::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 430: radnicki
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'radnicki',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Srbsko ženy',
      'radnicki',
      1.01::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 431: Slovan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'Slovan',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK ženy',
      'Slovan',
      1.025::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 432: slávia
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'slávia',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK ženy',
      'slávia',
      1.01::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 433: Alba blaj
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'Alba blaj',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rumunsko ženy',
      'Alba blaj',
      1.012::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 434: vilacondense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      820::numeric,
      'win'::public.tip_status,
      'vilacondense',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 ženy',
      'vilacondense',
      1.012::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 435: vilacondense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'vilacondense',
      '2025-11-22'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 muži',
      'vilacondense',
      1.04::numeric(5,3),
      '2025-11-22'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 436: kielce
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'kielce',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko muži',
      'kielce',
      1.03::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 437: Graz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1020::numeric,
      'win'::public.tip_status,
      'Graz',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'Graz',
      1.015::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 438: Porto
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1020::numeric,
      'win'::public.tip_status,
      'Porto',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'Porto',
      1.015::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 439: benfica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1020::numeric,
      'win'::public.tip_status,
      'benfica',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'benfica',
      1.012::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 440: linkopings
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1020::numeric,
      'win'::public.tip_status,
      'linkopings',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko ženy',
      'linkopings',
      1.025::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 441: Graz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      590::numeric,
      'win'::public.tip_status,
      'Graz',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'Graz',
      1.015::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 442: benfica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      590::numeric,
      'win'::public.tip_status,
      'benfica',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'benfica',
      1.012::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 443: mjolnir
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      350::numeric,
      'win'::public.tip_status,
      'mjolnir',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'faerske ženy',
      'mjolnir',
      1.04::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 444: fleyr
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      350::numeric,
      'win'::public.tip_status,
      'fleyr',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'faerske muži',
      'fleyr',
      1.04::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 445: Orkelljunga
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      350::numeric,
      'win'::public.tip_status,
      'Orkelljunga',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko muži',
      'Orkelljunga',
      1.03::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 446: Santa Cruz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'Santa Cruz',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 ženy',
      'Santa Cruz',
      1.015::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 447: vilacondense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      420::numeric,
      'win'::public.tip_status,
      'vilacondense',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 ženy',
      'vilacondense',
      1.015::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 448: universitario
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      420::numeric,
      'win'::public.tip_status,
      'universitario',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru ženy',
      'universitario',
      1.02::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 449: Pittsburgh
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      420::numeric,
      'win'::public.tip_status,
      'Pittsburgh',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'Pittsburgh',
      1.03::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 450: vilacondense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'vilacondense',
      '2025-11-23'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 ženy',
      'vilacondense',
      1.015::numeric(5,3),
      '2025-11-23'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 451: papagou
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'papagou',
      '2025-11-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Grécko 3.div. ženy',
      'papagou',
      1.02::numeric(5,3),
      '2025-11-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 452: ust golden
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'ust golden',
      '2025-11-24'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny muži',
      'ust golden',
      1.015::numeric(5,3),
      '2025-11-24'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 453: lin/Wang
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'lin/Wang',
      '2025-11-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'India ženy štvorhra',
      'lin/Wang',
      1.01::numeric(5,3),
      '2025-11-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 454: al rayan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      480::numeric,
      'win'::public.tip_status,
      'al rayan',
      '2025-11-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'qatar muži',
      'al rayan',
      1.025::numeric(5,3),
      '2025-11-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 455: national tsing hua
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      660::numeric,
      'win'::public.tip_status,
      'national tsing hua',
      '2025-11-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'taipei ženy',
      'national tsing hua',
      1.012::numeric(5,3),
      '2025-11-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 456: regatas
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      660::numeric,
      'win'::public.tip_status,
      'regatas',
      '2025-11-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'peru muži',
      'regatas',
      1.012::numeric(5,3),
      '2025-11-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 457: ferdinansyah/wardana
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'ferdinansyah/wardana',
      '2025-11-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'India mix',
      'ferdinansyah/wardana',
      1.01::numeric(5,3),
      '2025-11-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 458: armada
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'armada',
      '2025-11-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'armada',
      1.015::numeric(5,3),
      '2025-11-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 459: kharisma
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'kharisma',
      '2025-11-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'kharisma',
      1.025::numeric(5,3),
      '2025-11-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 460: armada
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'armada',
      '2025-11-25'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'zápasy zen',
      'armada',
      1.015::numeric(5,3),
      '2025-11-25'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 461: niyregihaza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      710::numeric,
      'win'::public.tip_status,
      'niyregihaza',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup ženy',
      'niyregihaza',
      1.012::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 462: kaposvar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      710::numeric,
      'win'::public.tip_status,
      'kaposvar',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko pohár muži',
      'kaposvar',
      1.01::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 463: bonardi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      710::numeric,
      'win'::public.tip_status,
      'bonardi',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'utr Buenos Aires ženy',
      'bonardi',
      1.01::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 464: taborda
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      710::numeric,
      'win'::public.tip_status,
      'taborda',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'tenis',
      'utr Buenos Aires ženy',
      'taborda',
      1.012::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 465: szegedi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      320::numeric,
      'win'::public.tip_status,
      'szegedi',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko muži',
      'szegedi',
      1.04::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 466: Stuttgart
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      320::numeric,
      'win'::public.tip_status,
      'Stuttgart',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Nemecko pohár ženy',
      'Stuttgart',
      1.01::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 467: haok mladost
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      320::numeric,
      'win'::public.tip_status,
      'haok mladost',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'cev ženy',
      'haok mladost',
      1.03::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 468: paok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'paok',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Grécko muži',
      'paok',
      1.01::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 469: cignal
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1020::numeric,
      'win'::public.tip_status,
      'cignal',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny spikers muži',
      'cignal',
      1.025::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 470: Taiwan normal university
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1020::numeric,
      'win'::public.tip_status,
      'Taiwan normal university',
      '2025-11-26'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'taipei ženy',
      'Taiwan normal university',
      1.012::numeric(5,3),
      '2025-11-26'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 471: keltern
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'keltern',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'euro cup ženy',
      'keltern',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 472: montpelier
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'montpelier',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'euro cup ženy',
      'montpelier',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 473: Nórsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'Nórsko',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'ms ženy',
      'Nórsko',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 474: andersen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'andersen',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh ženy',
      'andersen',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 475: Coelho
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'Coelho',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh muži',
      'Coelho',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 476: cheng/sun
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'cheng/sun',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh ženy štvorhra',
      'cheng/sun',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 477: curtin/Kelly
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'curtin/Kelly',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh ženy štvorhra',
      'curtin/Kelly',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 478: begga/jacob
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'begga/jacob',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh mix',
      'begga/jacob',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 479: montpelier
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'montpelier',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'euro cup ženy',
      'montpelier',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 480: keltern
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'keltern',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'euro cup ženy',
      'keltern',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 481: Nórsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'Nórsko',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'ms ženy',
      'Nórsko',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 482: andersen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'andersen',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh ženy',
      'andersen',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 483: curtin/Kelly
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'curtin/Kelly',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh ženy štvorhra',
      'curtin/Kelly',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 484: begga/jacob
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'begga/jacob',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh mix',
      'begga/jacob',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 485: montpelier
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'montpelier',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'euro cup ženy',
      'montpelier',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 486: curtin/Kelly
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'curtin/Kelly',
      '2025-11-27'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh ženy štvorhra',
      'curtin/Kelly',
      1.01::numeric(5,3),
      '2025-11-27'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 487: Nemecko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1300::numeric,
      'win'::public.tip_status,
      'Nemecko',
      '2025-11-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'ms ženy',
      'Nemecko',
      1.01::numeric(5,3),
      '2025-11-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 488: Nemecko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Nemecko',
      '2025-11-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'ms ženy',
      'Nemecko',
      1.01::numeric(5,3),
      '2025-11-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 489: Jacob/vallet
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Jacob/vallet',
      '2025-11-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'badminton',
      'welsh ženy štvorhra',
      'Jacob/vallet',
      1.01::numeric(5,3),
      '2025-11-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 490: jar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'jar',
      '2025-11-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'rugby',
      'medzištátny',
      'jar',
      1.01::numeric(5,3),
      '2025-11-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 491: Singapur
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Singapur',
      '2025-11-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futbal',
      'medzištátny ženy',
      'Singapur',
      1.01::numeric(5,3),
      '2025-11-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 492: maccabi tel aviv
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'maccabi tel aviv',
      '2025-11-28'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael muži',
      'maccabi tel aviv',
      1.03::numeric(5,3),
      '2025-11-28'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 493: aich dob
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      1010::numeric,
      'win'::public.tip_status,
      'aich dob',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko muži',
      'aich dob',
      1.03::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 494: Linz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1010::numeric,
      'win'::public.tip_status,
      'Linz',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'Linz',
      1.02::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 495: hylte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1010::numeric,
      'win'::public.tip_status,
      'hylte',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko muži',
      'hylte',
      1.02::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 496: orebro
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1010::numeric,
      'win'::public.tip_status,
      'orebro',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko ženy',
      'orebro',
      1.02::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 497: trofaiach
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'trofaiach',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'trofaiach',
      1.04::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 498: Graz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'Graz',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'Graz',
      1.03::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 499: holte
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'holte',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'holte',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 500: haok mladost 2
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'haok mladost 2',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko 1 ženy',
      'haok mladost 2',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 501: Venezuela
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      500::numeric,
      'win'::public.tip_status,
      'Venezuela',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'international U21 muži',
      'Venezuela',
      1.025::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 502: jar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'jar',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'rugby',
      'medzištátny',
      'jar',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 503: vakifbank
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'vakifbank',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Turecko ženy vvsl',
      'vakifbank',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 504: Francúzsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'Francúzsko',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'ms ženy',
      'Francúzsko',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 505: kielce
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'kielce',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko muži',
      'kielce',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 506: y.a.kosice
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'y.a.kosice',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'SVK ženy',
      'y.a.kosice',
      1.02::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 507: kielce
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'kielce',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'Poľsko muži',
      'kielce',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 508: anorthosis
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'anorthosis',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Cyprus ženy',
      'anorthosis',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 509: viana
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'viana',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 muži',
      'viana',
      1.015::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 510: arizona
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1050::numeric,
      'win'::public.tip_status,
      'arizona',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'arizona',
      1.025::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 511: Poľsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Poľsko',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'ms ženy',
      'Poľsko',
      1.01::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 512: Scorpions
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'Scorpions',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny ženy wncaa',
      'Scorpions',
      1.02::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 513: nebraska
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'nebraska',
      '2025-11-29'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'nebraska',
      1.012::numeric(5,3),
      '2025-11-29'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 514: vli
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1440::numeric,
      'win'::public.tip_status,
      'vli',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko 1 ženy',
      'vli',
      1.012::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 515: sporting
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1440::numeric,
      'win'::public.tip_status,
      'sporting',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'sporting',
      1.01::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 516: timisoara
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      640::numeric,
      'win'::public.tip_status,
      'timisoara',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rumunsko 2 muži',
      'timisoara',
      1.012::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 517: Flyers
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      640::numeric,
      'win'::public.tip_status,
      'Flyers',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Malta ženy',
      'Flyers',
      1.01::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 518: marienses
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      640::numeric,
      'win'::public.tip_status,
      'marienses',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 muži',
      'marienses',
      1.01::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 519: praiense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      640::numeric,
      'win'::public.tip_status,
      'praiense',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 ženy',
      'praiense',
      1.05::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 520: tallina
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      296::numeric,
      'win'::public.tip_status,
      'tallina',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Estónsko muži',
      'tallina',
      1.015::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 521: sporting
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      296::numeric,
      'win'::public.tip_status,
      'sporting',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'sporting',
      1.01::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 522: asv aarhus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      296::numeric,
      'win'::public.tip_status,
      'asv aarhus',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko muži',
      'asv aarhus',
      1.05::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 523: Nitra
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      296::numeric,
      'win'::public.tip_status,
      'Nitra',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK ženy',
      'Nitra',
      1.03::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 524: Filipíny
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Filipíny',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'kvalifikácia ms oceania asia muži',
      'Filipíny',
      1.01::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 525: Venezia
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Venezia',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'basketbal',
      'Taliansko ženy',
      'Venezia',
      1.01::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 526: asal
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'asal',
      '2025-11-30'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'muži',
      'asal',
      1.02::numeric(5,3),
      '2025-11-30'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 527: Nórsko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'Nórsko',
      '2025-12-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'ms ženy',
      'Nórsko',
      1.02::numeric(5,3),
      '2025-12-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 528: dasmarinas
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'dasmarinas',
      '2025-12-01'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Filipíny mpva ženy',
      'dasmarinas',
      1.04::numeric(5,3),
      '2025-12-01'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 529: orfi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.1::numeric(5,3),
      800::numeric,
      'win'::public.tip_status,
      'orfi',
      '2025-12-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'squash',
      'ženy',
      'orfi',
      1.1::numeric(5,3),
      '2025-12-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 530: Brazília
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      200::numeric,
      'win'::public.tip_status,
      'Brazília',
      '2025-12-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'futsal',
      'ms ženy',
      'Brazília',
      1.04::numeric(5,3),
      '2025-12-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 531: mate asher
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      540::numeric,
      'win'::public.tip_status,
      'mate asher',
      '2025-12-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael muži',
      'mate asher',
      1.01::numeric(5,3),
      '2025-12-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 532: niyregihaza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      540::numeric,
      'win'::public.tip_status,
      'niyregihaza',
      '2025-12-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Challenge cup ženy',
      'niyregihaza',
      1.025::numeric(5,3),
      '2025-12-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 533: cbr
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'cbr',
      '2025-12-02'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'uruguay ženy',
      'cbr',
      1.04::numeric(5,3),
      '2025-12-02'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 534: chieri
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'chieri',
      '2025-12-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'cev cup ženy',
      'chieri',
      1.01::numeric(5,3),
      '2025-12-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 535: al rayyan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'al rayyan',
      '2025-12-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Katar muži',
      'al rayyan',
      1.03::numeric(5,3),
      '2025-12-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 536: Brezovica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Brezovica',
      '2025-12-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Slovinsko 1b muži',
      'Brezovica',
      1.025::numeric(5,3),
      '2025-12-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 537: neuchatel
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'neuchatel',
      '2025-12-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'cev cup ženy',
      'neuchatel',
      1.01::numeric(5,3),
      '2025-12-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 538: kakanj
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'kakanj',
      '2025-12-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bosna muži',
      'kakanj',
      1.05::numeric(5,3),
      '2025-12-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 539: rabotnicki
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'rabotnicki',
      '2025-12-03'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Macedónsko muži',
      'rabotnicki',
      1.05::numeric(5,3),
      '2025-12-03'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 540: Krishnamurty/pratheek
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      600::numeric,
      'win'::public.tip_status,
      'Krishnamurty/pratheek',
      '2025-12-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'Badminton',
      'muži štvorhra',
      'Krishnamurty/pratheek',
      1.01::numeric(5,3),
      '2025-12-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 541: dag
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      400::numeric,
      'win'::public.tip_status,
      'dag',
      '2025-12-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko muži',
      'dag',
      1.015::numeric(5,3),
      '2025-12-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 542: maritza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1000::numeric,
      'win'::public.tip_status,
      'maritza',
      '2025-12-04'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bulharsko ženy',
      'maritza',
      1.02::numeric(5,3),
      '2025-12-04'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 543: gacko
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      1230::numeric,
      'win'::public.tip_status,
      'gacko',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bosna ženy',
      'gacko',
      1.03::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 544: podgorica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1230::numeric,
      'win'::public.tip_status,
      'podgorica',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora muži',
      'podgorica',
      1.01::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 545: Budva
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1230::numeric,
      'win'::public.tip_status,
      'Budva',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora muži',
      'Budva',
      1.01::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 546: napredak
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      1230::numeric,
      'win'::public.tip_status,
      'napredak',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bosna muži',
      'napredak',
      1.04::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 547: napredak
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      604::numeric,
      'win'::public.tip_status,
      'napredak',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bosna muži',
      'napredak',
      1.04::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 548: maritza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      604::numeric,
      'win'::public.tip_status,
      'maritza',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Bulharsko ženy',
      'maritza',
      1.015::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 549: podgorica
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      604::numeric,
      'win'::public.tip_status,
      'podgorica',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora muži',
      'podgorica',
      1.01::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 550: Budva
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      604::numeric,
      'win'::public.tip_status,
      'Budva',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora muži',
      'Budva',
      1.01::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 551: kaposvar
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      604::numeric,
      'win'::public.tip_status,
      'kaposvar',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko muži',
      'kaposvar',
      1.01::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 552: stanford
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      604::numeric,
      'win'::public.tip_status,
      'stanford',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'stanford',
      1.02::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 553: lousville
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.015::numeric(5,3),
      520::numeric,
      'win'::public.tip_status,
      'lousville',
      '2025-12-05'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'ncaa ženy',
      'lousville',
      1.015::numeric(5,3),
      '2025-12-05'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 554: Graz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'Graz',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rakúsko ženy',
      'Graz',
      1.02::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 555: moraca
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'moraca',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora ženy',
      'moraca',
      1.01::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 556: engelholm
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'engelholm',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švédsko ženy',
      'engelholm',
      1.012::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 557: mjolnir
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.012::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'mjolnir',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'faerske muži',
      'mjolnir',
      1.012::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 558: marupes
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'marupes',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Lotyšsko ženy',
      'marupes',
      1.05::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 559: al rayyan
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'al rayyan',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Katar muži',
      'al rayyan',
      1.025::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 560: haok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'haok',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko ženy pohár',
      'haok',
      1.05::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 561: pfefingen
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'pfefingen',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Švajčiarsko ženy',
      'pfefingen',
      1.03::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 562: police
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'police',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'rwanda ženy',
      'police',
      1.01::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 563: praiense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'praiense',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko 2 ženy',
      'praiense',
      1.01::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 564: praiense
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'praiense',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko A2 ženy',
      'praiense',
      1.01::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 565: kastela
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.05::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'kastela',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko ženy pohár',
      'kastela',
      1.05::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 566: galati
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'galati',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Rumunsko A2 ženy',
      'galati',
      1.04::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 567: ashdod
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.062::numeric(5,3),
      300::numeric,
      'win'::public.tip_status,
      'ashdod',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Izrael ženy',
      'ashdod',
      1.062::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 568: Prešov
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      1600::numeric,
      'win'::public.tip_status,
      'Prešov',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hádzaná',
      'SVK muži',
      'Prešov',
      1.01::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 569: Katovice
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Nike';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      260::numeric,
      'win'::public.tip_status,
      'Katovice',
      '2025-12-06'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'hokej',
      'Poľsko muži',
      'Katovice',
      1.03::numeric(5,3),
      '2025-12-06'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 570: nordeskov
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      330::numeric,
      'win'::public.tip_status,
      'nordeskov',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko muži',
      'nordeskov',
      1.04::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 571: fredriksberg
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.03::numeric(5,3),
      330::numeric,
      'win'::public.tip_status,
      'fredriksberg',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko 1 muži',
      'fredriksberg',
      1.03::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 572: asv aarhus
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.01::numeric(5,3),
      330::numeric,
      'win'::public.tip_status,
      'asv aarhus',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Dánsko ženy',
      'asv aarhus',
      1.01::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 573: haok
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      330::numeric,
      'win'::public.tip_status,
      'haok',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Chorvátsko pohár muži',
      'haok',
      1.025::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 574: Žilina
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'Žilina',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'SVK ženy',
      'Žilina',
      1.025::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 575: mjolnir
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.005::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'mjolnir',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'faerske ženy',
      'mjolnir',
      1.005::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 576: braga
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.005::numeric(5,3),
      1200::numeric,
      'win'::public.tip_status,
      'braga',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko ženy',
      'braga',
      1.005::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 577: jedinstvo
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'jedinstvo',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'čierna hora muži',
      'jedinstvo',
      1.025::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 578: Columbia
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'Columbia',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'international U19 ženy',
      'Columbia',
      1.04::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 579: swieqi
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.04::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'swieqi',
      '2025-12-07'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Malta ženy',
      'swieqi',
      1.04::numeric(5,3),
      '2025-12-07'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 580: Nyíregyháza
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.02::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'Nyíregyháza',
      '2025-12-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Maďarsko ženy',
      'Nyíregyháza',
      1.02::numeric(5,3),
      '2025-12-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  -- Row 581: esmoriz
  SELECT id INTO company_id FROM public.betting_companies WHERE name = 'Bet365';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      1.025::numeric(5,3),
      620::numeric,
      'win'::public.tip_status,
      'esmoriz',
      '2025-12-08'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      'volejbal',
      'Portugalsko pohár muži',
      'esmoriz',
      1.025::numeric(5,3),
      '2025-12-08'::timestamptz,
      'win'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;

  RAISE NOTICE 'Inserted % betting tips', tip_count;
END $$;

-- Verification query
SELECT 
  COUNT(*) as total_tips,
  COUNT(DISTINCT betting_company_id) as companies_used,
  SUM(stake) as total_stake
FROM public.betting_tips
WHERE created_at >= '2025-09-01'::timestamptz;
