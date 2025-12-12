# Quick Start - Google OAuth Testing

Get started testing Google OAuth in 5 minutes!

## Step 1: Start Services (2 minutes)

```bash
# Terminal 1: Start Supabase
npm run db:local

# Terminal 2: Start Next.js
npm run dev
```

Wait for both services to be ready.

## Step 2: Run Your First Test (1 minute)

```bash
# Run in headed mode (you'll see the browser)
npx playwright test tests/examples/google-oauth-simple.spec.ts --headed
```

The browser will open automatically. When it reaches the Google login page, manually:
1. Enter your test Google account email
2. Enter password
3. Grant permissions

The test will continue automatically!

## Step 3: View Results (30 seconds)

```bash
# Open test report
npx playwright show-report
```

See detailed results, screenshots, and traces.

## That's it! You're testing OAuth!

## Next Steps

### Option A: Automate Everything

Want tests to run without manual intervention?

1. Create `.env.test` file:
```bash
echo "TEST_GOOGLE_EMAIL=your-test@gmail.com" > .env.test
echo "TEST_GOOGLE_PASSWORD=your-password" >> .env.test
```

2. Run tests headless:
```bash
npx playwright test tests/examples/google-oauth-simple.spec.ts
```

Now fully automated! ⚡

### Option B: Save Auth State (Fastest)

Do OAuth once, reuse forever:

1. Save authentication state:
```typescript
// Run this test once
npx playwright test -g "save authentication state"
```

2. Use saved state in all future tests:
```typescript
test.use({ storageState: 'tests/.auth/user.json' })

test('instant auth', async ({ page }) => {
  await page.goto('http://localhost:3000/en/bettings')
  // Already logged in! No OAuth needed!
})
```

Tests run 10x faster! 🚀

### Option C: BDD Style Testing

Prefer writing tests in plain English?

1. Open the feature file:
```bash
# tests/features/google-oauth-registration.feature
```

2. Add your scenario:
```gherkin
Scenario: User can view betting tips
  Given I have successfully registered via Google OAuth
  When I navigate to the bettings page
  Then I should see the betting tips list
```

3. Run BDD tests:
```bash
npx playwright test tests/features/google-oauth-registration.feature
```

Business-friendly test specs! 📝

## Common Commands

```bash
# Run all tests
npm test

# Run with UI (interactive, visual)
npx playwright test --ui

# Run specific test
npx playwright test -g "registration"

# Debug mode
npx playwright test --debug

# Update snapshots
npx playwright test --update-snapshots
```

## Test Structure

```
tests/
├── features/              # BDD scenarios (plain English)
├── steps/                 # Step implementations
├── fixtures/              # Test helpers
├── examples/              # Example tests
└── .auth/                 # Saved auth states (gitignored)
```

## Helper Classes

### GoogleOAuthHelper

```typescript
import { GoogleOAuthHelper } from '../fixtures/auth.fixtures'

test('oauth test', async ({ page, context }) => {
  const helper = new GoogleOAuthHelper(page, context)

  // Complete entire OAuth flow
  await helper.completeOAuthRegistration()

  // Verify authentication
  expect(await helper.isAuthenticated()).toBe(true)

  // Get user profile
  const profile = await helper.getUserProfile()
})
```

One line to complete OAuth! 🎯

## Troubleshooting

### Test hangs?
```bash
# Run in headed mode to see what's happening
npx playwright test --headed
```

### Need more details?
```bash
# Run with full trace
npx playwright test --trace on
```

### Want to inspect?
```bash
# Use UI mode for live debugging
npx playwright test --ui
```

## Need More Help?

- **Detailed guide**: `tests/GOOGLE_OAUTH_TESTING.md`
- **Fixture docs**: `tests/fixtures/README.md`
- **Full README**: `tests/README.md`
- **Playwright docs**: https://playwright.dev/

## Pro Tips 💡

1. **Run tests in watch mode during development:**
   ```bash
   npx playwright test --watch
   ```

2. **Debug failed tests with traces:**
   ```bash
   npx playwright show-report
   # Click on failed test → See trace
   ```

3. **Record authentication state once:**
   ```bash
   npx playwright test -g "save auth" --headed
   # Complete OAuth manually
   # State saved to tests/.auth/user.json
   # Reuse in all future tests!
   ```

4. **Test specific scenarios:**
   ```bash
   npx playwright test --grep "successful registration"
   ```

5. **See test in slow motion:**
   ```bash
   npx playwright test --headed --slow-mo=1000
   ```

## Example Test

Here's a complete working example:

```typescript
import { test, expect } from '@playwright/test'
import { GoogleOAuthHelper } from './fixtures/auth.fixtures'

test('register with Google', async ({ page, context }) => {
  const helper = new GoogleOAuthHelper(page, context)

  // Go to signup
  await page.goto('http://localhost:3000/en/signup')

  // Complete OAuth
  await helper.completeOAuthRegistration()

  // Verify success
  expect(page.url()).toContain('/bettings')
  expect(await helper.isAuthenticated()).toBe(true)
})
```

That's it! Copy, paste, run! ✅

## What's Being Tested?

Every test verifies:

✅ OAuth redirect to Google
✅ User authentication
✅ Redirect back to app
✅ User account creation
✅ Correct role assignment
✅ Session persistence
✅ Error handling

## Ready to Go!

You now know:
- ✅ How to run tests
- ✅ How to automate OAuth
- ✅ How to save auth state
- ✅ How to write new tests
- ✅ How to debug issues

Start testing! 🚀

```bash
# Let's go!
npx playwright test --ui
```
