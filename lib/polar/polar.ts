import { Polar } from '@polar-sh/sdk';

let polarInstance: Polar | null = null;

function getPolarInstance(): Polar {
  if (!polarInstance) {
    const accessToken = process.env.POLAR_ACCESS_TOKEN;

    // During Next.js build, environment variables might not be available
    // We'll defer the error until runtime when Polar is actually used
    const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build' ||
                         process.env.NEXT_PHASE === 'phase-development-build';

    if (!accessToken) {
      if (isBuildPhase) {
        // During build, create a placeholder instance to allow build to complete
        // This will fail at runtime with a clear error when actually used
        polarInstance = new Polar({
          accessToken: 'polar_placeholder_missing_key_during_build',
          server: 'sandbox',
        });
      } else {
        // At runtime, throw immediately with a clear error
        throw new Error('POLAR_ACCESS_TOKEN is not set in environment variables');
      }
    } else {
      // Determine environment (sandbox or production)
      const environment = process.env.POLAR_ENVIRONMENT || 'sandbox';
      const server = environment === 'production' ? 'production' : 'sandbox';

      polarInstance = new Polar({
        accessToken,
        server,
      });
    }
  }

  return polarInstance;
}

// Create a Proxy that intercepts all property access
// This allows lazy initialization and proper handling of nested properties
export const polar = new Proxy({} as Polar, {
  get(_target, prop) {
    const instance = getPolarInstance();
    const value = instance[prop as keyof Polar];

    // If the value is an object (like subscriptions, checkouts, etc.),
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
}) as Polar;

// Helper to get organization ID
export function getOrganizationId(): string {
  const orgId = process.env.POLAR_ORGANIZATION_ID;
  if (!orgId) {
    throw new Error('POLAR_ORGANIZATION_ID is not set in environment variables');
  }
  return orgId;
}

// Helper to get product IDs
export function getProductIds(): { monthly: string; yearly: string } {
  const monthlyId = process.env.POLAR_MONTHLY_PRODUCT_ID;
  const yearlyId = process.env.POLAR_YEARLY_PRODUCT_ID;

  if (!monthlyId || !yearlyId) {
    throw new Error('POLAR_MONTHLY_PRODUCT_ID and POLAR_YEARLY_PRODUCT_ID must be set in environment variables');
  }

  return { monthly: monthlyId, yearly: yearlyId };
}

// Helper to get webhook secret
export function getWebhookSecret(): string {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('POLAR_WEBHOOK_SECRET is not set in environment variables');
  }
  return secret;
}
