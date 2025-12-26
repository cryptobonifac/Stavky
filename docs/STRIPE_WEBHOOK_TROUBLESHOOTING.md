# Stripe Webhook Troubleshooting Guide

## Issue: Account Not Activating After Payment

### Problem
After a successful Stripe payment, the user's account is not being activated in the database. The `account_active_until`, `stripe_customer_id`, and `stripe_subscription_id` fields remain NULL.

### Root Causes

1. **Webhook Not Configured (Local Development)**
   - Stripe webhooks require the Stripe CLI to forward events to your local server
   - Without the CLI running, webhooks will never reach your application

2. **Webhook Not Configured (Production)**
   - Webhook endpoint not added in Stripe Dashboard
   - Webhook URL incorrect or not accessible
   - Webhook secret not set in environment variables

3. **Email Mismatch**
   - Email in Stripe session doesn't match email in database
   - Case sensitivity issues
   - User not found in database

4. **Database Update Failures**
   - `customerId` can be null for some payment methods
   - Database constraints or RLS policies blocking updates
   - Network/timeout issues

## Solutions

### 1. Local Development Setup

**Step 1: Install Stripe CLI**
```bash
# Windows (using Scoop)
scoop install stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

**Step 2: Login to Stripe**
```bash
stripe login
```

**Step 3: Forward Webhooks to Local Server**

**For Test Mode:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**For Sandbox Mode:**
```bash
# 1. Get your sandbox API key from Stripe Dashboard:
#    - Go to Stripe Dashboard → Switch to your sandbox (top-right dropdown)
#    - Go to Developers → API keys
#    - Copy the Secret key (starts with sk_test_)

# 2. Add to .env.local:
STRIPE_SANDBOX_API_KEY=sk_test_...

# 3. Use the helper script (it reads from .env.local automatically):
node scripts/start-dev-with-webhooks.js

# Or manually:
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key <your-sandbox-api-key>
```

**Step 4: Copy Webhook Secret**
The CLI will output a webhook secret like:
```
> Ready! Your webhook signing secret is whsec_xxxxx
```

**Step 5: Add to `.env.local`**
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Step 6: Restart Next.js Dev Server**
```bash
npm run dev
```

### 2. Production Setup

**Step 1: Deploy Application**
Ensure your application is deployed and accessible.

**Step 2: Add Webhook Endpoint in Stripe Dashboard**
1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **+ Add endpoint**
3. Enter endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**

**Step 3: Copy Webhook Signing Secret**
1. Click on the webhook endpoint you just created
2. Click **Reveal** next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

**Step 4: Add to Production Environment Variables**
- Vercel: Project Settings → Environment Variables
- Add `STRIPE_WEBHOOK_SECRET` with the copied value
- Redeploy application

### 3. Verify Webhook is Working

**Check Webhook Logs in Stripe Dashboard:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. View the "Events" tab
4. Look for `checkout.session.completed` events
5. Check the status:
   - ✅ **200 OK**: Webhook received successfully
   - ❌ **4xx/5xx**: Error in webhook handler
   - ⏱️ **Timeout**: Webhook took too long to respond

**Check Application Logs:**
- Local: Check terminal where `npm run dev` is running
- Production: Check Vercel logs or your hosting platform logs
- Look for webhook handler console.log messages

### 4. Manual Account Activation (For Testing)

If webhook isn't working, you can manually activate an account for testing:

```bash
node scripts/manually-activate-account.js customer11@gmail.com 30
```

This will activate the account for 30 days.

### 5. Check User Status

To verify a user's account status:

```bash
node scripts/check-user-status.js customer11@gmail.com
```

This will show:
- User details
- Account active status
- Stripe customer/subscription IDs
- Account expiration date

## Debugging Steps

### Step 1: Verify Webhook is Receiving Events

**Local:**
- Check Stripe CLI terminal for forwarded events
- Should see: `--> checkout.session.completed [evt_xxxxx]`

**Production:**
- Check Stripe Dashboard → Webhooks → Events
- Look for recent `checkout.session.completed` events

### Step 2: Check Webhook Handler Logs

Look for these log messages in your application:
- `✅ Checkout session completed: cs_test_xxxxx`
- `🔍 Extracted values:`
- `✅ User found in database:`
- `✅ Account activated successfully`

If you see error messages:
- `❌ Failed to update user:` - Database update failed
- `User not found:` - Email/userId mismatch

### Step 3: Verify Database Update

After a successful payment, check the database:
```bash
node scripts/check-user-status.js user@example.com
```

Expected result:
- `Account Active Until: 2026-XX-XX` (30 days from payment)
- `Stripe Customer ID: cus_xxxxx`
- `Stripe Subscription ID: sub_xxxxx` (if subscription)

### Step 4: Check Email Matching

The webhook tries to find users by:
1. `userId` from session metadata (most reliable)
2. Email from `customer_details.email` or `customer_email`

Ensure:
- User is logged in when creating checkout session (so `userId` is in metadata)
- Email in Stripe matches email in database exactly (case-sensitive)

## Common Issues

### Issue: Webhook Returns 200 but Account Not Activated

**Possible Causes:**
1. User not found in database (email mismatch)
2. Database update failed silently
3. RLS policies blocking update

**Solution:**
- Check webhook handler logs for error messages
- Verify user exists: `node scripts/check-user-status.js user@example.com`
- Check database RLS policies allow updates

### Issue: Webhook Not Receiving Events

**Possible Causes:**
1. Stripe CLI not running (local)
2. Webhook endpoint not configured (production)
3. Webhook URL incorrect
4. Network/firewall blocking webhook requests

**Solution:**
- Local: Ensure `stripe listen` is running
- Production: Verify webhook endpoint in Stripe Dashboard
- Check webhook URL is accessible (test with curl)

### Issue: Email Mismatch

**Possible Causes:**
1. User entered different email in Stripe checkout
2. Email case sensitivity
3. User not logged in when creating checkout

**Solution:**
- Always include `userId` in checkout session metadata
- Use case-insensitive email matching (if needed)
- Ensure user is logged in before checkout

## Testing Webhook Locally

### Test with Stripe CLI

```bash
# Trigger a test checkout.session.completed event
stripe trigger checkout.session.completed
```

This will send a test event to your webhook handler.

### Test with Real Payment

1. Start Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
2. Make a test payment on your local app
3. Check CLI output for forwarded events
4. Check application logs for webhook handler execution

## Production Monitoring

### Set Up Alerts

1. Stripe Dashboard → Webhooks → Your endpoint
2. Enable "Send alert emails for webhook failures"
3. Add your email address

### Monitor Webhook Health

Check regularly:
- Success rate (should be > 99%)
- Average response time (should be < 5 seconds)
- Failed attempts (investigate immediately)

## Related Files

- Webhook Handler: `app/api/webhooks/stripe/route.ts`
- Checkout Actions: `app/checkout/actions.ts`
- User Status Script: `scripts/check-user-status.js`
- Manual Activation Script: `scripts/manually-activate-account.js`
