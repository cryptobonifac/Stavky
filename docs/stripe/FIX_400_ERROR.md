# Fix: All Webhooks Returning 400 Error

## Current Issue

All Stripe webhook events are returning **400 Bad Request**:

```
2025-12-19 20:03:14   --> customer.created [evt_xxx]
2025-12-19 20:03:14  <--  [400] POST http://localhost:3000/api/webhooks/stripe
```

## Root Cause

**Webhook signature verification is failing.** This means the `STRIPE_WEBHOOK_SECRET` in `.env.local` doesn't match the webhook secret from your current `stripe listen` session.

## Quick Fix (5 Steps)

### Step 1: Check Current Stripe Listen Output

Look at your `stripe listen` terminal. You should see:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

**Copy this secret** - it starts with `whsec_`

### Step 2: Update .env.local

Open `.env.local` and update:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

Replace `whsec_xxxxxxxxxxxxx` with the secret from Step 1.

### Step 3: Stop Next.js Dev Server

Press `Ctrl+C` in the terminal running `npm run dev`

### Step 4: Restart Next.js Dev Server

```bash
npm run dev
```

**Important:** Environment variables are only loaded when the server starts. You MUST restart after updating `.env.local`.

### Step 5: Test

Make a test payment and verify:

**Stripe CLI should show:**
```
--> checkout.session.completed [evt_xxx]
<-- [200] POST http://localhost:3000/api/webhooks/stripe  ✅
```

**Next.js terminal should show:**
```
🔔 WEBHOOK EVENT RECEIVED
✅ CHECKOUT SESSION COMPLETED
✅ DATABASE UPDATE SUCCESSFUL
```

## Why This Happens

Every time you restart `stripe listen`, it generates a **new webhook secret**. If you don't update `.env.local` and restart Next.js, the old secret won't match and all webhooks will fail with 400.

## Prevention

### Option 1: Use Helper Script (Recommended)

The `scripts/start-dev-with-webhooks.js` script helps manage this:

```bash
npm run dev:with-webhooks
```

This script:
- Starts Next.js dev server
- Starts `stripe listen` with correct configuration
- Shows webhook secret in output
- Handles Sandbox mode automatically

### Option 2: Check Before Each Session

Before starting development:

1. Start `stripe listen`
2. Copy the webhook secret
3. Verify it matches `.env.local`
4. If different, update `.env.local` and restart Next.js

## Verification

Run diagnostic script:

```bash
node scripts/check-webhook-secret.js
```

This checks:
- ✅ Webhook secret is set
- ✅ Format is correct
- ⚠️ Warns if format looks wrong

## Common Mistakes

### ❌ Wrong: Using old secret
```env
# .env.local has secret from yesterday
STRIPE_WEBHOOK_SECRET=whsec_old_secret
```

### ✅ Correct: Using current secret
```env
# .env.local matches current stripe listen output
STRIPE_WEBHOOK_SECRET=whsec_current_secret
```

### ❌ Wrong: Not restarting server
```bash
# Updated .env.local
# But server still running with old secret
```

### ✅ Correct: Restart after update
```bash
# Updated .env.local
# Stop server (Ctrl+C)
npm run dev  # Now loads new secret
```

## Sandbox-Specific Issue

If using **Stripe Sandbox**, ensure:

1. `stripe listen` uses `--api-key` flag:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_KEY
   ```

2. `STRIPE_SANDBOX_API_KEY` is set in `.env.local`:
   ```env
   STRIPE_SANDBOX_API_KEY=sk_test_YOUR_SANDBOX_KEY
   ```

3. Webhook secret from Sandbox `stripe listen` matches `.env.local`

## Still Not Working?

1. **Check Next.js Terminal:**
   - Look for detailed error message after "Webhook signature verification failed:"
   - This will tell you exactly what's wrong

2. **Verify Stripe Listen is Running:**
   ```bash
   # Should see events being forwarded
   --> checkout.session.completed [evt_xxx]
   ```

3. **Check for Multiple Instances:**
   - Only one `stripe listen` should be running
   - Multiple instances can cause conflicts

4. **Verify Environment Match:**
   - Test Mode payment → Test Mode webhook
   - Sandbox payment → Sandbox webhook (with `--api-key`)

## Related Documentation

- [400 Error Troubleshooting](./400_ERROR_TROUBLESHOOTING.md) - Detailed troubleshooting guide
- [Stripe Sandbox Setup](./STRIPE_SANDBOX_SETUP.md) - Sandbox configuration
- [Stripe Webhook Setup](./STRIPE_SETUP2.md) - General webhook setup

---

**Last Updated:** 2025-01-19  
**Status:** All webhooks returning 400 - signature verification failing







