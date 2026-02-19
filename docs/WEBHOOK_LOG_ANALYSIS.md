# Webhook Log Analysis Guide

## How to Capture Logs

### Local Development

1. **Terminal 1: Next.js Dev Server**
   ```bash
   npm run dev
   # or
   node scripts/start-dev-with-webhooks.js
   ```
   - Look for logs starting with `🔔 WEBHOOK EVENT RECEIVED`
   - Copy ALL logs from when you make a payment

2. **Terminal 2: Stripe CLI** (if running separately)
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   - Look for messages like `--> checkout.session.completed [evt_xxxxx]`
   - Check if events are being forwarded

### Production

- **Vercel**: Go to Dashboard → Your Project → Functions → View logs
- **Other platforms**: Check your hosting platform's log viewer

## What to Look For in Logs

### ✅ Success Pattern

```
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
...

📧 EMAIL LOCATIONS:
   customer_details?.email: customer14@gmail.com
   customer_email: customer14@gmail.com
   metadata?.userId: <uuid>
...

🔐 ACTIVATION CONDITION CHECK:
   Mode check (subscription || payment): true (mode: payment)
   Identifier check (email || userId): true (email: customer14@gmail.com, userId: <uuid>)
   Payment status check (paid || complete): true (status: paid)
   Should activate: true

🔍 STARTING USER LOOKUP...
   Attempting lookup by userId from metadata: <uuid>
   Lookup by userId result: SUCCESS: Found user customer14@gmail.com

✅ USER FOUND IN DATABASE
   Email: customer14@gmail.com
   ID: <uuid>
   Current Status: INACTIVE

💾 EXECUTING DATABASE UPDATE...
   Update duration: 45ms

✅ DATABASE UPDATE SUCCESSFUL
   User: customer14@gmail.com (payment mode)
   Account active until: 2026-01-XX...
   Updated fields: account_active_until, stripe_customer_id

📋 VERIFICATION - UPDATED USER RECORD:
   account_active_until: 2026-01-XX...
   stripe_customer_id: cus_xxxxx
   Account is now ACTIVE: ✅ YES
```

### ❌ Failure Patterns

#### Pattern 1: Webhook Not Received
**Symptoms:**
- No logs starting with `🔔 WEBHOOK EVENT RECEIVED`
- Stripe CLI shows events but no logs in Next.js

**Possible Causes:**
- Stripe CLI not running
- Webhook URL incorrect
- Network/firewall blocking
- Webhook secret mismatch

#### Pattern 2: User Not Found
**Symptoms:**
```
❌ USER NOT FOUND IN DATABASE
   Searched email: customer14@gmail.com
   Searched userId: <uuid>
   Lookup method: email-failed
   Error: { "code": "PGRST116", "message": "The result contains 0 rows" }
```

**Possible Causes:**
- Email case mismatch (customer14@gmail.com vs Customer14@gmail.com)
- User doesn't exist in database
- User not logged in when creating checkout (no userId in metadata)

#### Pattern 3: Payment Status Not Valid
**Symptoms:**
```
⚠️  ACCOUNT ACTIVATION SKIPPED
   Reason: Activation condition not met
   Payment status check (paid || complete): false (status: unpaid)
```

**Possible Causes:**
- Payment not completed
- Async payment (bank transfer, etc.)
- Payment failed

#### Pattern 4: Database Update Failed
**Symptoms:**
```
❌ DATABASE UPDATE FAILED
   Error code: 42501
   Error message: new row violates row-level security policy
```

**Possible Causes:**
- RLS policy blocking update
- Missing SUPABASE_SERVICE_ROLE_KEY
- Database connection issue

## Common Issues and Solutions

### Issue 1: Email Case Mismatch

**Logs show:**
```
   customer_details?.email: Customer14@gmail.com
   Searched email: Customer14@gmail.com
   ❌ USER NOT FOUND IN DATABASE
```

**Solution:**
- The webhook handler now tries case-insensitive lookup as fallback
- Ensure user email in database matches exactly (or use case-insensitive matching)

### Issue 2: No userId in Metadata

**Logs show:**
```
   metadata?.userId: NULL
   Attempting lookup by email (case-insensitive): customer14@gmail.com
```

**Solution:**
- Ensure user is logged in when creating checkout session
- Check `app/checkout/actions.ts` - it should add `userId` to metadata

### Issue 3: Webhook Secret Mismatch

**Logs show:**
```
Webhook signature verification failed: ...
```

**Solution:**
- Verify `STRIPE_WEBHOOK_SECRET` in `.env.local` matches Stripe CLI output
- For production, verify it matches the webhook endpoint secret in Stripe Dashboard

## Diagnostic Commands

### Check User Status
```bash
node scripts/check-user-status.js customer14@gmail.com
```

### Run Diagnostic
```bash
node scripts/diagnose-webhook-issue.js customer14@gmail.com
```

### Check Environment Variables
```bash
node scripts/check-env-vars.js
```

## Next Steps

1. **Share your logs** - Copy the complete webhook handler logs from your terminal
2. **Include these details:**
   - All logs starting from `🔔 WEBHOOK EVENT RECEIVED`
   - Any error messages
   - Stripe CLI output (if using)
   - User email that made the payment

3. **Run diagnostic:**
   ```bash
   node scripts/diagnose-webhook-issue.js customer14@gmail.com
   ```

4. **Check user status:**
   ```bash
   node scripts/check-user-status.js customer14@gmail.com
   ```







