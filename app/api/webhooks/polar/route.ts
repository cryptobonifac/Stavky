import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { getWebhookSecret } from '@/lib/polar/polar';

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

// Helper function to determine subscription plan type from Polar subscription
function getSubscriptionPlanType(interval: string | undefined): 'monthly' | 'yearly' | null {
  if (interval === 'month') return 'monthly';
  if (interval === 'year') return 'yearly';
  console.warn(`Unexpected subscription interval: ${interval}`);
  return null;
}

export async function POST(req: Request) {
  console.log('\n🔔 POLAR WEBHOOK REQUEST RECEIVED');
  console.log('   Timestamp:', new Date().toISOString());

  const body = await req.text();

  let webhookSecret: string;
  try {
    webhookSecret = getWebhookSecret();
  } catch (error) {
    console.error('❌ POLAR_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event;

  try {
    event = validateEvent(body, Object.fromEntries(req.headers), webhookSecret);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      console.error('❌ WEBHOOK SIGNATURE VERIFICATION FAILED');
      console.error('   Error:', error.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
    throw error;
  }

  console.log('✅ Webhook signature verified');
  console.log('   Event Type:', event.type);

  try {
    switch (event.type) {
      case 'subscription.created': {
        const subscription = event.data;
        console.log('📦 Subscription created:', subscription.id);

        // Get customer email from the subscription
        // Cast to any to access customer properties that may vary by SDK version
        const subscriptionData = subscription as any;
        const customerEmail = subscriptionData.customer?.email || subscriptionData.customerEmail;
        const customerId = subscription.customerId;
        const subscriptionId = subscription.id;
        const userId = subscription.metadata?.userId as string | undefined;

        console.log('   Customer ID:', customerId);
        console.log('   Customer Email:', customerEmail);
        console.log('   User ID from metadata:', userId);

        if (!customerEmail && !userId) {
          console.error('❌ No customer email or userId found in subscription');
          break;
        }

        // Find user by userId from metadata first, then fallback to email
        let user: { id: string; email: string } | null = null;

        if (userId) {
          const { data, error } = await supabase
            .from('users')
            .select('id, email')
            .eq('id', userId)
            .single();

          if (!error && data) {
            user = data;
            console.log('   Found user by userId:', user.email);
          }
        }

        if (!user && customerEmail) {
          const { data, error } = await supabase
            .from('users')
            .select('id, email')
            .ilike('email', customerEmail)
            .maybeSingle();

          if (!error && data) {
            user = data;
            console.log('   Found user by email:', user.email);
          }
        }

        if (!user) {
          console.error('❌ User not found in database');
          break;
        }

        // Calculate activation date based on subscription period
        const currentPeriodEnd = subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

        // Determine plan type from recurring interval
        const recurringInterval = subscription.recurringInterval;
        const planType = getSubscriptionPlanType(recurringInterval);

        // Update user with Polar info and activate account
        const updateData: {
          polar_customer_id: string;
          polar_subscription_id: string;
          subscription_plan_type: 'monthly' | 'yearly' | null;
          account_active_until: string;
        } = {
          polar_customer_id: customerId,
          polar_subscription_id: subscriptionId,
          subscription_plan_type: planType,
          account_active_until: currentPeriodEnd.toISOString(),
        };

        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Failed to update user:', updateError);
        } else {
          console.log('✅ User activated:', user.email);
          console.log('   Account active until:', currentPeriodEnd.toISOString());
          console.log('   Plan type:', planType);
        }

        break;
      }

      case 'subscription.updated': {
        const subscription = event.data;
        console.log('📦 Subscription updated:', subscription.id);

        const customerId = subscription.customerId;

        // Find user by Polar customer ID
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, email')
          .eq('polar_customer_id', customerId)
          .single();

        if (userError || !user) {
          console.error('❌ User not found for customer:', customerId);
          break;
        }

        // Update subscription info
        const currentPeriodEnd = subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd)
          : null;

        const recurringInterval = subscription.recurringInterval;
        const planType = getSubscriptionPlanType(recurringInterval);

        const updateData: {
          polar_subscription_id: string;
          subscription_plan_type?: 'monthly' | 'yearly' | null;
          account_active_until?: string;
        } = {
          polar_subscription_id: subscription.id,
        };

        if (planType) {
          updateData.subscription_plan_type = planType;
        }

        if (currentPeriodEnd) {
          updateData.account_active_until = currentPeriodEnd.toISOString();
        }

        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Failed to update subscription:', updateError);
        } else {
          console.log('✅ Subscription updated for:', user.email);
        }

        break;
      }

      case 'subscription.canceled': {
        const subscription = event.data;
        console.log('📦 Subscription canceled:', subscription.id);

        const customerId = subscription.customerId;

        // Find user by Polar customer ID
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, email')
          .eq('polar_customer_id', customerId)
          .single();

        if (userError || !user) {
          console.error('❌ User not found for customer:', customerId);
          break;
        }

        // Clear subscription ID (keep customer ID for future subscriptions)
        // Note: We don't immediately deactivate the account; it will expire naturally
        const { error: updateError } = await supabase
          .from('users')
          .update({
            polar_subscription_id: null,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Failed to update user:', updateError);
        } else {
          console.log('✅ Subscription removed for:', user.email);
        }

        break;
      }

      case 'subscription.revoked': {
        // Subscription was revoked (e.g., due to payment failure)
        const subscription = event.data;
        console.log('📦 Subscription revoked:', subscription.id);

        const customerId = subscription.customerId;

        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id, email')
          .eq('polar_customer_id', customerId)
          .single();

        if (userError || !user) {
          console.error('❌ User not found for customer:', customerId);
          break;
        }

        // Clear subscription ID
        const { error: updateError } = await supabase
          .from('users')
          .update({
            polar_subscription_id: null,
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('❌ Failed to update user:', updateError);
        } else {
          console.log('✅ Subscription revoked for:', user.email);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
