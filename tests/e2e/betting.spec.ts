import { test, expect } from '@playwright/test'

test.describe('Betting Pages Access', () => {
  test('should redirect unauthenticated user from betting tips', async ({ page }) => {
    await page.goto('http://localhost:3000/bettings')
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login\?redirectedFrom=\/bettings/)
  })

  test('should redirect unauthenticated user from new bet page', async ({ page }) => {
    await page.goto('http://localhost:3000/newbet')
    await expect(page).toHaveURL(/.*\/login\?redirectedFrom=\/newbet/)
  })

  test('should redirect unauthenticated user from manage page', async ({ page }) => {
    await page.goto('http://localhost:3000/bettings/manage')
    await expect(page).toHaveURL(/.*\/login\?redirectedFrom=\/bettings\/manage/)
  })
})

