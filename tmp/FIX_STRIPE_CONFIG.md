# Fix Stripe Configuration for Checkout Page

## Current Issue
Your checkout page shows "No valid price IDs configured" because:
1. `STRIPE_SECRET_KEY` is set to a webhook secret (`whsec_...`) instead of an API secret key
2. Missing `NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID`
3. Missing `NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID`

## Step-by-Step Fix

### Step 1: Get Your Stripe API Secret Key

1. Go to **Stripe Dashboard**: https://dashboard.stripe.com/test/apikeys
2. Make sure you're in **Test mode** (toggle in top right should say "Test mode")
3. Under **"Secret key"**, click **"Reveal test key"** (or copy if already visible)
4. Copy the key - it should start with `sk_test_` (NOT `whsec_`)

### Step 2: Update .env.local

Open `.env.local` and find this line:
```
STRIPE_SECRET_KEY=whsec_c6818e7c17afaa...
```

Replace it with:
```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```
(Use the actual key you copied from Stripe Dashboard)

**Important**: Keep `STRIPE_WEBHOOK_SECRET` as `whsec_...` - only `STRIPE_SECRET_KEY` needs to change!

### Step 3: Run Setup Script

After updating `STRIPE_SECRET_KEY`, run:
```bash
node tmp/setup-subscription-prices.js
```

This will:
- ✅ Verify your API key is correct
- ✅ List all subscription prices in your Stripe account
- ✅ Automatically set `NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID`
- ✅ Automatically set `NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID`

### Step 4: Restart Dev Server

```bash
npm run dev
```

Then refresh your checkout page - prices should now display correctly!

## Manual Alternative

If you prefer to set price IDs manually:

1. Go to **Stripe Dashboard** → **Products**: https://dashboard.stripe.com/test/products
2. Find your monthly subscription product
3. Click on it and copy the **Price ID** (starts with `price_`)
4. Find your yearly subscription product
5. Click on it and copy the **Price ID**

Add to `.env.local`:
```
NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID=price_xxxxx
NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID=price_yyyyy
```

## Verification

After fixing, verify everything is correct:
```bash
node tmp/verify-stripe-config.js
```

This will check:
- ✅ STRIPE_SECRET_KEY format
- ✅ Price IDs are set
- ✅ Price IDs are valid in Stripe

## Troubleshooting

**If you get "Invalid API Key" error:**
- Make sure you copied the **Secret key** (starts with `sk_test_`), not the Publishable key (starts with `pk_test_`)
- Make sure you're using Test mode keys if you're in test mode

**If no subscription prices are found:**
- Go to Stripe Dashboard → Products
- Create subscription products with billing intervals of "month" and "year"
- Make sure they're set to "Recurring" (not one-time)

**If prices still don't show:**
- Restart your dev server after updating `.env.local`
- Clear browser cache and refresh
- Check browser console for errors





