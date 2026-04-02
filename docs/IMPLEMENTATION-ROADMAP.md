# SEO Implementation Roadmap: smartbet365.com

**Created:** 2026-04-02

---

## Phase 1 -- Foundation (Weeks 1-4)

> Goal: Make the site crawlable, indexable, and technically sound.

### Week 1: Critical Technical Fixes

| Task | File(s) | Impact |
|------|---------|--------|
| Fix SSR -- ensure server-rendered HTML with real content | All page components | CRITICAL |
| Audit `"use client"` directives -- move content rendering to server | `app/[locale]/page.tsx`, etc. | CRITICAL |
| Create `app/robots.ts` with sitemap ref + disallowed paths | New file | CRITICAL |
| Add canonical tags to all public pages | `app/[locale]/layout.tsx` | CRITICAL |
| Add hreflang tags site-wide (not just blog) | `app/[locale]/layout.tsx` | CRITICAL |
| Fix `<html lang>` -- server-render instead of client-side | `components/layout/LocaleHtml.tsx` | CRITICAL |
| Change root `/` redirect from 307 to 301 | `next.config.js` or middleware | HIGH |
| Set up Google Search Console + submit sitemap | External | HIGH |
| Set up Bing Webmaster Tools | External | MEDIUM |

### Week 2: Metadata & Structured Data

| Task | File(s) | Impact |
|------|---------|--------|
| Add `generateMetadata()` to homepage | `app/[locale]/page.tsx` | CRITICAL |
| Write unique title + description per page per locale | All page files | HIGH |
| Add Open Graph tags to all public pages | Layout/page metadata | HIGH |
| Add Twitter Card tags | Layout metadata | MEDIUM |
| Add Organization JSON-LD (site-wide) | `app/[locale]/layout.tsx` | HIGH |
| Add WebSite JSON-LD with SearchAction | Homepage | MEDIUM |
| Add BreadcrumbList schema to pages with breadcrumbs | Blog, guides | MEDIUM |
| Enhance Article schema -- use Person author, not Organization | `app/[locale]/blog/[slug]/page.tsx` | MEDIUM |

### Week 3: Content Expansion

| Task | File(s) | Impact |
|------|---------|--------|
| Expand homepage to 800+ words | `app/[locale]/page.tsx` + translations | CRITICAL |
| Render howItWorks + pricing on introduction page | `app/[locale]/introduction/page.tsx` | HIGH |
| Create public statistics summary (key metrics without login) | New component/page | HIGH |
| Add company ICO to footer | `components/layout/Footer.tsx` | MEDIUM |
| Fix brand naming -- consistent use of "SmartBet365" | All pages, metadata | MEDIUM |
| Add blog post URLs to sitemap | `app/sitemap.ts` | MEDIUM |

### Week 4: Trust & New Pages

| Task | File(s) | Impact |
|------|---------|--------|
| Create About/Team page with analyst profiles | New: `app/[locale]/about/page.tsx` | HIGH |
| Add physical address to contact page + footer | Contact page, Footer | MEDIUM |
| Create FAQ page with FAQPage schema | New: `app/[locale]/faq/page.tsx` | MEDIUM |
| Add `preconnect`/`dns-prefetch` resource hints | `app/layout.tsx` | MEDIUM |
| Set `fetchPriority="high"` on hero/LCP images | Homepage, key pages | MEDIUM |

### Phase 1 Success Criteria
- [ ] All public pages return server-rendered HTML with headings and content
- [ ] robots.txt returns 200 with sitemap reference
- [ ] Every page has unique canonical, title, description
- [ ] Hreflang tags present on all locale variants
- [ ] Google Search Console shows 0 critical errors
- [ ] Homepage scores 50+ on Lighthouse SEO audit
- [ ] Organization + WebSite schema validated

---

## Phase 2 -- Expansion (Weeks 5-12)

> Goal: Build content depth and establish topical authority.

### Content Creation

| Task | Target | Cadence |
|------|--------|---------|
| Launch betting guides hub (4-5 guides) | 5,000+ total words | One guide per week |
| Beginners guide to sports betting | 1,500 words | Week 5 |
| Bankroll management guide | 1,200 words | Week 6 |
| Understanding odds and value | 1,200 words | Week 7 |
| How to evaluate betting tips | 1,000 words | Week 8 |
| Blog post cadence: 2-4/week | Match previews + strategy | Ongoing |
| Monthly performance report (public) | 500-800 words | Monthly |

### Technical Enhancements

