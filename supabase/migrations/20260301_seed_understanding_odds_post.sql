-- Seed blog post: Understanding Betting Odds
-- Generated on 2026-02-23

-- Insert the blog post with localized content
INSERT INTO public.blog_posts (
  slug,
  title,
  content,
  excerpt,
  category_id,
  status,
  meta_title,
  meta_description,
  tags,
  published_at
) VALUES (
  'understanding-betting-odds',
  '{
    "en": "Understanding Betting Odds: A Beginner''s Guide to Decimal, Fractional, and American Odds",
    "cs": "Pochopení sázkových kurzů: Průvodce pro začátečníky desítkovými, zlomkovými a americkými kurzy",
    "sk": "Pochopenie stávkových kurzov: Sprievodca pre začiatočníkov desiatkovými, zlomkovými a americkými kurzami"
  }'::jsonb,
  '{
    "en": "<p>Betting odds tell you two things: how much you''ll win on a successful bet and how likely the bookmaker believes an outcome is. Every serious bettor needs to read odds fluently — regardless of format. The three major systems are decimal, fractional, and American. Each expresses the same information differently.</p>\n\n<h2>1. Decimal Odds</h2>\n\n<div class=\"odds-card decimal\">\n<p><strong>Used in:</strong> Europe, Australia, Canada</p>\n<p>The simplest format. The number represents your <strong>total return per €1 staked</strong>, including your original stake. Odds of 2.50 mean a €10 bet returns €25 total (€15 profit + €10 stake).</p>\n<p><strong>Example:</strong> €10 × 2.50 = €25 total return (€15 profit)</p>\n</div>\n\n<h2>2. Fractional Odds</h2>\n\n<div class=\"odds-card fractional\">\n<p><strong>Used in:</strong> UK &amp; Ireland</p>\n<p>Expressed as a fraction showing <strong>profit relative to stake</strong>. Odds of 5/2 mean you win €5 for every €2 staked. Your stake is returned on top. They''re traditional but slightly harder to calculate mentally.</p>\n<p><strong>Example:</strong> €10 at 5/2 = €25 profit + €10 stake = €35 total</p>\n</div>\n\n<h2>3. American Odds</h2>\n\n<div class=\"odds-card american\">\n<p><strong>Used in:</strong> United States</p>\n<p>Use a <strong>positive or negative number</strong>. Positive (+200) shows profit on a $100 bet. Negative (−150) shows how much you must bet to win $100. The favourite carries the minus sign; the underdog carries the plus.</p>\n<p><strong>Example:</strong> +200 → $100 bet wins $200 profit | −150 → bet $150 to win $100 profit</p>\n</div>\n\n<h2>Quick Conversion Reference</h2>\n\n<table class=\"conversion-table\">\n<thead>\n<tr><th>Implied Prob.</th><th>Decimal</th><th>Fractional</th><th>American</th></tr>\n</thead>\n<tbody>\n<tr><td>80%</td><td>1.25</td><td>1/4</td><td>−400</td></tr>\n<tr><td>66.7%</td><td>1.50</td><td>1/2</td><td>−200</td></tr>\n<tr><td>50%</td><td>2.00</td><td>1/1</td><td>+100</td></tr>\n<tr><td>33.3%</td><td>3.00</td><td>2/1</td><td>+200</td></tr>\n<tr><td>20%</td><td>5.00</td><td>4/1</td><td>+400</td></tr>\n</tbody>\n</table>\n\n<div class=\"key-rule\">\n<p><strong>Pro Tip:</strong> To convert decimal odds to implied probability: divide 1 by the odds. For example, 1 ÷ 2.50 = 0.40, meaning the bookmaker implies a <strong>40% chance</strong>. Compare this to your own estimate — if you see a higher probability, you''ve found a value bet.</p>\n</div>\n\n<p>Understanding odds is the foundation everything else builds on — bankroll management, value betting, and evaluating tipster performance all require fluency in reading and comparing odds across formats. Learn this first, and every other concept clicks into place.</p>",

    "cs": "<p>Sázkové kurzy vám říkají dvě věci: kolik vyhrajete při úspěšné sázce a jak pravděpodobný je podle bookmakera daný výsledek. Každý seriózní sázkař musí umět plynule číst kurzy — bez ohledu na formát. Tři hlavní systémy jsou desítkové, zlomkové a americké. Každý vyjadřuje stejnou informaci jinak.</p>\n\n<h2>1. Desítkové kurzy</h2>\n\n<div class=\"odds-card decimal\">\n<p><strong>Používají se v:</strong> Evropa, Austrálie, Kanada</p>\n<p>Nejjednodušší formát. Číslo představuje váš <strong>celkový výnos na 1 € vkladu</strong>, včetně původního vkladu. Kurz 2,50 znamená, že sázka 10 € vrátí celkem 25 € (15 € zisk + 10 € vklad).</p>\n<p><strong>Příklad:</strong> 10 € × 2,50 = 25 € celkový výnos (15 € zisk)</p>\n</div>\n\n<h2>2. Zlomkové kurzy</h2>\n\n<div class=\"odds-card fractional\">\n<p><strong>Používají se v:</strong> Velká Británie a Irsko</p>\n<p>Vyjádřeno jako zlomek ukazující <strong>zisk vzhledem k vkladu</strong>. Kurz 5/2 znamená, že vyhrajete 5 € za každé 2 € vsazené. Váš vklad se vrací navíc. Jsou tradiční, ale těžší na rychlý výpočet.</p>\n<p><strong>Příklad:</strong> 10 € při 5/2 = 25 € zisk + 10 € vklad = 35 € celkem</p>\n</div>\n\n<h2>3. Americké kurzy</h2>\n\n<div class=\"odds-card american\">\n<p><strong>Používají se v:</strong> Spojené státy</p>\n<p>Používají <strong>kladné nebo záporné číslo</strong>. Kladné (+200) ukazuje zisk ze sázky 100 $. Záporné (−150) ukazuje, kolik musíte vsadit pro výhru 100 $. Favorit nese znaménko mínus; outsider nese plus.</p>\n<p><strong>Příklad:</strong> +200 → sázka 100 $ vyhraje 200 $ zisku | −150 → vsaďte 150 $ pro výhru 100 $ zisku</p>\n</div>\n\n<h2>Rychlá převodní tabulka</h2>\n\n<table class=\"conversion-table\">\n<thead>\n<tr><th>Impl. pravděp.</th><th>Desítkový</th><th>Zlomkový</th><th>Americký</th></tr>\n</thead>\n<tbody>\n<tr><td>80%</td><td>1,25</td><td>1/4</td><td>−400</td></tr>\n<tr><td>66,7%</td><td>1,50</td><td>1/2</td><td>−200</td></tr>\n<tr><td>50%</td><td>2,00</td><td>1/1</td><td>+100</td></tr>\n<tr><td>33,3%</td><td>3,00</td><td>2/1</td><td>+200</td></tr>\n<tr><td>20%</td><td>5,00</td><td>4/1</td><td>+400</td></tr>\n</tbody>\n</table>\n\n<div class=\"key-rule\">\n<p><strong>Tip pro profesionály:</strong> Pro převod desítkových kurzů na implikovanou pravděpodobnost: vydělte 1 kurzem. Například 1 ÷ 2,50 = 0,40, což znamená, že bookmaker implikuje <strong>40% šanci</strong>. Porovnejte to s vlastním odhadem — pokud vidíte vyšší pravděpodobnost, našli jste value sázku.</p>\n</div>\n\n<p>Pochopení kurzů je základ, na kterém staví vše ostatní — správa bankrollu, value betting a hodnocení výkonnosti tipérů, to vše vyžaduje plynulé čtení a porovnávání kurzů napříč formáty. Naučte se to jako první a každý další koncept zapadne na své místo.</p>",

    "sk": "<p>Stávkové kurzy vám hovoria dve veci: koľko vyhráte pri úspešnej stávke a ako pravdepodobný je podľa bookmakera daný výsledok. Každý seriózny stávkar musí vedieť plynulo čítať kurzy — bez ohľadu na formát. Tri hlavné systémy sú desiatkové, zlomkové a americké. Každý vyjadruje rovnakú informáciu inak.</p>\n\n<h2>1. Desiatkové kurzy</h2>\n\n<div class=\"odds-card decimal\">\n<p><strong>Používajú sa v:</strong> Európa, Austrália, Kanada</p>\n<p>Najjednoduchší formát. Číslo predstavuje váš <strong>celkový výnos na 1 € vkladu</strong>, vrátane pôvodného vkladu. Kurz 2,50 znamená, že stávka 10 € vráti celkom 25 € (15 € zisk + 10 € vklad).</p>\n<p><strong>Príklad:</strong> 10 € × 2,50 = 25 € celkový výnos (15 € zisk)</p>\n</div>\n\n<h2>2. Zlomkové kurzy</h2>\n\n<div class=\"odds-card fractional\">\n<p><strong>Používajú sa v:</strong> Veľká Británia a Írsko</p>\n<p>Vyjadrené ako zlomok ukazujúci <strong>zisk vzhľadom k vkladu</strong>. Kurz 5/2 znamená, že vyhráte 5 € za každé 2 € stavené. Váš vklad sa vracia navyše. Sú tradičné, ale ťažšie na rýchly výpočet.</p>\n<p><strong>Príklad:</strong> 10 € pri 5/2 = 25 € zisk + 10 € vklad = 35 € celkom</p>\n</div>\n\n<h2>3. Americké kurzy</h2>\n\n<div class=\"odds-card american\">\n<p><strong>Používajú sa v:</strong> Spojené štáty</p>\n<p>Používajú <strong>kladné alebo záporné číslo</strong>. Kladné (+200) ukazuje zisk zo stávky 100 $. Záporné (−150) ukazuje, koľko musíte staviť pre výhru 100 $. Favorit nesie znamienko mínus; outsider nesie plus.</p>\n<p><strong>Príklad:</strong> +200 → stávka 100 $ vyhrá 200 $ zisku | −150 → stavte 150 $ pre výhru 100 $ zisku</p>\n</div>\n\n<h2>Rýchla prevodná tabuľka</h2>\n\n<table class=\"conversion-table\">\n<thead>\n<tr><th>Impl. pravdep.</th><th>Desiatkový</th><th>Zlomkový</th><th>Americký</th></tr>\n</thead>\n<tbody>\n<tr><td>80%</td><td>1,25</td><td>1/4</td><td>−400</td></tr>\n<tr><td>66,7%</td><td>1,50</td><td>1/2</td><td>−200</td></tr>\n<tr><td>50%</td><td>2,00</td><td>1/1</td><td>+100</td></tr>\n<tr><td>33,3%</td><td>3,00</td><td>2/1</td><td>+200</td></tr>\n<tr><td>20%</td><td>5,00</td><td>4/1</td><td>+400</td></tr>\n</tbody>\n</table>\n\n<div class=\"key-rule\">\n<p><strong>Tip pre profesionálov:</strong> Pre prevod desiatkových kurzov na implikovanú pravdepodobnosť: vydeľte 1 kurzom. Napríklad 1 ÷ 2,50 = 0,40, čo znamená, že bookmaker implikuje <strong>40% šancu</strong>. Porovnajte to s vlastným odhadom — ak vidíte vyššiu pravdepodobnosť, našli ste value stávku.</p>\n</div>\n\n<p>Pochopenie kurzov je základ, na ktorom stavia všetko ostatné — správa bankrollu, value betting a hodnotenie výkonnosti tipérov, to všetko vyžaduje plynulé čítanie a porovnávanie kurzov naprieč formátmi. Naučte sa to ako prvé a každý ďalší koncept zapadne na svoje miesto.</p>"
  }'::jsonb,
  '{
    "en": "Learn how decimal, fractional, and American odds work with clear examples. Convert between formats and understand implied probability to make smarter bets.",
    "cs": "Naučte se, jak fungují desítkové, zlomkové a americké kurzy s jasnými příklady. Převádějte mezi formáty a pochopte implikovanou pravděpodobnost.",
    "sk": "Naučte sa, ako fungujú desiatkové, zlomkové a americké kurzy s jasnými príkladmi. Prevádzajte medzi formátmi a pochopte implikovanú pravdepodobnosť."
  }'::jsonb,
  (SELECT id FROM public.blog_categories WHERE slug = 'strategy-guides' LIMIT 1),
  'published',
  '{
    "en": "Understanding Betting Odds: Decimal, Fractional & American Guide",
    "cs": "Pochopení sázkových kurzů: Průvodce desítkovými, zlomkovými a americkými kurzy",
    "sk": "Pochopenie stávkových kurzov: Sprievodca desiatkovými, zlomkovými a americkými kurzami"
  }'::jsonb,
  '{
    "en": "Learn how decimal, fractional, and American odds work with examples. Master odds conversion and implied probability.",
    "cs": "Naučte se, jak fungují desítkové, zlomkové a americké kurzy s příklady. Osvojte si převod kurzů a implikovanou pravděpodobnost.",
    "sk": "Naučte sa, ako fungujú desiatkové, zlomkové a americké kurzy s príkladmi. Osvojte si prevod kurzov a implikovanú pravdepodobnosť."
  }'::jsonb,
  ARRAY['odds', 'decimal-odds', 'fractional-odds', 'american-odds', 'betting-basics', 'probability', 'beginners'],
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  category_id = EXCLUDED.category_id,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  tags = EXCLUDED.tags,
  updated_at = NOW();
