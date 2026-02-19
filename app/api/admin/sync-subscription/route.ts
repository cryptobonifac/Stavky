import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { polar, getOrganizationId } from '@/lib/polar/polar';

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

function getSubscriptionPlanType(interval: string | undefined): 'monthly' | 'yearly' | null {
  if (interval === 'month') return 'monthly';
  if (interval === 'year') return 'yearly';
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log(`\n🔄 MANUAL SUBSCRIPTION SYNC for: ${email}`);

    // 1. Find user in database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, polar_customer_id, polar_subscription_id')
      .ilike('email', email)
      .single();

    if (userError || !user) {
      console.error('❌ User not found:', email);
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    console.log('   Found user:', user.id);

    // 2. Search for customer in Polar by email
    const organizationId = getOrganizationId();

    // Search customers by email
    const customersResponse = await polar.customers.list({
      organizationId,
      email,
      limit: 1,
    });

    const customers = customersResponse.result?.items || [];

    if (customers.length === 0) {
      console.log('❌ No Polar customer found for email:', email);
      return NextResponse.json({
        error: 'No Polar customer found for this email',
        suggestion: 'Make sure the user has completed a checkout in Polar'
      }, { status: 404 });
    }

    const customer = customers[0];
    console.log('   Found Polar customer:', customer.id);

    // 3. Get active subscriptions for this customer
    const subscriptionsResponse = await polar.subscriptions.list({
      organizationId,
      customerId: customer.id,
      active: true,
      limit: 10,
    });

    const subscriptions = subscriptionsResponse.result?.items || [];

    if (subscriptions.length === 0) {
      console.log('❌ No active subscriptions found for customer:', customer.id);
      return NextResponse.json({
        error: 'No active subscriptions found',
        customerId: customer.id,
        suggestion: 'The customer exists but has no active subscription'
      }, { status: 404 });
    }

    // Use the first active subscription
    const subscription = subscriptions[0];
    console.log('   Found subscription:', subscription.id);
    console.log('   Status:', subscription.status);
    console.log('   Current period end:', subscription.currentPeriodEnd);

    // 4. Update user in database
    const currentPeriodEnd = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const planType = getSubscriptionPlanType(subscription.recurringInterval);

    const updateData = {
      polar_customer_id: customer.id,
      polar_subscription_id: subscription.id,
      subscription_plan_type: planType,
      account_active_until: currentPeriodEnd.toISOString(),
    };

    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Failed to update user:', updateError);
      return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
    }

    console.log('✅ User subscription synced successfully');
    console.log('   Account active until:', currentPeriodEnd.toISOString());
    console.log('   Plan type:', planType);

    return NextResponse.json({
      success: true,
      message: 'Subscription synced successfully',
      data: {
        userId: user.id,
        email: user.email,
        polarCustomerId: customer.id,
        polarSubscriptionId: subscription.id,
        subscriptionPlanType: planType,
        accountActiveUntil: currentPeriodEnd.toISOString(),
        subscriptionStatus: subscription.status,
      }
    });

  } catch (error) {
    console.error('Error syncing subscription:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
