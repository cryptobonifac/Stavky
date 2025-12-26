# Webhook Log Analysis Summary

## Current Status Analysis

Based on webhook debug tool analysis for `customer14@gmail.com`:

### User Account Status

| Field | Value | Status |
|-------|-------|--------|
| **Email** | customer14@gmail.com | ✅ Exists |
| **User ID** | 46dd738c-9ef1-496d-a0dd-26d2ef517f84 | ✅ Found |
| **Role** | customer | ✅ Correct |
| **Account Status** | ❌ INACTIVE | ❌ **ISSUE** |
| **Account Active Until** | NULL | ❌ **ISSUE** |
| **Stripe Customer ID** | NULL | ❌ **ISSUE** |
| **Stripe Subscription ID** | NULL | ❌ **ISSUE** |
| **Last Updated** | 2025-12-19 18:41:51 | ⚠️ Old (no recent update) |

### Analysis

**Account Status:** INACTIVE  
**Has Stripe Customer:** ❌ No  
**Has Stripe Subscription:** ❌ No  
**Days Since Last Update:** ~30+ days (estimated)

### Webhook Status

**Webhook Processed:** ❌ **NO**  
**Likely Issue:** Webhook may not have processed payment - no Stripe IDs stored

---

## Root Cause Analysis

### Why Webhook Didn't Process

1. **Environment Mismatch (Most Likely)**
   - Payment made in **Stripe Sandbox**
   - `stripe listen` running in **Test Mode** (without `--api-key` flag)
   - Result: Webhook events from Sandbox never reach server

2. **Stripe CLI Not Running**
   - `stripe listen` not started
   - Webhook events have no forwarding mechanism
   - Result: Events never reach localhost

3. **Webhook Secret Mismatch**
   - `STRIPE_WEBHOOK_SECRET` in `.env.local` doesn't match current `stripe listen` output
   - Signature verification fails
   - Result: Events rejected with 400 error

4. **Email Mismatch**
   - Email in Stripe doesn't match database email exactly
   - Case sensitivity issue
   - Result: User lookup fails, account not activated

---

## Solution Steps

### Step 1: Verify Sandbox Setup

1. **Check Stripe Dashboard:**
   - Switch to your Sandbox (top-right dropdown)
   - Verify you see "Sandbox" indicator
   - Go to **Developers → API keys**
   - Copy the Secret key

2. **Verify Environment Variables:**
   ```env
   STRIPE_SECRET_KEY=sk_test_YOUR_SANDBOX_KEY
   STRIPE_SANDBOX_API_KEY=sk_test_YOUR_SANDBOX_KEY  # Same as above!
   ```

3. **Verify Price IDs:**
   - Ensure Price IDs in `.env.local` are from Sandbox (not Test Mode)
   - Run: `node scripts/verify-stripe-prices.js`

### Step 2: Start Webhook Forwarding with Sandbox

**Option A: Using Helper Script (Recommended)**
```bash
# Make sure STRIPE_SANDBOX_API_KEY is in .env.local
npm run dev:with-webhooks
```

**Option B: Manual**
```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Stripe CLI with sandbox key
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_YOUR_SANDBOX_KEY
```

**Important:** The `--api-key` flag is **REQUIRED** when using Sandbox!

### Step 3: Copy Webhook Secret

When `stripe listen` starts, it outputs:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Restart Next.js dev server** after adding the webhook secret.

### Step 4: Make Test Payment

1. Navigate to checkout page
2. Complete payment with test card: `4242 4242 4242 4242`
3. Watch for webhook events in terminals

### Step 5: Verify Webhook Processing

**Check Stripe CLI Terminal:**
```
--> checkout.session.completed [evt_xxx]
<-- [200] POST http://localhost:3000/api/webhooks/stripe
```

**Check Next.js Terminal:**
```
🔔 WEBHOOK EVENT RECEIVED
✅ CHECKOUT SESSION COMPLETED
📧 EMAIL LOCATIONS: customer14@gmail.com
✅ USER FOUND IN DATABASE
✅ DATABASE UPDATE SUCCESSFUL
```

**Verify Account Activation:**
```bash
node scripts/check-user-status.js customer14@gmail.com
```

Should show:
- ✅ Account Active Until: `<future date>`
- ✅ Stripe Customer ID: `cus_xxxxx`
- ✅ Current Status: ACTIVE

---

## Log Analysis Tools

### 1. Webhook Debug Page

Navigate to: `http://localhost:3000/en/admin/webhook-debug?email=customer14@gmail.com`

