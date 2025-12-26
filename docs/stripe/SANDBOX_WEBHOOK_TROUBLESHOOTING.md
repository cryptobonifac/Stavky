# Stripe Sandbox Webhook Troubleshooting

## The Problem: Webhook Not Reaching Server with Sandbox

When using Stripe Sandbox locally, webhooks may not reach your server if not configured correctly.

---

## Root Cause Analysis

### Why Webhooks Don't Work with Sandbox by Default

1. **Environment Isolation**: Sandbox is a separate isolated environment from Test Mode
2. **API Key Requirement**: `stripe listen` defaults to Test Mode, not Sandbox
3. **Key Matching**: The API key used by `stripe listen` must match the environment where payments are made

### The Issue

When you make a payment in Sandbox:
- Payment is created in **Sandbox environment**
- Webhook event is generated in **Sandbox environment**
- But `stripe listen` (without `--api-key`) forwards events from **Test Mode**
- Result: **Webhook never reaches your server** because it's listening to the wrong environment

---

## Solution: Use `--api-key` Flag

### Correct Setup for Sandbox

**Terminal 1: Next.js Dev Server**
```bash
npm run dev
```

**Terminal 2: Stripe CLI with Sandbox Key**
```bash
# MUST use --api-key with your sandbox secret key
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_SECRET_KEY
```

**Or use the helper script:**
```bash
# Make sure STRIPE_SANDBOX_API_KEY is in .env.local
npm run dev:with-webhooks
```

---

## Configuration Checklist

### 1. Environment Variables

Your `.env.local` should have:

```env
# Sandbox API Keys (from Stripe Dashboard → Sandbox → API Keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_SANDBOX_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SANDBOX_SECRET_KEY

# Sandbox API Key for Stripe CLI (should match STRIPE_SECRET_KEY)
STRIPE_SANDBOX_API_KEY=sk_test_YOUR_SANDBOX_SECRET_KEY

# Sandbox Price IDs (from Stripe Dashboard → Sandbox → Products)
NEXT_PUBLIC_ONE_TIME_PRICE_ID=price_xxxxx
NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID=price_xxxxx

# Webhook Secret (from stripe listen output)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Important:**
- `STRIPE_SECRET_KEY` = Your sandbox secret key (used by the app)
- `STRIPE_SANDBOX_API_KEY` = Same sandbox secret key (used by `stripe listen`)
- Both should be **identical** and from the **same Sandbox environment**

### 2. Verify You're Using Sandbox Keys

**Check in Stripe Dashboard:**
1. Switch to your Sandbox (top-right dropdown)
2. Go to **Developers → API keys**
3. Copy the Secret key
4. Verify it matches `STRIPE_SECRET_KEY` in `.env.local`

**Check with script:**
```bash
node scripts/verify-stripe-account.js
```

This will show which environment you're connected to.

### 3. Verify Price IDs Match Sandbox

**Check in Stripe Dashboard:**
1. Switch to your Sandbox
2. Go to **Products**
3. Verify Price IDs exist
4. Compare with `NEXT_PUBLIC_ONE_TIME_PRICE_ID` and `NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID` in `.env.local`

**Check with script:**
```bash
node scripts/verify-stripe-prices.js
```

---

## Step-by-Step Fix

### Step 1: Verify Sandbox Setup

1. Go to Stripe Dashboard
2. Switch to your Sandbox (top-right dropdown)
3. Verify you see "Sandbox" indicator
4. Go to **Developers → API keys**
5. Copy the Secret key (starts with `sk_test_`)

### Step 2: Update Environment Variables

Update `.env.local`:

```env
# Use Sandbox keys (not Test Mode keys)
STRIPE_SECRET_KEY=sk_test_YOUR_SANDBOX_SECRET_KEY
STRIPE_SANDBOX_API_KEY=sk_test_YOUR_SANDBOX_SECRET_KEY  # Same as above
```

**Important:** Both should be the **same key** from your Sandbox.

### Step 3: Start Webhook Forwarding with Sandbox Key

**Option A: Using Helper Script**
```bash
# Make sure STRIPE_SANDBOX_API_KEY is set in .env.local
npm run dev:with-webhooks
```

**Option B: Manual**
```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Stripe CLI with sandbox key
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_SECRET_KEY
```

### Step 4: Copy Webhook Secret

When `stripe listen` starts, it will output:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Copy this and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 5: Restart Next.js Server

After adding the webhook secret:
```bash
# Stop the dev server (Ctrl+C)
# Restart it
npm run dev
```

### Step 6: Test Payment

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
   ✅ DATABASE UPDATE SUCCESSFUL
   ```

