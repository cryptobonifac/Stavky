# Stripe Webhook Debugging Guide

This guide helps you debug issues with Stripe webhooks not reaching your local development server or not updating the database correctly.

## Problem: Database Not Updated After Successful Payment

If you complete a Stripe checkout successfully but the user table fields (`stripe_customer_id`, `stripe_subscription_id`, `account_active_until`) remain empty, follow this debugging workflow.

## Prerequisites

- Stripe CLI installed
- Next.js dev server running
- Supabase local instance running
- Valid Stripe test API keys in `.env.local`

## Step 1: Verify Stripe CLI Is Installed

```bash
stripe --version
```

**Expected output:**
```
stripe version X.X.X
```

**If not installed:**
- Windows: Download from https://github.com/stripe/stripe-cli/releases
- Or use: `scoop install stripe`
- Or use: `choco install stripe-cli`

## Step 2: Authenticate Stripe CLI

```bash
stripe login
```

This opens your browser to connect the CLI to your Stripe account.

**Verify authentication:**
```bash
stripe config --list
```

Should show your account details.

## Step 3: Check Webhook Secret Configuration

This is the **most common issue**. The `STRIPE_WEBHOOK_SECRET` must match the secret provided by Stripe CLI.

### 3.1 Start Dev Server with Webhooks

```bash
npm run dev:with-webhooks
```

### 3.2 Find the Webhook Secret

In the terminal output, look for the **STRIPE** section (green text):

```
[STRIPE] > Ready! Your webhook signing secret is whsec_1234567890abcdef... (^C to quit)
```

### 3.3 Update .env.local

Copy the `whsec_...` value and add/update in `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
```

### 3.4 Restart Dev Server

**Important:** Stop the dev server (Ctrl+C) and restart it to load the new secret:

```bash
npm run dev:with-webhooks
```

## Step 4: Verify Webhook Endpoint Is Reachable

### 4.1 Check Logs for Request Receipt

When you trigger a Stripe event, you should see logs in your Next.js terminal (blue [NEXT] prefix):

```
🔔 WEBHOOK REQUEST RECEIVED
   URL: http://localhost:3000/api/webhooks/stripe
   Method: POST
   Timestamp: 2025-12-26T...

🔧 Configuration Check:
   STRIPE_WEBHOOK_SECRET exists: true
   Secret prefix: whsec_1234...
   Signature present: true
   Body length: 2451 bytes
```

**If you DON'T see these logs:**
- Webhook is not reaching your endpoint
- Check Stripe CLI is running (see Step 5)
- Verify port 3000 is not blocked

### 4.2 Check Signature Verification

After the configuration check, you should see:

```
🔔 WEBHOOK EVENT RECEIVED
```

**If you see "WEBHOOK SIGNATURE VERIFICATION FAILED":**
- Your `STRIPE_WEBHOOK_SECRET` doesn't match Stripe CLI output
- Go back to Step 3 and update the secret
- Make sure to restart the dev server after updating

## Step 5: Verify Stripe CLI Is Forwarding Events

### 5.1 Check Stripe CLI Process

In the terminal running `npm run dev:with-webhooks`, look for the **STRIPE** output (green):

```
[STRIPE] > Ready! Your webhook signing secret is whsec_...
[STRIPE] > Listening for events...
```

### 5.2 Trigger a Test Event

When you complete a checkout, you should see in the STRIPE output:

```
[STRIPE] 2025-12-26 12:00:00   --> checkout.session.completed [evt_...]
[STRIPE] 2025-12-26 12:00:00   <-- [200] POST http://localhost:3000/api/webhooks/stripe [evt_...]
```

**Key indicators:**
- `-->` means Stripe CLI received the event from Stripe
- `<-- [200]` means the event was successfully forwarded to your endpoint
- `<-- [400]` or `<-- [500]` means there was an error (check Next.js logs for details)

**If you DON'T see `-->` events:**
- Stripe CLI is not receiving events from Stripe
- Check your internet connection
- Run `stripe login` again
- Ensure you're using test mode in Stripe Dashboard

**If you see `-->` but no `<--`:**
- Stripe CLI can't reach your endpoint
- Verify Next.js is running on port 3000
- Check firewall settings

## Step 6: Verify Database Update

### 6.1 Check Webhook Processing Logs

After seeing `<-- [200]`, check the Next.js terminal for:

```
✅ CHECKOUT SESSION COMPLETED
📧 EMAIL LOCATIONS:
   customer_details?.email: user@example.com

🔍 EXTRACTED VALUES:
   Customer ID: cus_...
   Customer Email: user@example.com
   Subscription ID: sub_...

🔐 ACTIVATION CONDITION CHECK:
   Should activate: true

🔍 STARTING USER LOOKUP...
   User found: true

📅 CALCULATING ACTIVATION DATE:
   Activation date (30 days from now): 2025-01-25T...

💾 EXECUTING DATABASE UPDATE...
✅ DATABASE UPDATE SUCCESSFUL
```

**If you see "❌ USER NOT FOUND IN DATABASE":**
- The user doesn't exist in the users table
- Verify the user signed up before making payment
- Check the email matches between signup and Stripe checkout

**If you see "❌ DATABASE UPDATE FAILED":**
- There's a database error
- Check the error message in logs
- Verify Supabase is running: `npx supabase status`
- Check RLS policies aren't blocking the update

### 6.2 Verify in Supabase Studio

