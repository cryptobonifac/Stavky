'use server';

import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/stripe';
import { createClient as createServerClient } from '@/lib/supabase/server';

/**
 * Get the current subscription status for the logged-in user
 */
export async function getSubscriptionStatus() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated', subscription: null };
    }

    // Get user's Stripe subscription ID from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('stripe_subscription_id, stripe_customer_id, account_active_until')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { error: 'User profile not found', subscription: null };
    }

    if (!profile.stripe_subscription_id) {
      return { 
        error: null, 
        subscription: null,
        hasSubscription: false 
      };
    }

    // Retrieve subscription from Stripe
    try {
      const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
      
      // Access current_period_end with proper type handling
      const currentPeriodEnd = (subscription as any).current_period_end as number;
      
      return {
        error: null,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: currentPeriodEnd 
            ? new Date(currentPeriodEnd * 1000).toISOString()
            : new Date().toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          customerId: profile.stripe_customer_id,
        },
        hasSubscription: true,
      };
    } catch (stripeError: any) {
      console.error('Error retrieving subscription from Stripe:', stripeError);
      return { 
        error: stripeError.message || 'Failed to retrieve subscription', 
        subscription: null,
        hasSubscription: false 
      };
    }
  } catch (error: any) {
    console.error('Error getting subscription status:', error);
    return { 
      error: error.message || 'An error occurred', 
      subscription: null,
      hasSubscription: false 
    };
  }
}

/**
 * Cancel the user's subscription
 */
export async function cancelSubscription() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated' };
    }

    // Get user's Stripe subscription ID from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('stripe_subscription_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { error: 'User profile not found' };
    }

    if (!profile.stripe_subscription_id) {
      return { error: 'No active subscription found' };
    }

    // Cancel subscription in Stripe (cancel at period end)
    try {
      const subscription = await stripe.subscriptions.update(profile.stripe_subscription_id, {
        cancel_at_period_end: true,
      });

      return {
        error: null,
        success: true,
        message: 'Subscription will be cancelled at the end of the current billing period',
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      };
    } catch (stripeError: any) {
      console.error('Error cancelling subscription in Stripe:', stripeError);
      return { 
        error: stripeError.message || 'Failed to cancel subscription' 
      };
    }
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return { 
      error: error.message || 'An error occurred' 
    };
  }
}



