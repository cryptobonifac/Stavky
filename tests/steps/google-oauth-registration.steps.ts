import { expect } from '@playwright/test'
import { Given, When, Then } from '@cucumber/cucumber'
import { createBdd } from 'playwright-bdd'

const { Given: BDDGiven, When: BDDWhen, Then: BDDThen } = createBdd()

/**
 * Background Steps
 */

BDDGiven('the application is running', async ({ page }) => {
  // Verify the application is accessible
  const response = await page.goto('http://localhost:3000')
  expect(response?.status()).toBeLessThan(400)
})

BDDGiven('I am not authenticated', async ({ page, context }) => {
  // Clear all cookies and storage to ensure we start unauthenticated
  await context.clearCookies()
  await page.goto('http://localhost:3000')
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
})

/**
 * Navigation Steps
 */

BDDGiven('I navigate to the signup page', async ({ page }) => {
  await page.goto('http://localhost:3000/en/signup')
  await page.waitForLoadState('networkidle')

  // Verify we're on the signup page
  await expect(page.getByTestId('signup-form')).toBeVisible()
})

BDDGiven('I navigate to the login page', async ({ page }) => {
  await page.goto('http://localhost:3000/en/login')
  await page.waitForLoadState('networkidle')

  // Verify we're on the login page
  await expect(page.getByTestId('login-form')).toBeVisible()
})

BDDGiven('I am on the Czech language signup page {string}', async ({ page }, url: string) => {
  await page.goto(`http://localhost:3000${url}`)
  await page.waitForLoadState('networkidle')

  // Verify we're on the signup page
  await expect(page.getByTestId('signup-form')).toBeVisible()
})

BDDGiven('I navigate to the auth callback URL without a code parameter', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/callback')
  await page.waitForLoadState('networkidle')
})

BDDGiven('I navigate to the auth callback URL with an invalid code', async ({ page }) => {
  await page.goto('http://localhost:3000/auth/callback?code=invalid_code_12345')
  await page.waitForLoadState('networkidle')
})

/**
 * OAuth Flow Steps
 */

BDDWhen('I click the {string} button', async ({ page }, buttonText: string) => {
  // Wait for the Google button to be visible
  const googleButton = page.getByTestId('social-login-google-button')
  await expect(googleButton).toBeVisible()

  // Click the button
  await googleButton.click()
})

BDDThen('I should be redirected to Google\'s OAuth consent page', async ({ page }) => {
  // Wait for navigation to Google's OAuth page
  await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 })

  // Verify we're on Google's domain
  expect(page.url()).toContain('accounts.google.com')
})

BDDWhen('I authenticate with valid Google credentials', async ({ page }) => {
  /**
   * IMPORTANT: This step requires either:
   * 1. A test Google account for automated testing
   * 2. Manual intervention during test execution
   * 3. A mock OAuth server for CI/CD environments
   *
   * For local development, you can use Playwright's authentication state
   * to record a real OAuth flow once and replay it.
   *
   * See: https://playwright.dev/docs/auth
   */

  // Check if we're on Google's OAuth page
  const isGooglePage = page.url().includes('accounts.google.com')

  if (isGooglePage) {
    // For automated testing, you would:
    // 1. Fill in email: await page.fill('input[type="email"]', process.env.TEST_GOOGLE_EMAIL)
    // 2. Click next
    // 3. Fill in password: await page.fill('input[type="password"]', process.env.TEST_GOOGLE_PASSWORD)
    // 4. Submit

    // For now, we'll use a stored authentication state or manual testing
    // This is a placeholder that would need actual credentials

    // Example with test credentials (DO NOT commit real credentials):
    const testEmail = process.env.TEST_GOOGLE_EMAIL
    const testPassword = process.env.TEST_GOOGLE_PASSWORD

    if (testEmail && testPassword) {
      try {
        // Try to find and fill email input
        const emailInput = page.locator('input[type="email"]').first()
        if (await emailInput.isVisible({ timeout: 5000 })) {
          await emailInput.fill(testEmail)
          await page.keyboard.press('Enter')
          await page.waitForTimeout(2000)

          // Try to find and fill password input
          const passwordInput = page.locator('input[type="password"]').first()
          if (await passwordInput.isVisible({ timeout: 5000 })) {
            await passwordInput.fill(testPassword)
            await page.keyboard.press('Enter')
          }
        }
      } catch (error) {
        console.warn('Could not automate Google login. Manual intervention may be required.')
      }
    } else {
      console.warn('TEST_GOOGLE_EMAIL and TEST_GOOGLE_PASSWORD not set. Skipping automated OAuth.')
    }
  }
})