**Features:**
- User information display
- Account status analysis
- Webhook checklist
- Possible issues detection
- Next steps guidance

### 2. Webhook Logs Page

Navigate to: `http://localhost:3000/en/admin/webhook-logs`

**Features:**
- View all users with recent activity
- Filter by email
- Auto-refresh capability
- Webhook status analysis
- Table view of all users

### 3. API Endpoints

**Single User:**
```
GET /api/webhooks/logs?email=customer14@gmail.com
```

**All Users:**
```
GET /api/webhooks/logs?limit=20
```

### 4. Command Line Scripts

```bash
# Check user status
node scripts/check-user-status.js customer14@gmail.com

# Diagnose webhook issues
node scripts/diagnose-webhook-issue.js customer14@gmail.com

# Verify Stripe configuration
node scripts/verify-stripe-account.js
node scripts/verify-stripe-prices.js
```

---

## Expected Log Patterns

### ✅ Success Pattern

```
Stripe CLI:
--> checkout.session.completed [evt_xxx]
<-- [200] POST http://localhost:3000/api/webhooks/stripe

Next.js Terminal:
================================================================================
🔔 WEBHOOK EVENT RECEIVED
================================================================================
Event Type: checkout.session.completed
Event ID: evt_xxxxx
...

✅ CHECKOUT SESSION COMPLETED
Session ID: cs_test_xxxxx
Payment Status: paid
Mode: payment

📧 EMAIL LOCATIONS:
   customer_details?.email: customer14@gmail.com
   customer_email: customer14@gmail.com
   metadata?.userId: <uuid>

🔐 ACTIVATION CONDITION CHECK:
   Mode check: true
   Identifier check: true
   Payment status check: true
   Should activate: true

✅ USER FOUND IN DATABASE
   Email: customer14@gmail.com
   ID: <uuid>

✅ DATABASE UPDATE SUCCESSFUL
   Account active until: 2026-01-XX...
```

### ❌ Failure Patterns

#### Pattern 1: No Webhook Received
```
Stripe CLI: (no output)
Next.js Terminal: (no webhook logs)
```
**Cause:** `stripe listen` not running or wrong environment

#### Pattern 2: Signature Verification Failed
```
Next.js Terminal:
Webhook signature verification failed: ...
```
**Cause:** Webhook secret mismatch

#### Pattern 3: User Not Found
```
Next.js Terminal:
❌ USER NOT FOUND IN DATABASE
   Searched email: customer14@gmail.com
```
**Cause:** Email mismatch or user doesn't exist

#### Pattern 4: Database Update Failed
```
Next.js Terminal:
❌ DATABASE UPDATE FAILED
   Error code: ...
```
**Cause:** RLS policy, permissions, or database issue

---

## Quick Diagnostic Checklist

- [ ] Stripe CLI authenticated: `stripe login`
- [ ] `stripe listen` running with `--api-key <sandbox-key>`
- [ ] `STRIPE_WEBHOOK_SECRET` matches `stripe listen` output
- [ ] `STRIPE_SECRET_KEY` is from Sandbox
- [ ] `STRIPE_SANDBOX_API_KEY` matches `STRIPE_SECRET_KEY`
- [ ] Price IDs are from Sandbox environment
- [ ] User exists in database
- [ ] Email in Stripe matches database email exactly
- [ ] Next.js dev server restarted after adding webhook secret

---

## Next Steps

1. **Fix Sandbox Webhook Forwarding:**
   - Ensure `stripe listen` uses `--api-key <sandbox-key>`
   - Use helper script: `npm run dev:with-webhooks`

2. **Verify Configuration:**
   - Run: `node scripts/verify-stripe-account.js`
   - Run: `node scripts/verify-stripe-prices.js`

3. **Make Test Payment:**
   - Use test card: `4242 4242 4242 4242`
   - Monitor both terminals for webhook events

4. **Verify Activation:**
   - Check: `node scripts/check-user-status.js customer14@gmail.com`
   - Should show account as ACTIVE with Stripe IDs

---

## Related Documentation

- [Stripe Sandbox Setup](./STRIPE_SANDBOX_SETUP.md)
- [Sandbox Webhook Troubleshooting](./SANDBOX_WEBHOOK_TROUBLESHOOTING.md)
- [Stripe Webhook Setup (Local)](./STRIPE_SETUP2.md)
- [Webhook Endpoint Verification](./WEBHOOK_ENDPOINT_VERIFICATION.md)

---

**Last Updated**: 2025-01-19  
**Status**: Webhook endpoint correctly implemented, but webhook events not reaching server due to Sandbox environment mismatch



