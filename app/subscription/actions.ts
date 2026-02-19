'use server';

import { polar } from '@/lib/polar/polar';
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server';

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

    // Get user's Polar subscription ID from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('polar_subscription_id, polar_customer_id, account_active_until')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { error: 'User profile not found', subscription: null };
    }

    if (!profile.polar_subscription_id) {
      return {
        error: null,
        subscription: null,
        hasSubscription: false
      };
    }

    // Retrieve subscription from Polar
    try {
      const subscription = await polar.subscriptions.get({
        id: profile.polar_subscription_id,
      });

      return {
        error: null,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd).toISOString()
            : new Date().toISOString(),
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
          customerId: profile.polar_customer_id,
        },
        hasSubscription: true,
      };
    } catch (polarError: any) {
      console.error('Error retrieving subscription from Polar:', polarError);
      return {
        error: polarError.message || 'Failed to retrieve subscription',
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

    // Get user's Polar subscription ID from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('polar_subscription_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { error: 'User profile not found' };
    }

    if (!profile.polar_subscription_id) {
      return { error: 'No active subscription found' };
    }

    // Revoke subscription in Polar (this cancels the subscription)
    try {
      const subscription = await polar.subscriptions.revoke({
        id: profile.polar_subscription_id,
      });

      return {
        error: null,
        success: true,
        message: 'Subscription has been cancelled',
        cancelAtPeriodEnd: true, // Polar revoke cancels the subscription
      };
    } catch (polarError: any) {
      console.error('Error revoking subscription in Polar:', polarError);
      return {
        error: polarError.message || 'Failed to cancel subscription'
      };
    }
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    return {
      error: error.message || 'An error occurred'
    };
  }
}