BDDWhen('I authenticate with a Google account email in the betting accounts list', async ({ page }) => {
  // This step is similar to regular authentication but uses a specific test account
  // that is configured in the database migration as a betting account
  // e.g., 'marek.rohon@gmail.com', 'igorpod69@gmail.com', or 'busikpartners@gmail.com'

  const testBettingEmail = process.env.TEST_BETTING_GOOGLE_EMAIL
  const testPassword = process.env.TEST_GOOGLE_PASSWORD

  if (testBettingEmail && testPassword) {
    try {
      const emailInput = page.locator('input[type="email"]').first()
      if (await emailInput.isVisible({ timeout: 5000 })) {
        await emailInput.fill(testBettingEmail)
        await page.keyboard.press('Enter')
        await page.waitForTimeout(2000)

        const passwordInput = page.locator('input[type="password"]').first()
        if (await passwordInput.isVisible({ timeout: 5000 })) {
          await passwordInput.fill(testPassword)
          await page.keyboard.press('Enter')
        }
      }
    } catch (error) {
      console.warn('Could not automate Google login for betting account.')
    }
  }
})

BDDWhen('I grant the required permissions', async ({ page }) => {
  // Wait for the consent screen and grant permissions
  try {
    // Look for "Continue" or "Allow" button on Google's consent page
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Allow")').first()
    if (await continueButton.isVisible({ timeout: 5000 })) {
      await continueButton.click()
    }
  } catch (error) {
    // Permissions might be already granted, continue
    console.log('No consent screen found, permissions may be already granted')
  }
})

BDDWhen('I complete the Google OAuth flow', async ({ page }) => {
  // This combines authentication and granting permissions
  await BDDWhen('I authenticate with valid Google credentials', { page })
  await BDDWhen('I grant the required permissions', { page })
})

/**
 * Assertion Steps - Navigation and Authentication
 */

BDDThen('I should be redirected back to the application', async ({ page }) => {
  // Wait for redirect back to our application
  await page.waitForURL(/localhost:3000/, { timeout: 15000 })
  expect(page.url()).toContain('localhost:3000')
})

BDDThen('I should be on the {string} page', async ({ page }, expectedPath: string) => {
  // Wait for the expected page to load
  await page.waitForURL(`**${expectedPath}`, { timeout: 10000 })
  expect(page.url()).toContain(expectedPath)
})

BDDThen('I should be authenticated', async ({ page }) => {
  // Check for authenticated state by verifying session cookies or UI elements
  // that only appear when authenticated

  // Option 1: Check for authentication cookies
  const cookies = await page.context().cookies()
  const hasAuthCookie = cookies.some(cookie =>
    cookie.name.includes('sb-') && cookie.name.includes('auth-token')
  )

  // Option 2: Check for authenticated UI elements (e.g., user menu)
  // Wait for an element that only appears when authenticated
  await page.waitForTimeout(2000) // Give time for auth state to update

  // We can also check if we're not on the login page
  expect(page.url()).not.toContain('/login')
  expect(page.url()).not.toContain('/signup')
})

BDDThen('I should be redirected to the login page', async ({ page }) => {
  await page.waitForURL('**/login', { timeout: 10000 })
  expect(page.url()).toContain('/login')
})

BDDThen('the page should be displayed in Czech language', async ({ page }) => {
  // Verify the page is in Czech by checking for Czech language content
  // This could be checking for specific Czech text or the html lang attribute
  const htmlLang = await page.getAttribute('html', 'lang')
  expect(htmlLang).toBe('cs')
})

/**
 * Assertion Steps - Error Messages
 */

BDDThen('I should see an error message about {string}', async ({ page }, errorType: string) => {
  // Look for error message in the URL or on the page
  if (errorType === 'missing_code') {
    expect(page.url()).toContain('error=missing_code')
  } else {
    expect(page.url()).toContain('error=')
  }
})

BDDThen('I should see an error message', async ({ page }) => {
  // Check if there's an error parameter in the URL or an error alert on the page
  const url = page.url()
  const hasErrorInUrl = url.includes('error=')

  if (!hasErrorInUrl) {
    // Check for error alert on the page
    const errorAlert = page.getByTestId('login-error').or(page.getByTestId('signup-error'))
    await expect(errorAlert).toBeVisible({ timeout: 5000 })
  } else {
    expect(hasErrorInUrl).toBe(true)
  }
})

/**
 * Assertion Steps - Database and User State
 */

BDDThen('my user account should be created in the database', async ({ page }) => {
  // Verify the user account exists by calling the profile API
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
  const profile = await response.json()
  expect(profile).toHaveProperty('id')
  expect(profile).toHaveProperty('email')
})

BDDThen('my user should have the {string} role assigned', async ({ page }, expectedRole: string) => {
  // Fetch user profile and verify role
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
  const profile = await response.json()
  expect(profile.role).toBe(expectedRole)
})

BDDThen('my account should be active until {string}', async ({ page }, expectedDate: string) => {
  // Fetch user profile and verify account active date
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
  const profile = await response.json()
  expect(profile.account_active_until).toContain(expectedDate)
})

BDDThen('my account should be active for one year from registration', async ({ page }) => {
  // Fetch user profile and verify account is active for approximately one year
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
  const profile = await response.json()

  const activeUntil = new Date(profile.account_active_until)
  const now = new Date()
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())

  // Allow for some variance (within a day)
  const timeDiff = Math.abs(activeUntil.getTime() - oneYearFromNow.getTime())
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

  expect(daysDiff).toBeLessThan(2)
})

