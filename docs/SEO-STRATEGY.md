# SEO Strategy: smartbet365.com

**Date:** 2026-04-02
**Business Type:** SaaS - Sports Betting Tips Platform
**Market:** International (EN primary), CZ, SK
**Budget:** Bootstrap
**Domain:** https://smartbet365.com

---

## Current State Assessment

| Area | Score | Key Issue |
|------|-------|-----------|
| Technical SEO | 38/100 | Empty HTML body (CSR), no robots.txt, no canonicals |
| Content & E-E-A-T | 33.5/100 | ~80 word homepage, no team page, gated statistics |
| AI Citation Readiness | 22/100 | No structured data on key pages |
| Security | 85/100 | Strong HTTPS, HSTS, security headers |
| Sitemap | 70/100 | Present and well-structured, missing blog post URLs |

### Critical Issues (Blocking Indexation)

1. **Server-Side Rendering broken** -- HTML body is empty `<div>` + JS chunks. Googlebot receives no content on first pass. Zero headings, zero links, zero text in source HTML.
2. **No robots.txt** -- Returns 404. Crawlers cannot discover sitemap or respect crawl rules.
3. **No canonical tags** -- Pages accessible via `/`, `/sk`, `/en`, `/cs` with no canonicalization. Massive duplicate content risk.
4. **No hreflang in HTML** -- Despite next-intl supporting 3 locales, hreflang only exists on blog pages, not site-wide.
5. **Homepage is critically thin** -- ~80 words of content. YMYL topic (betting) requires substantial expertise signals.

---

## Target Audience & Keywords

### Primary Audience
- Sports bettors looking for expert tips (international, English-speaking)
- Czech and Slovak bettors seeking localized tips
- Casual bettors wanting to improve win rates

### Keyword Categories

**High Intent (Bottom of Funnel):**
- "betting tips today"
- "football betting predictions"
- "best betting tips site"
- "professional betting tips"
- "bet365 tips"
- "daily betting tips"

**Medium Intent (Middle of Funnel):**
- "how to bet on football"
- "betting strategy guide"
- "sports betting analysis"
- "value betting explained"
- "betting odds comparison"

**Low Intent (Top of Funnel):**
- "football match preview [team] vs [team]"
- "sports betting for beginners"
- "how do betting odds work"
- "is sports betting profitable"
- "bankroll management tips"

**Localized (CZ/SK):**
- "sazkovani tipy" (CZ)
- "fotbalove predikce" (CZ)
- "stavkove tipy" (SK)
- "analyza zapasov" (SK)

---

## Site Architecture (Recommended)

```
smartbet365.com/
├── /[locale]/                          # Home (expand to 800+ words)
├── /[locale]/about                     # NEW: Team, methodology, track record
├── /[locale]/how-it-works              # NEW: Service explanation + pricing
├── /[locale]/statistics                # Make partially public (summary stats)
├── /[locale]/blog                      # Blog hub
│   ├── /[slug]                         # Individual posts
│   └── /category/[slug]               # Category archives
├── /[locale]/guides                    # NEW: Betting education hub
│   ├── /beginners-guide
│   ├── /bankroll-management
│   ├── /understanding-odds
│   └── /value-betting
├── /[locale]/match-previews            # NEW: Public match analysis (SEO magnet)
├── /[locale]/contact
├── /[locale]/introduction              # Expand: render howItWorks + pricing sections
├── /[locale]/privacy
├── /[locale]/terms
├── /[locale]/legal-disclaimer
├── /[locale]/risk-warning
└── /[locale]/faq                       # NEW: FAQ with schema markup
```

### Pages to Keep Non-Indexed
- `/[locale]/(auth)/*` -- login, signup, forgot-password
- `/[locale]/bettings/*` -- user dashboard
- `/[locale]/profile`, `/settings`, `/history`
- `/[locale]/admin/*`
- `/[locale]/activation`

---

## Content Strategy

### Priority 1: Fix Existing Pages

| Page | Current Words | Target Words | Action |
|------|--------------|-------------|--------|
| Homepage | ~80 | 800+ | Add: service explanation, how it works, sample stats, social proof, FAQ section |
| Introduction | ~120 | 1000+ | Render missing howItWorks and pricing sections from translation files |
| Contact | ~30 | 300+ | Add company info, address, phone, map embed, FAQ |
| Statistics | 0 (gated) | 500+ | Create public summary with key metrics visible to crawlers |

### Priority 2: New High-Value Pages

1. **About / Team Page** (~1500 words)
   - Named analysts with photos, credentials, track record
   - Company story and methodology
   - Performance data and transparency
   - Critical for YMYL E-E-A-T requirements

2. **How It Works / Pricing** (~1000 words)
   - Step-by-step explanation
   - Pricing table (50 EUR/month -- already in translation strings)
   - FAQ section with schema

3. **FAQ Page** (~2000 words)
   - 15-20 common questions about sports betting tips
   - FAQ schema markup for rich results
   - Internal links to guides and blog posts

4. **Betting Guides Hub** (~5000 words across 4-5 guides)
   - Beginner's guide to sports betting
   - Bankroll management
   - Understanding odds and value
   - How to evaluate betting tips
   - Each guide 1000-1500 words

### Priority 3: Content Marketing (Ongoing)

**Blog Cadence:** 2-4 posts per week
- Match previews (high search volume, time-sensitive)
- Betting strategy articles (evergreen)
- Monthly performance reports (trust building)
- League/tournament previews (seasonal)

**Content Calendar Themes:**
| Month | Focus | Content Type |
|-------|-------|-------------|
| Apr 2026 | Football season finales | Match previews, league wrap-ups |
| May 2026 | Champions League, Europa League | Tournament analysis |
| Jun-Jul 2026 | Transfer window, pre-season | Evergreen guides, methodology |
| Aug 2026 | New season kickoff | Season previews, team analysis |

