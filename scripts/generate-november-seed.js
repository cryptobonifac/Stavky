const fs = require('fs');
const path = require('path');

// Manual data parsing from november.txt
// Format: Date, Sport, League, Match, Result, Odds, Betting company, stake, win
const rawData = `1.11, Tenis,UTR Newport, Gasanova A. - Boyer L., 1, 1.04, bet365, 300, 312
4.11,  Tenis, W75, Trnava, SR R. Šramková - A. L. Nita 1 1.25 Nike, 100, 125
5.11,  hadzana, mol liga, Most - Michalovce, 1, 1.6, Nike, 100, 160
6.11,  Tenis,W35 Pune, India P. Honova - M. Ozeki, 1, 1.08, bet365, 300, 324
7.11,  Tenis, W50 Helsinki, Fínsko Z. Vancouverová - L. Laboutkova, 1, 1.15, bet365, 200, 230
9.11,  hadzana, mol liga, Poruba - Slavia, 2, 1.21, Nike, 100, 121
10.11, Tenis, Challenger Knoxville, USA A. Walton - T. Zink, 1, 1.28, bet365, 100, 128
11.11, Tenis, Masters Alcaraz - Fritz, 1, 1.21, Tipsport, 100, 121 
12.11, Tenis, ITF Sharm, el Sheik Biryukov - Kaufman, 1, 1.04 ,bet365, 300, 312
12.11, Tenis, Masters Sinner - Zverev, 1, 1.11, bet365, 200, 222
13.11, Tenis, ITF Azul, Ambrogi - Dreer, 1, 1.04, bet365, 300, 312
13.11, Futbal, Moldavsko - Taliansko, 2, 1.1, Tipsport, 100, 110
14.11, Tenis, UTR Boca, Sahnis - Jackson, 2, 1.083, bet365, 300, 324
14.11, Beachvolleyball, Capogroso/Capogroso - Mondlane/Mungoi, 1, 1.05, Tipsport, 600 630
14.11, Hokej, Sanok - Jastrzbie, 2, 1.03, Nike, 400, 412
14.11, Futsal, Plzen - Usti, 1, 1.12, Tipsport, 200 224
15.11, Tenis, Masters, Sinner - DeMinaur, 1.08, Tipsport, 200,216
15.11, Hadzana, Metz - DVSC, 1.05, Tipsport, 200, 210
15.11, Futsal, Vyskov - Chrudim, 2, 1.1, Tipsport, 200, 220
15.11, Futbal, Dansko - Bielorusko, 1, 1.08, Nike, 200, 216
16.11, Tenis, Masters ,Sinner - Alcaraz, 1, 1.6 ,Nike, 100, 160
17.11, Tenis, ITF Trnava, Havlickova - Kovacicova, 1, 1.03, bet365, 400,412
18.11, Tenis, ITF Austin, Choi - Grumet, 2, 1.08, bet365, 200, 216
19.11, Tenis, Davis cup, Taliansko - Rakúsko, 1, 1.083, bet365, 200, 216
19.11, Basketbal, USK,  KP Brno 1.polčas, 1, 1.05, bet365, 400, 420
19.11, Volejbal, CEV, Strumica - Budejovice, 2, 1.11, bet365, 200, 222
21.11, Tenis, UTR Ithaca, Kilmer - Fernandes, 2, 1.04, bet365, 300, 312
21.11, Hokej, Torun - Sanok, 1, 1.03, Nike, 400, 412
21.11, Futsal, Plzeň - Brno 1 1,1 Tipsport 200 220
23.11, Tenis, Ateny, Schinas - Casanova, 2, 1.03, bet365, 400, 412
23.11, Hadzana, Legionowo - Kielce, 2, 1.03, Nike, 800 824
23.11, Volejbal, Orkelljunga - Hasthagen, 1, 1.04, bet365, 800, 832
25.11, Tenis, WTA Buenos Aires, Vazqez - Dolehide, 2, 1.04, bet365, 400, 416
25.11, Tenis, Olyinikova - Nahimana, 1, 1.04, bet365, 400, 416
25.11, Volejbal, Al, rayyan -  shamal, 1, 1.04, bet365, 500, 520
26.11, Volejbal, CEV, Janta - Mladost, 2, 1.03, bet365, 600, 618
27.11, Tenis ITF Hradec Recek/Siniakov - Blazka/Homola 1 1,04 bet365 400 416
29.11, Volejbal, Rakusko ,Aich - Bisamberg, 1, 1.03, bet365, 600, 618
30.11, Tenis, UTR Oxford ,Pires - Whitwell, 1, 1.04 ,bet365, 400, 416
30.11, Volejbal, Aarhus - Amager, 1, 1.05, bet365, 600, 630`;

