# Test Suite Documentation

This directory contains comprehensive end-to-end tests for the Stavky sports betting application, with a focus on Google OAuth authentication and user registration flows.

## Directory Structure

```
tests/
├── features/                          # BDD feature files (Gherkin syntax)
│   ├── login.feature                  # Login scenarios (placeholder)
│   └── google-oauth-registration.feature  # Google OAuth registration scenarios
│
├── steps/                             # Step definitions for BDD tests
│   ├── login.steps.ts                 # Login step implementations (placeholder)
│   └── google-oauth-registration.steps.ts # OAuth step implementations
│
├── fixtures/                          # Test fixtures and helpers
│   ├── auth.fixtures.ts               # Authentication helper classes
│   └── README.md                      # Fixture usage documentation
│
├── examples/                          # Example test files
│   └── google-oauth-simple.spec.ts    # Non-BDD OAuth test examples
│
├── .auth/                             # Saved authentication states (gitignored)
│   └── user.json                      # Example: saved user auth state
│
├── playwright.config.ts               # Playwright test configuration
├── GOOGLE_OAUTH_TESTING.md           # OAuth testing guide
└── README.md                          # This file
```

## Quick Start

### Prerequisites

1. **Start local Supabase:**
   ```bash
   npm run db:local
   ```

2. **Start Next.js development server:**
   ```bash
   npm run dev
   ```

3. **Set test credentials (optional):**
   ```bash
   # Create .env.test file
   echo "TEST_GOOGLE_EMAIL=your-test@gmail.com" > .env.test
   echo "TEST_GOOGLE_PASSWORD=your-password" >> .env.test
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/examples/google-oauth-simple.spec.ts

# Run BDD feature tests
npx playwright test tests/features/google-oauth-registration.feature

# Run with UI (recommended for debugging)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific scenario by name
npx playwright test --grep "Successful registration"

# Debug mode
npx playwright test --debug
```

## Test Categories

### 1. Google OAuth Registration Tests

**Location**: `tests/features/google-oauth-registration.feature`

**What it tests**:
- Complete OAuth registration flow
- User account creation in database
- Role assignment (customer vs betting)
- Session persistence
- Locale preservation
- Error handling
- Duplicate account prevention

**Key scenarios**:
- Successful registration from signup page
- Successful registration from login page
- Betting account registration (special role)
- User profile loading
- Session persistence across refreshes
- Error handling (missing/invalid code)
- Locale preservation (Czech, Slovak, English)
- Duplicate account prevention

### 2. Example Tests (Non-BDD)

**Location**: `tests/examples/google-oauth-simple.spec.ts`

**What it demonstrates**:
- Writing OAuth tests without BDD/Cucumber
- Using GoogleOAuthHelper class
- Saving and loading authentication state
- Testing different user roles
- Error handling patterns

## Key Components

### Authentication Fixtures

**File**: `tests/fixtures/auth.fixtures.ts`

Provides helper classes for authentication testing:

#### `AuthHelper`
Basic authentication operations:
```typescript
const authHelper = new AuthHelper(page, context)

// Clear auth
await authHelper.clearAuth()

// Check if authenticated
const isAuth = await authHelper.isAuthenticated()

// Get user profile
const profile = await authHelper.getUserProfile()

// Verify role
await authHelper.verifyUserRole('customer')

// Save/load auth state
await authHelper.saveAuthState('tests/.auth/user.json')
await authHelper.loadAuthState('tests/.auth/user.json')
```

#### `GoogleOAuthHelper`
Google OAuth-specific operations:
```typescript
const oauthHelper = new GoogleOAuthHelper(page, context)

// Click Google button
await oauthHelper.clickGoogleButton()

// Wait for redirect
await oauthHelper.waitForGoogleRedirect()

// Perform automated login
await oauthHelper.performGoogleLogin()

// Complete full flow
await oauthHelper.completeOAuthRegistration()

// Verify callback
await oauthHelper.verifyOAuthCallback('/bettings')
```

#### `TestDataGenerator`
Test data utilities:
```typescript
// Generate test email
const email = TestDataGenerator.generateTestEmail('mytest')

// Get betting emails
const bettingEmails = TestDataGenerator.getBettingAccountEmails()

// Check if betting account
const isBetting = TestDataGenerator.isBettingAccountEmail('marek.rohon@gmail.com')
```

### BDD Step Definitions

**File**: `tests/steps/google-oauth-registration.steps.ts`

Contains step implementations for all BDD scenarios. Each step follows the Given-When-Then pattern:

- **Given**: Set up initial conditions
- **When**: Perform actions
- **Then**: Verify outcomes

Example steps:
```gherkin
Given I am not authenticated
When I click the "Continue with Google" button
Then I should be redirected to Google's OAuth consent page
```

## Test Modes

### 1. Manual Testing Mode

**When**: No test credentials are set

