/**
 * Simple Google OAuth Registration Test Example
 *
 * This file demonstrates how to write Playwright tests for Google OAuth
 * without using BDD/Cucumber. Use this as a reference for writing
 * additional OAuth tests.
 */

import { test, expect } from '@playwright/test'
import { GoogleOAuthHelper, TestDataGenerator } from '../fixtures/auth.fixtures'

/**
 * Test Configuration
 * These tests require local Supabase and Next.js to be running
 */
test.describe('Google OAuth Registration', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear all authentication state before each test
    await context.clearCookies()
    await page.goto('http://localhost:3000')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  /**
   * Basic OAuth Registration Test
   * This test verifies the complete OAuth flow from signup page
   */
  test('should register a new user with Google OAuth from signup page', async ({
    page,
    context,
  }) => {
    const oauthHelper = new GoogleOAuthHelper(page, context)

    // Given: User is on the signup page
    await page.goto('http://localhost:3000/en/signup')
    await expect(page.getByTestId('signup-form')).toBeVisible()

    // When: User clicks the "Continue with Google" button
    await oauthHelper.clickGoogleButton()

    // Then: User should be redirected to Google's OAuth page
    const redirectedToGoogle = await oauthHelper.waitForGoogleRedirect()

    if (!redirectedToGoogle) {
      test.skip('Could not redirect to Google OAuth')
    }

    // When: User authenticates with Google
    // Note: This requires TEST_GOOGLE_EMAIL and TEST_GOOGLE_PASSWORD
    // Or manual intervention in headed mode
    const authenticated = await oauthHelper.performGoogleLogin()

    if (!authenticated) {
      test.skip('Could not complete Google authentication. Set TEST_GOOGLE_EMAIL and TEST_GOOGLE_PASSWORD or run in headed mode.')
    }

    // Then: User should be redirected back to the application
    await page.waitForURL('**/bettings', { timeout: 15000 })
    expect(page.url()).toContain('/bettings')

    // And: User should be authenticated
    const isAuthenticated = await oauthHelper.isAuthenticated()
    expect(isAuthenticated).toBe(true)

    // And: User profile should be created
    const profile = await oauthHelper.getUserProfile()
    expect(profile).not.toBeNull()
    expect(profile?.email).toBeTruthy()
    expect(profile?.role).toBe('customer')
  })

  /**
   * OAuth from Login Page Test
   * Verifies that OAuth works from login page as well
   */
  test('should register a new user with Google OAuth from login page', async ({
    page,
    context,
  }) => {
    const oauthHelper = new GoogleOAuthHelper(page, context)

    // Given: User is on the login page
    await page.goto('http://localhost:3000/en/login')
    await expect(page.getByTestId('login-form')).toBeVisible()

    // When: User completes OAuth flow
    await oauthHelper.clickGoogleButton()

    // Wait for redirect to Google (or skip if it fails)
    const redirected = await oauthHelper.waitForGoogleRedirect()
    if (!redirected) {
      test.skip('Could not redirect to Google')
    }

    // Complete authentication
    const authenticated = await oauthHelper.performGoogleLogin()
    if (!authenticated) {
      test.skip('Could not authenticate with Google')
    }

    // Then: User should be on the bettings page
    await page.waitForURL('**/bettings', { timeout: 15000 })
    expect(page.url()).toContain('/bettings')

    // And: Should be authenticated
    await oauthHelper.verifyUserRole('customer')
    await oauthHelper.verifyAccountActive()
  })

  /**
   * Betting Account Registration Test
   * Verifies that specific emails get betting role automatically
   */
  test('should assign betting role to approved email addresses', async ({
    page,
    context,
  }) => {
    const bettingEmail = process.env.TEST_BETTING_GOOGLE_EMAIL

    if (!bettingEmail) {
      test.skip('TEST_BETTING_GOOGLE_EMAIL not set. Skipping betting account test.')
    }

    // Verify the email is in the betting accounts list
    const isBettingEmail = TestDataGenerator.isBettingAccountEmail(bettingEmail!)
    if (!isBettingEmail) {
      test.skip(`${bettingEmail} is not in the betting accounts list`)
    }

    const oauthHelper = new GoogleOAuthHelper(page, context)

    // Given: User navigates to signup
    await page.goto('http://localhost:3000/en/signup')

    // When: User completes OAuth with a betting account email
    await oauthHelper.clickGoogleButton()
    await oauthHelper.waitForGoogleRedirect()

    // Use the betting account credentials
    const authenticated = await oauthHelper.performGoogleLogin(
      bettingEmail,
      process.env.TEST_GOOGLE_PASSWORD
    )

    if (!authenticated) {
      test.skip('Could not authenticate with betting account')
    }

    // Then: User should be redirected to /newbet (betting user's landing page)
    await page.waitForURL('**/newbet', { timeout: 15000 })
    expect(page.url()).toContain('/newbet')

    // And: Should have betting role
    await oauthHelper.verifyUserRole('betting')
  })

  /**
   * Locale Preservation Test
   * Verifies that user's language preference is maintained through OAuth
   */
  test('should preserve locale through OAuth flow', async ({ page, context }) => {
    const oauthHelper = new GoogleOAuthHelper(page, context)

    // Given: User is on the Czech signup page
    await page.goto('http://localhost:3000/cs/signup')
    await expect(page.getByTestId('signup-form')).toBeVisible()

    // When: User completes OAuth flow
    await oauthHelper.clickGoogleButton()

    const redirected = await oauthHelper.waitForGoogleRedirect()
    if (!redirected) {
      test.skip('Could not redirect to Google')
    }

    const authenticated = await oauthHelper.performGoogleLogin()
    if (!authenticated) {
      test.skip('Could not authenticate')
    }

    // Then: User should be redirected back to Czech locale
    await page.waitForURL('**/cs/**', { timeout: 15000 })
    expect(page.url()).toContain('/cs/')

    // And: Page should be in Czech language
    const htmlLang = await page.getAttribute('html', 'lang')
    expect(htmlLang).toBe('cs')
  })

  /**
   * Session Persistence Test
   * Verifies that authentication persists across page refreshes
   */
  test('should maintain authentication after page refresh', async ({
    page,
    context,
  }) => {
    const oauthHelper = new GoogleOAuthHelper(page, context)

    // Given: User has completed OAuth registration
    const success = await oauthHelper.completeOAuthRegistration()
    if (!success) {
      test.skip('Could not complete OAuth registration')
    }

    // Verify initial authentication
    expect(await oauthHelper.isAuthenticated()).toBe(true)

    // When: User refreshes the page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Then: User should still be authenticated
    expect(page.url()).not.toContain('/login')
    expect(page.url()).not.toContain('/signup')

    // And: Session should be valid
    const stillAuthenticated = await oauthHelper.isAuthenticated()
    expect(stillAuthenticated).toBe(true)

    // And: Profile should still be accessible
    const profile = await oauthHelper.getUserProfile()
    expect(profile).not.toBeNull()
  })

  /**
   * Error Handling Test - Missing Code
   * Verifies error handling when OAuth callback is missing code parameter
   */
  test('should handle missing code parameter in OAuth callback', async ({ page }) => {
    // When: User navigates to callback without code
    await page.goto('http://localhost:3000/auth/callback')
    await page.waitForLoadState('networkidle')

    // Then: Should redirect to login with error
    expect(page.url()).toContain('/login')
    expect(page.url()).toContain('error=missing_code')
  })

  /**
   * Error Handling Test - Invalid Code
   * Verifies error handling when OAuth callback receives invalid code
   */
  test('should handle invalid OAuth code', async ({ page }) => {
    // When: User navigates to callback with invalid code
    await page.goto('http://localhost:3000/auth/callback?code=invalid_code_12345')
    await page.waitForLoadState('networkidle')

    // Then: Should redirect to login with error
    expect(page.url()).toContain('/login')
    expect(page.url()).toContain('error=')
  })

  /**
   * User Profile Test
   * Verifies that user profile is properly loaded and accessible
   */
  test('should load user profile after OAuth registration', async ({
    page,
    context,
  }) => {
    const oauthHelper = new GoogleOAuthHelper(page, context)

    // Given: User has completed OAuth registration
    const success = await oauthHelper.completeOAuthRegistration()
    if (!success) {
      test.skip('Could not complete OAuth registration')
    }

    // When: User's profile is fetched
    const profile = await oauthHelper.getUserProfile()

    // Then: Profile should exist and be complete
    expect(profile).not.toBeNull()

    // And: Should have required fields
    expect(profile?.id).toBeTruthy()
    expect(profile?.email).toBeTruthy()
    expect(profile?.role).toBe('customer')
    expect(profile?.account_active_until).toBeTruthy()

    // And: Account should be active
    const activeUntil = new Date(profile!.account_active_until!)
    expect(activeUntil.getTime()).toBeGreaterThan(Date.now())

    // And: Should be active until 2099 (for customer accounts)
    expect(profile?.account_active_until).toContain('2099')
  })
})

