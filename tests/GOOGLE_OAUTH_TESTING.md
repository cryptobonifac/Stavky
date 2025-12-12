# Google OAuth Testing Guide

This guide explains how to run and maintain tests for Google OAuth registration and authentication.

## Overview

The Google OAuth tests verify that users can:
- Register using their Google account
- Authenticate through Google's OAuth flow
- Have their account properly created with correct roles and permissions
- Maintain authenticated sessions across page refreshes and browser restarts

## Test Files

```
tests/
├── features/
│   └── google-oauth-registration.feature    # BDD feature definitions
├── steps/
│   └── google-oauth-registration.steps.ts   # Step implementations
├── fixtures/
│   ├── auth.fixtures.ts                     # Authentication helpers
│   └── README.md                            # Fixture documentation
└── GOOGLE_OAUTH_TESTING.md                  # This file
```

## Prerequisites

### 1. Local Environment Setup

Ensure your local environment is properly configured:

```bash
# Start local Supabase
npm run db:local

# Start Next.js development server
npm run dev
```

### 2. Environment Variables

Create a `.env.test` file (or set environment variables):

```env
# Test Google Account
TEST_GOOGLE_EMAIL=your-test-google-account@gmail.com
TEST_GOOGLE_PASSWORD=your-test-password

# Test Betting Account (optional - for testing betting role assignment)
TEST_BETTING_GOOGLE_EMAIL=marek.rohon@gmail.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Important**: Never commit real credentials! Add `.env.test` to `.gitignore`.

### 3. Google OAuth Configuration

Verify Google OAuth is properly configured:

1. **Google Cloud Console**:
   - Authorized redirect URI: `http://localhost:54321/auth/v1/callback`
   - Test users added (if in testing mode)

2. **Supabase Local Config** (`supabase/config.toml`):
   ```toml
   [auth.external.google]
   enabled = true
   client_id = "env(GOOGLE_CLIENT_ID)"
   secret = "env(GOOGLE_CLIENT_SECRET)"
   redirect_uri = "env(GOOGLE_REDIRECT_URL)"
   ```

3. **Environment Variables** (set before starting Supabase):
   ```bash
   export GOOGLE_CLIENT_ID="your-google-client-id"
   export GOOGLE_CLIENT_SECRET="your-google-client-secret"
   export GOOGLE_REDIRECT_URL="http://localhost:54321/auth/v1/callback"
   ```

## Running Tests

### Run All Google OAuth Tests

```bash
npx playwright test tests/features/google-oauth-registration.feature
```

### Run Specific Scenario

```bash
# Run only the successful registration scenario
npx playwright test tests/features/google-oauth-registration.feature:6

# Run by scenario name
npx playwright test --grep "Successful registration with Google OAuth"
```

### Run with UI Mode (Recommended for Debugging)

```bash
npx playwright test tests/features/google-oauth-registration.feature --ui
```

This provides:
- Visual test execution
- Step-by-step debugging
- Network request inspection
- Console log viewing

### Run in Debug Mode

```bash
npx playwright test tests/features/google-oauth-registration.feature --debug
```

This opens the Playwright Inspector for detailed debugging.

## Test Scenarios

### 1. Successful Registration with Google OAuth

**What it tests**:
- User can click "Continue with Google" button
- Redirects to Google OAuth consent page
- After authentication, redirects back to application
- User is authenticated and on the correct page
- User account is created in database
- User has "customer" role
- Account is active until 2099-12-31

**Expected outcome**: New user successfully registered and authenticated.

### 2. Registration from Login Page

**What it tests**:
- OAuth works from both signup and login pages
- New users can register from login page via Google

**Expected outcome**: Registration works from login page.

### 3. User Profile Loading

**What it tests**:
- User profile is properly loaded after registration
- Profile contains correct email
- Profile has correct role
- Profile has active account date
- User can access customer features

**Expected outcome**: User profile is complete and accessible.

### 4. Betting Account Registration

**What it tests**:
- Specific emails get "betting" role automatically
- Betting users redirect to `/newbet` instead of `/bettings`
- Account is active for one year instead of until 2099

