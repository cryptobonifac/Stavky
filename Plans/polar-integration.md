# Polar Integration Plan: Replace Stripe with Polar

## Summary
Replace Stripe payment integration with Polar.sh for subscription billing in the Stavky betting tips application.

**Decisions from interview:**
- Start fresh with Polar (no customer migration)
- Remove all Stripe code immediately
- Subscriptions only (monthly + yearly, no one-time payments)
- Remove free month automation
- No Polar benefits needed
- Config in .env files

---

## Phase 1: Environment Setup

### 1.1 Update Dependencies
**File:** `package.json`

Remove:
- `stripe`
- `@stripe/stripe-js`

Add:
- `@polar-sh/sdk`

### 1.2 Environment Variables
**Files:** `.env`, `.env.local`, `.env.production`

Remove Stripe vars, add:
```env
POLAR_ACCESS_TOKEN=your_access_token
POLAR_ORGANIZATION_ID=your_org_id
POLAR_WEBHOOK_SECRET=your_webhook_secret
POLAR_MONTHLY_PRODUCT_ID=your_monthly_product_id
POLAR_YEARLY_PRODUCT_ID=your_yearly_product_id
POLAR_ENVIRONMENT=sandbox
```

---

## Phase 2: Database Migration

**Create:** `supabase/migrations/YYYYMMDD_rename_stripe_to_polar.sql`

```sql
ALTER TABLE public.users RENAME COLUMN stripe_customer_id TO polar_customer_id;
ALTER TABLE public.users RENAME COLUMN stripe_subscription_id TO polar_subscription_id;
ALTER INDEX IF EXISTS users_stripe_customer_id_idx RENAME TO users_polar_customer_id_idx;

-- Remove 'one-time' option since we're subscriptions only
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_subscription_plan_type_check;
ALTER TABLE public.users ADD CONSTRAINT users_subscription_plan_type_check
  CHECK (subscription_plan_type IN ('monthly', 'yearly'));
```

---

## Phase 3: Core Polar Integration

### 3.1 Create Polar Client
**Create:** `lib/polar/polar.ts`

- Initialize `@polar-sh/sdk` with lazy loading
- Handle build-time placeholder (same pattern as current Stripe)
- Support sandbox/production environments

### 3.2 Delete Stripe Client
**Delete:** `lib/stripe/` (entire directory)

---

## Phase 4: Server Actions

### 4.1 Rewrite Checkout Actions
**Modify:** `app/checkout/actions.ts`

Replace:
- `getStripePrices()` → `getPolarPrices()` (fetch products from Polar API)
- `createSubscriptionCheckoutSession()` → `createPolarCheckoutSession()`
- Remove `createCheckoutSession()` (one-time payments)

### 4.2 Rewrite Subscription Actions
**Modify:** `app/subscription/actions.ts`

Replace:
- `getSubscriptionStatus()` - Use Polar subscriptions API
- `cancelSubscription()` - Use Polar subscriptions.cancel()

---

## Phase 5: Webhook Handler

### 5.1 Create Polar Webhook
**Create:** `app/api/webhooks/polar/route.ts`

Handle events:
- `subscription.created` - Activate account, store polar_customer_id, polar_subscription_id
- `subscription.updated` - Update plan type, extend account_active_until
- `subscription.canceled` - Clear polar_subscription_id

### 5.2 Delete Stripe Webhook
**Delete:** `app/api/webhooks/stripe/route.ts`

---

## Phase 6: UI Updates

### 6.1 Checkout Page
**Modify:** `app/[locale]/checkout/page.tsx`
- Import `getPolarPrices`, `createPolarCheckoutSession`
- Remove one-time payment option
- Update price display logic

### 6.2 Subscription Page
**Modify:** `app/[locale]/subscription/page.tsx`
- Use updated subscription actions
- Update status display for Polar format

### 6.3 Success Page
**Modify:** `app/[locale]/checkout/success/page.tsx`
- Update session_id handling for Polar checkout ID format

---

## Phase 7: Cleanup

### Files to Delete:
```
lib/stripe/ (entire directory)
app/api/webhooks/stripe/route.ts
app/api/webhooks/debug/route.ts
app/api/webhooks/logs/route.ts
app/api/subscription/cancel/route.ts
app/[locale]/admin/webhook-debug/page.tsx
scripts/*stripe*.js (all stripe-related scripts)
```

### package.json Scripts:
Remove `dev:with-webhooks` scripts

---

## Phase 8: Polar Dashboard Setup

### 8.1 Create Products
1. **Monthly Subscription** - Recurring, monthly billing
2. **Yearly Subscription** - Recurring, yearly billing

### 8.2 Configure Webhook
- Endpoint: `https://yourdomain.com/api/webhooks/polar`
- Events: `subscription.created`, `subscription.updated`, `subscription.canceled`

### 8.3 Get Credentials
- Organization Access Token
- Organization ID
- Webhook Secret

---

## Verification

### Local Testing
1. Set `POLAR_ENVIRONMENT=sandbox`
2. Run `npx polar tunnel --port 3000` for webhook testing
3. Test checkout flow end-to-end
4. Verify webhook activation of accounts

### Test Cases
- [ ] Monthly subscription checkout
- [ ] Yearly subscription checkout
- [ ] Subscription cancellation
- [ ] Account activation after payment
- [ ] Price display on checkout page

---

## Critical Files Summary

| Action | File |
|--------|------|
| Create | `lib/polar/polar.ts` |
| Create | `app/api/webhooks/polar/route.ts` |
| Create | `supabase/migrations/YYYYMMDD_rename_stripe_to_polar.sql` |
| Modify | `package.json` |
| Modify | `.env`, `.env.local`, `.env.production` |
| Modify | `app/checkout/actions.ts` |
| Modify | `app/subscription/actions.ts` |
| Modify | `app/[locale]/checkout/page.tsx` |
| Modify | `app/[locale]/subscription/page.tsx` |
| Modify | `app/[locale]/checkout/success/page.tsx` |
| Delete | `lib/stripe/` directory |
| Delete | `app/api/webhooks/stripe/route.ts` |
| Delete | Multiple debug/admin files |

---

## Rollout Steps

1. Create Polar account and organization
2. Create products in Polar dashboard (sandbox first)
3. Configure webhook endpoint
4. Update environment variables
5. Run database migration: `npx supabase db reset`
6. Deploy code changes
7. Test in sandbox mode
8. Switch to production when ready