**How to use**:
```bash
npx playwright test --headed
```

The test will pause during OAuth flow. Manually:
1. Sign in to Google
2. Grant permissions
3. Test resumes automatically

### 2. Automated Testing Mode

**When**: TEST_GOOGLE_EMAIL and TEST_GOOGLE_PASSWORD are set

**How to use**:
```bash
export TEST_GOOGLE_EMAIL="test@gmail.com"
export TEST_GOOGLE_PASSWORD="password123"
npx playwright test
```

Tests run fully automated without manual intervention.

### 3. Authentication State Mode (Recommended)

**When**: You have saved authentication state

**Benefits**:
- Fastest test execution
- No repeated OAuth flows
- More reliable in CI/CD

**How to use**:

1. Save auth state once:
```typescript
test('save auth', async ({ page, context }) => {
  const helper = new GoogleOAuthHelper(page, context)
  await helper.completeOAuthRegistration()
  await helper.saveAuthState('tests/.auth/user.json')
})
```

2. Use saved state in tests:
```typescript
test.use({ storageState: 'tests/.auth/user.json' })

test('test with saved auth', async ({ page }) => {
  await page.goto('http://localhost:3000/en/bettings')
  // Already authenticated!
})
```

## Configuration

### Playwright Config

**File**: `tests/playwright.config.ts`

Key settings:
```typescript
{
  baseURL: 'http://localhost:3000',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  }
}
```

### Environment Variables

Create `.env.test` file:

```env
# Test Google account credentials
TEST_GOOGLE_EMAIL=your-test-google@gmail.com
TEST_GOOGLE_PASSWORD=your-password

# Test betting account (for betting role tests)
TEST_BETTING_GOOGLE_EMAIL=marek.rohon@gmail.com

# Supabase (usually in .env.local)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Important**: `.env.test` is in `.gitignore`. Never commit credentials!

## Google OAuth Setup

### Local Development

1. **Google Cloud Console**:
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:54321/auth/v1/callback`
   - Copy Client ID and Secret

2. **Supabase Configuration**:
   ```bash
   export GOOGLE_CLIENT_ID="your-client-id"
   export GOOGLE_CLIENT_SECRET="your-client-secret"
   export GOOGLE_REDIRECT_URL="http://localhost:54321/auth/v1/callback"
   ```

3. **Start Supabase**:
   ```bash
   npm run db:local
   ```

4. **Verify in `supabase/config.toml`**:
   ```toml
   [auth.external.google]
   enabled = true
   client_id = "env(GOOGLE_CLIENT_ID)"
   secret = "env(GOOGLE_CLIENT_SECRET)"
   redirect_uri = "env(GOOGLE_REDIRECT_URL)"
   ```

See `docs/LOCAL_SUPABASE_GOOGLE_OAUTH.md` for detailed setup instructions.

## User Roles

The application has two user roles:

### Customer Role (Default)
- Default role for all new registrations
- Can view betting tips
- Account active until 2099-12-31
- Redirects to `/bettings` after login

### Betting Role (Special)
- Assigned to specific approved emails
- Can create and manage betting tips
- Account active for 1 year from registration
- Redirects to `/newbet` after login

**Betting account emails** (from database migration):
- `igorpod69@gmail.com`
- `busikpartners@gmail.com`
- `marek.rohon@gmail.com`

## Database Schema

### Users Table

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id),
  email TEXT NOT NULL UNIQUE,
  role public.user_role NOT NULL DEFAULT 'customer',
  account_active_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
```

### Trigger Function

When a user signs up, the `handle_new_auth_user()` trigger:
1. Checks if email is in betting accounts list
2. Assigns appropriate role ('betting' or 'customer')
3. Sets account expiration (1 year or 2099)
4. Creates user profile in public.users table

## Troubleshooting

### Tests hang during OAuth

**Problem**: Test gets stuck on Google's page

**Solutions**:
1. Run in headed mode: `npx playwright test --headed`
2. Set TEST_GOOGLE_EMAIL and TEST_GOOGLE_PASSWORD
3. Use saved authentication state
4. Check for 2FA or captcha requirements

### Authentication doesn't persist

**Problem**: User is not authenticated after OAuth

**Solutions**:
1. Check Supabase is running: `npx supabase status`
2. Verify cookies: Check browser DevTools
3. Check callback route: `curl http://localhost:3000/auth/callback`
4. Review Supabase logs: `npx supabase logs auth`

### Wrong role assigned

**Problem**: User doesn't get expected role

**Solutions**:
1. Reset database: `npm run db:reset`
2. Check email is in betting list
3. Verify trigger function:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
4. Test function directly:
   ```sql
   SELECT public.is_betting_account_email('marek.rohon@gmail.com');
   ```

### Tests fail in CI/CD

**Problem**: Tests pass locally but fail in CI

