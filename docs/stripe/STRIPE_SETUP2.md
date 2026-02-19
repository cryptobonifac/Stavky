# Stripe Webhook Setup Guide - Local Development

This guide walks you through setting up Stripe webhooks for local development using the Stripe CLI.

## Prerequisites

- Node.js and npm installed
- Stripe account (test mode)
- Next.js application running on `localhost:3000`

---

## Step 1: Install Stripe CLI

### macOS (Homebrew):
```bash
brew install stripe/stripe-cli/stripe
```

### Windows (Scoop):
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

### Linux:
```bash
# Download the latest release
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

### Or via npm:
```bash
npm install -g stripe-cli
```

---

## Step 2: Login to Stripe

```bash
stripe login
```

This will open a browser window to authorize the CLI with your Stripe account.

---

## Step 3: Forward Webhooks to Localhost

### Option A: Using Helper Script (Recommended)

We have a helper script that automatically starts both the Next.js dev server and Stripe webhook forwarding:

```bash
# Using npm script
npm run dev:with-webhooks

# Or directly
node scripts/start-dev-with-webhooks.js
```

**For Sandbox Mode:**
1. Add to `.env.local`:
   ```env
   STRIPE_SANDBOX_API_KEY=sk_test_...
   ```
2. Run the helper script - it will automatically use the sandbox key if present.

### Option B: Manual Setup

**For Test Mode:**
```bash
# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**For Sandbox Mode:**
```bash
# Get your sandbox API key from Stripe Dashboard
# Then use it with the --api-key flag
stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key sk_test_...
```

**Important:** This command will output a **webhook signing secret** like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy this secret** - you'll need it in the next step.

---

## Step 4: Set Up Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_stripe_listen
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Optional: For sandbox mode
STRIPE_SANDBOX_API_KEY=sk_test_your_sandbox_key_here

# Stripe Price IDs
NEXT_PUBLIC_ONE_TIME_PRICE_ID=price_xxxxx
NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID=price_xxxxx
```

**Where to find these values:**
- `STRIPE_SECRET_KEY`: [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) → Developers → API keys → Secret key
- `STRIPE_WEBHOOK_SECRET`: Output from `stripe listen` command (starts with `whsec_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe Dashboard → Developers → API keys → Publishable key
- Price IDs: Stripe Dashboard → Products → Select Product → Copy Price ID

---

## Step 5: Verify Webhook Endpoint Implementation

Our webhook endpoint is already implemented at `app/api/webhooks/stripe/route.ts`.

**Key Features:**
- ✅ Signature verification using `STRIPE_WEBHOOK_SECRET`
- ✅ Handles `checkout.session.completed` events
- ✅ Activates user accounts after successful payment
- ✅ Stores Stripe customer and subscription IDs
- ✅ Comprehensive logging for debugging

**The webhook handler:**
- Verifies webhook signature
- Processes `checkout.session.completed` events
- Extracts user information from session metadata or email
- Updates user account in database
- Handles both one-time payments and subscriptions

---

## Step 6: Test Your Webhook

### Option 1: Trigger Test Events

In a new terminal (while `stripe listen` is running):

```bash
# Trigger a test checkout.session.completed event
stripe trigger checkout.session.completed

# Trigger other test events
stripe trigger payment_intent.succeeded
stripe trigger customer.created
```

### Option 2: Make a Real Test Payment

1. Start your development server:
   ```bash
   npm run dev
   # Or use the helper script:
   npm run dev:with-webhooks
   ```

2. Navigate to your checkout page (e.g., `http://localhost:3000/en/checkout`)

3. Complete a test payment using:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., `12/34`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **ZIP**: Any 5 digits (e.g., `12345`)

4. Watch the webhook events come through in your terminal

---

## Step 7: See Webhook Events in Real-Time

The `stripe listen` terminal will show all events:

```
2024-12-19 10:30:45   --> checkout.session.completed [evt_xxx]
2024-12-19 10:30:45   <-- [200] POST http://localhost:3000/api/webhooks/stripe
```

Your Next.js dev server terminal will show detailed logs:

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
   customer_details?.email: customer@example.com
   customer_email: customer@example.com
   metadata?.userId: <uuid>

✅ USER FOUND IN DATABASE
   Email: customer@example.com
   ID: <uuid>

✅ DATABASE UPDATE SUCCESSFUL
   Account active until: 2026-01-XX...
```

---

## Step 8: Verify Account Activation

After a successful payment, verify the account was activated:

```bash
# Check user status
node scripts/check-user-status.js customer@example.com
```

You should see:
- ✅ Account Active Until: `<future date>`
- ✅ Stripe Customer ID: `cus_xxxxx`
- ✅ Current Status: ACTIVE

---

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port for Next.js
PORT=3001 npm run dev

# Update webhook forwarding
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

Or clean up the existing process:
```bash
node scripts/cleanup-dev.js
```

### See Specific Events Only

```bash
stripe listen --events checkout.session.completed,payment_intent.succeeded --forward-to localhost:3000/api/webhooks/stripe
```

### Verbose Logging

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-json
```

### Webhook Not Receiving Events

1. **Check Stripe CLI is running**: Look for `--> checkout.session.completed` messages
2. **Verify webhook URL**: Should be `localhost:3000/api/webhooks/stripe` (not `/webhook/stripe`)
3. **Check environment variable**: Ensure `STRIPE_WEBHOOK_SECRET` matches the secret from `stripe listen`
4. **Restart dev server**: After setting `STRIPE_WEBHOOK_SECRET`, restart your Next.js server

### Account Not Activating After Payment

1. **Check webhook logs**: Look for `🔔 WEBHOOK EVENT RECEIVED` in your terminal
2. **Verify user exists**: Run `node scripts/check-user-status.js <email>`
3. **Check email match**: Email in Stripe must match email in database (case-sensitive)
4. **Run diagnostic**: `node scripts/diagnose-webhook-issue.js <email>`

See [Stripe Webhook Troubleshooting Guide](../STRIPE_WEBHOOK_TROUBLESHOOTING.md) for more details.

---

## Quick Reference

### Start Development with Webhooks

```bash
# Recommended: Use helper script
npm run dev:with-webhooks

# Or manually:
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Environment Variables Checklist

- [ ] `STRIPE_SECRET_KEY` - Server-side Stripe API key
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (from `stripe listen`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Client-side Stripe key
- [ ] `NEXT_PUBLIC_ONE_TIME_PRICE_ID` - One-time payment price ID
- [ ] `NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID` - Subscription price ID
- [ ] `STRIPE_SANDBOX_API_KEY` - (Optional) Sandbox API key

### Useful Commands

```bash
# Check user status
node scripts/check-user-status.js <email>

# Diagnose webhook issues
node scripts/diagnose-webhook-issue.js <email>

# Verify Stripe configuration
node scripts/verify-stripe-account.js
node scripts/verify-stripe-prices.js

# List all Stripe prices
node scripts/list-stripe-prices.js

# Clean up dev environment
node scripts/cleanup-dev.js
```

---

## Next Steps

- ✅ Webhooks are now forwarding to your local server
- ✅ Test payments will trigger webhook events
- ✅ User accounts will be activated automatically after payment
- ✅ You can debug webhook processing in real-time

**For production setup**, see:
- [Stripe Setup Guide](./STRIPE_SETUP.md)
- [Stripe Webhook Troubleshooting](../STRIPE_WEBHOOK_TROUBLESHOOTING.md)
- [Environment Variables Documentation](../ENVIRONMENT_VARIABLES.md)

---

**Last Updated**: 2025-01-19  
**Project**: Stavky - Sports Betting Tips Platform







