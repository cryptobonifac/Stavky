const fs = require('fs');
const path = require('path');

// Read CSV file
const csvPath = path.join(process.env.USERPROFILE, 'Downloads', 'betting_tips.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');

// Skip header
const dataLines = lines.slice(1);

// Parse date from DD.M.YYYY format
function parseDate(dateStr) {
  const [day, month, year] = dateStr.trim().split('.');
  // PostgreSQL format: YYYY-MM-DD
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Escape SQL strings
function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

// Generate SQL
let sql = `-- Seed production database with betting tips from CSV
-- Generated from: betting_tips.csv
-- Total records: ${dataLines.length}
-- Date: ${new Date().toISOString()}

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
`;

// Process each CSV row
dataLines.forEach((line, index) => {
  const parts = line.split(',');
  if (parts.length < 7) return; // Skip invalid rows
  
  const date = parts[0]?.trim();
  const betting_company = parts[1]?.trim();
  const sport = parts[2]?.trim();
  const league = parts[3]?.trim();
  const team = parts[4]?.trim();
  const odds = parts[5]?.trim();
  const amount = parts[6]?.trim();
  
  if (!date || !betting_company || !sport || !league || !team || !odds || !amount) {
    return; // Skip invalid rows
  }
  
  const matchDate = parseDate(date);
  const companyName = escapeSql(betting_company);
  const sportName = escapeSql(sport);
  const leagueName = escapeSql(league);
  const teamName = escapeSql(team);
  const oddsValue = parseFloat(odds);
  const stakeValue = parseFloat(amount);
  
  if (isNaN(oddsValue) || isNaN(stakeValue)) {
    return; // Skip rows with invalid numbers
  }
  
  sql += `
  -- Row ${index + 1}: ${teamName}
  SELECT id INTO company_id FROM public.betting_companies WHERE name = '${companyName}';
  
  IF company_id IS NOT NULL THEN
    INSERT INTO public.betting_tips (
      betting_company_id,
      odds,
      stake,
      status,
      description,
      created_at
    ) VALUES (
      company_id,
      ${oddsValue}::numeric(5,3),
      ${stakeValue}::numeric,
      'pending'::public.tip_status,
      '${teamName}',
      '${matchDate}'::timestamptz
    ) RETURNING id INTO tip_id;
    
    INSERT INTO public.betting_tip_items (
      betting_tip_id,
      sport,
      league,
      match,
      odds,
      match_date,
      status
    ) VALUES (
      tip_id,
      '${sportName}',
      '${leagueName}',
      '${teamName}',
      ${oddsValue}::numeric(5,3),
      '${matchDate}'::timestamptz,
      'pending'::public.tip_status
    );
    
    tip_count := tip_count + 1;
  END IF;
`;
});

sql += `
  RAISE NOTICE 'Inserted % betting tips', tip_count;
END $$;

-- Verification query
SELECT 
  COUNT(*) as total_tips,
  COUNT(DISTINCT betting_company_id) as companies_used,
  SUM(stake) as total_stake
FROM public.betting_tips
WHERE created_at >= '2025-09-01'::timestamptz;
`;

// Write to seed-production.sql
const outputPath = path.join(__dirname, 'seed-production.sql');
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log(`✅ Generated ${outputPath}`);
console.log(`   Total records: ${dataLines.length}`);
console.log(`   File size: ${(sql.length / 1024).toFixed(2)} KB`);









