import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    // During Next.js build, environment variables might not be available
    // We'll defer the error until runtime when Stripe is actually used
    // Check if we're in build phase (Next.js sets NEXT_PHASE during build)
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' || 
                         process.env.NEXT_PHASE === 'phase-development-build';
    
    if (!secretKey) {
      if (isBuildPhase) {
        // During build, create a placeholder instance to allow build to complete
        // This will fail at runtime with a clear error when actually used
        stripeInstance = new Stripe('sk_placeholder_missing_key_during_build', {
          apiVersion: '2025-12-15.clover',
          typescript: true,
        });
      } else {
        // At runtime, throw immediately with a clear error
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

// Create a Proxy that intercepts all property access
// This allows lazy initialization and proper handling of nested properties
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripeInstance();
    const value = instance[prop as keyof Stripe];
    
    // If the value is an object (like subscriptions, checkout, etc.), 
    // we need to return it as-is so nested property access works
    if (value && typeof value === 'object') {
      return value;
    }
    
    // If it's a function, bind it to the instance
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    
    return value;
  },
}) as Stripe;
