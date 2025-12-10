const fs = require('fs');
const path = require('path');

// Read the chat file - find it dynamically
const dataDir = path.join(__dirname, '../data');
let chatContent = null;
let foundPath = null;

try {
  // List files in data directory
  const files = fs.readdirSync(dataDir);
  const chatFile = files.find(f => f.toLowerCase().includes('whatsapp') && f.toLowerCase().includes('igor'));
  
  if (chatFile) {
    foundPath = path.join(dataDir, chatFile);
    chatContent = fs.readFileSync(foundPath, 'utf-8');
    console.log(`Found chat file: ${chatFile}`);
  }
} catch (e) {
  console.error('Error reading data directory:', e.message);
}

if (!chatContent) {
  console.error('Could not find chat file in data directory');
  console.error(`Data directory: ${dataDir}`);
  try {
    const files = fs.readdirSync(dataDir);
    console.error('Files in data directory:', files);
  } catch (e) {
    console.error('Could not list data directory');
  }
  process.exit(1);
}

// Sport name mapping (from chat to database Slovak names)
const sportMapping = {
  'futbal': 'Futbal',
  'tenis': 'Tenis',
  'basketbal': 'Basketbal',
  'hokej': 'Hokej',
  'volejbal': 'Volejbal',
  'hádzaná': 'Hádzaná',
  'ragby': 'Ragby',
  'badminton': 'Badminton',
  'squash': 'Squash',
  'vodné pólo': 'Vodné pólo',
  'florbal': 'Florbal',
  'futsal': 'Futsal',
  'plážový volejbal': 'Plážový volejbal',
  'atletika': 'Atletika',
  'softbal': 'Softbal',
  'politika': 'Politika',
  'padel': 'Padel'
};

// Betting companies
const companies = ['Bet365', 'Nike', 'Tipsport', 'Fortuna'];

// Parse tips from chat
const tips = [];
const lines = chatContent.split('\n');

let currentDate = null;
let currentTime = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Parse date/time line: "10. 9. 2025, 10:23 - Igor Stavky: message"
  const dateMatch = line.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4}),\s*(\d{1,2}):(\d{2})\s*-\s*Igor Stavky:\s*(.*)$/);
  if (dateMatch) {
    const [, day, month, year, hour, minute, message] = dateMatch;
    currentDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    currentTime = `${hour.padStart(2, '0')}:${minute}`;
    
    if (message && message.trim()) {
      parseTipMessage(message.trim(), currentDate, currentTime, tips);
    }
    continue;
  }
}