---

## Technical SEO Roadmap

### Week 1: Critical Fixes

- [ ] **Fix SSR** -- Ensure Next.js server-renders actual HTML content (headings, text, links). Audit all page components for unnecessary `"use client"` directives
- [ ] **Create `app/robots.ts`** -- Block auth/admin/api routes, reference sitemap
- [ ] **Add canonical tags** -- Every page needs `<link rel="canonical">`
- [ ] **Add hreflang site-wide** -- Not just blog pages. Include `x-default`
- [ ] **Fix `<html lang>`** -- Currently missing. Server-render the lang attribute per locale
- [ ] **Change root redirect 307 -> 301** or implement x-default strategy

### Week 2: Metadata & Structured Data

- [ ] **Homepage metadata** -- Add `generateMetadata()` to `app/[locale]/page.tsx`
- [ ] **Unique titles/descriptions per page per locale** -- Replace placeholder text
- [ ] **Open Graph + Twitter Card tags** -- All public pages
- [ ] **Organization JSON-LD** -- Site-wide in root layout
- [ ] **WebSite JSON-LD with SearchAction** -- Homepage
- [ ] **BreadcrumbList schema** -- Already have UI breadcrumbs, add structured data

### Week 3: Content & Performance

- [ ] **Expand homepage content** to 800+ words
- [ ] **Render introduction page sections** (howItWorks, pricing already in translations)
- [ ] **Add `preconnect` / `dns-prefetch`** resource hints
- [ ] **Add individual blog posts to sitemap**
- [ ] **Optimize image loading** -- `fetchPriority="high"` on LCP element

### Week 4: New Pages & Trust Signals

- [ ] **Create About/Team page** with named analysts
- [ ] **Create public statistics summary** (visible without login)
- [ ] **Add company registration (ICO)** to footer
- [ ] **Add physical address** to contact page and footer
- [ ] **Fix brand naming** -- Choose "SmartBet365" or "Stavky" and use consistently

---

## Schema Markup Plan

| Page Type | Schema Types | Priority |
|-----------|-------------|----------|
| All pages | Organization, WebSite | Critical |
| Homepage | WebSite + SearchAction, SoftwareApplication | Critical |
| Blog posts | Article (already exists -- enhance with Person author) | High |
| About/Team | Organization, Person (for each team member) | High |
| FAQ | FAQPage | High |
| Pricing | Offer, SoftwareApplication | Medium |
| Guides | Article, HowTo | Medium |
| Contact | ContactPoint, LocalBusiness | Medium |
| Blog categories | CollectionPage | Low |

---

## E-E-A-T Building Plan

### Experience Signals
- Publish monthly performance reports with real statistics
- Create "how we analyze matches" methodology content
- Share specific match analysis examples publicly
- Add analyst commentary to match previews

### Expertise Signals
- Create individual analyst profiles with credentials
- Change blog author from "Stavky Advisory Team" to real Person entities
- Publish in-depth educational guides demonstrating domain knowledge
- Add qualifications and years of experience to team bios

### Authoritativeness Signals
- Build backlinks through guest posts on sports/betting publications
- Get listed in betting tip comparison sites
- Publish original research and data
- Maintain consistent brand name across all touchpoints

### Trustworthiness Signals (Strongest Current Area)
- Display company registration number (ICO) publicly
- Add physical address to footer and contact page
- Show real-time or recent performance statistics publicly
- Maintain strong legal pages (already in place)
- Keep responsible gambling disclaimers prominent

---

## KPI Targets

| Metric | Current (Baseline) | 3 Month | 6 Month | 12 Month |
|--------|-------------------|---------|---------|----------|
| Organic Traffic | ~0 (not indexed properly) | 500/mo | 2,000/mo | 8,000/mo |
| Indexed Pages | ~5 (empty HTML issue) | 30+ | 60+ | 100+ |
| Keyword Rankings (top 100) | 0 | 50 | 200 | 500 |
| Domain Authority | 0-5 | 10 | 15 | 25 |
| Core Web Vitals | Failing | Passing | Passing | Optimized |
| Blog Posts Published | ~5 | 30+ | 60+ | 150+ |
| Organic Signups | 0 | 10/mo | 50/mo | 200/mo |

---

## Budget Allocation (Bootstrap)

Since budget is minimal, prioritize high-impact free actions:

| Activity | Cost | Impact | Priority |
|----------|------|--------|----------|
| Fix SSR/technical issues | $0 (dev time) | Critical | Week 1 |
| Write content (DIY) | $0 (time investment) | High | Ongoing |
| Google Search Console | Free | High | Week 1 |
| Schema markup | $0 (dev time) | Medium | Week 2 |
| Blog writing | $0 or ~$50-100/post if outsourced | High | Ongoing |
| Ahrefs/Semrush (free tier) | $0 | Medium | Ongoing |
| Guest posting/outreach | $0 (time investment) | Medium | Month 2+ |

---

## Risk Factors

1. **YMYL Classification** -- Sports betting is a Your Money or Your Life topic. Google applies heightened E-E-A-T scrutiny. Anonymous services with thin content face severe trust penalties.

2. **Regulatory Considerations** -- Betting content may face advertising restrictions in certain jurisdictions. Ensure compliance with local gambling advertising laws, especially in CZ/SK (Czech Gambling Act, Slovak Act on Gambling).

3. **Competitor Landscape** -- Established betting tip sites have years of domain authority. Focus on niche differentiation (e.g., bet365-specific analysis, CZ/SK market focus) rather than competing on broad terms.

4. **Content Freshness Pressure** -- Match previews and tips have very short shelf lives. Need consistent publishing cadence to maintain relevance.
