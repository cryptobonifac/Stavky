'use server';

import { stripe } from '@/lib/stripe/stripe';
import { headers } from 'next/headers';
import { createClient as createServerClient } from '@/lib/supabase/server';

interface PriceInfo {
  amount: number;
  currency: string;
  interval: string | null;
  intervalCount: number | null;
  priceId: string;
  error?: string;
}

interface StripePricesResponse {
  monthly: PriceInfo | null;
  yearly: PriceInfo | null;
  error?: string;
}

export async function getStripePrices(): Promise<StripePricesResponse> {
  try {
    const monthlyPriceId = process.env.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID;
    const yearlyPriceId = process.env.NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID;

    const result: StripePricesResponse = {
      monthly: null,
      yearly: null,
    };

    // Fetch monthly price
    if (monthlyPriceId && monthlyPriceId.startsWith('price_')) {
      try {
        const monthlyPrice = await stripe.prices.retrieve(monthlyPriceId);
        result.monthly = {
          amount: monthlyPrice.unit_amount || 0,
          currency: monthlyPrice.currency.toUpperCase(),
          interval: monthlyPrice.recurring?.interval || null,
          intervalCount: monthlyPrice.recurring?.interval_count || null,
          priceId: monthlyPriceId,
        };
      } catch (error: any) {
        console.error('Error fetching monthly price:', error);
        result.monthly = {
          amount: 0,
          currency: 'USD',
          interval: null,
          intervalCount: null,
          priceId: monthlyPriceId,
          error: error.message || 'Failed to fetch monthly price',
        };
      }
    }

    // Fetch yearly price
    if (yearlyPriceId && yearlyPriceId.startsWith('price_')) {
      try {
        const yearlyPrice = await stripe.prices.retrieve(yearlyPriceId);
        result.yearly = {
          amount: yearlyPrice.unit_amount || 0,
          currency: yearlyPrice.currency.toUpperCase(),
          interval: yearlyPrice.recurring?.interval || null,
          intervalCount: yearlyPrice.recurring?.interval_count || null,
          priceId: yearlyPriceId,
        };
      } catch (error: any) {
        console.error('Error fetching yearly price:', error);
        result.yearly = {
          amount: 0,
          currency: 'USD',
          interval: null,
          intervalCount: null,
          priceId: yearlyPriceId,
          error: error.message || 'Failed to fetch yearly price',
        };
      }
    }

    if (!result.monthly && !result.yearly) {
      result.error = 'No valid price IDs configured. Please set NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID and NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID.';
    }

    return result;
  } catch (error: any) {
    console.error('Error in getStripePrices:', error);
    return {
      monthly: null,
      yearly: null,
      error: error.message || 'Failed to fetch prices from Stripe',
    };
  }
}