function parseTipMessage(message, date, time, tipsArray) {
  // Skip non-tip messages
  if (!message || 
      message.includes('<Médiá') || 
      message.includes('http') || 
      message.length < 10 ||
      message.toLowerCase().includes('podas') ||
      message.toLowerCase().includes('koľko') ||
      message.toLowerCase().includes('ok') ||
      message.toLowerCase().includes('ideš') ||
      message.toLowerCase().includes('príď') ||
      message.toLowerCase().includes('daj cash') ||
      message.toLowerCase().includes('vyhodnotili') ||
      message.toLowerCase().includes('vyhra') ||
      message.toLowerCase().includes('prehra') ||
      message.match(/^\d+$/) || // Just a number (bet amount confirmation)
      message.includes('@') ||
      message.includes('github') ||
      message.includes('excel') ||
      message.includes('stavky.xlsx')) {
    return;
  }
  
  // Find betting company
  let company = null;
  let companyIndex = -1;
  for (const comp of companies) {
    const index = message.toLowerCase().indexOf(comp.toLowerCase());
    if (index !== -1) {
      company = comp;
      companyIndex = index;
      break;
    }
  }
  
  if (!company) return;
  
  // Remove company name and "za [amount]" from message
  let tipText = message.substring(companyIndex + company.length).trim();
  
  // Remove "za [number]" at the end
  tipText = tipText.replace(/\s+za\s+\d+.*$/i, '').trim();
  
  // Find sport
  let sport = null;
  let sportName = null;
  let sportIndex = -1;
  for (const [key, value] of Object.entries(sportMapping)) {
    const index = tipText.toLowerCase().indexOf(key);
    if (index !== -1 && (sportIndex === -1 || index < sportIndex)) {
      sport = value;
      sportName = key;
      sportIndex = index;
    }
  }
  
  if (!sport) return;
  
  // Remove sport name
  tipText = tipText.substring(sportIndex + sportName.length).trim();
  
  // Extract odds - pattern: number with comma or dot: 1,01 or 1.01 or 1,015
  const oddsPattern = /\b(\d+[,\.]\d{2,3})\b/g;
  const oddsMatches = [...tipText.matchAll(oddsPattern)];
  
  if (oddsMatches.length === 0) return;
  
  // Process each odds found (can have multiple tips in one message)
  for (const oddsMatch of oddsMatches) {
    const oddsStr = oddsMatch[0].replace(',', '.');
    const odds = parseFloat(oddsStr);
    
    if (isNaN(odds) || odds < 1.001 || odds > 2.0) continue;
    
    // Find the position of this odds in the text
    const oddsIndex = tipText.indexOf(oddsMatch[0]);
    
    // Get text before this odds (contains league and match)
    const beforeOdds = tipText.substring(0, oddsIndex).trim();
    
    // Extract league and match from beforeOdds
    // Pattern is usually: "league match" or "league team" or just "team"
    const words = beforeOdds.split(/\s+/).filter(w => w && w.length > 1);
    
    if (words.length === 0) continue;
    
    // Try to identify league (common league names)
    let league = null;
    let matchStartIndex = 0;
    
    // Common league patterns (longer first)
    const leaguePatterns = [
      /brasil paulista u21 ženy/i,
      /brasil paulista u19 ženy/i,
      /brasil paulista u19 muži/i,
      /brasil paulista u19/i,
      /brasil paulista/i,
      /brasil rdj u19 muži/i,
      /brasil rdj u19/i,
      /thajsko pro league muži/i,
      /thajsko ženy/i,
      /thajsko muži/i,
      /ncaa 2 ženy/i,
      /ncaa 2 žaby/i,
      /ncaa ženy/i,
      /ncaa muži/i,
      /svk extraliga muži/i,
      /svk juniorská liga/i,
      /svk ženy/i,
      /svk muži/i,
      /poľsko muži/i,
      /poľsko ženy/i,
      /dánsko 1\.div\. ženy/i,
      /dánsko 1\.divizia ženy/i,
      /dánsko 1 muži/i,
      /dánsko 1 ženy/i,
      /dánsko ženy/i,
      /dánsko muži/i,
      /dánsko pohár ženy/i,
      /dánsko pohár muži/i,
      /česko ženy/i,
      /česko muži/i,
      /česko pohár muži/i,
      /uruguay clausura primera ženy/i,
      /uruguay clausura a muži/i,
      /uruguay clausura muži/i,
      /uruguay ženy/i,
      /uruguay muži/i,
      /indonézia ženy/i,
      /indonézia muži/i,
      /filipíny wncaa/i,
      /filipíny mpva ženy/i,
      /filipíny pvl ženy/i,
      /filipíny ssl ženy/i,
      /filipíny spikers muži/i,
      /zápasy zen/i,
      /zápasy muži/i,
      /zápasy žien/i,
      /liga majstrov muži/i,
      /liga majstrov ženy/i,
      /liga majstrov/i,
      /challenge cup muži/i,
      /challenge cup ženy/i,
      /challenge cup/i,
      /cev cup ženy/i,
      /cev muži/i,
      /cev ženy/i,
      /cev cup/i,
      /norceca/i,
      /maďarsko nb i ženy/i,
      /maďarsko pohár ženy/i,
      /maďarsko pohár muži/i,
      /maďarsko ženy/i,
      /maďarsko muži/i,
      /čierna hora ženy/i,
      /čierna hora muži/i,
      /čierna hora/i,
      /srbsko ženy/i,
      /srbsko muži/i,
      /slovinsko 1b ženy/i,
      /slovinsko pohár ženy/i,
      /slovinsko ženy/i,
      /slovinsko muži/i,
      /švédsko ženy/i,
      /švédsko muži/i,
      /nemecko pohár ženy/i,
      /nemecko nc u20 ženy/i,
      /nemecko ženy/i,
      /nemecko muži/i,
      /rakúsko pohár ženy/i,
      /rakúsko pohár muži/i,
      /rakúsko ženy/i,
      /rakúsko muži/i,
      /chorvátsko pohár ženy/i,
      /chorvátsko pohár muži/i,
      /chorvátsko 1 ženy/i,
      /chorvátsko ženy/i,
      /chorvátsko muži/i,
      /portugalsko a2 ženy/i,
      /portugalsko a2 muži/i,
      /portugalsko pohár muži/i,
      /portugalsko 2 ženy/i,
      /portugalsko ženy/i,
      /portugalsko muži/i,
      /island ženy/i,
      /island muži/i,
      /malta ženy/i,
      /malta muži/i,
      /cyprus ženy/i,
      /cyprus muži/i,
      /grécko 3\.div\. ženy/i,
      /grécko nc u20 ženy/i,
      /grécko ženy/i,
      /grécko muži/i,
      /bulharsko ženy/i,
      /bulharsko muži/i,
      /rumunsko a2 muži/i,
      /rumunsko a2 ženy/i,
      /rumunsko ženy/i,
      /rumunsko muži/i,
      /estónsko pohár muži/i,
      /estónsko pohár ženy/i,
      /estónsko muži/i,
      /estónsko ženy/i,
      /litva ženy/i,
      /lotyšsko pohár muži/i,
      /lotyšsko ženy/i,
      /lotyšsko muži/i,
      /lotyšsko/i,
      /kazachstan ženy/i,
      /kazachstan muži/i,
      /peru ženy/i,
      /peru muži/i,
      /rwanda ženy/i,
      /rwanda muži/i,
      /keňa muži/i,
      /keňa ženy/i,
      /uganda ženy/i,
      /tunis muži/i,
      /egypt muži/i,
      /egypt ženy/i,
      /iraq muži/i,
      /qatar muži/i,
      /qatar ženy/i,
      /taipei ženy/i,
      /vietnam ženy/i,
      /vietnam muži/i,
      /nicaragua/i,
      /costa rica/i,
      /dominikánska/i,
      /albania cup muži/i,
      /albania ženy/i,
      /albania muži/i,
      /bosna ženy/i,
      /bosna muži/i,
      /international u21 muži/i,
      /international u19 ženy/i,
      /international u19 muži/i,
      /arabské klubové ženy nc/i,
      /arabské klubové ženy/i,
      /arabské klubové muži/i,
      /arabské klubové/i,
      /islamské hry muži/i,
      /islamské hry ženy/i,
      /islamské hry/i,
      /faroe muži/i,
      /faroe ženy/i,
      /faerske muži/i,
      /faerske ženy/i,
      /nórsko 1\.div\. ženy/i,
      /nórsko 1\.div\. muži/i,
      /nórsko ženy/i,
      /nórsko muži/i,
      /švajčiarsko ženy/i,
      /švajčiarsko muži/i,
      /fínsko ženy/i,
      /macedónsko ženy/i,
      /kosovo ženy/i,
      /montenegro muži/i,
      /izrael ženy/i,
      /izrael muži/i,
      /argentína de honor ženy/i,
      /kostarika muži/i,
      /kostarika ženy/i,
      /kostarika/i,
      /super league/i,
      /medzištátne/i,
      /jar/i,
      /gruzínsko/i,
      /írsko/i,
      /hylo/i,
      /canadian/i,
      /india/i,
      /welsh/i,
      /austrália/i,
      /us open/i,
      /marche/i,
      /rwp/i,
      /mol liga/i,
      /super globe muži/i,
      /super globe ženy/i,
      /super globe/i,
      /ms ženy/i,
      /ms muži/i,
      /ms/i,
      /me ženy/i,
      /me muži/i,
      /me/i,
      /kvalifikácia ms/i,
      /kvalifikácia me u17/i,
      /kvalifikácia me/i,
      /kvali ms/i,
      /kvali me sk\.10 u17/i,
      /kvali me/i,
      /španielsko ženy/i,
      /malajzia pohár/i,
      /nba/i,
      /euroleague/i,
      /euro cup ženy/i,
      /euro cup/i,
      /el salvador muži/i,
      /taliansko ženy/i,
      /nhl/i,
      /khl/i,
      /atp/i,
      /wta/i,
      /wta queretaro/i,
      /utr/i,
      /itf/i,
      /davis cup/i,
      /masters/i,
      /fiba cup muži/i,
      /futsal liga majstrov sk\.4/i,
      /futsal liga majstrov/i,
      /badminton hylo muži štvorhra/i,
      /badminton nórsko štvorhra muži/i,
      /štvorhra ženy/i,
      /dvojhra ženy/i,
      /štvorhra muži/i,
      /mix/i,
      /ragby medzištátne/i,
      /futbal kvali ms/i,
      /futbal kvali me u17/i,
      /futbal medzištátny ženy/i,
      /basketbal kvali me ženy/i,
      /basketbal euro cup ženy/i,
      /basketbal fiba cup muži/i,
      /basketbal kvalifikácia ms oceania asia muži/i,
      /hokej poľsko muži/i,
      /vodné pólo liga majstrov/i,
      /vodné pólo/i,
      /plážový volejbal muži/i,
      /plážový volejbal/i,
      /atletika ms/i,
      /atletika ms 400m prekážky ženy/i,
      /softbal me ženy/i,
      /politika česko voľby/i,
      /politika írsko prezidentské voľby/i,
      /padel/i,
      /squash us open/i,
      /squash canadian/i,
      /squash marche/i,
      /squash qatar/i,
      /premier league/i,
      /la liga/i,
      /champions league/i,
      /serie a/i
    ];
    
    // Find longest matching league
    for (const pattern of leaguePatterns) {
      const match = beforeOdds.match(pattern);
      if (match) {
        league = match[0].trim();
        matchStartIndex = match.index + match[0].length;
        break;
      }
    }
    
    // If no league found, try to guess from first words
    if (!league && words.length > 1) {
      // Take first 1-3 words as potential league
      const potentialLeague = words.slice(0, Math.min(3, words.length - 1)).join(' ');
      if (potentialLeague.length > 3) {
        league = potentialLeague;
        matchStartIndex = potentialLeague.length;
      }
    }
    
    // Extract match/team name (remaining words after league)
    let match = beforeOdds.substring(matchStartIndex).trim();
    
    // Clean up match name
    match = match
      .replace(/^(za|a|ešte|raz|k tomu|daj|podas|podaj|rýchlo|live|rozklikni|celkovo|víťaz|bol|áno|nie|set|1\.set|2\.set|aspoň|1|2|muži|ženy)\s+/gi, '')
      .replace(/\s+(za|a|ešte|raz|k tomu|daj|podas|podaj|rýchlo|live)$/gi, '')
      .trim();
    
    // If no match found, use last word before odds
    if (!match || match.length < 2) {
      if (words.length > 0) {
        match = words[words.length - 1];
      } else {
        match = 'Match';
      }
    }
    
    // Clean league name
    if (league) {
      league = league
        .replace(/^(za|a|ešte|raz|k tomu|daj|podas|podaj|rýchlo|live)\s+/gi, '')
        .trim();
    } else {
      league = 'General';
    }
    
    // Create datetime from date and time (assuming CET/CEST timezone)
    const matchDateTime = `${date}T${time}:00+01:00`;
    
    tipsArray.push({
      company,
      sport,
      league,
      match,
      odds,
      date: matchDateTime
    });
  }
}

