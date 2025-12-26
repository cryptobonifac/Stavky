# Stripe Webhook 400 Error Troubleshooting

## Problem

All webhook events are returning **400 Bad Request** errors:

```
2025-12-19 20:03:14   --> customer.created [evt_xxx]
2025-12-19 20:03:14  <--  [400] POST http://localhost:3000/api/webhooks/stripe
```

## Root Causes

A 400 error from the webhook endpoint indicates one of two issues:

### 1. Missing Signature Header (Most Common)

**Error Location:** Line 23-27 in `app/api/webhooks/stripe/route.ts`

**Cause:** The `stripe-signature` header is not being sent or received correctly.

**Check:**
- Is `stripe listen` running?
- Is it forwarding to the correct URL?
- Are there any network/proxy issues?

### 2. Signature Verification Failed (Most Likely)

**Error Location:** Line 42-49 in `app/api/webhooks/stripe/route.ts`

**Cause:** The `STRIPE_WEBHOOK_SECRET` in `.env.local` doesn't match the webhook secret from `stripe listen`.

**Common Scenarios:**
- Webhook secret was updated in `stripe listen` but not in `.env.local`
- Using wrong webhook secret (Test Mode vs Sandbox)
- Webhook secret was copied incorrectly
- `.env.local` not loaded (server not restarted)

## Diagnostic Steps

### Step 1: Check Webhook Secret Configuration

```bash
node scripts/check-webhook-secret.js
```

This will verify:
- ✅ `STRIPE_WEBHOOK_SECRET` is set
- ✅ Format is correct (starts with `whsec_`)
- ✅ Matches current environment

### Step 2: Check Next.js Terminal Logs

Look for this error message:

```
Webhook signature verification failed: ...
```

This will tell you exactly why the signature verification failed.

**Common Error Messages:**
- `No signatures found matching the expected signature`
- `Unable to extract timestamp and signatures from header`
- `Timestamp outside the tolerance zone`

### Step 3: Verify Stripe CLI Output

When you start `stripe listen`, it should output:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

**Important:** This secret MUST match `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### Step 4: Check Environment Variables

```bash
# Check if webhook secret is loaded
node -e "console.log('Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET ? 'SET' : 'NOT SET')"
```

**Note:** This only works if `.env.local` is loaded. In Next.js, environment variables are loaded at server startup.

## Solutions

### Solution 1: Update Webhook Secret

1. **Stop Next.js dev server** (if running)

2. **Get current webhook secret:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the secret from the output: `whsec_xxxxxxxxxxxxx`

3. **Update `.env.local`:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

4. **Restart Next.js dev server:**
   ```bash
   npm run dev
   ```

5. **Keep `stripe listen` running** in a separate terminal

### Solution 2: Verify Stripe Listen is Running

```bash
# Check if stripe listen is running
# You should see it forwarding events in the terminal
```

If not running:
```bash
# For Test Mode
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# For Sandbox (REQUIRED)
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_KEY
```

### Solution 3: Check for Multiple Stripe Listen Instances

Having multiple `stripe listen` instances can cause conflicts:

```bash
# Check running processes (macOS/Linux)
ps aux | grep "stripe listen"

# Kill all instances
pkill -f "stripe listen"
```

### Solution 4: Verify Environment Match

**If using Sandbox:**
- `STRIPE_SECRET_KEY` should be from Sandbox
- `STRIPE_SANDBOX_API_KEY` should match `STRIPE_SECRET_KEY`
- `stripe listen` must use `--api-key <sandbox-key>`

**If using Test Mode:**
- `STRIPE_SECRET_KEY` should be from Test Mode
- `stripe listen` can run without `--api-key` (defaults to Test Mode)

## Quick Fix Checklist

- [ ] `stripe listen` is running
- [ ] Webhook secret from `stripe listen` matches `.env.local`
- [ ] Next.js dev server restarted after updating `.env.local`
- [ ] Only one `stripe listen` instance is running
- [ ] Using correct environment (Test Mode vs Sandbox)
- [ ] If Sandbox: `stripe listen` uses `--api-key` flag
- [ ] Check Next.js terminal for specific error message

## Testing After Fix

1. **Make a test payment:**
   - Use test card: `4242 4242 4242 4242`
   - Complete checkout

2. **Check Stripe CLI:**
   ```
   --> checkout.session.completed [evt_xxx]
   <-- [200] POST http://localhost:3000/api/webhooks/stripe  ✅
   ```

3. **Check Next.js Terminal:**
   ```
   🔔 WEBHOOK EVENT RECEIVED
   ✅ CHECKOUT SESSION COMPLETED
   ✅ DATABASE UPDATE SUCCESSFUL
   ```

## Common Mistakes

### ❌ Wrong: Using old webhook secret
```env
STRIPE_WEBHOOK_SECRET=whsec_old_secret_from_yesterday
```

### ✅ Correct: Using current webhook secret
```env
STRIPE_WEBHOOK_SECRET=whsec_current_secret_from_stripe_listen
```

### ❌ Wrong: Not restarting server after updating .env.local
```bash
# Updated .env.local but didn't restart
npm run dev  # Still using old secret
```

### ✅ Correct: Restart after updating
```bash
# Updated .env.local
# Stop server (Ctrl+C)
npm run dev  # Now using new secret
```

### ❌ Wrong: Sandbox payment but Test Mode webhook
```bash
# Payment in Sandbox
# But stripe listen defaults to Test Mode
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### ✅ Correct: Sandbox payment with Sandbox webhook
```bash
# Payment in Sandbox
# stripe listen uses Sandbox API key
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_SANDBOX_KEY
```

## Related Documentation

- [Stripe Sandbox Setup](./STRIPE_SANDBOX_SETUP.md)
- [Sandbox Webhook Troubleshooting](./SANDBOX_WEBHOOK_TROUBLESHOOTING.md)
- [Stripe Webhook Setup (Local)](./STRIPE_SETUP2.md)
- [Webhook Endpoint Verification](./WEBHOOK_ENDPOINT_VERIFICATION.md)

---

**Last Updated:** 2025-01-19  
**Status:** All webhooks returning 400 - signature verification failing
