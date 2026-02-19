# Polar Subscription Integration

This document describes how Polar payment processing is integrated into the Stavky application.

## Overview

The application uses [Polar](https://polar.sh) for subscription management. Polar handles:
- Payment processing
- Subscription lifecycle (creation, renewal, cancellation)
- Customer management

## Environment Configuration

### Required Environment Variables

Add these to `.env.local`:

```env
# Polar API Configuration
POLAR_ACCESS_TOKEN=polar_oat_xxxxx           # API access token from Polar dashboard
POLAR_ORGANIZATION_ID=xxxxxxxx-xxxx-xxxx     # Your organization ID
POLAR_WEBHOOK_SECRET=polar_whs_xxxxx         # Webhook signing secret
POLAR_MONTHLY_PRODUCT_ID=xxxxxxxx-xxxx-xxxx  # Monthly subscription product ID
POLAR_YEARLY_PRODUCT_ID=xxxxxxxx-xxxx-xxxx   # Yearly subscription product ID
POLAR_ENVIRONMENT=sandbox                     # 'sandbox' or 'production'
```

### Getting Credentials

1. Go to [Polar Dashboard](https://polar.sh/dashboard)
2. Navigate to **Settings > Developers**
3. Create an API Access Token
4. Copy your Organization ID
5. Set up a webhook and copy the signing secret

## Database Schema

The `users` table has these subscription-related columns:

| Column | Type | Description |
|--------|------|-------------|
| `account_active_until` | `timestamptz` | When the subscription expires |
| `polar_customer_id` | `text` | Polar customer identifier |
| `polar_subscription_id` | `text` | Active subscription ID |
| `subscription_plan_type` | `text` | 'monthly' or 'yearly' |

## Subscription Flow

### 1. Checkout Flow

```
User clicks "Subscribe" on /checkout
    ↓
createPolarCheckoutSession() creates checkout with userId in metadata
    ↓
User redirected to Polar payment page
    ↓
User completes payment
    ↓
Polar sends webhook to /api/webhooks/polar
    ↓
Webhook updates user record in database
    ↓
User redirected to /checkout/success (polls for activation)
```

### 2. Webhook Events

The webhook handler (`/app/api/webhooks/polar/route.ts`) processes these events:

| Event | Action |
|-------|--------|
| `subscription.created` | Sets `polar_customer_id`, `polar_subscription_id`, `account_active_until`, `subscription_plan_type` |
| `subscription.updated` | Updates subscription details and expiration date |
| `subscription.canceled` | Clears `polar_subscription_id` (account remains active until expiration) |
| `subscription.revoked` | Clears `polar_subscription_id` (payment failure) |

## API Endpoints

### Webhook Endpoint

**POST** `/api/webhooks/polar`

Receives and processes Polar webhook events. Validates signatures using `POLAR_WEBHOOK_SECRET`.

### Admin: Sync Subscription

**POST** `/api/admin/sync-subscription`

Manually syncs a subscription from Polar to the local database. **Essential for local development** where webhooks cannot reach localhost.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Subscription synced successfully",
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "polarCustomerId": "xxx",
    "polarSubscriptionId": "xxx",
    "subscriptionPlanType": "monthly",
    "accountActiveUntil": "2026-03-19T15:49:46.420Z",
    "subscriptionStatus": "active"
  }
}
```

**Response (errors):**
- `404` - User not found in database
- `404` - No Polar customer found for email
- `404` - No active subscriptions found
- `500` - Internal server error

**Usage:**
```bash
curl -X POST http://localhost:3000/api/admin/sync-subscription \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

## Local Development

### The Webhook Problem

In local development, Polar webhooks **cannot reach localhost**. When a user completes a subscription in Polar sandbox:

1. Payment succeeds in Polar
2. Polar tries to send webhook to your configured URL
3. If URL is `localhost:3000`, webhook fails (not publicly accessible)
4. User's subscription exists in Polar but not in local database

### Solutions

#### Option 1: Manual Sync (Recommended for Development)

After a user subscribes in Polar sandbox, sync their subscription manually:

```bash
curl -X POST http://localhost:3000/api/admin/sync-subscription \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

#### Option 2: Use a Tunnel (ngrok, etc.)

1. Start ngrok: `ngrok http 3000`
2. Update webhook URL in Polar dashboard to ngrok URL
3. Webhooks will now reach your local server

#### Option 3: Polar CLI (if available)

Some payment providers offer CLI tools to forward webhooks locally.

## Checking Subscription Status

### Via Supabase Studio

1. Open http://127.0.0.1:54323 (Supabase Studio)
2. Navigate to Table Editor > users
3. Check `account_active_until`, `polar_customer_id`, `polar_subscription_id`

### Via REST API

```bash
curl "http://127.0.0.1:54321/rest/v1/users?email=eq.user@example.com&select=id,email,account_active_until,polar_customer_id,polar_subscription_id,subscription_plan_type" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

### Via Admin Endpoint

```bash
# Check user status
curl "http://localhost:3000/api/admin/users"
```

## Troubleshooting

### User Has Subscription in Polar But Not in App

**Symptoms:**
- User completed payment in Polar
- Subscription shows "No active subscription" in app
- Database shows `null` for polar fields

**Cause:** Webhook didn't reach the server (common in local development)

**Fix:**
```bash
curl -X POST http://localhost:3000/api/admin/sync-subscription \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Webhook Signature Verification Failed

**Symptoms:** Webhook returns 400 "Invalid signature"

**Causes:**
1. Wrong `POLAR_WEBHOOK_SECRET` in `.env.local`
2. Webhook secret was rotated in Polar but not updated locally

**Fix:** Update `POLAR_WEBHOOK_SECRET` and restart the dev server

### User Not Found During Webhook Processing

**Symptoms:** Webhook logs show "User not found in database"

**Causes:**
1. User signed up with different email than Polar checkout
2. `userId` metadata wasn't passed during checkout
3. Email case mismatch (webhook uses case-insensitive search)

**Fix:** Ensure checkout passes `userId` in metadata, or user exists with matching email

## File Reference

| File | Purpose |
|------|---------|
| `/app/api/webhooks/polar/route.ts` | Webhook handler |
| `/app/api/admin/sync-subscription/route.ts` | Manual sync endpoint |
| `/lib/polar/polar.ts` | Polar SDK initialization |
| `/app/subscription/actions.ts` | Subscription status actions |
| `/app/checkout/actions.ts` | Checkout session creation |
| `/app/[locale]/subscription/page.tsx` | Subscription UI |
| `/app/[locale]/checkout/page.tsx` | Checkout/pricing page |
| `/app/[locale]/checkout/success/page.tsx` | Post-checkout success page |

## Production Considerations

1. **Webhook URL:** Must be publicly accessible (e.g., `https://yourdomain.com/api/webhooks/polar`)
2. **Environment:** Set `POLAR_ENVIRONMENT=production`
3. **Product IDs:** Use production product IDs
4. **Monitoring:** Check webhook logs in Polar dashboard for failed deliveries
