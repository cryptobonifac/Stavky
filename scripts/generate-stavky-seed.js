const fs = require('fs');
const path = require('path');

// Read stavky.txt file
const stavkyPath = path.join(__dirname, '..', 'data', 'stavky.txt');
const stavkyContent = fs.readFileSync(stavkyPath, 'utf-8');
const lines = stavkyContent.trim().split('\n');

// Only process lines 1-18 (tab-separated format)
const dataLines = lines.slice(0, 18);

// Parse date from DD.MM. format (assume current year 2025)
function parseDate(dateStr) {
  const trimmed = dateStr.trim().replace(/\.$/, ''); // Remove trailing dot
  const [day, month] = trimmed.split('.');
  // PostgreSQL format: YYYY-MM-DD
  return `2025-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Convert odds from comma format (1,12) to numeric (1.12)
function parseOdds(oddsStr) {
  return oddsStr.trim().replace(',', '.');
}

// Escape SQL strings
function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

// Generate SQL
let sql = `-- Seed production database with betting tips from stavky.txt
-- Generated from: data/stavky.txt
-- Total records: ${dataLines.length}
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
`;

// Process each line
dataLines.forEach((line, index) => {
  // Split by tab character
  const parts = line.split('\t');
  
  if (parts.length < 7) {
    console.warn(`Skipping line ${index + 1}: insufficient columns (${parts.length})`);
    return;
  }
  
  const [dateStr, sportLeague, match, oddsStr, company, stakeStr, totalWinStr] = parts;
  
  if (!dateStr || !sportLeague || !match || !oddsStr || !company || !stakeStr || !totalWinStr) {
    console.warn(`Skipping line ${index + 1}: missing required fields`);
    return;
  }
  
  const matchDate = parseDate(dateStr.trim());
  const odds = parseOdds(oddsStr.trim());
  const stake = stakeStr.trim();
  const totalWin = totalWinStr.trim();
  
  // Split sport-league (e.g., "Futsal-Cesko" -> sport: "Futsal", league: "Cesko")
  const sportLeagueParts = sportLeague.trim().split('-');
  const sport = sportLeagueParts[0] || '';
  const league = sportLeagueParts.slice(1).join('-') || ''; // Join remaining parts in case league has dashes
  
  const companyName = company.trim().toLowerCase();
  const matchText = match.trim();
  
  // Determine status: if total_win > 0, status is 'win', otherwise 'loss'
  const totalWinNum = parseFloat(totalWin.replace(',', '.'));
  const status = totalWinNum > 0 ? 'win' : 'loss';
  
  sql += `
  -- Row ${index + 1}: ${escapeSql(matchText)}
  SELECT id INTO company_id FROM public.betting_companies WHERE LOWER(name) = '${escapeSql(companyName)}';
  
  IF company_id IS NULL THEN
    RAISE EXCEPTION 'Company not found: %', '${escapeSql(companyName)}';
  END IF;
  
  match_date_val := '${matchDate}'::timestamptz;
  sport_val := '${escapeSql(sport)}';
  league_val := '${escapeSql(league)}';
  match_val := '${escapeSql(matchText)}';
  odds_val := ${odds}::numeric(5,3);
  stake_val := ${stake}::numeric;
  total_win_val := ${totalWin.replace(',', '.')}::numeric;
  status_val := '${status}'::public.tip_status;
  
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
`;
});

sql += `
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

// Write to seed-production.sql
const outputPath = path.join(__dirname, 'seed-production.sql');
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log(`✅ Generated ${outputPath} with ${dataLines.length} records`);

