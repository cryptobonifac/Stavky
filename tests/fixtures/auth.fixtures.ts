/**
 * Authentication Test Fixtures
 *
 * This file provides fixtures and utilities for testing authentication flows,
 * particularly Google OAuth registration and login.
 */

import { test as base, expect, type Page, type BrowserContext } from '@playwright/test'
import type { UserProfile } from '@/components/providers/auth-provider'

/**
 * Extended test fixtures for authentication testing
 */
export const test = base.extend<{
  authenticatedPage: Page
  bettingUserPage: Page
}>({
  /**
   * Authenticated page fixture
   * Provides a page that is already authenticated with a test user
   */
  authenticatedPage: async ({ page, context }, use) => {
    // This fixture would set up an authenticated session
    // For OAuth, you'd typically use a saved authentication state

    // Load saved auth state if it exists
    const authFile = 'tests/.auth/user.json'
    try {
      await context.addCookies(require(authFile).cookies)
    } catch {
      console.warn('No saved auth state found. Tests may need manual authentication.')
    }

    await use(page)
  },

  /**
   * Betting user page fixture
   * Provides a page authenticated as a betting role user
   */
  bettingUserPage: async ({ page, context }, use) => {
    const authFile = 'tests/.auth/betting-user.json'
    try {
      await context.addCookies(require(authFile).cookies)
    } catch {
      console.warn('No saved betting user auth state found.')
    }

    await use(page)
  },
})

/**
 * Authentication Helper Class
 * Provides methods for common authentication operations in tests
 */
export class AuthHelper {
  constructor(
    protected page: Page,
    protected context: BrowserContext
  ) {}

  /**
   * Clear all authentication state
   */
  async clearAuth(): Promise<void> {
    await this.context.clearCookies()
    await this.page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  }

  /**
   * Check if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const cookies = await this.context.cookies()
    return cookies.some(cookie =>
      cookie.name.includes('sb-') && cookie.name.includes('auth-token')
    )
  }

  /**
   * Get the current user profile
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const cookies = await this.context.cookies()
      const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')

      const response = await this.page.request.get('http://localhost:3000/api/profile', {
        headers: { Cookie: cookieHeader },
      })

      if (response.status() === 200) {
        return await response.json()
      }
    } catch (error) {
      console.error('Failed to get user profile:', error)
    }

    return null
  }

  /**
   * Wait for authentication to complete
   */
  async waitForAuthentication(timeout = 30000): Promise<boolean> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      if (await this.isAuthenticated()) {
        return true
      }
      await this.page.waitForTimeout(500)
    }

    return false
  }

  /**
   * Verify user has expected role
   */
  async verifyUserRole(expectedRole: 'betting' | 'customer'): Promise<void> {
    const profile = await this.getUserProfile()
    expect(profile).not.toBeNull()
    expect(profile?.role).toBe(expectedRole)
  }

  /**
   * Verify account is active
   */
  async verifyAccountActive(): Promise<void> {
    const profile = await this.getUserProfile()
    expect(profile).not.toBeNull()
    expect(profile?.account_active_until).toBeTruthy()

    const activeUntil = new Date(profile!.account_active_until!)
    expect(activeUntil.getTime()).toBeGreaterThan(Date.now())
  }

  /**
   * Save authentication state for reuse
   */
  async saveAuthState(filename: string): Promise<void> {
    const cookies = await this.context.cookies()
    const storage = await this.page.evaluate(() => ({
      localStorage: { ...localStorage },
      sessionStorage: { ...sessionStorage },
    }))

    const authState = {
      cookies,
      origins: [
        {
          origin: 'http://localhost:3000',
          localStorage: storage.localStorage,
        },
      ],
    }

    const fs = require('fs')
    const path = require('path')
    const authDir = path.dirname(filename)

    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true })
    }

    fs.writeFileSync(filename, JSON.stringify(authState, null, 2))
  }

  /**
   * Load authentication state
   */
  async loadAuthState(filename: string): Promise<boolean> {
    try {
      const fs = require('fs')
      const authState = JSON.parse(fs.readFileSync(filename, 'utf-8'))

      await this.context.addCookies(authState.cookies)

      if (authState.origins?.[0]?.localStorage) {
        await this.page.goto('http://localhost:3000')
        await this.page.evaluate((storage) => {
          Object.entries(storage).forEach(([key, value]) => {
            localStorage.setItem(key, value as string)
          })
        }, authState.origins[0].localStorage)
      }

      return true
    } catch (error) {
      console.error('Failed to load auth state:', error)
      return false
    }
  }
}

/**
 * Google OAuth Test Helper
 * Provides methods specific to testing Google OAuth flows
 */