**Solutions**:
1. Use saved authentication state
2. Mock OAuth provider
3. Use GitHub Actions secrets for credentials
4. Consider Supabase test mode

See `GOOGLE_OAUTH_TESTING.md` for more troubleshooting tips.

## Best Practices

### 1. Use Separate Test Accounts

Create dedicated Google accounts for testing:
- `your-app-test1@gmail.com`
- `your-app-test2@gmail.com`

Never use personal accounts for automated testing.

### 2. Save Authentication State

Complete OAuth manually once, save the state, reuse for fast tests.

### 3. Clean Up Test Data

After test runs, clean up test users:
```sql
DELETE FROM auth.users WHERE email LIKE '%test%@gmail.com';
DELETE FROM public.users WHERE email LIKE '%test%@gmail.com';
```

### 4. Test Independence

Each test should:
- Set up its own data
- Clean up after itself
- Not depend on other tests
- Be runnable in any order

### 5. Mock OAuth in CI/CD

For continuous integration, consider mocking the OAuth flow.

### 6. Test Edge Cases

Don't just test happy paths:
- Network failures
- Timeout scenarios
- Denied permissions
- Invalid tokens
- Expired sessions

## Writing New Tests

### BDD Style (Cucumber)

1. Add scenario to `.feature` file:
```gherkin
Scenario: User can view their profile
  Given I have successfully registered via Google OAuth
  When I navigate to the profile page
  Then I should see my email address
  And I should see my account status
```

2. Implement steps in `.steps.ts` file:
```typescript
BDDGiven('I have successfully registered via Google OAuth', async ({ page, context }) => {
  const helper = new GoogleOAuthHelper(page, context)
  await helper.completeOAuthRegistration()
})
```

### Non-BDD Style

Use the example file as a template:

```typescript
import { test, expect } from '@playwright/test'
import { GoogleOAuthHelper } from '../fixtures/auth.fixtures'

test('my new test', async ({ page, context }) => {
  const oauthHelper = new GoogleOAuthHelper(page, context)

  // Your test logic here
})
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Start Supabase
        run: npx supabase start
        env:
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}

      - name: Run tests
        run: npm test
        env:
          TEST_GOOGLE_EMAIL: ${{ secrets.TEST_GOOGLE_EMAIL }}
          TEST_GOOGLE_PASSWORD: ${{ secrets.TEST_GOOGLE_PASSWORD }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Resources

### Documentation
- [GOOGLE_OAUTH_TESTING.md](./GOOGLE_OAUTH_TESTING.md) - Detailed OAuth testing guide
- [fixtures/README.md](./fixtures/README.md) - Fixture usage documentation
- [Playwright Docs](https://playwright.dev/) - Official Playwright documentation
- [Cucumber BDD](https://cucumber.io/docs/guides/) - Cucumber/Gherkin guide
- [playwright-bdd](https://vitalets.github.io/playwright-bdd/) - Playwright BDD integration

### Related Application Docs
- `docs/GOOGLE_OAUTH_IMPLEMENTATION_ANALYSIS.md` - OAuth implementation details
- `docs/LOCAL_SUPABASE_GOOGLE_OAUTH.md` - Local OAuth setup
- `docs/SUPABASE_GOOGLE_OAUTH_FIX.md` - Common OAuth issues

### External Resources
- [Supabase Auth Testing](https://supabase.com/docs/guides/auth/testing)
- [Google OAuth Testing](https://developers.google.com/identity/protocols/oauth2)

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [GOOGLE_OAUTH_TESTING.md](./GOOGLE_OAUTH_TESTING.md)
3. Check fixture docs: [fixtures/README.md](./fixtures/README.md)
4. Run with `--debug` flag for detailed output
5. Review Supabase logs: `npx supabase logs auth`
6. Check application logs in browser console

## Contributing

When adding new tests:

1. Follow BDD structure for user-facing features
2. Use descriptive scenario names
3. Add comments explaining complex logic
4. Update this README if adding new test categories
5. Ensure tests are independent and can run in any order
6. Clean up test data after test runs
7. Add appropriate error handling
8. Use the provided fixtures and helpers

## Test Coverage

Current test coverage:

- ✅ Google OAuth registration flow
- ✅ User account creation
- ✅ Role assignment (customer and betting)
- ✅ Session persistence
- ✅ Locale preservation
- ✅ Error handling (missing/invalid code)
- ✅ User profile loading
- ✅ Duplicate account prevention
- ✅ Authentication state management

## Future Enhancements

Potential areas for additional test coverage:

- [ ] Password-based registration and login
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Account settings updates
- [ ] Betting tips CRUD operations
- [ ] Access control for different roles
- [ ] Internationalization (all supported locales)
- [ ] Mobile responsiveness
- [ ] Performance testing
- [ ] Accessibility testing

## License

This test suite is part of the Stavky application and follows the same license.
