import { test, expect } from '@playwright/test'

test.describe('Authentication Flows', () => {
  test('should show login page elements', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await expect(page).toHaveTitle(/Login | Stavky/i)
    
    // Check for email and password fields
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
  })

  test('should navigate from home to login', async ({ page }) => {
    await page.goto('http://localhost:3000')
    // Use more specific locator for the sign in button in the nav or hero
    await page.getByRole('link', { name: 'Sign in' }).first().click()
    await expect(page).toHaveURL(/.*\/login/)
  })

  test('should navigate from home to signup', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByRole('link', { name: 'Sign up' }).first().click()
    await expect(page).toHaveURL(/.*\/signup/)
  })

  test('should show validation errors on empty login', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // Trigger validation by clicking submit without filling fields
    await page.getByRole('button', { name: 'Sign in', exact: true }).click()
    
    // Check if the email input has the :invalid pseudo-class
    const emailInput = page.getByLabel('Email')
    const isInvalid = await emailInput.evaluate((el) => {
      return (el as HTMLInputElement).checkValidity() === false
    })
    expect(isInvalid).toBe(true)
  })
})
