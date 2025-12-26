# Stripe Payment Integration Setup Guide

This guide walks you through setting up Stripe payment integration in the Stavky application.

## Overview

The Stripe integration includes:
- ✅ Server and client-side Stripe configuration
- ✅ Checkout page with Server Actions
- ✅ Webhook handler for payment events
- ✅ Success and cancel pages
- ✅ Support for both one-time payments and subscriptions

## Prerequisites

1. A Stripe account ([sign up here](https://dashboard.stripe.com/register))
2. Stripe packages already installed:
   - `stripe` (server-side)
   - `@stripe/stripe-js` (client-side)

## Step 1: Get Your Stripe API Keys

### Development (Test Mode)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test Mode** (toggle in top-right)
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Production (Live Mode)

1. Switch to **Live Mode** in Stripe Dashboard
2. Complete your business profile verification
3. Copy your production keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

## Step 2: Configure Environment Variables

Add the following variables to your environment configuration:

### For Development (`.env.local`)

```bash
# Stripe Configuration
# Replace with your actual keys from Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### For Production (Vercel Environment Variables)

Add the same variables in Vercel Dashboard → Project Settings → Environment Variables, but use your **live mode** keys:

```bash
# Replace with your actual production keys from Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### Environment Variables Reference

| Variable | Description | Where to Find | Type |
|----------|-------------|---------------|------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public key for client-side Stripe.js | Stripe Dashboard → Developers → API keys | Public |
| `STRIPE_SECRET_KEY` | Secret key for server-side API calls | Stripe Dashboard → Developers → API keys | **Secret** |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe Dashboard → Developers → Webhooks | **Secret** |

**⚠️ Security Note**:
- `STRIPE_SECRET_KEY` is server-side only - never expose it to the client
- `NEXT_PUBLIC_*` variables are public and exposed to the browser
- Always use test keys in development and live keys in production

## Step 3: Create Stripe Products and Prices

Before you can accept payments, you need to create products and prices in Stripe.

### Option A: Using Stripe Dashboard

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products)
2. Click **+ Add product**
3. Fill in product details:
   - **Name**: e.g., "Premium Subscription"
   - **Description**: What the customer gets
   - **Price**: Set amount and currency
   - **Billing period**: One-time or Recurring (for subscriptions)
4. Click **Save product**
5. Copy the **Price ID** (starts with `price_`)

### Option B: Using Stripe CLI

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Create a one-time product
stripe products create \
  --name="Premium Access" \
  --description="One-time premium access"

# Create a price for the product
stripe prices create \
  --product=prod_XXXXXX \
  --unit-amount=2999 \
  --currency=usd

# Create a subscription product
stripe products create \
  --name="Monthly Subscription" \
  --description="Monthly premium subscription"

# Create a recurring price
stripe prices create \
  --product=prod_YYYYYY \
  --unit-amount=999 \
  --currency=usd \
  --recurring[interval]=month
```

### Update Checkout Page

After creating products, update the Price IDs in `app/checkout/page.tsx`:

```typescript
// Replace these with your actual Price IDs
onClick={() => handleCheckout('price_XXXXXXXXXXXXXX')}  // One-time
onClick={() => handleCheckout('price_YYYYYYYYYYYYYY', true)}  // Subscription
```

## Step 4: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your application about payment events.

### Local Development (Using Stripe CLI)

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   ```

### Production (Vercel)

1. Deploy your application to Vercel

2. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)

3. Click **+ Add endpoint**

4. Configure the endpoint:
   - **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
   - **Description**: Production webhook endpoint
   - **Events to send**: Select the following events:
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`
     - `checkout.session.async_payment_failed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

5. Click **Add endpoint**

6. Copy the **Signing secret** (starts with `whsec_`)

7. Add it to Vercel environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   ```

## Step 5: Customize the Integration

### Checkout Page Customization

Edit `app/checkout/page.tsx` to:
- Update pricing and plan details
- Modify the UI to match your brand
- Add/remove features from the plan lists
- Change the redirect URLs after checkout

### Webhook Handler Customization

Edit `app/api/webhooks/stripe/route.ts` to implement your business logic:

```typescript
case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session;

  // Example: Update user record in database
  const userId = session.metadata?.userId;
  const customerId = session.customer;

  // TODO: Implement your logic here
  // await updateUserSubscription(userId, {
  //   stripeCustomerId: customerId,
  //   subscriptionStatus: 'active',
  //   subscriptionId: session.subscription,
  // });

  break;
}
```

### Success/Cancel Pages

- **Success page**: `app/checkout/success/page.tsx`
  - Customize the thank you message
  - Add order confirmation details
  - Redirect to specific pages

- **Cancel page**: `app/checkout/cancel/page.tsx`
  - Customize the cancellation message
  - Add support contact information

## Step 6: Test Your Integration

### Test Cards

Use these test card numbers in development:

| Card Number | Description | Expected Result |
|------------|-------------|-----------------|
| `4242 4242 4242 4242` | Visa | Successful payment |
| `4000 0025 0000 3155` | Visa (3D Secure) | Requires authentication |
| `4000 0000 0000 9995` | Visa | Declined (insufficient funds) |
| `4000 0000 0000 0002` | Visa | Declined (generic decline) |

- Use any future expiry date (e.g., 12/34)
- Use any 3-digit CVC
- Use any postal code

http://localhost:3000/en/admin/webhook-debug?email=customer14@gmail.com


### Testing Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Start Stripe webhook forwarding (in another terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Navigate to `http://localhost:3000/checkout`

4. Click a checkout button

5. On the Stripe Checkout page:
   - Enter email address
   - Use a test card number
   - Fill in remaining details
   - Click Pay

