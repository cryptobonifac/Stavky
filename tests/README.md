# Testing Documentation

This directory contains all tests for the Sports Betting Tips Application.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual functions
│   ├── roles.spec.ts       # Role utility functions
│   ├── validation.spec.ts  # Form validation logic
│   ├── date-i18n.spec.ts   # Date formatting and i18n
│   ├── test-helpers.spec.ts # Test utility functions
│   ├── betting-companies.spec.ts # Betting companies API
│   └── sports.spec.ts      # Sports API
├── integration/             # Integration tests for API and database
│   ├── api.spec.ts         # API endpoint tests
│   └── database.spec.ts    # Database function tests
├── e2e/                     # End-to-end tests
│   ├── auth.spec.ts        # Authentication flows
│   ├── betting.spec.ts     # Betting functionality
│   ├── navigation.spec.ts  # Navigation tests
│   ├── features.spec.ts    # Feature tests
│   ├── access-control.spec.ts # Role-based access control
│   └── contact.spec.ts     # Contact form functionality
└── utils/                   # Test utilities and helpers
    └── test-helpers.ts     # Common test utilities
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Unit tests only
npx playwright test tests/unit

# Integration tests only
npx playwright test tests/integration

# E2E tests only
npx playwright test tests/e2e

# Specific test file
npx playwright test tests/unit/roles.spec.ts

# Contact form test
npx playwright test tests/e2e/contact.spec.ts
```

### Run Tests in UI Mode
```bash
# Run all tests in UI mode
npx playwright test --ui

# Run contact form test in UI mode (recommended for debugging)
npx playwright test tests/e2e/contact.spec.ts --ui
```

The UI mode provides an interactive interface where you can:
- See all tests in a sidebar
- Watch tests execute in real-time
- Step through tests with breakpoints
- Inspect page state at any point
- View network requests and responses
- See console logs and errors

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### View Test Report
```bash
npx playwright show-report
```

## Test Categories

### 8.1 Unit Tests ✅

Unit tests verify individual functions and utilities work correctly in isolation.

**Coverage:**
- ✅ Role utility functions (`hasRole`, `canManageBets`, `canViewCustomerContent`)
- ✅ Form validation (odds range, email format, match names)
- ✅ Date formatting and handling (dd.mm.YYYY HH:mm)
- ✅ Internationalization (i18n) support
- ✅ Test helper utilities
- ✅ API data fetching (betting companies, sports)

**Files:**
- `tests/unit/roles.spec.ts`
- `tests/unit/validation.spec.ts`
- `tests/unit/date-i18n.spec.ts`
- `tests/unit/test-helpers.spec.ts`
- `tests/unit/betting-companies.spec.ts`
- `tests/unit/sports.spec.ts`

### 8.2 Integration Tests ✅

Integration tests verify that different parts of the system work together correctly.

**Coverage:**
- ✅ API endpoint authentication and authorization
- ✅ Database function validation (odds range, success rate calculation)
- ✅ Row Level Security (RLS) policies
- ✅ Betting tips CRUD operations
- ✅ Settings management APIs
- ✅ User management APIs

**Files:**
- `tests/integration/api.spec.ts`
- `tests/integration/database.spec.ts`

### 8.3 E2E Tests ✅

End-to-end tests verify complete user workflows from start to finish.

**Coverage:**
- ✅ User authentication flows (login, signup, social auth)
- ✅ Betting tip creation and management
- ✅ Role-based access control
- ✅ Navigation and routing
- ✅ Settings page functionality
- ✅ Profile management
- ✅ History and statistics viewing
- ✅ Contact form submission and validation

**Files:**
- `tests/e2e/auth.spec.ts`
- `tests/e2e/betting.spec.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/features.spec.ts`
- `tests/e2e/access-control.spec.ts`
- `tests/e2e/contact.spec.ts`

## Test Utilities

The `tests/utils/test-helpers.ts` file provides common utilities:

- **Mock Data**: Pre-defined test data for users, betting tips, companies, and sports
- **Validation Functions**: `isValidOdds()`, `isValidEmail()`
- **Date Helpers**: `formatMatchDate()`, `generateFutureDate()`, `generatePastDate()`
- **Account Helpers**: `isAccountActive()`, `calculateSuccessRate()`
- **Test Cleanup**: Utilities for managing test data

## Testing Best Practices

### 1. Test Isolation
Each test should be independent and not rely on the state from other tests.

### 2. Use Descriptive Names
Test names should clearly describe what is being tested and the expected outcome.

```typescript
test('should validate odds within range 1.001 to 2.00', () => {
  // Test implementation
});
```

### 3. Test Edge Cases
Always test boundary conditions and edge cases:
- Minimum and maximum values
- Null and undefined values
- Empty strings and arrays
- Invalid input formats

### 4. Mock External Dependencies
Use mock data for external services to ensure tests run quickly and reliably.

### 5. Keep Tests Fast
Unit tests should run in milliseconds, integration tests in seconds.

## Authentication in Tests

Most protected routes and API endpoints require authentication. Tests handle this in several ways:

1. **Unit Tests**: Test functions in isolation without authentication
2. **Integration Tests**: Verify that endpoints properly reject unauthenticated requests (401)
3. **E2E Tests**: Check for proper redirects to login page

## Database Testing

Tests interact with the database through API endpoints. The local Supabase instance should be running:

```bash
npm run db:local
```

## Continuous Integration

Tests are configured to run in CI environments with:
- Retry logic for flaky tests
- HTML reporter for test results
- Trace collection on failures

## Coverage Goals

- **Unit Tests**: 80%+ code coverage for utility functions
- **Integration Tests**: All API endpoints tested
- **E2E Tests**: All critical user flows tested

## Contact Form Testing

The contact form test (`tests/e2e/contact.spec.ts`) verifies the contact form functionality:

### Test Cases:
1. **Happy Path**: Full form submission with email, mobile, and message
2. **Minimal Submission**: Submission with only email (optional fields empty)
3. **Email Validation**: Invalid email format handling
4. **Required Field Validation**: Email field requirement

### Running Contact Form Tests:

```bash
# Run contact form tests in headless mode
npx playwright test tests/e2e/contact.spec.ts