// Generate SQL
const sqlStatements = [];
sqlStatements.push('-- Betting Tips extracted from WhatsApp chat');
sqlStatements.push('-- All tips are set to pending status');
sqlStatements.push('-- Match dates use the message timestamp when the tip was sent');
sqlStatements.push('');
sqlStatements.push('do $$');
sqlStatements.push('declare');

// Add company ID variables
sqlStatements.push('  bet365_id uuid;');
sqlStatements.push('  nike_id uuid;');
sqlStatements.push('  tipsport_id uuid;');
sqlStatements.push('  fortuna_id uuid;');

// Add sport ID variables
const uniqueSports = [...new Set(tips.map(t => t.sport))];
for (const sport of uniqueSports.sort()) {
  const varName = sport.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_id';
  sqlStatements.push(`  ${varName} uuid;`);
}

sqlStatements.push('  league_id_var uuid;');
sqlStatements.push('  tip_count integer := 0;');
sqlStatements.push('begin');
sqlStatements.push('  -- Get betting company IDs');
sqlStatements.push("  select id into bet365_id from public.betting_companies where name = 'Bet365';");
sqlStatements.push("  select id into nike_id from public.betting_companies where name = 'Nike';");
sqlStatements.push("  select id into tipsport_id from public.betting_companies where name = 'Tipsport';");
sqlStatements.push("  select id into fortuna_id from public.betting_companies where name = 'Fortuna';");
sqlStatements.push('');