**Expected outcome**: Betting accounts get special treatment.

### 5. Session Persistence

**What it tests**:
- Session persists after page refresh
- Session persists after browser close/reopen
- Authentication cookies remain valid

**Expected outcome**: Users stay logged in.

### 6. Error Handling

**What it tests**:
- Missing code parameter shows error
- Invalid code parameter shows error
- User sees appropriate error messages

**Expected outcome**: Errors are handled gracefully.

### 7. Locale Preservation

**What it tests**:
- User's language preference is maintained through OAuth flow
- Czech users stay on Czech pages
- Locale is passed correctly through callback

**Expected outcome**: Language preference preserved.

### 8. Duplicate Account Prevention

**What it tests**:
- Existing user can log in with Google
- No duplicate accounts are created
- Existing account is reused

**Expected outcome**: No duplicates, existing account used.

## Test Modes

### Manual Testing Mode

If `TEST_GOOGLE_EMAIL` and `TEST_GOOGLE_PASSWORD` are **not** set:
- Tests will pause during OAuth flow
- Manually complete Google authentication
- Tests resume after successful authentication

**Usage**:
```bash
npx playwright test --headed tests/features/google-oauth-registration.feature
```

Then manually:
1. Click "Continue with Google"
2. Sign in to Google
3. Grant permissions
4. Test will resume automatically

### Automated Testing Mode

If `TEST_GOOGLE_EMAIL` and `TEST_GOOGLE_PASSWORD` **are** set:
- Tests will attempt automated Google login
- No manual intervention required
- Tests run fully headless

**Usage**:
```bash
export TEST_GOOGLE_EMAIL="test@gmail.com"
export TEST_GOOGLE_PASSWORD="password123"
npx playwright test tests/features/google-oauth-registration.feature
```

### Authentication State Mode (Recommended)

Save authentication state once, reuse for all tests:

**Step 1**: Save auth state (run once)
```typescript
test('save auth state', async ({ page, context }) => {
  const oauthHelper = new GoogleOAuthHelper(page, context)
  await oauthHelper.completeOAuthRegistration()
  await oauthHelper.saveAuthState('tests/.auth/user.json')
})
```

**Step 2**: Use saved state in tests
```typescript
test.use({ storageState: 'tests/.auth/user.json' })

test('test with saved auth', async ({ page }) => {
  await page.goto('http://localhost:3000/en/bettings')
  // Already authenticated!
})
```

## Troubleshooting

### Tests Hang During OAuth

**Problem**: Test gets stuck on Google's OAuth page.

**Solutions**:
1. Run in headed mode to see what's happening:
   ```bash
   npx playwright test --headed
   ```

2. Set test credentials:
   ```bash
   export TEST_GOOGLE_EMAIL="test@gmail.com"
   export TEST_GOOGLE_PASSWORD="password123"
   ```

3. Use saved authentication state instead

4. Check for Google's 2FA or captcha requirements

### Authentication Doesn't Persist

**Problem**: User is not authenticated after OAuth.

**Solutions**:
1. Check Supabase is running:
   ```bash
   npx supabase status
   ```

2. Verify cookies are being set:
   ```typescript
   const cookies = await context.cookies()
   console.log(cookies)
   ```

3. Check Supabase auth configuration

4. Verify callback route is working:
   ```bash
   curl http://localhost:3000/auth/callback
   ```

### Role Not Assigned Correctly

**Problem**: User doesn't get expected role.

**Solutions**:
1. Check database migrations are applied:
   ```bash
   npx supabase db reset
   ```

2. Verify trigger function exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

3. Check email is in betting accounts list (for betting role)

4. Verify `is_betting_account_email` function:
   ```sql
   SELECT public.is_betting_account_email('your-email@gmail.com');
   ```

### Tests Fail in CI/CD

**Problem**: Tests pass locally but fail in CI.

**Solutions**:
1. Use saved authentication state in CI

2. Mock OAuth provider for CI:
   ```typescript
   if (process.env.CI) {
     // Use mock OAuth
   }
   ```

3. Use GitHub Actions secrets for credentials