# Run contact form tests in UI mode (recommended for debugging)
npx playwright test tests/e2e/contact.spec.ts --ui

# Run a specific test case
npx playwright test tests/e2e/contact.spec.ts -g "happy path"
```

### Prerequisites for Contact Form Tests:

1. **RESEND_API_KEY must be configured** in `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

2. **Development server must be running** (Playwright config handles this automatically)

3. **Contact page must be accessible** at `/contact` route

### What the Tests Verify:

- ✅ Form fields are visible and accessible
- ✅ Form accepts valid email addresses
- ✅ Form accepts optional mobile and message fields
- ✅ Form validates email format
- ✅ Form requires email field
- ✅ Successful submission shows success message
- ✅ Form fields are cleared after successful submission
- ✅ API returns 200 status on successful submission

### Debugging Contact Form Tests:

If tests fail, use UI mode to debug:
```bash
npx playwright test tests/e2e/contact.spec.ts --ui
```

In UI mode, you can:
- See the form being filled step-by-step
- Inspect API responses in the Network tab
- Check for validation errors
- View console logs for any errors
- Pause execution at any point

## Troubleshooting

### Tests Failing Locally

1. Ensure the development server is running:
   ```bash
   npm run dev
   ```

2. Ensure Supabase is running:
   ```bash
   npm run db:local
   ```

3. Check that the database is seeded:
   ```bash
   npm run db:reset
   ```

4. **For contact form tests**: Verify `RESEND_API_KEY` is set in `.env.local`

### Timeout Errors

Increase timeout in `playwright.config.ts`:
```typescript
use: {
  timeout: 30000, // 30 seconds
}
```

### Authentication Issues

Some tests may fail if authentication is required. These tests verify that:
- Unauthenticated requests are properly rejected (401)
- Users are redirected to login page
- Protected routes are inaccessible

This is expected behavior and indicates proper security implementation.

## Future Improvements

- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Add accessibility testing (a11y)
- [ ] Increase test coverage for edge cases
- [ ] Add load testing for API endpoints
- [ ] Add mutation testing

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