1. Open Supabase Studio: http://127.0.0.1:54323
2. Navigate to **Table Editor** → **users**
3. Find the user by email
4. Check these columns are filled:
   - `stripe_customer_id`: Should be `cus_xxxxx`
   - `stripe_subscription_id`: Should be `sub_xxxxx` (if subscription mode)
   - `account_active_until`: Should be ~30 days from now

## Step 7: Manual Test

If webhooks still aren't working, test the endpoint directly:

### 7.1 Test Endpoint Reachability

```bash
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{}'
```

**Expected response:**
```json
{
  "error": "Invalid signature",
  "message": "No signatures found matching the expected signature for payload..."
}
```

This confirms the endpoint is reachable. The signature error is expected for a test request.

**If you get connection refused:**
- Next.js dev server is not running
- Port 3000 is blocked or in use by another process

### 7.2 Send Test Event via Stripe CLI

```bash
stripe trigger checkout.session.completed
```

Check Next.js terminal for webhook logs.

## Common Issues and Solutions

### Issue 1: "STRIPE_WEBHOOK_SECRET is not set"

**Cause:** Environment variable not loaded.

**Solution:**
1. Check `.env.local` has `STRIPE_WEBHOOK_SECRET=whsec_...`
2. Restart dev server to load environment variables
3. Run `echo $env:STRIPE_WEBHOOK_SECRET` (PowerShell) to verify it's loaded

### Issue 2: "Invalid signature"

**Cause:** Webhook secret mismatch.

**Solution:**
1. Get secret from Stripe CLI output (starts with `whsec_`)
2. Update `.env.local`
3. Restart dev server
4. **Important:** The secret changes every time you restart `stripe listen`

### Issue 3: No webhook logs at all

**Cause:** Webhooks not reaching endpoint.

**Solutions:**
1. Verify Stripe CLI is running: Check for green [STRIPE] output
2. Verify forwarding URL is correct: Should be `localhost:3000/api/webhooks/stripe`
3. Check Next.js is running on port 3000
4. Test endpoint with curl (see Step 7.1)

### Issue 4: User not found in database

**Cause:** User record doesn't exist or email doesn't match.

**Solutions:**
1. Verify user signed up before payment
2. Check email in Supabase Studio matches Stripe checkout email
3. Ensure `handle_new_auth_user()` trigger is creating user records

### Issue 5: Database update fails

**Cause:** Permission error or database issue.

**Solutions:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
2. Check Supabase is running: `npx supabase status`
3. Verify migrations are applied: `npx supabase db push`
4. Check the error message in Next.js logs for specific issue

### Issue 6: Webhook succeeds but fields still NULL

**Cause:** Database transaction rolled back or update conditions not met.

**Solutions:**
1. Check activation conditions in logs:
   - Mode should be 'subscription' or 'payment'
   - Payment status should be 'paid'
   - Email or userId should be present
2. Verify no database constraints are failing
3. Check for database triggers that might interfere

## Debugging Checklist

Run through this checklist when debugging:

- [ ] Stripe CLI installed: `stripe --version`
- [ ] Stripe CLI authenticated: `stripe login`
- [ ] Dev server running: `npm run dev:with-webhooks`
- [ ] Webhook secret in `.env.local` matches Stripe CLI output
- [ ] Dev server restarted after updating `.env.local`
- [ ] Supabase running: `npx supabase status`
- [ ] User exists in database before payment
- [ ] Webhook logs appear: "🔔 WEBHOOK REQUEST RECEIVED"
- [ ] Signature verification passes: "🔔 WEBHOOK EVENT RECEIVED"
- [ ] User lookup succeeds: "✅ USER FOUND IN DATABASE"
- [ ] Database update succeeds: "✅ DATABASE UPDATE SUCCESSFUL"
- [ ] Fields populated in Supabase Studio

## Getting Help

If you've followed all steps and webhooks still aren't working:

1. **Capture full logs:**
   - Copy all terminal output from Next.js (blue [NEXT])
   - Copy all terminal output from Stripe CLI (green [STRIPE])

2. **Check database state:**
   - Screenshot of user record in Supabase Studio
   - Note which fields are NULL

3. **Verify configuration:**
   - Run `echo $env:STRIPE_WEBHOOK_SECRET` and note prefix
   - Check Stripe CLI output for signing secret prefix
   - Confirm they match

4. **Test manually:**
   - Run `stripe trigger checkout.session.completed`
   - Capture all logs

## Additional Resources

- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Testing Webhooks Locally](https://stripe.com/docs/webhooks/test)
- [Supabase Local Development](https://supabase.com/docs/guides/local-development)
- [Troubleshooting Guide](./STRIPE_WEBHOOK_TROUBLESHOOTING.md)

## Quick Reference

### Start Development with Webhooks
```bash
npm run dev:with-webhooks
```

### Get Webhook Secret
Look for: `> Ready! Your webhook signing secret is whsec_...`

### Update Environment Variable
```env
# .env.local
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Test Webhook Endpoint
```bash
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "stripe-signature: test" \
  -d '{}'
```

### Trigger Test Event
```bash
stripe trigger checkout.session.completed
```

### View Logs
- Next.js logs: Blue [NEXT] prefix
- Stripe CLI logs: Green [STRIPE] prefix

### Check Database
- Supabase Studio: http://127.0.0.1:54323
- Table: users
- Fields: stripe_customer_id, stripe_subscription_id, account_active_until