---

## Verification Commands

### Check Current Setup

```bash
# Verify API key is from Sandbox
node scripts/verify-stripe-account.js

# Verify Price IDs match environment
node scripts/verify-stripe-prices.js

# Check user status after payment
node scripts/check-user-status.js customer@example.com

# Diagnose webhook issues
node scripts/diagnose-webhook-issue.js customer@example.com
```

---

## Common Mistakes

### ❌ Mistake 1: Not Using `--api-key` Flag

```bash
# WRONG - This listens to Test Mode, not Sandbox
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Fix:**
```bash
# CORRECT - Use sandbox API key
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_KEY
```

### ❌ Mistake 2: Mismatched Keys

```env
# WRONG - Different keys
STRIPE_SECRET_KEY=sk_test_SANDBOX_KEY
STRIPE_SANDBOX_API_KEY=sk_test_TEST_MODE_KEY  # Different!
```

**Fix:**
```env
# CORRECT - Same sandbox key
STRIPE_SECRET_KEY=sk_test_YOUR_SANDBOX_KEY
STRIPE_SANDBOX_API_KEY=sk_test_YOUR_SANDBOX_KEY  # Same!
```

### ❌ Mistake 3: Price IDs from Wrong Environment

```env
# WRONG - Price ID from Test Mode, but using Sandbox keys
STRIPE_SECRET_KEY=sk_test_SANDBOX_KEY
NEXT_PUBLIC_ONE_TIME_PRICE_ID=price_TEST_MODE_PRICE_ID
```

**Fix:**
```env
# CORRECT - Price ID from Sandbox
STRIPE_SECRET_KEY=sk_test_SANDBOX_KEY
NEXT_PUBLIC_ONE_TIME_PRICE_ID=price_SANDBOX_PRICE_ID
```

### ❌ Mistake 4: Not Restarting After Adding Webhook Secret

**Problem:** Added `STRIPE_WEBHOOK_SECRET` but didn't restart Next.js

**Fix:** Always restart Next.js dev server after adding/updating `STRIPE_WEBHOOK_SECRET`

---

## Quick Diagnostic

Run this to check your setup:

```bash
# 1. Check environment variables
node scripts/check-env-vars.js

# 2. Verify Stripe connection
node scripts/verify-stripe-account.js

# 3. Verify prices
node scripts/verify-stripe-prices.js

# 4. Check if webhook is receiving events
# Look for "🔔 WEBHOOK EVENT RECEIVED" in Next.js terminal
```

---

## Expected Behavior

### When Everything Works:

1. **Payment in Sandbox** → Creates checkout session in Sandbox
2. **Stripe CLI** → Forwards webhook event from Sandbox to localhost
3. **Next.js Server** → Receives webhook, processes it
4. **Database** → User account activated, Stripe IDs stored
5. **User** → Account is now active

### Logs You Should See:

**Stripe CLI:**
```
--> checkout.session.completed [evt_xxx]
<-- [200] POST http://localhost:3000/api/webhooks/stripe
```

**Next.js Terminal:**
```
🔔 WEBHOOK EVENT RECEIVED
✅ CHECKOUT SESSION COMPLETED
📧 EMAIL LOCATIONS: customer@example.com
✅ USER FOUND IN DATABASE
✅ DATABASE UPDATE SUCCESSFUL
```

---

## Summary

**The Key Point:**
When using Stripe Sandbox, you **MUST** use `stripe listen --api-key <sandbox-key>` to forward webhooks from the Sandbox environment. Without the `--api-key` flag, `stripe listen` defaults to Test Mode, and webhooks from Sandbox won't be forwarded.

**Quick Fix:**
1. Set `STRIPE_SANDBOX_API_KEY` in `.env.local` (same as `STRIPE_SECRET_KEY`)
2. Use `npm run dev:with-webhooks` (automatically uses sandbox key)
3. Or manually: `stripe listen --api-key <sandbox-key> --forward-to localhost:3000/api/webhooks/stripe`

---

## Related Documentation

- [Stripe Sandbox Setup Guide](./STRIPE_SANDBOX_SETUP.md)
- [Stripe Webhook Setup (Local)](./STRIPE_SETUP2.md)
- [Stripe Webhook Troubleshooting](../STRIPE_WEBHOOK_TROUBLESHOOTING.md)

---

**Last Updated**: 2025-01-19
