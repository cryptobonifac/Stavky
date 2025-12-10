import { test, expect } from '@playwright/test'

test.describe('Contact Form E2E', () => {
  test('should successfully submit contact form with valid data (happy path)', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact')

    // Verify we're on the contact page
    await expect(page).toHaveURL(/.*\/contact/)

    // Verify form elements are visible
    const emailField = page.getByLabel(/email/i).first()
    const mobileField = page.getByLabel(/mobile/i).first()
    const messageField = page.getByLabel(/message/i).first()
    const submitButton = page.getByRole('button', { name: /send message|odoslať správu|odeslat zprávu/i })

    await expect(emailField).toBeVisible()
    await expect(mobileField).toBeVisible()
    await expect(messageField).toBeVisible()
    await expect(submitButton).toBeVisible()

    // Fill in valid form data
    const testEmail = 'test@example.com'
    const testMobile = '+421 123 456 789'
    const testMessage = 'This is a test message for the contact form. It contains enough characters to pass validation.'

    await emailField.fill(testEmail)
    await mobileField.fill(testMobile)
    await messageField.fill(testMessage)

    // Verify fields are filled
    await expect(emailField).toHaveValue(testEmail)
    await expect(mobileField).toHaveValue(testMobile)
    await expect(messageField).toHaveValue(testMessage)

    // Wait for API response and submit form
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/contact') && response.request().method() === 'POST',
      { timeout: 10000 }
    )

    await submitButton.click()

    // Wait for API response
    const response = await responsePromise

    // Verify API response is successful
    expect(response.status()).toBe(200)

    const responseData = await response.json()
    expect(responseData).toHaveProperty('success', true)
    expect(responseData).toHaveProperty('message')

    // Verify success message is displayed
    const successAlert = page.getByText(/thank you|ďakujeme|děkujeme/i).first()
    await expect(successAlert).toBeVisible({ timeout: 5000 })

    // Verify form fields are cleared after successful submission
    await expect(emailField).toHaveValue('')
    await expect(mobileField).toHaveValue('')
    await expect(messageField).toHaveValue('')
  })

  test('should submit contact form with only email (optional fields empty)', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact')

    // Fill in only email (required field)
    const testEmail = 'minimal@example.com'
    const emailField = page.getByLabel(/email/i).first()
    const submitButton = page.getByRole('button', { name: /send message|odoslať správu|odeslat zprávu/i })

    await emailField.fill(testEmail)

    // Leave mobile and message empty (they are optional)

    // Wait for API response and submit form
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/contact') && response.request().method() === 'POST',
      { timeout: 10000 }
    )

    await submitButton.click()

    // Wait for API response
    const response = await responsePromise

    // Verify API response is successful
    expect(response.status()).toBe(200)

    // Verify success message is displayed
    const successAlert = page.getByText(/thank you|ďakujeme|děkujeme/i).first()
    await expect(successAlert).toBeVisible({ timeout: 5000 })
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/contact')

    const emailField = page.getByLabel(/email/i).first()
    const submitButton = page.getByRole('button', { name: /send message|odoslať správu|odeslat zprávu/i })

    // Try to submit with invalid email
    await emailField.fill('invalid-email')
    await submitButton.click()

    // Should show validation error
    const errorText = page.getByText(/invalid|neplatn|neplatn/i)
    await expect(errorText.first()).toBeVisible({ timeout: 2000 })
  })

  test('should require email field', async ({ page }) => {
    await page.goto('/contact')

    const submitButton = page.getByRole('button', { name: /send message|odoslať správu|odeslat zprávu/i })

    // Try to submit without email
    await submitButton.click()

    // Should show validation error for required email
    const errorText = page.getByText(/required|povinn|povinn/i)
    await expect(errorText.first()).toBeVisible({ timeout: 2000 })
  })
})

