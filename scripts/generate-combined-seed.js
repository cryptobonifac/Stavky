const fs = require('fs');
const path = require('path');

// Read both data files
const novemberPath = path.join(__dirname, '../data/november.txt');
const decemberPath = path.join(__dirname, '../data/december.txt');

const novemberData = fs.readFileSync(novemberPath, 'utf-8');
const decemberData = fs.readFileSync(decemberPath, 'utf-8');

// Parse lines (skip header)
const novemberLines = novemberData.trim().split('\n').slice(1).filter(l => l.trim());
const decemberLines = decemberData.trim().split('\n').slice(1).filter(l => l.trim());

const allLines = [
  ...novemberLines.map(l => ({ line: l, source: 'november' })),
  ...decemberLines.map(l => ({ line: l, source: 'december' }))
];

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

allLines.forEach(({ line, source }, index) => {
  if (!line.trim()) return;
  
  // Pre-process line to fix common issues
  let processedLine = line;
  
  // Fix "Tenis,UTR" -> "Tenis, UTR" (missing space after comma)
  processedLine = processedLine.replace(/([a-zA-Z]),([A-Z])/g, '$1, $2');
  
  // Fix "27.11, Tenis ITF Hradec..." (missing comma after Tenis)
  processedLine = processedLine.replace(/^(\d+\.\d+),\s*(\w+)\s+([A-Z])/, '$1, $2, $3');
  
  // Fix completely malformed line: "27.11, Tenis ITF Hradec Recek/Siniakov - Blazka/Homola 1 1,04 bet365 400 416"
  if (line.includes('Tenis ITF Hradec') || processedLine.includes('Tenis ITF Hradec')) {
    processedLine = '27.11, Tenis, ITF Hradec, Recek/Siniakov - Blazka/Homola, 1, 1.04, bet365, 400, 416';
  }
  
  // Fix "21.11, Futsal, Plzeň - Brno 1 1,1 Tipsport 200 220"
  if (processedLine.includes('Plzeň - Brno 1 1,1')) {
    processedLine = '21.11, Futsal, , Plzeň - Brno, 1, 1.1, Tipsport, 200, 220';
  }
  
  // Fix lines with result embedded in match
  if (processedLine.includes('SR R. Šramková')) {
    processedLine = '4.11, Tenis, W75 Trnava, SR R. Šramková - A. L. Nita, 1, 1.25, Nike, 100, 125';
  }
  
  // Fix "Bedard-Frey 2" -> "Bedard-Frey, 2"
  processedLine = processedLine.replace(/([A-Za-z\s-]+)\s+([12X])\s*,\s*(\d+[,.]\d+)/g, '$1, $2, $3');
  
  // Fix "Al Ahly-Sporting 1" -> "Al Ahly-Sporting, 1"
  processedLine = processedLine.replace(/([A-Za-z\s-]+)\s+([12X])\s*,\s*(\d+[,.]\d+)/g, '$1, $2, $3');
  
  // Fix "Pecotic-Das, 1	1.03" -> "Pecotic-Das, 1, 1.03" (missing comma/tab between result and odds)
  processedLine = processedLine.replace(/([A-Za-z\s-]+),\s*([12X])\s+(\d+[,.]\d+)/g, '$1, $2, $3');
  processedLine = processedLine.replace(/([A-Za-z\s-]+),\s*([12X])\t+(\d+[,.]\d+)/g, '$1, $2, $3');
  
  // Fix "Sinner - DeMinaur, 1.08" -> "Sinner - DeMinaur, 1, 1.08" (missing result before odds)
  // But only if the pattern looks like match, odds (no result)
  processedLine = processedLine.replace(/([A-Za-z\s-]+),\s*(\d+[,.]\d+)\s*,\s*(bet365|tipsport|nike)/gi, (match, p1, p2, p3) => {
    // Check if p2 looks like odds (1.xx format)
    if (/^1\.\d+$/.test(p2)) {
      // Insert default result "1" before odds
      return `${p1}, 1, ${p2}, ${p3}`;
    }
    return match;
  });
  
  processedLine = processedLine.replace(/([^,]+?)\s+([12X])\s+(\d+[,.]\d+)\s+(\w+)(,)/g, '$1, $2, $3, $4$5');
  
  // Fix missing commas in numbers at end
  processedLine = processedLine.replace(/(\d+)\s+(\d+)(\s*)$/, '$1, $2$3');
  
  // Split by comma, but also handle tabs in values
  let parts = processedLine.split(',').map(p => p.trim().replace(/\t+/g, ' '));
  
  // Fix cases where result and odds are in the same field (e.g., "1	1.03" or "1 1.03")
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // Check if field contains result followed by odds (e.g., "1 1.03" or "2 1.05")
    const match = part.match(/^([12X])\s+(\d+[,.]\d+)$/);
    if (match) {
      parts[i] = match[1]; // Result
      parts.splice(i + 1, 0, match[2]); // Insert odds
      break;
    }
  }
  
  // Handle special cases for stake/win
  if (parts.length === 8 && parts[7].includes(' ') && !parts[7].includes(',')) {
    const lastParts = parts[7].split(/\s+/).filter(p => /^\d+/.test(p));
    if (lastParts.length >= 2) {
      parts[7] = lastParts[0];
      parts[8] = lastParts[1];
    }
  }
  
  // Find result field (1, 2, or X) - check for standalone or with other text
  let resultIdx = -1;
  let resultValue = null;
  
  for (let i = 0; i < parts.length; i++) {
    const trimmed = parts[i].trim();
    // Check if it's exactly 1, 2, or X
    if (trimmed === '1' || trimmed === '2' || trimmed === 'X') {
      resultIdx = i;
      resultValue = trimmed;
      break;
    }
    // Check if it starts with 1, 2, or X followed by space or end
    const match = trimmed.match(/^([12X])(\s|$)/);
    if (match) {
      resultIdx = i;
      resultValue = match[1];
      parts[i] = match[1];
      break;
    }
  }
  
  // If result not found, check if it's embedded in match field
  if (resultIdx === -1) {
    for (let i = 2; i < Math.min(parts.length - 3, 6); i++) {
      const trimmed = parts[i].trim();
      const match = trimmed.match(/\s+([12X])\s+/);
      if (match) {
        const beforeResult = trimmed.substring(0, match.index);
        const afterResult = trimmed.substring(match.index + match[0].length);
        parts[i] = beforeResult.trim();
        parts.splice(i + 1, 0, match[1]);
        resultIdx = i + 1;
        resultValue = match[1];
        if (afterResult.trim()) {
          parts[i + 2] = (parts[i + 2] || '') + ' ' + afterResult.trim();
        }
        break;
      }
    }
  }
  
  // If still not found, result is missing - set to null
  if (resultIdx === -1) {
    // Look for odds-like pattern to determine where result should be
    for (let i = 3; i < Math.min(parts.length - 2, 6); i++) {
      if (/^1\.\d+$/.test(parts[i])) {
        const nextField = parts[i + 1] || '';
        if (nextField.toLowerCase().match(/^(bet365|tipsport|nike)$/)) {
          // Result is missing - we'll set it to NULL
          resultIdx = -1; // Keep as -1 to indicate missing
          break;
        }
      }
    }
  }
  
  // Parse fields
  const date = parts[0];
  const sport = parts[1];
  const result = resultValue; // Can be null
  
  // Find odds, company, stake, win by looking for patterns
  let odds = '';
  let company = '';
  let stake = '';
  let win = '';
  
  if (resultIdx >= 0) {
    // Result found - fields should be in order: result, odds, company, stake, win
    odds = parts[resultIdx + 1] || '';
    company = parts[resultIdx + 2] || '';
    stake = parts[resultIdx + 3] || '';
    win = parts[resultIdx + 4] || '';
  } else {
    // Result not found - need to find odds (looks like 1.xx), then company, stake, win
    for (let i = 3; i < parts.length; i++) {
      const part = parts[i];
      // Check if it's odds (1.xx format)
      if (/^1\.\d+$/.test(part) && !odds) {
        odds = part;
        company = parts[i + 1] || '';
        stake = parts[i + 2] || '';
        win = parts[i + 3] || '';
        break;
      }
      // Check if it's a company name
      if (part.toLowerCase().match(/^(bet365|tipsport|nike)$/) && !company) {
        company = part;
        stake = parts[i + 1] || '';
        win = parts[i + 2] || '';
        // Look backwards for odds
        for (let j = i - 1; j >= 2; j--) {
          if (/^1\.\d+$/.test(parts[j])) {
            odds = parts[j];
            break;
          }
        }
        break;
      }
    }
  }
  
  // League and Match are between Sport and Result (or where result would be)
  const searchEnd = resultIdx >= 0 ? resultIdx : (parts.length - 4);
  const middleParts = parts.slice(2, searchEnd);
  
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
  
  // Clean up match
  match = match.replace(/\s+\d+\s+\d+[.,]\d+\s+\w+$/, '').trim();
  
  // Validate essential fields (result is optional)
  if (!date || !sport || !odds || !company) {
    console.warn(`Line ${index + 1} (${source}): Missing essential fields`);
    return;
  }
  
  const matchDate = parseDate(date);
  if (!matchDate) {
    console.warn(`Line ${index + 1} (${source}): Invalid date: ${date}`);
    return;
  }
  
  const normalizedCompany = company.toLowerCase();
  const oddsValue = parseNumeric(odds);
  if (!oddsValue || isNaN(oddsValue)) {
    console.warn(`Line ${index + 1} (${source}): Invalid odds: ${odds}`);
    return;
  }
  
  const stakeValue = parseNumeric(stake);
  if (!stakeValue || isNaN(stakeValue)) {
    console.warn(`Line ${index + 1} (${source}): Invalid stake: ${stake}`);
    return;
  }
  
  const winValue = parseNumeric(win) || 0;
  const status = winValue > 0 ? 'win' : 'loss';
  const totalWin = status === 'win' ? winValue : 0;
  
  // Generate SQL - handle NULL result
  if (result && (result === '1' || result === '2' || result === 'X')) {
    // Result exists
    sqlStatements.push(`
  -- Row ${index + 1} (${source}): ${escapeSql(match)}
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
  } else {
    // Result is NULL
    sqlStatements.push(`
  -- Row ${index + 1} (${source}): ${escapeSql(match)} [No result]
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = '${normalizedCompany}';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', '${normalizedCompany}';
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
      AND result_id IS NULL
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
      NULL,
      odds_val,
      match_date_val,
      stake_val,
      total_win_val,
      status_val
    );
    
    tip_count := tip_count + 1;
  END IF;`);
  }
});

const sql = `-- Seed production database with betting tips from november.txt and december.txt
-- Generated from: data/november.txt, data/december.txt
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
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE result_id IS NULL) as tips_without_result
FROM public.betting_tip;
`;

const outputPath = path.join(__dirname, '../supabase/seed.sql');
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log(`✅ Generated ${outputPath} with ${sqlStatements.length} records from november.txt and december.txt`);

