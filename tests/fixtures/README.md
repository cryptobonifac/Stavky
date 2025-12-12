# Authentication Test Fixtures

This directory contains test fixtures and helpers for authentication testing, particularly for Google OAuth flows.

## Files

- **auth.fixtures.ts** - Main authentication fixtures and helper classes

## Usage

### Basic Authentication Helper

```typescript
import { test } from '@playwright/test'
import { AuthHelper } from './fixtures/auth.fixtures'

test('test with auth helper', async ({ page, context }) => {
  const authHelper = new AuthHelper(page, context)

  // Clear authentication state
  await authHelper.clearAuth()

  // Check if authenticated
  const isAuth = await authHelper.isAuthenticated()

  // Get user profile
  const profile = await authHelper.getUserProfile()

  // Verify user role
  await authHelper.verifyUserRole('customer')

  // Verify account is active
  await authHelper.verifyAccountActive()
})
```

### Google OAuth Helper

```typescript
import { test } from '@playwright/test'
import { GoogleOAuthHelper } from './fixtures/auth.fixtures'

test('test Google OAuth', async ({ page, context }) => {
  const oauthHelper = new GoogleOAuthHelper(page, context)

  // Navigate to signup
  await page.goto('http://localhost:3000/en/signup')

  // Click Google button
  await oauthHelper.clickGoogleButton()

  // Wait for redirect to Google
  await oauthHelper.waitForGoogleRedirect()

  // Perform automated login (requires environment variables)
  await oauthHelper.performGoogleLogin()

  // Verify callback
  await oauthHelper.verifyOAuthCallback('/bettings')
})
```

### Complete OAuth Flow

```typescript
import { test } from '@playwright/test'
import { GoogleOAuthHelper } from './fixtures/auth.fixtures'

test('complete OAuth registration', async ({ page, context }) => {
  const oauthHelper = new GoogleOAuthHelper(page, context)

  // Complete the entire OAuth flow
  const success = await oauthHelper.completeOAuthRegistration('signup')

  if (success) {
    // Verify authentication
    await oauthHelper.verifyUserRole('customer')
  }
})
```

### Saving and Loading Authentication State

```typescript
import { test } from '@playwright/test'
import { GoogleOAuthHelper } from './fixtures/auth.fixtures'

test('save auth state', async ({ page, context }) => {
  const oauthHelper = new GoogleOAuthHelper(page, context)

  // Complete OAuth flow
  await oauthHelper.completeOAuthRegistration()

  // Save authentication state for reuse
  await oauthHelper.saveAuthState('tests/.auth/user.json')
})

test('load saved auth state', async ({ page, context }) => {
  const authHelper = new AuthHelper(page, context)

  // Load previously saved auth state
  const loaded = await authHelper.loadAuthState('tests/.auth/user.json')

  if (loaded) {
    await page.goto('http://localhost:3000/en/bettings')
    // Should be authenticated without going through OAuth again
  }
})
```

### Using Authenticated Page Fixtures

```typescript
import { test } from './fixtures/auth.fixtures'

test('test with authenticated page', async ({ authenticatedPage }) => {
  // This page is already authenticated
  await authenticatedPage.goto('http://localhost:3000/en/bettings')
  // ... perform tests that require authentication
})

test('test with betting user', async ({ bettingUserPage }) => {
  // This page is authenticated as a betting user
  await bettingUserPage.goto('http://localhost:3000/en/newbet')
  // ... perform tests that require betting role
})
```

### Test Data Generator

```typescript
import { TestDataGenerator } from './fixtures/auth.fixtures'

// Generate unique test email
const email = TestDataGenerator.generateTestEmail('mytest')
// Returns: mytest+1234567890123@gmail.com

// Get betting account emails
const bettingEmails = TestDataGenerator.getBettingAccountEmails()
// Returns: ['igorpod69@gmail.com', 'busikpartners@gmail.com', 'marek.rohon@gmail.com']

// Check if email is a betting account
const isBetting = TestDataGenerator.isBettingAccountEmail('marek.rohon@gmail.com')
// Returns: true
```

## Environment Variables

For automated Google OAuth testing, set these environment variables:

```bash
# Test Google account credentials
TEST_GOOGLE_EMAIL=your-test-account@gmail.com
TEST_GOOGLE_PASSWORD=your-test-password

# Test betting account (one of the approved betting emails)
TEST_BETTING_GOOGLE_EMAIL=marek.rohon@gmail.com
```

### Setting Environment Variables

**Windows PowerShell:**
```powershell
$env:TEST_GOOGLE_EMAIL = "test@gmail.com"
$env:TEST_GOOGLE_PASSWORD = "password123"
```

**Linux/Mac:**
```bash
export TEST_GOOGLE_EMAIL="test@gmail.com"
export TEST_GOOGLE_PASSWORD="password123"
```

**Or create a `.env.test` file:**
```env
TEST_GOOGLE_EMAIL=test@gmail.com
TEST_GOOGLE_PASSWORD=password123
TEST_BETTING_GOOGLE_EMAIL=marek.rohon@gmail.com
```

## Authentication State Management

### Saving Authentication State

After completing a manual OAuth flow, you can save the authentication state:

```typescript
test('save auth after manual OAuth', async ({ page, context }) => {
  // Manually complete OAuth (or let the test run with manual intervention)
  await page.goto('http://localhost:3000/en/signup')
  // ... click through OAuth manually ...

  // Once authenticated, save the state
  const authHelper = new AuthHelper(page, context)
  await authHelper.saveAuthState('tests/.auth/user.json')
})
```

### Reusing Saved State

```typescript
test.use({ storageState: 'tests/.auth/user.json' })

test('test with saved auth', async ({ page }) => {
  // Page is already authenticated
  await page.goto('http://localhost:3000/en/bettings')
})
```

## Best Practices

1. **Never commit credentials**: Add `.env.test` and `tests/.auth/*.json` to `.gitignore`

2. **Use separate test accounts**: Create dedicated Google accounts for testing

3. **Save authentication state**: Complete OAuth once manually and save the state for faster subsequent tests

4. **Test both registration and login**: Verify OAuth works for both new users and returning users

5. **Handle timeouts gracefully**: OAuth flows may be slow; use appropriate timeouts

6. **Clean up test data**: After tests, clean up any test users created in the database

7. **Mock OAuth in CI/CD**: For continuous integration, consider mocking the OAuth provider

## Troubleshooting

### OAuth Flow Hangs

If tests hang during OAuth:
1. Check that `TEST_GOOGLE_EMAIL` and `TEST_GOOGLE_PASSWORD` are set
2. Verify Google credentials are correct
3. Check if Google requires additional verification (2FA, captcha)
4. Consider using saved authentication state instead

### Authentication Not Persisting

If authentication doesn't persist:
1. Verify cookies are being saved
2. Check that Supabase session cookies are present
3. Ensure `storageState` is properly configured
4. Check for cookie domain/path issues

### Role Assignment Issues

If user doesn't get expected role:
1. Verify database migrations are applied
2. Check the `is_betting_account_email` function in database
3. Verify email matches exactly (case-sensitive)
4. Check trigger function `handle_new_auth_user` is working

### Tests Fail in CI/CD

For CI/CD environments:
1. Use saved authentication state
2. Mock the OAuth provider
3. Use Playwright's authentication helpers
4. Consider using test mode OAuth credentials if available

## See Also

- [Playwright Authentication Guide](https://playwright.dev/docs/auth)
- [Google OAuth Testing Best Practices](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
