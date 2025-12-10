#!/usr/bin/env python3
"""
Parse WhatsApp chat to extract betting tips from Igor Stavky
"""
import re
import json
from datetime import datetime
from collections import defaultdict

# Sport name mapping (Slovak/Czech → English)
SPORT_MAPPING = {
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
    'politika': 'Politics',
}

# Betting company normalization
COMPANY_MAPPING = {
    'bet365': 'Bet365',
    'nike': 'Nike',
    'tipsport': 'Tipsport',
    'fortuna': 'Fortuna',
}

def parse_date(date_str):
    """Parse date from format 'DD. MM. YYYY, HH:MM'"""
    try:
        return datetime.strptime(date_str, '%d. %m. %Y, %H:%M')
    except:
        return None

def extract_odds(text):
    """Extract odds from text (format: 1,01 or 1.01)"""
    # Look for patterns like 1,01, 1,02, 1.01, etc.
    odds_pattern = r'(\d+)[,.](\d{2,3})'
    matches = re.findall(odds_pattern, text)
    odds_list = []
    for match in matches:
        try:
            odds = float(f"{match[0]}.{match[1]}")
            if 1.001 <= odds <= 2.0:
                odds_list.append(odds)
        except:
            pass
    return odds_list

def extract_sport(text):
    """Extract sport name from text"""
    text_lower = text.lower()
    for sk_name, en_name in SPORT_MAPPING.items():
        if sk_name in text_lower:
            return en_name
    return None

def extract_company(text):
    """Extract betting company from text"""
    text_lower = text.lower()
    for key, company in COMPANY_MAPPING.items():
        if key in text_lower:
            return company
    return None

def parse_tip_message(date_str, message):
    """Parse a single message to extract betting tips"""
    tips = []
    
    # Skip non-betting messages
    if not any(company in message.lower() for company in ['bet365', 'nike', 'tipsport', 'fortuna']):
        return tips
    
    # Extract date
    match_date = parse_date(date_str)
    if not match_date:
        return tips
    
    # Extract company
    company = extract_company(message)
    if not company:
        return tips
    
    # Extract sport
    sport = extract_sport(message)
    if not sport:
        return tips
    
    # Extract odds
    odds_list = extract_odds(message)
    if not odds_list:
        return tips
    
    # Extract league - look for common patterns
    league = None
    league_patterns = [
        r'(brasil paulista)',
        r'(ncaa)',
        r'(SVK extraliga)',
        r'(SVK ženy)',
        r'(SVK muži)',
        r'(mol liga)',
        r'(Thajsko ženy)',
        r'(Thajsko muži)',
        r'(Poľsko muži)',
        r'(Poľsko ženy)',
        r'(Dánsko ženy)',
        r'(Dánsko muži)',
        r'(liga majstrov)',
        r'(Challenge cup)',
        r'(WTA)',
        r'(ATP)',
        r'(UTR)',
        r'(ITF)',
        r'(Davis cup)',
        r'(kvali ms)',
        r'(kvali me)',
    ]
    
    for pattern in league_patterns:
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            league = match.group(1)
            break
    
    # If no league found, try to extract from context
    if not league:
        # Look for country/region patterns
        country_match = re.search(r'(\w+)\s+(muži|ženy|muži|ženy)', message, re.IGNORECASE)
        if country_match:
            league = f"{country_match.group(1)} {country_match.group(2)}"
        else:
            league = "General"
    
    # Extract match/team info - everything between sport and odds
    # This is complex, so we'll use a simplified approach
    match_text = message
    # Remove company, sport, league mentions
    match_text = re.sub(r'(bet365|nike|tipsport|fortuna)', '', match_text, flags=re.IGNORECASE)
    match_text = re.sub(r'(volejbal|hádzaná|tenis|basketbal|futbal|hokej)', '', match_text, flags=re.IGNORECASE)
    match_text = re.sub(r'za\s+\d+', '', match_text)  # Remove "za 600" etc
    match_text = re.sub(r'\d+[,.]\d+', '', match_text)  # Remove odds
    match_text = re.sub(r'\s+', ' ', match_text).strip()
    
    if not match_text or len(match_text) < 3:
        match_text = "Match details"
    
    # Create a tip for each odds found
    for odds in odds_list:
        tips.append({
            'company': company,
            'sport': sport,
            'league': league,
            'match': match_text[:200],  # Limit length
            'odds': odds,
            'match_date': match_date.isoformat(),
            'status': 'pending'
        })
    
    return tips

def main():
    # Read chat file
    with open('data/WhatsApp chat s používateľom Igor Stavky.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all messages from Igor Stavky
    pattern = r'(\d+\. \d+\. \d{4}, \d+:\d+) - Igor Stavky: (.+)'
    messages = re.findall(pattern, content)
    
    all_tips = []
    companies = set()
    sports = set()
    leagues = defaultdict(set)  # sport -> leagues
    
    print(f"Found {len(messages)} messages from Igor Stavky")
    
    for date_str, message in messages:
        tips = parse_tip_message(date_str, message)
        for tip in tips:
            all_tips.append(tip)
            companies.add(tip['company'])
            sports.add(tip['sport'])
            leagues[tip['sport']].add(tip['league'])
    
    print(f"\nExtracted {len(all_tips)} betting tips")
    print(f"Companies: {sorted(companies)}")
    print(f"Sports: {sorted(sports)}")
    print(f"\nLeagues by sport:")
    for sport in sorted(leagues.keys()):
        print(f"  {sport}: {len(leagues[sport])} leagues")
    
    # Save to JSON for inspection
    with open('data/extracted_tips.json', 'w', encoding='utf-8') as f:
        json.dump({
            'tips': all_tips,
            'companies': sorted(companies),
            'sports': sorted(sports),
            'leagues': {k: sorted(v) for k, v in leagues.items()}
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved extracted data to data/extracted_tips.json")

if __name__ == '__main__':
    main()