const lines = rawData.trim().split('\n');

const sqlStatements = [];

// Helper functions
function parseDate(dateStr) {
  const [day, month] = dateStr.trim().split('.');
  return `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

function parseNumeric(str) {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/,/g, '.').replace(/\s+/g, ''));
}

lines.forEach((line, index) => {
  if (!line.trim()) return;
  
  // Pre-process line to fix common issues
  // Fix "Tenis,UTR" -> "Tenis, UTR" (missing space after comma)
  let processedLine = line.replace(/([a-zA-Z]),([A-Z])/g, '$1, $2');
  
  // Fix "27.11, Tenis ITF Hradec..." (missing comma after Tenis)
  processedLine = processedLine.replace(/^(\d+\.\d+),\s*(\w+)\s+([A-Z])/, '$1, $2, $3');
  
  // Fix completely malformed line: "27.11, Tenis ITF Hradec Recek/Siniakov - Blazka/Homola 1 1,04 bet365 400 416"
  // This has no commas except the first one - manually fix it
  if (line.includes('Tenis ITF Hradec') || processedLine.includes('Tenis ITF Hradec')) {
    processedLine = '27.11, Tenis, ITF Hradec, Recek/Siniakov - Blazka/Homola, 1, 1.04, bet365, 400, 416';
  }
  
  // Fix "21.11, Futsal, Plzeň - Brno 1 1,1 Tipsport 200 220" - missing commas
  if (processedLine.includes('Plzeň - Brno 1 1,1')) {
    processedLine = '21.11, Futsal, , Plzeň - Brno, 1, 1.1, Tipsport, 200, 220';
  }
  
  // Fix lines with result embedded in match (e.g., "SR R. Šramková - A. L. Nita 1 1.25 Nike")
  // Pattern: match text, then " 1 " or " 2 " or " X ", then odds, then company
  // But only if it's not already separated by comma
  if (processedLine.includes('SR R. Šramková')) {
    processedLine = '4.11, Tenis, W75 Trnava, SR R. Šramková - A. L. Nita, 1, 1.25, Nike, 100, 125';
  }
  
  processedLine = processedLine.replace(/([^,]+?)\s+([12X])\s+(\d+[,.]\d+)\s+(\w+)(,)/g, '$1, $2, $3, $4$5');
  
  // Fix missing commas in numbers at end (e.g., "200 224" -> "200, 224")
  processedLine = processedLine.replace(/(\d+)\s+(\d+)(\s*)$/, '$1, $2$3');
  
  // Fix "1.08" where result is missing (should be "result, 1.08")
  // If we see a pattern like ", 1.08," or ", 1.05," after match, it might be missing result
  // But we'll handle this in the parsing logic below
  
  // Split by comma
  let parts = processedLine.split(',').map(p => p.trim());
  
  // Handle special cases
  // Line with "600 630" -> split stake and win
  if (parts.length === 8 && parts[7].includes(' ') && !parts[7].includes(',')) {
    const lastParts = parts[7].split(/\s+/).filter(p => /^\d+/.test(p));
    if (lastParts.length >= 2) {
      parts[7] = lastParts[0];
      parts[8] = lastParts[1];
    }
  }
  
  // Find result field (1, 2, or X) - check for standalone or with other text
  let resultIdx = -1;
  for (let i = 0; i < parts.length; i++) {
    const trimmed = parts[i].trim();
    // Check if it's exactly 1, 2, or X
    if (trimmed === '1' || trimmed === '2' || trimmed === 'X') {
      resultIdx = i;
      break;
    }
    // Check if it starts with 1, 2, or X followed by space or end
    const match = trimmed.match(/^([12X])(\s|$)/);
    if (match) {
      resultIdx = i;
      parts[i] = match[1]; // Replace with just the result
      break;
    }
  }
  
  // If result not found, check if it's embedded in match field
  if (resultIdx === -1) {
    // Look for pattern like "match 1 1.25" or "match 1" in middle parts
    for (let i = 2; i < Math.min(parts.length - 3, 6); i++) {
      const trimmed = parts[i].trim();
      // Check if field contains " 1 " or " 2 " or " X " followed by number
      const match = trimmed.match(/\s+([12X])\s+/);
      if (match) {
        // Insert result as new field
        const beforeResult = trimmed.substring(0, match.index);
        const afterResult = trimmed.substring(match.index + match[0].length);
        parts[i] = beforeResult.trim();
        parts.splice(i + 1, 0, match[1]); // Insert result
        resultIdx = i + 1;
        // Update the part after result if it was merged
        if (afterResult.trim()) {
          parts[i + 2] = (parts[i + 2] || '') + ' ' + afterResult.trim();
        }
        break;
      }
    }
  }
  
  // If still not found and we have a pattern like ", 1.08," assume result is missing
  // and odds is in wrong position
  if (resultIdx === -1) {
    // Look for odds-like pattern (1.xx) in position where result should be
    for (let i = 3; i < Math.min(parts.length - 2, 6); i++) {
      if (/^1\.\d+$/.test(parts[i])) {
        // This might be odds where result should be
        // Check if next field also looks like odds or is company
        const nextField = parts[i + 1] || '';
        if (nextField.toLowerCase().match(/^(bet365|tipsport|nike)$/)) {
          // Missing result, insert default (try to infer from context or use 1)
          parts.splice(i, 0, '1'); // Default to 1 if we can't determine
          resultIdx = i;
          break;
        }
      }
    }
  }
  
  if (resultIdx === -1) {
    console.warn(`Line ${index + 1}: Could not find result in: ${line.substring(0, 80)}`);
    return;
  }
  
  // Parse fields
  const date = parts[0];
  const sport = parts[1];
  const result = parts[resultIdx];
  const odds = parts[resultIdx + 1] || '';
  const company = parts[resultIdx + 2] || '';
  const stake = parts[resultIdx + 3] || '';
  const win = parts[resultIdx + 4] || '';
  
  // League and Match are between Sport and Result
  const middleParts = parts.slice(2, resultIdx);
  
  // Find match (usually contains " - ")
  let matchIdx = -1;
  for (let i = 0; i < middleParts.length; i++) {
    if (middleParts[i].includes(' - ') || middleParts[i].includes('/')) {
      matchIdx = i;
      break;
    }
  }
  
  let league, match;
  if (matchIdx >= 0) {
    league = middleParts.slice(0, matchIdx).join(' ');
    match = middleParts.slice(matchIdx).join(' ');
  } else {
    league = middleParts.slice(0, -1).join(' ') || '';
    match = middleParts[middleParts.length - 1] || '';
  }
  
  // Clean up match (remove extra data like "1 1.25 Nike")
  match = match.replace(/\s+\d+\s+\d+[.,]\d+\s+\w+$/, '').trim();
  
  // Validate essential fields
  if (!date || !sport || !result || !odds || !company) {
    console.warn(`Line ${index + 1}: Missing essential fields`);
    return;
  }
  
  const matchDate = parseDate(date);
  if (!matchDate) {
    console.warn(`Line ${index + 1}: Invalid date: ${date}`);
    return;
  }
  
  const normalizedCompany = company.toLowerCase();
  const oddsValue = parseNumeric(odds);
  if (!oddsValue || isNaN(oddsValue)) {
    console.warn(`Line ${index + 1}: Invalid odds: ${odds}`);
    return;
  }
  
  const stakeValue = parseNumeric(stake);
  if (!stakeValue || isNaN(stakeValue)) {
    console.warn(`Line ${index + 1}: Invalid stake: ${stake}`);
    return;
  }
  
  const winValue = parseNumeric(win) || 0;
  const status = winValue > 0 ? 'win' : 'loss';
  const totalWin = status === 'win' ? winValue : 0;
  
  sqlStatements.push(`
  -- Row ${index + 1}: ${escapeSql(match)}
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = '${normalizedCompany}';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', '${normalizedCompany}';
  END IF;
  
  SELECT id INTO result_id_var FROM public.results WHERE LOWER(name) = LOWER('${escapeSql(result.trim())}');
  
  IF result_id_var IS NULL THEN
    RAISE EXCEPTION 'Result not found: %', '${escapeSql(result.trim())}';
  END IF;
  
  match_date_val := '${matchDate}'::timestamptz;
  sport_val := '${escapeSql(sport.trim())}';
  league_val := '${escapeSql(league.trim())}';
  match_val := '${escapeSql(match.trim())}';
  odds_val := ${oddsValue}::numeric(5,3);
  stake_val := ${stakeValue}::numeric;
  total_win_val := ${totalWin}::numeric;
  status_val := '${status}'::public.tip_status;
  
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
  END IF;`);
});

const sql = `-- Seed production database with betting tips from november.txt
-- Generated from: data/november.txt
-- Total records: ${sqlStatements.length}

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
${sqlStatements.join('\n')}

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
`;

const outputPath = path.join(__dirname, '../supabase/seed.sql');
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log(`✅ Generated ${outputPath} with ${sqlStatements.length} records`);





