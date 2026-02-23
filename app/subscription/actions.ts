'use server';

import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server';

/**
 * Ensure user profile exists in public.users table.
 * This is a failsafe in case the auth trigger didn't fire.
 */
async function ensureUserProfile(supabase: any, user: any) {
  const { data: existingProfile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (!existingProfile) {
    // Profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        role: 'customer',
        account_active_until: null,
        sign_up_method: user.app_metadata?.provider || 'email',
      });

    if (insertError) {
      console.error('Failed to create user profile:', insertError);
      return false;
    }
    return true;
  }
  return true;
}

/**
 * Get the current subscription status for the logged-in user
 * Now checks database only (provider_* columns)
 */
export async function getSubscriptionStatus() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Not authenticated', subscription: null };
    }

    // Ensure user profile exists (failsafe for trigger failures)
    await ensureUserProfile(supabase, user);

    // Get user's subscription info from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('provider_subscription_id, provider_customer_id, account_active_until, subscription_plan_type')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // Profile not found - return as no subscription (don't show error to user)
      return { error: null, subscription: null, hasSubscription: false, maintenanceMode: true };
    }

    // Check if user has active subscription based on account_active_until
    const now = new Date();
    const activeUntil = profile.account_active_until ? new Date(profile.account_active_until) : null;
    const isActive = activeUntil ? activeUntil >= now : false;

    if (!isActive) {
      return {
        error: null,
        subscription: null,
        hasSubscription: false,
        maintenanceMode: true,
      };
    }

    // User has active subscription from database
    return {
      error: null,
      subscription: {
        id: profile.provider_subscription_id || 'db-subscription',
        status: 'active',
        currentPeriodEnd: profile.account_active_until,
        cancelAtPeriodEnd: false,
        customerId: profile.provider_customer_id,
        planType: profile.subscription_plan_type,
      },
      hasSubscription: true,
      maintenanceMode: true,
    };
  } catch (error: any) {
    console.error('Error getting subscription status:', error);
    return {
      error: error.message || 'An error occurred',
      subscription: null,
      hasSubscription: false,
      maintenanceMode: true,
    };
  }
}

/**
 * Cancel the user's subscription
 * Stub: Payment system is being updated
 */
export async function cancelSubscription() {
  return {
    error: 'Subscription management is currently being updated. Please try again later or contact support.',
    success: false,
  };
}