6. Verify:
   - You're redirected to the success page
   - Webhook events are logged in your terminal
   - Payment appears in Stripe Dashboard

### Testing Webhooks

```bash
# Test webhook locally
stripe trigger payment_intent.succeeded

# Or send a specific event
stripe events resend evt_xxxxxxxxxxxxxx
```

## Step 7: Go Live Checklist

Before accepting real payments:

- [ ] Switch to live mode API keys in production
- [ ] Update webhook endpoint to production URL
- [ ] Verify webhook events are properly handled
- [ ] Test the entire checkout flow in production
- [ ] Set up proper error monitoring (e.g., Sentry)
- [ ] Configure email notifications for failed payments
- [ ] Review Stripe's [go-live checklist](https://stripe.com/docs/development/checkout/integration-checklist)
- [ ] Complete business profile in Stripe Dashboard
- [ ] Set up proper tax collection if required
- [ ] Add terms of service and privacy policy links

## File Structure

```
lib/stripe/
├── stripe.ts              # Server-side Stripe client
└── stripe-client.ts       # Client-side Stripe client

app/
├── checkout/
│   ├── actions.ts         # Server Actions for creating sessions
│   ├── page.tsx           # Checkout page
│   ├── success/
│   │   └── page.tsx       # Success page
│   └── cancel/
│       └── page.tsx       # Cancel page
└── api/
    └── webhooks/
        └── stripe/
            └── route.ts   # Webhook handler
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/checkout` | GET | Displays pricing and checkout options |
| `/checkout/success` | GET | Shows payment success message |
| `/checkout/cancel` | GET | Shows payment cancellation message |
| `/api/webhooks/stripe` | POST | Receives Stripe webhook events |

## Server Actions

| Action | Description | Parameters |
|--------|-------------|------------|
| `createCheckoutSession` | Creates a one-time payment session | `priceId: string` |
| `createSubscriptionCheckoutSession` | Creates a subscription session | `priceId: string` |

## Common Use Cases

### Adding User ID to Checkout

Modify `app/checkout/actions.ts`:

```typescript
export async function createCheckoutSession(priceId: string, userId: string) {
  const session = await stripe.checkout.sessions.create({
    // ... other config
    metadata: {
      userId: userId, // Add user ID to metadata
    },
  });

  return { sessionId: session.id, url: session.url };
}
```

### Retrieving Customer After Payment

In `app/api/webhooks/stripe/route.ts`:

```typescript
case 'checkout.session.completed': {
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;

  // Store customer ID in your database
  // await updateUser(userId, { stripeCustomerId: customerId });

  break;
}
```

### Managing Subscriptions

To allow users to manage their subscriptions:

```typescript
// Create a billing portal session
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${origin}/settings/billing`,
});

// Redirect user to session.url
```

## Troubleshooting

### Common Issues

1. **"Missing Stripe environment variables"**
   - Ensure all three Stripe env vars are set
   - Restart dev server after adding variables
   - Verify variable names match exactly (including `NEXT_PUBLIC_` prefix)

2. **Webhook signature verification failed**
   - Ensure `STRIPE_WEBHOOK_SECRET` is correct
   - For local dev: Use secret from `stripe listen` command
   - For production: Use secret from Stripe Dashboard webhook settings
   - Check that webhook endpoint URL is correct

3. **Checkout session creation fails**
   - Verify `STRIPE_SECRET_KEY` is correct (starts with `sk_`)
   - Ensure Price ID exists and is active
   - Check that price belongs to your Stripe account
   - Review server logs for detailed error messages

4. **Payment succeeds but webhook not received**
   - For local dev: Ensure `stripe listen` is running
   - For production: Check webhook endpoint URL in Stripe Dashboard
   - Verify webhook endpoint is accessible (not behind auth)
   - Check webhook event types are selected in Dashboard

5. **Client-side Stripe.js not loading**
   - Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
   - Check browser console for errors
   - Ensure key starts with `pk_test_` or `pk_live_`

### Debug Mode

Enable debug logging in development:

```typescript
// lib/stripe/stripe.ts
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
  maxNetworkRetries: 2,
  telemetry: false,
});
```

### Testing Webhooks Locally

```bash
# View all webhook events
stripe events list

# Get details of specific event
stripe events retrieve evt_xxxxxxxxxxxxxx

# Resend event to your endpoint
stripe events resend evt_xxxxxxxxxxxxxx

# Test specific webhook event
stripe trigger checkout.session.completed
```

## Security Best Practices

1. ✅ **Do**: Always verify webhook signatures
2. ✅ **Do**: Use idempotency keys for duplicate prevention
3. ✅ **Do**: Store customer IDs in your database
4. ✅ **Do**: Use metadata to link Stripe objects to your users
5. ✅ **Do**: Handle webhook retries properly
6. ❌ **Don't**: Use secret key in client-side code
7. ❌ **Don't**: Trust client-side data for payment amounts
8. ❌ **Don't**: Skip webhook signature verification
9. ❌ **Don't**: Use test keys in production

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Next.js + Stripe Example](https://github.com/vercel/next.js/tree/canary/examples/with-stripe)

## Support

If you encounter issues:
1. Check the [Stripe Dashboard logs](https://dashboard.stripe.com/test/logs)
2. Review webhook delivery attempts in Dashboard → Webhooks
3. Check your server logs for errors
4. Refer to [Stripe's support documentation](https://support.stripe.com/)

## Next Steps

After setting up the basic integration, consider:
- Adding subscription management portal
- Implementing usage-based billing
- Adding multiple payment methods
- Setting up tax collection with Stripe Tax
- Implementing promotional codes and coupons
- Adding invoice generation
- Setting up email receipts
