# Vercel Build Error Fix: STRIPE_SECRET_KEY

## Problem

Vercel builds were failing with the error:
```
Error: STRIPE_SECRET_KEY is not set in environment variables
Error: Failed to collect page data for /api/subscription/cancel
```

## Root Cause

The `lib/stripe/stripe.ts` file was throwing an error immediately when the module was loaded, even during the build phase. Next.js tries to evaluate all route handlers during build time to collect page data, and when it imported the Stripe module, it would throw an error if `STRIPE_SECRET_KEY` wasn't set.

## Solution

Refactored `lib/stripe/stripe.ts` to use **lazy initialization** with a Proxy pattern:

1. **Lazy Initialization**: The Stripe instance is only created when first accessed, not when the module loads
2. **Build-Time Handling**: During build phase, if the key is missing, a placeholder instance is created to allow the build to complete
3. **Runtime Validation**: At runtime, if the key is missing, a clear error is thrown immediately

## Changes Made

### Before
```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});
```

### After
```typescript
import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || 
                         process.env.NEXT_PHASE === 'phase-development-build';
    
    if (!secretKey) {
      if (isBuildPhase) {
        // During build, create placeholder to allow build to complete
        stripeInstance = new Stripe('sk_placeholder_missing_key_during_build', {
          apiVersion: '2025-12-15.clover',
          typescript: true,
        });
      } else {
        // At runtime, throw immediately with clear error
        throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
      }
    } else {
      stripeInstance = new Stripe(secretKey, {
        apiVersion: '2025-12-15.clover',
        typescript: true,
      });
    }
  }
  return stripeInstance;
}

// Proxy pattern for lazy initialization and nested property support
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripeInstance();
    const value = instance[prop as keyof Stripe];
    
    if (value && typeof value === 'object') {
      return value;
    }
    
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    
    return value;
  },
}) as Stripe;
```

## How It Works

1. **Module Load**: When the module is imported, no Stripe instance is created
2. **First Access**: When `stripe` is first accessed (e.g., `stripe.subscriptions`), the Proxy intercepts and calls `getStripeInstance()`
3. **Build Phase**: If `STRIPE_SECRET_KEY` is missing during build, a placeholder instance is created
4. **Runtime**: If `STRIPE_SECRET_KEY` is missing at runtime, an error is thrown immediately
5. **Nested Properties**: The Proxy returns actual Stripe objects (like `subscriptions`, `checkout`) so nested access like `stripe.subscriptions.update()` works correctly

## Important Notes

- ✅ **Build will succeed** even if `STRIPE_SECRET_KEY` is not set in Vercel environment variables
- ⚠️ **Runtime will fail** if `STRIPE_SECRET_KEY` is not set when Stripe is actually used
- ✅ **Type safety is preserved** - TypeScript still sees `stripe` as a `Stripe` instance
- ✅ **All Stripe API calls work** - Nested properties and methods work correctly

## Next Steps

1. **Add `STRIPE_SECRET_KEY` to Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `STRIPE_SECRET_KEY` with your Stripe secret key
   - Redeploy

2. **Verify the Fix**:
   - The build should now complete successfully
   - Stripe functionality will work at runtime when the key is set

## Related Files

- `lib/stripe/stripe.ts` - Main Stripe client initialization
- `app/api/subscription/cancel/route.ts` - Route that was failing during build
- `app/checkout/actions.ts` - Uses Stripe for checkout sessions





