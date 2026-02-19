'use server';

import { polar, getProductIds } from '@/lib/polar/polar';
import { headers } from 'next/headers';
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server';

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

export async function getPolarPrices(): Promise<PolarPricesResponse> {
  try {
    const productIds = getProductIds();

    const result: PolarPricesResponse = {
      monthly: null,
      yearly: null,
    };

    // Fetch monthly product
    if (productIds.monthly) {
      try {
        const product = await polar.products.get({ id: productIds.monthly });

        // Get the first price from the product
        const price = product.prices?.[0];
        if (price && price.type === 'recurring' && 'amountType' in price && price.amountType === 'fixed') {
          // Cast to access fixed price properties
          const fixedPrice = price as any;
          result.monthly = {
            amount: fixedPrice.priceAmount || 0,
            currency: (fixedPrice.priceCurrency || 'USD').toUpperCase(),
            interval: fixedPrice.recurringInterval || 'month',
            intervalCount: 1,
            productId: productIds.monthly,
          };
        }
      } catch (error: any) {
        console.error('Error fetching monthly product:', error);
        result.monthly = {
          amount: 0,
          currency: 'USD',
          interval: null,
          intervalCount: null,
          productId: productIds.monthly,
          error: error.message || 'Failed to fetch monthly price',
        };
      }
    }

    // Fetch yearly product
    if (productIds.yearly) {
      try {
        const product = await polar.products.get({ id: productIds.yearly });

        // Get the first price from the product
        const price = product.prices?.[0];
        if (price && price.type === 'recurring' && 'amountType' in price && price.amountType === 'fixed') {
          // Cast to access fixed price properties
          const fixedPrice = price as any;
          result.yearly = {
            amount: fixedPrice.priceAmount || 0,
            currency: (fixedPrice.priceCurrency || 'USD').toUpperCase(),
            interval: fixedPrice.recurringInterval || 'year',
            intervalCount: 1,
            productId: productIds.yearly,
          };
        }
      } catch (error: any) {
        console.error('Error fetching yearly product:', error);
        result.yearly = {
          amount: 0,
          currency: 'USD',
          interval: null,
          intervalCount: null,
          productId: productIds.yearly,
          error: error.message || 'Failed to fetch yearly price',
        };
      }
    }

    if (!result.monthly && !result.yearly) {
      result.error = 'No valid product IDs configured. Please set POLAR_MONTHLY_PRODUCT_ID and POLAR_YEARLY_PRODUCT_ID.';
    }

    return result;
  } catch (error: any) {
    console.error('Error in getPolarPrices:', error);
    return {
      monthly: null,
      yearly: null,
      error: error.message || 'Failed to fetch prices from Polar',
    };
  }
}

export async function createPolarCheckoutSession(productId: string, locale: string = 'en') {
  try {
    // Validate product ID
    if (!productId) {
      throw new Error('Invalid Product ID. Please configure a valid Product ID.');
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // Get logged-in user's email if available
    let customerEmail: string | undefined;
    let userId: string | undefined;

    try {
      const supabase = await createServerClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error getting user from session:', userError);
      } else if (user?.email) {
        customerEmail = user.email;
        userId = user.id;
        console.log('Found authenticated user, will prefill email in Polar checkout:', customerEmail);
      } else {
        console.log('No user session found, Polar will collect email during checkout');
      }
    } catch (error) {
      console.error('Exception while getting user session:', error);
    }

    // Create Polar checkout session
    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${origin}/${locale}/checkout/success?checkout_id={CHECKOUT_ID}`,
      customerEmail,
      metadata: {
        ...(userId && { userId }),
        locale,
      },
    });

    return { checkoutId: checkout.id, url: checkout.url };
  } catch (error: any) {
    console.error('Error creating Polar checkout session:', error);

    if (error.message) {
      throw new Error(error.message);
    }

    throw new Error('Failed to create checkout session. Please check your Polar configuration.');
  }
}
