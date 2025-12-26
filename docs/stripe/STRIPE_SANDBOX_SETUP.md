# Stripe Sandbox Setup Guide - Local Development

This guide explains how to properly set up and use Stripe Sandbox for local development with webhooks.

## Understanding Stripe Sandbox

### Key Concepts

**Stripe Sandbox:**
- ✅ **Isolated environment** separate from Test Mode and Live Mode
- ✅ Uses **test keys** (`pk_test_` and `sk_test_`) - same prefix as Test Mode
- ✅ **Required for Stripe Accounts V2** when creating checkout sessions
- ✅ **Data isolation** - products, customers, prices are separate from Test Mode
- ✅ Limited to **5 sandboxes per account**

**Important Distinction:**
- Sandbox keys look **identical** to Test Mode keys (`pk_test_` and `sk_test_`)
- The difference is **environment isolation**, not key prefixes
- Sandbox data is **completely separate** from Test Mode data
- Products/prices created in Sandbox won't appear in Test Mode and vice versa

---

## Step 1: Create a Stripe Sandbox

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to: **Developers → Sandboxes** (or **Settings → Sandboxes**)
3. Click **"Create sandbox"**
4. Enter a name (e.g., "Local Development" or "Testing")
5. Click **"Create sandbox"**

**Note:** You can have up to 5 sandboxes per Stripe account.

---

## Step 2: Switch to Your Sandbox

1. In Stripe Dashboard, look for the **environment selector** (top-right or in sidebar)
2. Select your newly created sandbox from the dropdown
3. The dashboard will now show data for this sandbox only
4. **Verify:** You should see "Sandbox" indicator in the top-left of the dashboard

---

## Step 3: Get Your Sandbox API Keys

1. While in your Sandbox environment, go to: **Developers → API keys**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - Click "Reveal test key"

3. **Copy both keys** - These are from your Sandbox environment

**⚠️ Important:**
- Sandbox keys use the **same prefix** as Test Mode (`pk_test_` and `sk_test_`)
- The isolation is at the **environment level**, not the key prefix
- Always verify you're in Sandbox mode when copying keys (check for "Sandbox" indicator)

---

## Step 4: Create Products and Prices in Sandbox

**Critical:** Sandbox environments start **empty**. You must create products and prices:

### Option A: Manual Creation

1. In your Sandbox, go to: **Products**
2. Click **"Add product"**
3. Create your products and prices
4. Copy the **Price IDs** (they start with `price_`)

### Option B: Automated Script

```bash
# This script will check and create products if missing
node scripts/verify-stripe-account.js
```

**Important:** Make sure your `.env.local` has the Sandbox API key set as `STRIPE_SECRET_KEY` when running this script.

---

## Step 5: Configure Environment Variables

Update your `.env.local` file:

```env
# Stripe Sandbox Configuration
# Note: Sandboxes use pk_test_ and sk_test_ keys (same prefix as Test Mode)
# but they operate in an isolated environment separate from regular Test Mode

# Sandbox API Keys (from Sandbox environment)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_SANDBOX_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SANDBOX_SECRET_KEY

# Sandbox API Key for Stripe CLI (used by start-dev-with-webhooks.js)
STRIPE_SANDBOX_API_KEY=sk_test_YOUR_SANDBOX_SECRET_KEY

# Sandbox Price IDs (created in your Sandbox environment)
NEXT_PUBLIC_ONE_TIME_PRICE_ID=price_xxxxx
NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID=price_xxxxx

# Webhook Secret (will be filled after running stripe listen)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Where to find:**
- **Sandbox Keys**: Stripe Dashboard → Switch to Sandbox → Developers → API keys
- **Price IDs**: Stripe Dashboard → Switch to Sandbox → Products → Copy Price ID
- **Webhook Secret**: Output from `stripe listen` command (see Step 6)

---

## Step 6: Set Up Webhook Forwarding for Sandbox

### Option A: Using Helper Script (Recommended)

Our helper script automatically uses the sandbox API key if configured:

```bash
# Make sure STRIPE_SANDBOX_API_KEY is in .env.local
npm run dev:with-webhooks
```

The script will:
1. Read `STRIPE_SANDBOX_API_KEY` from `.env.local`
2. Start Next.js dev server
3. Run `stripe listen --api-key <sandbox-key> --forward-to localhost:3000/api/webhooks/stripe`

### Option B: Manual Setup

**Terminal 1: Start Next.js**
```bash
npm run dev
```

**Terminal 2: Forward Webhooks from Sandbox**
```bash
# Use your sandbox secret key
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_SECRET_KEY
```

**Important:** The `--api-key` flag is **required** when using a sandbox. Without it, `stripe listen` will forward events from Test Mode, not your Sandbox.

**Output:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy this webhook secret** and add it to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Restart your Next.js dev server** after adding the webhook secret.

---

## Step 7: Verify Sandbox Setup

### Check API Key Mode

```bash
# Verify your API key is from Sandbox
node scripts/verify-stripe-account.js
```

This will show:
- Account connection status
- Products and prices in your environment
- Mode (should indicate Sandbox if using sandbox keys)

### Check Price IDs Match Environment

```bash
# Verify Price IDs exist in your Sandbox
node scripts/verify-stripe-prices.js
```

**Important:** Price IDs must be from the same environment (Sandbox) as your API keys.

### Test Webhook Connection

1. Make a test payment in your app
2. Check Stripe CLI terminal - should show:
   ```
   --> checkout.session.completed [evt_xxx]
   <-- [200] POST http://localhost:3000/api/webhooks/stripe
   ```
3. Check Next.js terminal - should show:
   ```
   🔔 WEBHOOK EVENT RECEIVED
   ✅ CHECKOUT SESSION COMPLETED
   ```

---

## Common Issues and Solutions

### Issue 1: Webhook Not Receiving Events

**Symptoms:**
- Payment completes but webhook never fires
- No `🔔 WEBHOOK EVENT RECEIVED` in logs

**Causes:**
1. `stripe listen` not running with sandbox API key
2. Using Test Mode keys instead of Sandbox keys
3. Webhook secret mismatch

**Solution:**
```bash
# Verify you're using sandbox API key
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_KEY