| Task | Impact |
|------|--------|
| Add FAQ schema to relevant pages | MEDIUM |
| Add HowTo schema to guide pages | MEDIUM |
| Implement breadcrumb schema across all pages | MEDIUM |
| Create locale-specific sitemaps (sitemap index) | LOW |
| Implement IndexNow for Bing/Yandex | LOW |
| Add Content-Security-Policy header | LOW |
| Optimize image delivery (WebP/AVIF, lazy loading) | MEDIUM |

### Internal Linking

| Task | Impact |
|------|--------|
| Link blog posts to relevant guides | HIGH |
| Link guides to related blog posts | HIGH |
| Add "Related posts" component to blog | MEDIUM |
| Create category landing pages with descriptive content | MEDIUM |
| Add contextual links from homepage to key pages | MEDIUM |

### Phase 2 Success Criteria
- [ ] 30+ indexed pages in Google Search Console
- [ ] Guides hub live with 4+ guides
- [ ] 20+ blog posts published
- [ ] First organic keyword rankings appearing (top 100)
- [ ] Internal linking structure connects all content clusters

---

## Phase 3 -- Scale (Weeks 13-24)

> Goal: Grow traffic and begin converting organic visitors.

### Content Scaling

| Task | Target |
|------|--------|
| Increase blog cadence to 3-4/week | 50+ total posts by end of phase |
| Create match preview template for efficiency | Standardized format |
| Launch CZ/SK language blog content | Localized posts |
| Create seasonal content (league previews, tournament guides) | 4-6 long-form pieces |
| Publish original research/data analysis | 1-2 data-driven pieces |

### Link Building (Free/Low-Cost)

| Task | Impact |
|------|--------|
| Guest posts on sports/betting blogs | HIGH |
| Submit to betting tip directories/review sites | MEDIUM |
| Create linkable assets (infographics, original data) | MEDIUM |
| Participate in sports betting forums/communities | LOW |
| HARO/journalist query responses | MEDIUM |

### Conversion Optimization

| Task | Impact |
|------|--------|
| Add CTA to all blog posts | HIGH |
| Create free tier or trial offer | HIGH |
| Add exit-intent popup for guide readers | MEDIUM |
| A/B test homepage CTA copy | MEDIUM |
| Track organic visitor -> signup funnel | HIGH |

### GEO (Generative Engine Optimization)

| Task | Impact |
|------|--------|
| Structure content for AI snippet extraction | HIGH |
| Add clear, quotable statistics in public content | HIGH |
| Ensure all data is in structured, parseable formats | MEDIUM |
| Monitor AI citations (Google AI Overviews, ChatGPT) | MEDIUM |

### Phase 3 Success Criteria
- [ ] 2,000+ organic visits/month
- [ ] 50+ keywords ranking in top 100
- [ ] 10+ keywords ranking in top 20
- [ ] Organic signups beginning (target: 50/month)
- [ ] Domain authority reaching 15+

---

## Phase 4 -- Authority (Months 7-12)

> Goal: Establish SmartBet365 as a recognized authority in betting tips.

### Authority Building

| Task | Impact |
|------|--------|
| Publish annual betting performance report | HIGH |
| Create free tools (odds calculator, ROI tracker) | HIGH |
| Launch email newsletter for organic list building | MEDIUM |
| Seek media mentions and PR opportunities | HIGH |
| Build relationships with sports journalists | MEDIUM |

### Advanced Technical

| Task | Impact |
|------|--------|
| Implement video schema for any video content | MEDIUM |
| Advanced Core Web Vitals optimization | MEDIUM |
| Implement dynamic rendering for social crawlers | LOW |
| Regular technical SEO audits (quarterly) | MEDIUM |

### Content Maturity

| Task | Target |
|------|--------|
| 150+ blog posts published | Ongoing |
| 10+ comprehensive guides | Evergreen content library |
| Monthly data-driven reports | Trust building |
| User-generated content (testimonials, reviews) | Social proof |

### Phase 4 Success Criteria
- [ ] 8,000+ organic visits/month
- [ ] 200+ organic signups/month
- [ ] Domain authority 25+
- [ ] Multiple keywords in top 10
- [ ] Brand searches appearing in Google Trends
- [ ] AI systems citing SmartBet365 content

---

## Quick Wins (Do This Week)

These require minimal effort and have immediate impact:

1. **Set up Google Search Console** -- Submit sitemap, monitor indexation
2. **Create `app/robots.ts`** -- 10 lines of code, fixes critical crawl issue
3. **Add `generateMetadata()` to homepage** -- Currently has none at all
4. **Render the hidden introduction page sections** -- Content already exists in translation files, just not rendered
5. **Add company ICO number to footer** -- One line of text, trust signal
