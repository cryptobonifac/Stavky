/**
 * Generate betting tips seed data from WhatsApp chat
 * This script parses the chat file and generates SQL INSERT statements
 */

const fs = require('fs');
const path = require('path');

// Sport mapping (Slovak/Czech → English)
const SPORT_MAP = {
  'volejbal': 'Volleyball',
  'hádzaná': 'Handball',
  'tenis': 'Tennis',
  'basketbal': 'Basketball',
  'futbal': 'Soccer',
  'hokej': 'Ice Hockey',
  'ragby': 'Rugby',
  'badminton': 'Badminton',
  'squash': 'Squash',
  'vodné pólo': 'Water Polo',
  'vodné pólo rwp': 'Water Polo',
  'florbal': 'Floorball',
  'futsal': 'Futsal',
  'plážový volejbal': 'Beach Volleyball',
  'atletika': 'Athletics',
  'softbal': 'Softball',
  'politika': 'Politics'
};

// Company mapping
const COMPANY_MAP = {
  'bet365': 'Bet365',
  'nike': 'Nike',
  'tipsport': 'Tipsport',
  'fortuna': 'Fortuna'
};

function parseDate(dateStr) {
  // Format: "DD. MM. YYYY, HH:MM"
  const match = dateStr.match(/(\d+)\.\s*(\d+)\.\s*(\d{4}),\s*(\d+):(\d+)/);
  if (!match) return null;
  
  const [, day, month, year, hour, minute] = match;
  return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`);
}

function extractOdds(text) {
  // Find odds in format 1,01 or 1.01
  const oddsPattern = /(\d+)[,.](\d{2,3})\b/g;
  const matches = [];
  let match;
  
  while ((match = oddsPattern.exec(text)) !== null) {
    const odds = parseFloat(`${match[1]}.${match[2]}`);
    if (odds >= 1.001 && odds <= 2.0) {
      matches.push(odds);
    }
  }
  
  return matches;
}

function extractSport(text) {
  const lower = text.toLowerCase();
  for (const [sk, en] of Object.entries(SPORT_MAP)) {
    if (lower.includes(sk)) {
      return en;
    }
  }
  return null;
}

function extractCompany(text) {
  const lower = text.toLowerCase();
  for (const [key, company] of Object.entries(COMPANY_MAP)) {
    if (lower.includes(key)) {
      return company;
    }
  }
  return null;
}

function extractLeague(text, sport) {
  // Common league patterns
  const patterns = [
    { pattern: /brasil\s+paulista/i, name: 'Brasil Paulista' },
    { pattern: /ncaa/i, name: 'NCAA ženy' },
    { pattern: /svk\s+extraliga/i, name: 'SVK extraliga muži' },
    { pattern: /svk\s+ženy/i, name: 'SVK ženy' },
    { pattern: /svk\s+muži/i, name: 'SVK muži' },
    { pattern: /mol\s+liga/i, name: 'MOL liga' },
    { pattern: /thajsko\s+ženy/i, name: 'Thajsko ženy' },
    { pattern: /thajsko\s+muži/i, name: 'Thajsko muži' },
    { pattern: /poľsko\s+muži/i, name: 'Poľsko muži' },
    { pattern: /poľsko\s+ženy/i, name: 'Poľsko ženy' },
    { pattern: /dánsko\s+ženy/i, name: 'Dánsko ženy' },
    { pattern: /dánsko\s+muži/i, name: 'Dánsko muži' },
    { pattern: /liga\s+majstrov/i, name: 'Liga majstrov ženy' },
    { pattern: /challenge\s+cup/i, name: 'Challenge Cup ženy' },
    { pattern: /wta/i, name: 'WTA' },
    { pattern: /atp/i, name: 'ATP' },
    { pattern: /utr/i, name: 'UTR' },
    { pattern: /itf/i, name: 'ITF' },
    { pattern: /davis\s+cup/i, name: 'Davis Cup' },
    { pattern: /kvali\s+ms/i, name: 'Kvalifikácia MS' },
    { pattern: /kvali\s+me/i, name: 'Kvalifikácia ME' },
    { pattern: /super\s+league/i, name: 'Super League' },
    { pattern: /super\s+globe/i, name: 'Super Globe muži' },
  ];
  
  for (const { pattern, name } of patterns) {
    if (pattern.test(text)) {
      return name;
    }
  }
  
  // Try to extract country + gender
  const countryMatch = text.match(/(\w+)\s+(muži|ženy)/i);
  if (countryMatch) {
    return `${countryMatch[1]} ${countryMatch[2]}`;
  }
  
  return 'General';
}

function extractMatch(text) {
  // Remove company, sport, league, odds, and "za X" patterns
  let match = text
    .replace(/(bet365|nike|tipsport|fortuna)/gi, '')
    .replace(/(volejbal|hádzaná|tenis|basketbal|futbal|hokej|ragby|badminton|squash|vodné pólo|florbal|futsal|plážový volejbal|atletika|softbal|politika)/gi, '')
    .replace(/za\s+\d+/gi, '')
    .replace(/\d+[,.]\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (!match || match.length < 3) {
    return 'Match details';
  }
  
  return match.substring(0, 200);
}

function parseChatFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const tips = [];
  const messagePattern = /^(\d+\.\s*\d+\.\s*\d{4},\s*\d+:\d+)\s+-\s+Igor\s+Stavky:\s+(.+)$/;
  
  for (const line of lines) {
    const match = line.match(messagePattern);
    if (!match) continue;
    
    const [, dateStr, message] = match;
    
    // Skip non-betting messages
    if (!extractCompany(message)) continue;
    
    const company = extractCompany(message);
    const sport = extractSport(message);
    if (!company || !sport) continue;
    
    const oddsList = extractOdds(message);
    if (oddsList.length === 0) continue;
    
    const matchDate = parseDate(dateStr);
    if (!matchDate) continue;
    
    const league = extractLeague(message, sport);
    const matchText = extractMatch(message);
    
    // Create a tip for each odds found
    for (const odds of oddsList) {
      tips.push({
        company,
        sport,
        league,
        match: matchText,
        odds,
        matchDate: matchDate.toISOString()
      });
    }
  }
  
  return tips;
}

function generateSQL(tips) {
  const sql = [];
  
  sql.push('-- Betting Tips from WhatsApp Chat');
  sql.push('do $$');
  sql.push('declare');
  sql.push('  bet365_id uuid;');
  sql.push('  nike_id uuid;');
  sql.push('  tipsport_id uuid;');
  sql.push('  fortuna_id uuid;');
  
  // Add sport variables
  const sports = [...new Set(tips.map(t => t.sport))];
  for (const sport of sports) {
    const varName = sport.toLowerCase().replace(/\s+/g, '_') + '_id';
    sql.push(`  ${varName} uuid;`);
  }
  
  sql.push('begin');
  sql.push('  -- Get betting company IDs');
  sql.push("  select id into bet365_id from public.betting_companies where name = 'Bet365';");
  sql.push("  select id into nike_id from public.betting_companies where name = 'Nike';");
  sql.push("  select id into tipsport_id from public.betting_companies where name = 'Tipsport';");
  sql.push("  select id into fortuna_id from public.betting_companies where name = 'Fortuna';");
  sql.push('');
  sql.push('  -- Get sport IDs');
  for (const sport of sports) {
    const varName = sport.toLowerCase().replace(/\s+/g, '_') + '_id';
    sql.push(`  select id into ${varName} from public.sports where name = '${sport}';`);
  }
  sql.push('');
  sql.push('  -- Insert betting tips');
  
  for (const tip of tips) {
    const companyVar = tip.company.toLowerCase() + '_id';
    const sportVar = tip.sport.toLowerCase().replace(/\s+/g, '_') + '_id';
    const leagueName = tip.league.replace(/'/g, "''");
    const matchText = tip.match.replace(/'/g, "''");
    const odds = tip.odds.toFixed(3);
    const matchDate = tip.matchDate;
    
    sql.push(`  insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)`);
    sql.push(`  select ${companyVar}, ${sportVar}, l.id, '${matchText}', ${odds}, '${matchDate}'::timestamptz, 'pending'`);
    sql.push(`  from public.leagues l`);
    sql.push(`  where l.sport_id = ${sportVar} and lower(l.name) = lower('${leagueName}')`);
    sql.push(`  limit 1;`);
    sql.push('');
  }
  
  sql.push('  raise notice \'Inserted % betting tips\', (select count(*) from public.betting_tips);');
  sql.push('end $$;');
  
  return sql.join('\n');
}

// Main execution
const chatFile = path.join(__dirname, '..', 'data', 'WhatsApp chat s používateľom Igor Stavky.txt');
const outputFile = path.join(__dirname, '..', 'supabase', 'tips_seed.sql');

try {
  console.log('Parsing chat file...');
  const tips = parseChatFile(chatFile);
  console.log(`Found ${tips.length} betting tips`);
  
  console.log('Generating SQL...');
  const sql = generateSQL(tips);
  
  fs.writeFileSync(outputFile, sql, 'utf-8');
  console.log(`SQL written to ${outputFile}`);
  
  // Also log statistics
  const companies = [...new Set(tips.map(t => t.company))];
  const sports = [...new Set(tips.map(t => t.sport))];
  console.log(`\nStatistics:`);
  console.log(`  Companies: ${companies.join(', ')}`);
  console.log(`  Sports: ${sports.join(', ')}`);
  console.log(`  Total tips: ${tips.length}`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

