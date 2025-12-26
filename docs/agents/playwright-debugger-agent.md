# Playwright Debugger Agent - Console Debugging Scripts Documentation

This document catalogs all console debugging scripts used in the Stavky project for troubleshooting, diagnostics, and development workflow management.

## Table of Contents

1. [User Management Scripts](#user-management-scripts)
2. [Stripe Integration Scripts](#stripe-integration-scripts)
3. [Webhook Debugging Scripts](#webhook-debugging-scripts)
4. [Environment & Configuration Scripts](#environment--configuration-scripts)
5. [Development Workflow Scripts](#development-workflow-scripts)
6. [Database & Migration Scripts](#database--migration-scripts)
7. [Web-Based Debug Tools](#web-based-debug-tools)

---

## User Management Scripts

### `scripts/check-user-status.js`

**Purpose**: Check the status of a user account in the database, including activation status and Stripe integration.

**Usage**:
```bash
node scripts/check-user-status.js <email>
# Example:
node scripts/check-user-status.js customer14@gmail.com
```

**What it does**:
- Queries the `users` table for the specified email
- Displays user information (ID, email, role, account status)
- Shows Stripe customer/subscription IDs
- Checks account activation status (active until date)
- Verifies user exists in `auth.users` table
- Calculates days remaining or expired

**Output includes**:
- User ID and email
- Role (customer/betting)
- Account active until date
- Stripe Customer ID
- Stripe Subscription ID
- Current activation status (ACTIVE/INACTIVE)
- Days remaining or expired
- Auth user verification

**Console logging patterns**:
- `🔍 Checking user status for: <email>`
- `✅ User found:` / `❌ User not found:`
- `📊 Account Status:`
- `🔐 Checking auth.users table...`

---

### `scripts/manually-activate-account.js`

**Purpose**: Manually activate a user account for testing purposes (bypasses Stripe webhook).

**Usage**:
```bash
node scripts/manually-activate-account.js <email> [days]
# Example:
node scripts/manually-activate-account.js customer14@gmail.com 30
```

**Parameters**:
- `email` (required): User email address
- `days` (optional): Number of days to activate (default: 30)

**What it does**:
- Finds user by email in database
- Sets `account_active_until` to current date + specified days
- Updates `updated_at` timestamp
- Verifies update succeeded

**Console logging patterns**:
- `🔧 Manually activating account for: <email>`
- `✅ User found:` / `❌ User not found:`
- `📅 Setting account_active_until to: <date>`
- `✅ Account activated successfully!`

**⚠️ Warning**: This is for testing only. In production, accounts should be activated via Stripe webhooks.

---

### `scripts/deactivate-user.js`

**Purpose**: Deactivate a user account by setting `account_active_until` to NULL.

**Usage**:
```bash
node scripts/deactivate-user.js <email>
# Example:
node scripts/deactivate-user.js customer14@gmail.com
```

**What it does**:
- Finds user by email
- Sets `account_active_until` to `null`
- Preserves other user data

**Console logging patterns**:
- `🔍 Looking up user: <email>...`
- `✅ Found user:` / `❌ User not found:`
- `🔧 Deactivating account...`
- `✅ Account deactivated successfully!`

---

### `scripts/check-user-role.js`

**Purpose**: Check user role and attempt to set betting role for specific users.

**Usage**:
```bash
node scripts/check-user-role.js
```

**What it does**:
- Checks user in `public.users` table
- Checks user in `auth.users` table
- Attempts to call `set_betting_role_by_email` RPC function
- Displays user information from both tables

**Console logging patterns**:
- `Checking user: <email>`
- `Found in public.users:` / `User NOT found in public.users`
- `Found in auth.users:` / `User NOT found in auth.users`
- `--- Attempting to set betting role ---`

---

## Stripe Integration Scripts

### `scripts/verify-stripe-account.js`

**Purpose**: Verify Stripe account connection and list/create products and prices.

**Usage**:
```bash
node scripts/verify-stripe-account.js
```

**What it does**:
- Tests Stripe API connection
- Retrieves account information
- Lists all products and their prices
- Creates sample products if none exist
- Provides copy-paste ready `.env.local` configuration

**Output includes**:
- Account ID, country, email
- List of all products with prices
- Price IDs formatted for `.env.local`
- Mode detection (TEST/LIVE)
- Warnings for mode mismatches

**Console logging patterns**:
- `🔍 Verifying Stripe Account Connection...`
- `✅ Successfully connected to Stripe account`
- `📦 Fetching products...`
- `📋 Products and Prices:`
- `📋 COPY-PASTE READY FOR .env.local:`

---

### `scripts/verify-stripe-prices.js`

**Purpose**: Verify that Price IDs in `.env.local` exist in your Stripe account.

**Usage**:
```bash
node scripts/verify-stripe-prices.js
```

**What it does**:
- Reads `NEXT_PUBLIC_ONE_TIME_PRICE_ID` from `.env.local`
- Reads `NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID` from `.env.local`
- Verifies each Price ID exists in Stripe
- Checks for mode mismatches (test vs live)
- Validates price configuration

**Output includes**:
- Price ID validation status
- Amount, currency, type (one-time/recurring)
- Active status
- Livemode status
- Mode mismatch warnings

**Console logging patterns**:
- `🔍 Verifying Stripe Price IDs...`
- `Checking <name>: <priceId>`
- `✅ <name> FOUND:` / `❌ <name> NOT FOUND`
- `📊 Summary:`
- `✅ All Price IDs are valid!` / `❌ Some Price IDs are invalid`

---

### `scripts/list-stripe-prices.js`

**Purpose**: List all available Stripe Prices in your account.

**Usage**:
```bash
node scripts/list-stripe-prices.js
```

**What it does**:
- Connects to Stripe API
- Lists all prices (up to 100)
- Displays price details (amount, type, active status)
- Shows mode (TEST/LIVE) for each price
- Provides guidance on updating `.env.local`

**Output includes**:
- All price IDs
- Product association
- Amount and currency
- Type (one-time or recurring interval)
- Active status
- Livemode status

**Console logging patterns**:
- `📋 Listing all Stripe Prices in your account...`
- `✅ Found <count> price(s):`
- `💡 Copy the Price ID(s) you want to use...`

---

## Webhook Debugging Scripts

### `scripts/diagnose-webhook-issue.js`

**Purpose**: Comprehensive diagnostic tool for webhook configuration and account activation issues.

**Usage**:
```bash
node scripts/diagnose-webhook-issue.js [email]
# Example:
node scripts/diagnose-webhook-issue.js customer14@gmail.com
```

**What it does**:
1. Checks environment variables (Supabase URL, Service Role Key, Stripe Webhook Secret, Stripe Secret Key)
2. Verifies user exists in database
3. Checks database schema
4. Provides checklist of common issues
5. Recommends actions for troubleshooting

**Output includes**:
- Environment variable status
- User database status
- Account activation status
- Stripe integration status
- Common issues checklist
- Recommended troubleshooting steps

**Console logging patterns**:
- `🔍 WEBHOOK DIAGNOSTIC TOOL`
- `1️⃣  ENVIRONMENT VARIABLES:`
- `2️⃣  USER DATABASE CHECK:`
- `3️⃣  DATABASE SCHEMA CHECK:`
- `4️⃣  COMMON ISSUES TO CHECK:`
- `5️⃣  RECOMMENDED ACTIONS:`
- `✅ DIAGNOSTIC COMPLETE`

---

### `scripts/capture-webhook-logs.js`

**Purpose**: Guide for capturing and analyzing webhook logs.

**Usage**:
```bash
node scripts/capture-webhook-logs.js
```

**What it does**:
- Provides instructions for viewing webhook logs
- Explains where to find logs (terminal, Stripe Dashboard)
- Lists key log patterns to look for
- Provides analysis guide for log patterns

**Output includes**:
- Instructions for viewing logs
- Key log patterns and their meanings
- Analysis guide for each pattern
- Troubleshooting tips

**Console logging patterns**:
- `📋 Webhook Log Capture Tool`
- `📊 What to Look For in Logs:`
- Pattern explanations:
  - `🔔 WEBHOOK EVENT RECEIVED` - Webhook endpoint was called
  - `✅ CHECKOUT SESSION COMPLETED` - Payment was successful
  - `📧 EMAIL LOCATIONS` - Email extraction from Stripe session
  - `✅ USER FOUND IN DATABASE` - User lookup succeeded
  - `✅ DATABASE UPDATE SUCCESSFUL` - Account activation succeeded
  - `⚠️  ACCOUNT ACTIVATION SKIPPED` - Activation conditions not met

---

## Environment & Configuration Scripts

### `scripts/check-env-vars.js`

**Purpose**: Verify that required Stripe Price ID environment variables are set.

**Usage**:
```bash
node scripts/check-env-vars.js
```

**What it does**:
- Checks for `NEXT_PUBLIC_ONE_TIME_PRICE_ID`
- Checks for `NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID`
- Validates Price ID format (must start with `price_`)
- Reports which variables are missing or invalid

**Output includes**:
- Status of each required variable
- Partial value preview (first 15 characters)
- Validation status (valid format check)
- Summary of all variables

**Console logging patterns**:
- `🔍 Checking Stripe Price ID Environment Variables...`
- `✅ <varName>` / `❌ <varName> - NOT SET`
- `✅ All environment variables are set correctly!` / `❌ Some environment variables are missing or invalid`

---

## Development Workflow Scripts

### `scripts/start-dev-with-webhooks.js`

**Purpose**: Start Next.js dev server with Stripe webhook forwarding using `concurrently`.

**Usage**:
```bash
node scripts/start-dev-with-webhooks.js
# Or via npm:
npm run dev:with-webhooks
```

**Configuration**:
- Reads `STRIPE_SANDBOX_API_KEY` from `.env.local` if available
- Uses default Stripe CLI configuration if sandbox key not set

**What it does**:
- Runs `npm run dev:skip-check` (Next.js dev server)
- Runs `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Uses sandbox API key if configured
- Handles process lifecycle and errors

**Console logging patterns**:
- `🚀 Starting development server with Stripe webhook forwarding...`
- `📦 Using sandbox API key from .env.local` / `🧪 Using default Stripe CLI configuration`
- `⚠️  Warning: Next.js lock file exists`

**Dependencies**:
- Requires `concurrently` package
- Requires Stripe CLI installed and authenticated

---

### `scripts/cleanup-dev.js`

**Purpose**: Clean up development environment issues (lock files, port conflicts).

**Usage**:
```bash
node scripts/cleanup-dev.js
# Or via npm:
npm run cleanup:dev
```

**What it does**:
- Removes Next.js lock file (`.next/dev/lock`)
- Identifies processes using port 3000
- Provides commands to kill processes (Windows)

**Output includes**:
- Lock file removal status
- List of processes using port 3000
- Process IDs and names
- `taskkill` commands for Windows

**Console logging patterns**:
- `🧹 Cleaning up development environment...`
- `✅ Removed Next.js lock file` / `ℹ️  No lock file found`
- `🔍 Checking for processes on port 3000...`
- `⚠️  Found <count> process(es) using port 3000:`
- `✨ Cleanup complete!`

---

## Database & Migration Scripts

### `scripts/check-migration-status.js`

**Purpose**: Check migration status and verify database functions exist.

**Usage**:
```bash
node scripts/check-migration-status.js
```

**What it does**:
- Tests if `activate_account_by_email` RPC function exists
- Checks specific users from migrations
- Verifies user roles and activation status

**Console logging patterns**:
- `Checking migration status for: <email>`
- `⚠️  activate_account_by_email function:` / `✅ activate_account_by_email function exists`
- `--- Checking all users from migration ---`
- `✅ <email>: role=<role>, active_until=<date>` / `❌ <email>: Not found`

---

## Web-Based Debug Tools

### `app/api/webhooks/debug/route.ts`

**Purpose**: API endpoint to debug user account status and webhook issues.

**Usage**:
```bash
# Via browser or curl:
curl "http://localhost:3000/api/webhooks/debug?email=customer14@gmail.com"
```

**What it does**:
- Queries user by email (with case-insensitive fallback)
- Returns user information and account status
- Provides analysis of webhook-related issues
- Returns JSON response with diagnostic information

**Response includes**:
- User information (ID, email, role, activation status)
- Stripe integration status (customer ID, subscription ID)
- Analysis (account status, has Stripe customer/subscription)
- Webhook checklist (user exists, should be activated, possible issues)

**Console logging**: None (API endpoint, returns JSON)

---

### `app/[locale]/admin/webhook-debug/page.tsx`

**Purpose**: Web-based UI for debugging webhook issues and user account status.

**Usage**:
```
Navigate to: http://localhost:3000/en/admin/webhook-debug?email=customer14@gmail.com
```

**What it does**:
- Provides form to enter user email
- Calls `/api/webhooks/debug` endpoint
- Displays formatted user information
- Shows analysis and webhook checklist
- Provides next steps for troubleshooting

**Features**:
- User information display
- Account status visualization (ACTIVE/INACTIVE)
- Stripe integration status
- Webhook checklist
- Possible issues list
- Next steps guide

**Console logging**: Browser console only (client-side React component)

---

## Common Debugging Workflows

### Debugging Inactive Account After Payment

1. **Check user status**:
   ```bash
   node scripts/check-user-status.js customer14@gmail.com
   ```

2. **Run webhook diagnostic**:
   ```bash
   node scripts/diagnose-webhook-issue.js customer14@gmail.com
   ```

3. **Check webhook logs**:
   - View terminal where `npm run dev` is running
   - Look for `🔔 WEBHOOK EVENT RECEIVED`
   - Check for `✅ DATABASE UPDATE SUCCESSFUL` or error messages

4. **Use web debug tool**:
   - Navigate to: `http://localhost:3000/en/admin/webhook-debug?email=customer14@gmail.com`
   - Review analysis and checklist

### Verifying Stripe Configuration

1. **Verify account connection**:
   ```bash
   node scripts/verify-stripe-account.js
   ```

2. **Verify Price IDs**:
   ```bash
   node scripts/verify-stripe-prices.js
   ```

3. **List all prices**:
   ```bash
   node scripts/list-stripe-prices.js
   ```

4. **Check environment variables**:
   ```bash
   node scripts/check-env-vars.js
   ```

### Development Environment Issues

1. **Clean up lock files and ports**:
   ```bash
   node scripts/cleanup-dev.js
   ```

2. **Start dev server with webhooks**:
   ```bash
   node scripts/start-dev-with-webhooks.js
   # Or:
   npm run dev:with-webhooks
   ```

---

## Script Dependencies

### Required NPM Packages
- `@supabase/supabase-js` - Supabase client
- `stripe` - Stripe SDK
- `concurrently` - Run multiple commands (for `start-dev-with-webhooks.js`)
- `dotenv` - Environment variable loading (optional, some scripts parse `.env.local` manually)

### Required External Tools
- **Stripe CLI**: Required for `start-dev-with-webhooks.js`
  - Install: https://stripe.com/docs/stripe-cli
  - Authenticate: `stripe login`

### Environment Variables

Scripts read from `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SANDBOX_API_KEY` (optional, for sandbox mode)
- `NEXT_PUBLIC_ONE_TIME_PRICE_ID`
- `NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID`

---

## Log Pattern Reference

### Success Patterns
- `✅` - Success indicator
- `🔍` - Checking/investigating
- `📋` - Information/listing
- `📊` - Analysis/summary
- `🔧` - Action being performed
- `📅` - Date/time related
- `💡` - Tip/suggestion

### Error Patterns
- `❌` - Error/failure
- `⚠️` - Warning
- `ℹ️` - Information

### Webhook-Specific Patterns
- `🔔 WEBHOOK EVENT RECEIVED` - Webhook endpoint called
- `✅ CHECKOUT SESSION COMPLETED` - Payment successful
- `📧 EMAIL LOCATIONS` - Email extraction
- `🔐 ACTIVATION CONDITION CHECK` - Activation logic evaluation
- `✅ USER FOUND IN DATABASE` - User lookup success
- `✅ DATABASE UPDATE SUCCESSFUL` - Account activation success
- `❌ DATABASE UPDATE FAILED` - Account activation failure
- `⚠️  ACCOUNT ACTIVATION SKIPPED` - Activation conditions not met

---

## Best Practices

1. **Always check user status first** before diagnosing webhook issues
2. **Verify environment variables** are set correctly
3. **Check terminal logs** where webhook handler runs (not browser console)
4. **Use webhook diagnostic tool** for comprehensive analysis
5. **Verify Stripe configuration** before testing payments
6. **Clean up dev environment** if experiencing port/lock file issues
7. **Use manual activation** only for testing, never in production

---

## Related Documentation

- [Stripe Webhook Troubleshooting](../STRIPE_WEBHOOK_TROUBLESHOOTING.md)
- [Webhook Log Analysis](../WEBHOOK_LOG_ANALYSIS.md)
- [Stripe Setup Guide](../stripe/STRIPE_SETUP.md)
- [Environment Variables](../ENVIRONMENT_VARIABLES.md)

---

## Script Index

| Script | Purpose | Console Output |
|--------|---------|----------------|
| `check-user-status.js` | Check user account status | ✅/❌ Status indicators |
| `manually-activate-account.js` | Manually activate account | 🔧 Activation messages |
| `deactivate-user.js` | Deactivate account | 🔧 Deactivation messages |
| `check-user-role.js` | Check/set user role | Role verification |
| `verify-stripe-account.js` | Verify Stripe connection | ✅ Account info, products |
| `verify-stripe-prices.js` | Verify Price IDs | ✅/❌ Price validation |
| `list-stripe-prices.js` | List all prices | 📋 Price listing |
| `diagnose-webhook-issue.js` | Webhook diagnostics | 🔍 Comprehensive analysis |
| `capture-webhook-logs.js` | Log capture guide | 📋 Instructions |
| `check-env-vars.js` | Check environment vars | ✅/❌ Var status |
| `start-dev-with-webhooks.js` | Start dev + webhooks | 🚀 Startup messages |
| `cleanup-dev.js` | Clean dev environment | 🧹 Cleanup status |
| `check-migration-status.js` | Check migrations | Migration status |

---

**Last Updated**: 2025-01-19  
**Maintained By**: Development Team  
**Version**: 1.0.0