# Check the output shows webhook secret
# Update STRIPE_WEBHOOK_SECRET in .env.local
# Restart Next.js dev server
```

### Issue 2: Price ID Not Found

**Symptoms:**
- Error: "No such price: price_xxxxx"
- Checkout fails to create

**Causes:**
- Price ID is from Test Mode, but you're using Sandbox keys
- Price ID is from Sandbox, but you're using Test Mode keys
- Price doesn't exist in the current environment

**Solution:**
1. Verify environment match:
   - If using Sandbox keys → Price IDs must be from Sandbox
   - If using Test Mode keys → Price IDs must be from Test Mode
2. Check Stripe Dashboard:
   - Switch to your Sandbox
   - Go to Products → Verify Price IDs exist
3. Recreate products if needed:
   ```bash
   node scripts/verify-stripe-account.js
   ```

### Issue 3: Customer Not Created in Sandbox

**Symptoms:**
- Payment succeeds but no customer ID stored
- Account not activated

**Causes:**
- Customer created in different environment (Test Mode vs Sandbox)
- Webhook processing failed

**Solution:**
1. Verify webhook is receiving events (see Issue 1)
2. Check webhook logs for errors
3. Verify email match between Stripe and database
4. Run diagnostic:
   ```bash
   node scripts/diagnose-webhook-issue.js customer@example.com
   ```

### Issue 4: "Accounts V2" Error

**Symptoms:**
```
Creating a Checkout session in testmode without an existing customer is not supported 
while using Accounts V2. Please use a Sandbox, rather than testmode, for testing Checkout.
```

**Solution:**
1. Switch to Sandbox (see Step 1-3)
2. Use Sandbox API keys in `.env.local`
3. Create products/prices in Sandbox
4. Use `stripe listen --api-key <sandbox-key>` for webhooks

**Note:** Our code creates customers before checkout, but if you still see this error, you must use Sandbox.

---

## Sandbox vs Test Mode Comparison

| Feature | Test Mode | Sandbox |
|---------|-----------|---------|
| **Key Prefix** | `pk_test_` / `sk_test_` | `pk_test_` / `sk_test_` |
| **Environment** | Shared with account | Isolated per sandbox |
| **Products/Prices** | Shared with account | Per-sandbox (isolated) |
| **Customers** | Shared with account | Per-sandbox (isolated) |
| **Webhooks** | Default `stripe listen` | Requires `--api-key` flag |
| **Accounts V2** | ❌ Limited support | ✅ Full support |
| **Use Case** | Basic testing | Complex integrations, team collaboration |

---

## Verification Checklist

Before testing payments, verify:

- [ ] Sandbox created in Stripe Dashboard
- [ ] Switched to Sandbox environment in dashboard
- [ ] Sandbox API keys copied (publishable and secret)
- [ ] `STRIPE_SECRET_KEY` in `.env.local` is from Sandbox
- [ ] `STRIPE_SANDBOX_API_KEY` in `.env.local` matches `STRIPE_SECRET_KEY`
- [ ] Products and prices created in Sandbox
- [ ] Price IDs in `.env.local` are from Sandbox
- [ ] `stripe listen` running with `--api-key <sandbox-key>`
- [ ] Webhook secret copied to `STRIPE_WEBHOOK_SECRET` in `.env.local`
- [ ] Next.js dev server restarted after adding webhook secret
- [ ] Test payment triggers webhook events

---

## Quick Reference Commands

```bash
# Start dev server with sandbox webhooks (recommended)
npm run dev:with-webhooks

# Manual: Forward sandbox webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_KEY

# Verify sandbox setup
node scripts/verify-stripe-account.js
node scripts/verify-stripe-prices.js

# Check user status after payment
node scripts/check-user-status.js customer@example.com

# Diagnose webhook issues
node scripts/diagnose-webhook-issue.js customer@example.com
```

---

## Important Notes

1. **Sandbox Keys = Test Keys (Prefix)**: Sandbox uses `pk_test_` and `sk_test_` prefixes, same as Test Mode. The isolation is environmental, not by key prefix.

2. **Environment Matching**: Always ensure:
   - API keys and Price IDs are from the same environment (both Sandbox or both Test Mode)
   - `stripe listen` uses the same API key as your application

3. **Webhook Secret**: Each `stripe listen` session generates a unique webhook secret. If you restart `stripe listen`, you must update `STRIPE_WEBHOOK_SECRET` in `.env.local`.

4. **Sandbox Isolation**: Data in Sandbox is completely separate from Test Mode. Products, customers, and prices don't transfer between environments.

5. **Production**: Sandboxes are for testing only. Production always uses Live Mode with `pk_live_` and `sk_live_` keys.

---

## Related Documentation

- [Stripe Setup Guide](./STRIPE_SETUP.md)
- [Stripe Webhook Setup (Local)](./STRIPE_SETUP2.md)
- [Stripe Webhook Troubleshooting](../STRIPE_WEBHOOK_TROUBLESHOOTING.md)
- [Environment Variables](../ENVIRONMENT_VARIABLES.md)

---

**Last Updated**: 2025-01-19  
**Project**: Stavky - Sports Betting Tips Platform
