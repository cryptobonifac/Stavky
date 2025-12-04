import { test, expect } from '@playwright/test'

test.describe('Localization and Href Tests', () => {
  const locales = ['en', 'cs', 'sk']
  const testRoutes = ['/bettings', '/signup', '/login']

  test.describe('Homepage Links Localization', () => {
    for (const locale of locales) {
      test(`should have correct locale prefix in hrefs on ${locale} homepage`, async ({ page }) => {
        await page.goto(`/${locale}`)
        
        // Wait for page to load
        await page.waitForLoadState('networkidle')
        
        // Find the main CTA button link (either to /bettings or /signup)
        const ctaLink = page.locator('a[href*="/bettings"], a[href*="/signup"]').first()
        
        if (await ctaLink.isVisible()) {
          const href = await ctaLink.getAttribute('href')
          
          // Verify the href contains the correct locale prefix
          expect(href).toContain(`/${locale}/`)
          
          // Verify it doesn't have the wrong locale
          locales.filter(l => l !== locale).forEach(wrongLocale => {
            expect(href).not.toContain(`/${wrongLocale}/`)
          })
        }
      })

      test(`should navigate correctly from ${locale} homepage`, async ({ page }) => {
        await page.goto(`/${locale}`)
        await page.waitForLoadState('networkidle')
        
        // Find and click the main CTA link
        const ctaLink = page.locator('a[href*="/bettings"], a[href*="/signup"]').first()
        
        if (await ctaLink.isVisible()) {
          await ctaLink.click()
          
          // Wait for navigation
          await page.waitForURL(/\/(en|cs|sk)\/(bettings|signup)/)
          
          // Verify URL has the correct locale prefix
          const url = page.url()
          expect(url).toContain(`/${locale}/`)
        }
      })
    }
  })

  test.describe('Navigation Links Localization', () => {
    for (const locale of locales) {
      test(`should have localized hrefs in navigation on ${locale} page`, async ({ page }) => {
        await page.goto(`/${locale}`)
        await page.waitForLoadState('networkidle')
        
        // Check all links in the page that should be localized
        const links = page.locator('a[href^="/"]').filter({ hasNotText: '#' })
        
        const linkCount = await links.count()
        
        for (let i = 0; i < Math.min(linkCount, 10); i++) {
          const link = links.nth(i)
          const href = await link.getAttribute('href')
          
          // Skip anchor links and external links
          if (href && !href.startsWith('#') && !href.startsWith('http')) {
            // If it's a route that should be localized, check it has the locale prefix
            if (testRoutes.some(route => href.includes(route))) {
              expect(href).toContain(`/${locale}/`)
            }
          }
        }
      })
    }
  })

  test.describe('Language Switcher', () => {
    test('should switch language and maintain route structure', async ({ page }) => {
      // Start on English homepage
      await page.goto('/en')
      await page.waitForLoadState('networkidle')
      
      // Find language switcher
      const languageSwitcher = page.locator('[aria-label*="language"], select').first()
      
      if (await languageSwitcher.isVisible()) {
        // Switch to Slovak
        await languageSwitcher.selectOption('sk')
        
        // Wait for navigation
        await page.waitForURL(/\/(en|cs|sk)/)
        
        // Verify we're now on Slovak locale
        const url = page.url()
        expect(url).toContain('/sk')
        expect(url).not.toContain('/en/')
      }
    })
  })

  test.describe('Direct Route Access', () => {
    for (const locale of locales) {
      for (const route of testRoutes) {
        test(`should access ${locale}${route} with correct locale in URL`, async ({ page }) => {
          await page.goto(`/${locale}${route}`)
          
          // Wait for page to load or redirect
          await page.waitForURL(/\/(en|cs|sk)\//)
          
          const url = page.url()
          
          // Verify the URL contains the locale
          expect(url).toContain(`/${locale}`)
        })
      }
    }
  })

  test.describe('Link Consistency', () => {
    test('should maintain locale when clicking internal links', async ({ page }) => {
      // Start on Slovak homepage
      await page.goto('/sk')
      await page.waitForLoadState('networkidle')
      
      // Get all internal links
      const internalLinks = page.locator('a[href^="/"]').filter({ hasNotText: '#' })
      const linkCount = await internalLinks.count()
      
      if (linkCount > 0) {
        // Click the first internal link that's not an anchor
        for (let i = 0; i < linkCount; i++) {
          const link = internalLinks.nth(i)
          const href = await link.getAttribute('href')
          
          if (href && !href.startsWith('#') && href.includes('/sk/')) {
            await link.click()
            await page.waitForURL(/\/(en|cs|sk)\//)
            
            // Verify we're still on Slovak locale
            const url = page.url()
            expect(url).toContain('/sk')
            break
          }
        }
      }
    })
  })
})