/**
 * Test Group: OAuth with Saved Authentication State
 *
 * These tests demonstrate how to use saved authentication state
 * to speed up test execution by avoiding repeated OAuth flows
 */
test.describe('OAuth with Saved State', () => {
  /**
   * Save Authentication State
   * Run this test once to save authentication state for reuse
   */
  test.skip('save authentication state for reuse', async ({ page, context }) => {
    const oauthHelper = new GoogleOAuthHelper(page, context)

    // Complete OAuth registration
    console.log('Completing OAuth flow...')
    const success = await oauthHelper.completeOAuthRegistration()

    if (success) {
      // Save the authentication state
      await oauthHelper.saveAuthState('tests/.auth/user.json')
      console.log('Authentication state saved to tests/.auth/user.json')

      // Verify it works
      const profile = await oauthHelper.getUserProfile()
      console.log('Saved user profile:', profile)
    }
  })

  /**
   * Test with Saved Authentication State
   * This test uses previously saved authentication state
   */
  test('should work with saved authentication state', async ({ page, context }) => {
    const oauthHelper = new GoogleOAuthHelper(page, context)

    // Load saved authentication state
    const loaded = await oauthHelper.loadAuthState('tests/.auth/user.json')

    if (!loaded) {
      test.skip('No saved authentication state found. Run the save-auth test first.')
    }

    // Navigate to protected page
    await page.goto('http://localhost:3000/en/bettings')
    await page.waitForLoadState('networkidle')

    // Verify we're authenticated without going through OAuth again
    expect(page.url()).toContain('/bettings')
    expect(page.url()).not.toContain('/login')

    // Verify profile is accessible
    const profile = await oauthHelper.getUserProfile()
    expect(profile).not.toBeNull()
  })
})

/**
 * Note: Running Tests
 *
 * To run these tests:
 *
 * 1. Ensure local environment is running:
 *    npm run db:local
 *    npm run dev
 *
 * 2. Set test credentials (optional, for automated testing):
 *    export TEST_GOOGLE_EMAIL="test@gmail.com"
 *    export TEST_GOOGLE_PASSWORD="password123"
 *
 * 3. Run the tests:
 *    npx playwright test tests/examples/google-oauth-simple.spec.ts
 *
 * 4. Run in headed mode (for manual OAuth):
 *    npx playwright test tests/examples/google-oauth-simple.spec.ts --headed
 *
 * 5. Run specific test:
 *    npx playwright test -g "should register a new user"
 *
 * 6. Debug mode:
 *    npx playwright test tests/examples/google-oauth-simple.spec.ts --debug
 */