export async function createCheckoutSession(priceId: string, locale: string = 'en') {
  try {
    // Validate price ID
    if (!priceId || priceId.includes('XXXXXXXX') || priceId.includes('YYYYYYYY')) {
      throw new Error('Invalid Stripe Price ID. Please configure a valid Price ID in the checkout page.');
    }

    if (!priceId.startsWith('price_')) {
      throw new Error('Invalid Stripe Price ID format. Price IDs must start with "price_".');
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // Get logged-in user's email if available
    let customerEmail: string | undefined;
    let userId: string | undefined;
    let customerId: string | undefined;
    
    try {
      const supabase = await createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        customerEmail = user.email;
        userId = user.id;
        
        // For Accounts V2, create or retrieve customer first
        try {
          // Try to find existing customer by email
          const existingCustomers = await stripe.customers.list({
            email: customerEmail,
            limit: 1,
          });
          
          if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id;
          } else {
            // Create new customer
            const customer = await stripe.customers.create({
              email: customerEmail,
              metadata: {
                userId: userId,
              },
            });
            customerId = customer.id;
          }
        } catch (customerError) {
          console.error('Error creating/finding customer:', customerError);
          // Fall back to customer_email if customer creation fails
        }
      }
    } catch (error) {
      // User not logged in - that's okay, Stripe will collect email during checkout
      console.log('No logged-in user, Stripe will collect email during checkout');
    }

    const sessionConfig: any = {
      mode: 'payment',
      payment_method_types: ['card', 'link'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/checkout/cancel`,
      metadata: {
        // Add user ID to metadata if available
        ...(userId && { userId }),
      },
    };

    // For Accounts V2: use customer if we have one, otherwise use customer_email with customer_creation
    if (customerId) {
      sessionConfig.customer = customerId;
    } else if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
      sessionConfig.customer_creation = 'always';
    } else {
      // No email - Stripe will collect it, but we still need customer_creation for Accounts V2
      sessionConfig.customer_creation = 'always';
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return { sessionId: session.id, url: session.url };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    // Check for mode mismatch (test vs live)
    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    const isTestMode = secretKey.startsWith('sk_test_');
    const isLiveMode = secretKey.startsWith('sk_live_');
    
    // Provide more detailed error messages
    if (error.message) {
      if (error.message.includes('No such price')) {
        let helpfulMessage = `Price ID "${priceId}" not found. `;
        
        if (isTestMode) {
          helpfulMessage += 'You are using TEST mode. Make sure the Price ID is from your TEST mode products. ';
          helpfulMessage += 'Go to Stripe Dashboard → Toggle to "Test mode" → Products → Copy the Price ID.';
        } else if (isLiveMode) {
          helpfulMessage += 'You are using LIVE mode. Make sure the Price ID is from your LIVE mode products. ';
          helpfulMessage += 'Go to Stripe Dashboard → Toggle to "Live mode" → Products → Copy the Price ID.';
        } else {
          helpfulMessage += 'Check that your STRIPE_SECRET_KEY matches the mode (test/live) of your Price ID.';
        }
        
        throw new Error(helpfulMessage);
      }
      
      throw new Error(error.message);
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      throw new Error(`Stripe error: ${error.message || 'Invalid request. Please check your Price ID and ensure it matches your Stripe mode (test/live).'}`);
    }
    
    throw new Error('Failed to create checkout session. Please check your Stripe configuration.');
  }
}

export async function createSubscriptionCheckoutSession(priceId: string, locale: string = 'en') {
  try {
    // Validate price ID
    if (!priceId || priceId.includes('XXXXXXXX') || priceId.includes('YYYYYYYY')) {
      throw new Error('Invalid Stripe Price ID. Please configure a valid Price ID in the checkout page.');
    }

    if (!priceId.startsWith('price_')) {
      throw new Error('Invalid Stripe Price ID format. Price IDs must start with "price_".');
    }

    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // Get logged-in user's email if available
    let customerEmail: string | undefined;
    let userId: string | undefined;
    let customerId: string | undefined;
    
    try {
      const supabase = await createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        customerEmail = user.email;
        userId = user.id;
        
        // For Accounts V2, create or retrieve customer first
        try {
          // Try to find existing customer by email
          const existingCustomers = await stripe.customers.list({
            email: customerEmail,
            limit: 1,
          });
          
          if (existingCustomers.data.length > 0) {
            customerId = existingCustomers.data[0].id;
          } else {
            // Create new customer
            const customer = await stripe.customers.create({
              email: customerEmail,
              metadata: {
                userId: userId,
              },
            });
            customerId = customer.id;
          }
        } catch (customerError) {
          console.error('Error creating/finding customer:', customerError);
          // Fall back to customer_email if customer creation fails
        }
      }
    } catch (error) {
      // User not logged in - that's okay, Stripe will collect email during checkout
      console.log('No logged-in user, Stripe will collect email during checkout');
    }

    const sessionConfig: any = {
      mode: 'subscription',
      payment_method_types: ['card', 'link'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/checkout/cancel`,
      metadata: {
        // Add user ID to metadata if available
        ...(userId && { userId }),
      },
    };

    // For subscription mode: use customer if we have one, otherwise use customer_email
    // Note: customer_creation is NOT supported in subscription mode (Stripe always creates a customer)
    if (customerId) {
      sessionConfig.customer = customerId;
    } else if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }
    // If no customer or email, Stripe will collect email during checkout and create customer automatically

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return { sessionId: session.id, url: session.url };
  } catch (error: any) {
    console.error('Error creating subscription checkout session:', error);
    
    // Check for mode mismatch (test vs live)
    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    const isTestMode = secretKey.startsWith('sk_test_');
    const isLiveMode = secretKey.startsWith('sk_live_');
    
    // Provide more detailed error messages
    if (error.message) {
      if (error.message.includes('No such price')) {
        let helpfulMessage = `Price ID "${priceId}" not found. `;
        
        if (isTestMode) {
          helpfulMessage += 'You are using TEST mode. Make sure the Price ID is from your TEST mode products. ';
          helpfulMessage += 'Go to Stripe Dashboard → Toggle to "Test mode" → Products → Copy the Price ID.';
        } else if (isLiveMode) {
          helpfulMessage += 'You are using LIVE mode. Make sure the Price ID is from your LIVE mode products. ';
          helpfulMessage += 'Go to Stripe Dashboard → Toggle to "Live mode" → Products → Copy the Price ID.';
        } else {
          helpfulMessage += 'Check that your STRIPE_SECRET_KEY matches the mode (test/live) of your Price ID.';
        }
        
        throw new Error(helpfulMessage);
      }
      
      throw new Error(error.message);
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      throw new Error(`Stripe error: ${error.message || 'Invalid request. Please check your Price ID and ensure it matches your Stripe mode (test/live).'}`);
    }
    
    throw new Error('Failed to create subscription checkout session. Please check your Stripe configuration.');
  }
}