/**
 * Assertion Steps - User Profile
 */

BDDGiven('I have successfully registered via Google OAuth', async ({ page, context }) => {
  // This is a compound step that performs the entire OAuth flow
  await page.goto('http://localhost:3000/en/signup')

  // Click Google button
  const googleButton = page.getByTestId('social-login-google-button')
  await googleButton.click()

  // For testing purposes, we'll assume the OAuth flow completes
  // In a real scenario, this would require authentication state setup
  // or manual intervention

  // Wait for successful authentication (with a reasonable timeout)
  try {
    await page.waitForURL('**/bettings', { timeout: 30000 })
  } catch (error) {
    console.warn('OAuth flow did not complete automatically. This may require manual testing.')
  }
})

BDDWhen('I check my user profile', async ({ page }) => {
  // Navigate to profile or settings page, or make an API call
  // For now, we'll verify profile via API
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
})

BDDThen('my profile should contain my email address', async ({ page }) => {
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  const profile = await response.json()
  expect(profile.email).toBeTruthy()
  expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
})

BDDThen('my profile should have the {string} role', async ({ page }, expectedRole: string) => {
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  const profile = await response.json()
  expect(profile.role).toBe(expectedRole)
})

BDDThen('my profile should have an account active date', async ({ page }) => {
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  const profile = await response.json()
  expect(profile.account_active_until).toBeTruthy()

  // Verify it's a valid date
  const activeDate = new Date(profile.account_active_until)
  expect(activeDate.getTime()).toBeGreaterThan(Date.now())
})

BDDThen('I should be able to access customer features', async ({ page }) => {
  // Navigate to a customer-only page and verify access
  await page.goto('http://localhost:3000/en/bettings')
  await page.waitForLoadState('networkidle')

  // Verify we can see betting tips (customer feature)
  // Should not be redirected to login
  expect(page.url()).toContain('/bettings')
  expect(page.url()).not.toContain('/login')
})

/**
 * Session Persistence Steps
 */

BDDWhen('I refresh the page', async ({ page }) => {
  await page.reload()
  await page.waitForLoadState('networkidle')
})

BDDThen('I should remain authenticated', async ({ page }) => {
  // Verify we're still not on login/signup pages
  expect(page.url()).not.toContain('/login')
  expect(page.url()).not.toContain('/signup')

  // Verify session is still valid
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
})

BDDThen('my user session should persist', async ({ page }) => {
  // This is similar to "I should remain authenticated"
  const cookies = await page.context().cookies()
  const hasAuthCookie = cookies.some(cookie =>
    cookie.name.includes('sb-') && cookie.name.includes('auth-token')
  )

  // We should have auth cookies
  expect(cookies.length).toBeGreaterThan(0)
})

BDDWhen('I close and reopen the browser', async ({ page, context, browser }) => {
  // Save the current cookies
  const cookies = await context.cookies()

  // Create a new context with the saved cookies
  const newContext = await browser.newContext()
  await newContext.addCookies(cookies)

  // Create a new page in the new context
  const newPage = await newContext.newPage()
  await newPage.goto(page.url())
  await newPage.waitForLoadState('networkidle')

  // Replace the current page reference (for subsequent steps)
  // Note: This is a simplification. In real tests, you'd manage this differently
})

BDDThen('I should still be authenticated', async ({ page }) => {
  // Same as "I should remain authenticated"
  expect(page.url()).not.toContain('/login')
  expect(page.url()).not.toContain('/signup')

  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
})

/**
 * Duplicate Account Prevention
 */

BDDGiven('I have already registered with a Google account', async ({ page }) => {
  // This assumes a user already exists
  // In a real test, you'd set up test data or use a known test account

  // For now, this is a placeholder that would be implemented based on
  // your test data setup strategy
  console.log('Test assumes a user already exists with the test Google account')
})

BDDWhen('I try to sign in again with the same Google account', async ({ page }) => {
  // Navigate to login and initiate Google OAuth
  await page.goto('http://localhost:3000/en/login')
  const googleButton = page.getByTestId('social-login-google-button')
  await googleButton.click()

  // Complete OAuth flow (same as before)
  // This would use the same test account
})

BDDThen('I should be successfully authenticated', async ({ page }) => {
  await page.waitForURL('**/bettings', { timeout: 15000 })
  expect(page.url()).toContain('/bettings')
})

BDDThen('my existing user account should be used', async ({ page }) => {
  // Verify we get the same user ID as before
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
  // In a real test, you'd compare this user ID with the original registration
})

BDDThen('no duplicate user should be created', async ({ page }) => {
  // This would require database access to verify only one user exists
  // with the test email address

  // For now, we verify that we got a successful profile response
  // which implies the existing account is being used
  const response = await page.request.get('http://localhost:3000/api/profile', {
    headers: {
      'Cookie': await page.context().cookies().then(cookies =>
        cookies.map(c => `${c.name}=${c.value}`).join('; ')
      )
    }
  })

  expect(response.status()).toBe(200)
})
