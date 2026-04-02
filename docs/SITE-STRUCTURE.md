# Site Structure & URL Architecture: smartbet365.com

**Created:** 2026-04-02

---

## Current URL Structure

### Public Pages (Indexed)
```
/[locale]/                              # Homepage
/[locale]/introduction                  # About the service (THIN)
/[locale]/statistics                    # Stats (GATED - requires login)
/[locale]/blog                          # Blog listing with pagination
/[locale]/blog/[slug]                   # Individual blog posts
/[locale]/blog/category/[slug]          # Blog category archives
/[locale]/contact                       # Contact form (THIN)
/[locale]/privacy                       # Privacy policy
/[locale]/terms                         # Terms of service
/[locale]/legal-disclaimer              # Legal disclaimer
/[locale]/risk-warning                  # Risk warning
```

### App Pages (Not Indexed)
```
/[locale]/(auth)/login                  # Login
/[locale]/(auth)/signup                 # Sign up
/[locale]/(auth)/forgot-password        # Password reset
/[locale]/(auth)/update-password        # Password update
/[locale]/bettings                      # Betting tips dashboard
/[locale]/bettings/manage               # Manage tips
/[locale]/bettings/customers            # Customer management
/[locale]/newbet                        # Create new tip
/[locale]/profile                       # User profile
/[locale]/settings                      # Settings
/[locale]/history                       # Betting history
/[locale]/contacts                      # User contacts
/[locale]/activation                    # Account activation
/[locale]/admin/activation              # Admin activation
/[locale]/admin/blog                    # Blog admin
/[locale]/admin/blog/new                # New blog post
/[locale]/admin/blog/[id]/edit          # Edit blog post
```

### Locales
- `en` -- English (primary for international SEO)
- `cs` -- Czech
- `sk` -- Slovak (current default)

---

## Recommended URL Structure (New Pages)

### New Pages to Create
```
/[locale]/about                         # Team, methodology, company info
/[locale]/how-it-works                  # Service explanation + pricing
/[locale]/faq                           # Frequently asked questions
/[locale]/guides                        # Betting education hub
/[locale]/guides/beginners-guide        # Beginner's guide
/[locale]/guides/bankroll-management    # Bankroll management
/[locale]/guides/understanding-odds     # Understanding odds
/[locale]/guides/value-betting          # Value betting explained
/[locale]/match-previews                # Public match analysis (future)
```

---

## Canonical & Hreflang Strategy

### Canonical Tags
Every page must have a self-referencing canonical:
```html
<!-- On /en/blog -->
<link rel="canonical" href="https://smartbet365.com/en/blog" />

<!-- On /cs/blog -->
<link rel="canonical" href="https://smartbet365.com/cs/blog" />
```

### Hreflang Tags (Every Public Page)
```html
<link rel="alternate" hreflang="en" href="https://smartbet365.com/en/blog" />
<link rel="alternate" hreflang="cs" href="https://smartbet365.com/cs/blog" />
<link rel="alternate" hreflang="sk" href="https://smartbet365.com/sk/blog" />
<link rel="alternate" hreflang="x-default" href="https://smartbet365.com/en/blog" />
```

### x-default Strategy
Point `x-default` to the English (`en`) version since the primary market is international.

---

## robots.txt (Recommended)

```
User-agent: *
Allow: /

# Block authentication and user-only pages
Disallow: /*/login
Disallow: /*/signup
Disallow: /*/forgot-password
Disallow: /*/update-password
Disallow: /*/bettings
Disallow: /*/newbet
Disallow: /*/profile
Disallow: /*/settings
Disallow: /*/history
Disallow: /*/contacts
Disallow: /*/activation
Disallow: /*/admin
Disallow: /auth/

# Block API routes
Disallow: /api/

Sitemap: https://smartbet365.com/sitemap.xml
```

---

## Internal Linking Map

### Homepage Links To:
- About / Team
- How It Works / Pricing
- Statistics (public summary)
- Blog (latest posts)
- Guides hub
- Contact

### Blog Post Links To:
- Related blog posts (same category)
- Relevant guides
- Statistics page
- Signup CTA

### Guide Links To:
- Related guides (cross-linking)
- Relevant blog posts
- FAQ
- Signup CTA

### Category Pages Link To:
- All posts in category
- Related categories
- Guides hub
- Homepage

---

## Sitemap Structure

### Current Sitemap (`app/sitemap.ts`)
- Static pages across 3 locales
- Blog categories
- Missing: individual blog post URLs

### Recommended Sitemap Additions
- Add all published blog post URLs
- Add new pages (about, faq, guides) as they're created
- Consider splitting into sitemap index if >500 URLs

---

## Redirect Rules

| From | To | Type | Status |
|------|-----|------|--------|
| `https://smartbet365.com/` | `https://smartbet365.com/sk` | 307 | **Change to 301** |
| `http://smartbet365.com/*` | `https://smartbet365.com/*` | 301 | OK |
| `http://www.smartbet365.com/*` | `https://smartbet365.com/*` | 301 | OK |

### Recommended: Root URL Strategy
**Option A (Simple):** Change 307 to 301 redirect to `/en` (since primary market is international).
**Option B (Advanced):** Serve content at `/` with `x-default` hreflang and use Accept-Language detection for initial locale suggestion.