export class GoogleOAuthHelper extends AuthHelper {
  /**
   * Click the Google login button
   */
  async clickGoogleButton(): Promise<void> {
    const googleButton = this.page.getByTestId('social-login-google-button')
    await expect(googleButton).toBeVisible()
    await googleButton.click()
  }

  /**
   * Wait for redirect to Google OAuth
   */
  async waitForGoogleRedirect(timeout = 10000): Promise<boolean> {
    try {
      await this.page.waitForURL(/accounts\.google\.com/, { timeout })
      return true
    } catch {
      return false
    }
  }

  /**
   * Perform automated Google login
   * Note: Requires TEST_GOOGLE_EMAIL and TEST_GOOGLE_PASSWORD environment variables
   */
  async performGoogleLogin(email?: string, password?: string): Promise<boolean> {
    const testEmail = email || process.env.TEST_GOOGLE_EMAIL
    const testPassword = password || process.env.TEST_GOOGLE_PASSWORD

    if (!testEmail || !testPassword) {
      console.warn('TEST_GOOGLE_EMAIL and TEST_GOOGLE_PASSWORD not set. Cannot automate OAuth.')
      return false
    }

    try {
      // Wait for Google's login page
      await this.page.waitForURL(/accounts\.google\.com/, { timeout: 10000 })

      // Fill email
      const emailInput = this.page.locator('input[type="email"]').first()
      if (await emailInput.isVisible({ timeout: 5000 })) {
        await emailInput.fill(testEmail)
        await this.page.keyboard.press('Enter')
        await this.page.waitForTimeout(2000)
      }

      // Fill password
      const passwordInput = this.page.locator('input[type="password"]').first()
      if (await passwordInput.isVisible({ timeout: 5000 })) {
        await passwordInput.fill(testPassword)
        await this.page.keyboard.press('Enter')
        await this.page.waitForTimeout(2000)
      }

      // Handle consent screen if it appears
      await this.grantPermissions()

      // Wait for redirect back to our app
      await this.page.waitForURL(/localhost:3000/, { timeout: 15000 })

      return true
    } catch (error) {
      console.error('Automated Google login failed:', error)
      return false
    }
  }

  /**
   * Grant permissions on Google's consent screen
   */
  async grantPermissions(): Promise<void> {
    try {
      const continueButton = this.page
        .locator('button:has-text("Continue"), button:has-text("Allow")')
        .first()

      if (await continueButton.isVisible({ timeout: 5000 })) {
        await continueButton.click()
        await this.page.waitForTimeout(1000)
      }
    } catch {
      // Consent screen may not appear if permissions already granted
      console.log('No consent screen found, permissions may be already granted')
    }
  }

  /**
   * Complete the full OAuth registration flow
   */
  async completeOAuthRegistration(fromPage: 'login' | 'signup' = 'signup'): Promise<boolean> {
    // Navigate to the appropriate page
    await this.page.goto(`http://localhost:3000/en/${fromPage}`)
    await this.page.waitForLoadState('networkidle')

    // Click Google button
    await this.clickGoogleButton()

    // Perform Google login
    const loginSuccess = await this.performGoogleLogin()
    if (!loginSuccess) {
      return false
    }

    // Wait for authentication to complete
    return await this.waitForAuthentication()
  }

  /**
   * Verify successful OAuth callback
   */
  async verifyOAuthCallback(expectedRedirectPath = '/bettings'): Promise<void> {
    // Wait for redirect to expected page
    await this.page.waitForURL(`**${expectedRedirectPath}`, { timeout: 15000 })

    // Verify we're authenticated
    const isAuth = await this.isAuthenticated()
    expect(isAuth).toBe(true)

    // Verify user profile was created
    const profile = await this.getUserProfile()
    expect(profile).not.toBeNull()
    expect(profile?.email).toBeTruthy()
  }
}

/**
 * Test Data Generator
 * Provides utilities for generating test data
 */
export class TestDataGenerator {
  /**
   * Generate a unique test email
   */
  static generateTestEmail(prefix = 'test'): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `${prefix}+${timestamp}${random}@gmail.com`
  }

  /**
   * Get betting account test emails
   */
  static getBettingAccountEmails(): string[] {
    return [
      'igorpod69@gmail.com',
      'busikpartners@gmail.com',
      'marek.rohon@gmail.com',
    ]
  }

  /**
   * Check if email is a betting account
   */
  static isBettingAccountEmail(email: string): boolean {
    return this.getBettingAccountEmails().includes(email.toLowerCase())
  }
}

/**
 * Exports
 */
export { expect }
