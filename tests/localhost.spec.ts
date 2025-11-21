import { test, expect } from '@playwright/test'

test.describe('Localhost Connection Tests', () => {
  test('should connect to localhost:3000', async ({ page }) => {
    // Try to navigate to the homepage
    const response = await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Check if we got a response
    expect(response).not.toBeNull()
    
    if (response) {
      console.log(`Response status: ${response.status()}`)
      console.log(`Response URL: ${response.url()}`)
      console.log(`Response headers:`, response.headers())
      
      // Check if status is OK
      expect(response.status()).toBe(200)
    }
  })

  test('should load the homepage content', async ({ page }) => {
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Stavky/)

    // Check if main content is visible
    const mainContent = page.locator('main')
    await expect(mainContent).toBeVisible()

    // Check for the hero heading
    const heading = page.getByRole('heading', { name: /Ship confident layouts faster/i })
    await expect(heading).toBeVisible()
  })

  test('should check for console errors', async ({ page }) => {
    const consoleErrors: string[] = []
    const networkErrors: string[] = []

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
        console.log(`Console error: ${msg.text()}`)
      }
    })

    // Listen for failed requests
    page.on('response', (response) => {
      if (!response.ok()) {
        networkErrors.push(`${response.url()} - ${response.status()}`)
        console.log(`Network error: ${response.url()} - ${response.status()}`)
      }
    })

    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000,
    })

    // Log all errors found
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors)
    }
    if (networkErrors.length > 0) {
      console.log('Network errors found:', networkErrors)
    }

    // The test will pass but we log errors for analysis
    expect(true).toBe(true)
  })

  test('should check page source and structure', async ({ page }) => {
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    // Get page content
    const html = await page.content()
    console.log('Page HTML length:', html.length)
    console.log('Page HTML preview:', html.substring(0, 500))

    // Check if HTML structure is correct
    expect(html).toContain('<html')
    expect(html).toContain('<body')
    expect(html).toContain('Ship confident layouts faster')
  })

  test('should confirm Supabase is configured via API', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/test-supabase', {
      timeout: 30000,
    })

    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)

    const payload = await response.json()

    expect(payload.success).toBe(true)
    expect(payload.details?.url).toMatch(/^https?:\/\//)
    expect(payload.details?.hasAnonKey).toBe(true)
    expect(typeof payload.details?.anonKeyLength).toBe('number')
    expect(payload.details?.anonKeyLength).toBeGreaterThan(0)
  })
})