sqlStatements.push('  -- Get sport IDs');
for (const sport of uniqueSports.sort()) {
  const varName = sport.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_id';
  sqlStatements.push(`  select id into ${varName} from public.sports where lower(name) = lower('${sport}');`);
}
sqlStatements.push('');

sqlStatements.push('  -- Insert betting tips');
for (const tip of tips) {
  const sportVar = tip.sport.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_id';
  const companyVar = tip.company.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_id';
  
  // Escape single quotes in match and league
  const matchEscaped = tip.match.replace(/'/g, "''");
  const leagueEscaped = tip.league.replace(/'/g, "''");
  
  sqlStatements.push(`  -- ${tip.date.substring(0, 10)} ${tip.company} ${tip.sport} ${tip.league} ${tip.match} ${tip.odds}`);
  sqlStatements.push(`  if ${sportVar} is not null then`);
  sqlStatements.push(`    select id into league_id_var from public.leagues where sport_id = ${sportVar} and lower(name) = lower('${leagueEscaped}');`);
  sqlStatements.push(`    if league_id_var is not null then`);
  sqlStatements.push(`      insert into public.betting_tips (betting_company_id, sport_id, league_id, match, odds, match_date, status)`);
  sqlStatements.push(`      values (${companyVar}, ${sportVar}, league_id_var, '${matchEscaped}', ${tip.odds}, '${tip.date}'::timestamptz, 'pending')`);
  sqlStatements.push(`      on conflict do nothing;`);
  sqlStatements.push(`      tip_count := tip_count + 1;`);
  sqlStatements.push(`    end if;`);
  sqlStatements.push(`  end if;`);
  sqlStatements.push('');
}

sqlStatements.push(`  raise notice 'Inserted % betting tips', tip_count;`);
sqlStatements.push('end $$;');

// Write to file
const outputFile = path.join(__dirname, '../supabase/seed_tips.sql');
fs.writeFileSync(outputFile, sqlStatements.join('\n'), 'utf-8');

console.log(`Extracted ${tips.length} betting tips`);
console.log(`SQL written to ${outputFile}`);
console.log(`\nUnique sports: ${uniqueSports.join(', ')}`);
console.log(`\nSample tips:`);
tips.slice(0, 5).forEach(tip => {
  console.log(`  ${tip.company} ${tip.sport} ${tip.league} ${tip.match} ${tip.odds} (${tip.date.substring(0, 10)})`);
});