4. Consider using Supabase test mode

### Google OAuth Errors

**Problem**: Google returns errors during OAuth.

**Common errors**:
- `redirect_uri_mismatch`: Check Google Cloud Console redirect URIs
- `invalid_client`: Check client ID and secret
- `access_denied`: User denied permissions or app not approved

**Solutions**:
1. Verify Google Cloud Console settings

2. Check redirect URI exactly matches:
   ```
   http://localhost:54321/auth/v1/callback
   ```

3. Add test users to OAuth consent screen (if in testing mode)

4. Check Supabase logs:
   ```bash
   npx supabase logs auth
   ```

## Best Practices

### 1. Use Separate Test Accounts

Create dedicated Google accounts for testing:
- `your-app-test1@gmail.com`
- `your-app-test2@gmail.com`

Don't use personal accounts for automated testing.

### 2. Save Authentication State

Complete OAuth manually once, save the state, reuse for fast tests:

```bash
# Run once to save auth
npx playwright test tests/save-auth.spec.ts --headed

# Run all other tests with saved auth
npx playwright test --global-setup tests/global-setup.ts
```

### 3. Clean Up Test Data

After test runs, clean up test users:

```sql
DELETE FROM auth.users WHERE email LIKE '%test%@gmail.com';
DELETE FROM public.users WHERE email LIKE '%test%@gmail.com';
```

### 4. Mock OAuth in CI/CD

For continuous integration, mock the OAuth flow:

```typescript
if (process.env.CI) {
  // Skip actual OAuth, use test tokens
  await mockOAuthSuccess()
} else {
  // Real OAuth for local testing
  await completeRealOAuth()
}
```

### 5. Test Edge Cases

Don't just test the happy path:
- Network failures
- Timeout scenarios
- Denied permissions
- Invalid tokens
- Expired sessions

### 6. Keep Tests Independent

Each test should:
- Set up its own data
- Clean up after itself
- Not depend on other tests
- Be runnable in any order

## Advanced Testing

### Testing with Multiple Accounts

```typescript
import { test } from './fixtures/auth.fixtures'

test.describe('Multiple user types', () => {
  test('customer user', async ({ page, context }) => {
    const helper = new GoogleOAuthHelper(page, context)
    await helper.loadAuthState('tests/.auth/customer.json')
    // Test as customer
  })

  test('betting user', async ({ page, context }) => {
    const helper = new GoogleOAuthHelper(page, context)
    await helper.loadAuthState('tests/.auth/betting.json')
    // Test as betting user
  })
})
```

### Testing Locale Handling

```typescript
test('locale preservation', async ({ page }) => {
  // Start on Czech page
  await page.goto('http://localhost:3000/cs/signup')

  // Complete OAuth
  const helper = new GoogleOAuthHelper(page, context)
  await helper.completeOAuthRegistration('signup')

  // Verify we're back on Czech page
  expect(page.url()).toContain('/cs/')
  const lang = await page.getAttribute('html', 'lang')
  expect(lang).toBe('cs')
})
```

### Testing Error Scenarios

```typescript
test('handle OAuth errors', async ({ page, route }) => {
  // Mock error response from Google
  await route('**/auth/v1/callback*', route => {
    route.fulfill({
      status: 400,
      body: 'error=access_denied',
    })
  })

  // Attempt OAuth
  await page.goto('http://localhost:3000/en/signup')
  // ... verify error handling
})
```

## Resources

- [Playwright Authentication Guide](https://playwright.dev/docs/auth)
- [Cucumber BDD Documentation](https://cucumber.io/docs/guides/)
- [playwright-bdd Documentation](https://vitalets.github.io/playwright-bdd/)
- [Supabase Auth Testing](https://supabase.com/docs/guides/auth/testing)
- [Google OAuth Testing](https://developers.google.com/identity/protocols/oauth2)

## Getting Help

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review `tests/fixtures/README.md` for fixture usage
3. Check Playwright docs for authentication strategies
4. Review Supabase logs: `npx supabase logs auth`
5. Run tests with `--debug` flag for detailed output
