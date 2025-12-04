import { test, expect } from '@playwright/test'

test.describe('Navigation Tests', () => {
  test('should display unauthenticated navigation items', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Should see Sign in and Sign up buttons
    await expect(page.getByRole('link', { name: 'Sign in' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign up' }).first()).toBeVisible()
    
    // Should NOT see Settings or Logout
    await expect(page.getByRole('link', { name: 'Settings' })).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Logout' })).not.toBeVisible()
  })
})

