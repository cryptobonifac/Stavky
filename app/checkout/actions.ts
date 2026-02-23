'use server';

interface PriceInfo {
  amount: number;
  currency: string;
  interval: string | null;
  intervalCount: number | null;
  productId: string;
  error?: string;
}

interface PolarPricesResponse {
  monthly: PriceInfo | null;
  yearly: PriceInfo | null;
  error?: string;
}

/**
 * Stub: Payment system is being updated
 */
export async function getPolarPrices(): Promise<PolarPricesResponse> {
  return {
    monthly: null,
    yearly: null,
    error: 'Payment system is being updated.',
  };
}

/**
 * Stub: Payment system is being updated
 */
export async function createPolarCheckoutSession(
  productId: string,
  locale: string = 'en'
): Promise<{ checkoutId?: string; url?: string }> {
  throw new Error('Payment system is currently being updated. Please try again later.');
}
