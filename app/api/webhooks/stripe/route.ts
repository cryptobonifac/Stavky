import { stripe } from '@/lib/stripe/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);

        const customerId = session.customer as string;
        const customerEmail = session.customer_details?.email;
        const subscriptionId = session.subscription as string | null;
        const mode = session.mode;

        console.log('Customer:', customerId);
        console.log('Email:', customerEmail);
        console.log('Subscription ID:', subscriptionId);
        console.log('Mode:', mode);

        // Only activate account for subscription mode
        if (mode === 'subscription' && customerEmail) {
          try {
            // Find user by email
            const { data: user, error: userError } = await supabase
              .from('users')
              .select('id, email, account_active_until')
              .eq('email', customerEmail)
              .single();

            if (userError || !user) {
              console.error('User not found:', customerEmail, userError);
              break;
            }

            // Calculate activation date: 30 days from now
            const activationDate = new Date();
            activationDate.setDate(activationDate.getDate() + 30);

            // Update user with Stripe info and activate account
            const { error: updateError } = await supabase
              .from('users')
              .update({
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                account_active_until: activationDate.toISOString(),
              })
              .eq('id', user.id);

            if (updateError) {
              console.error('Failed to update user:', updateError);
            } else {
              console.log('Account activated for user:', customerEmail, 'until', activationDate.toISOString());
            }
          } catch (error) {
            console.error('Error activating account:', error);
          }
        }

        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Async payment succeeded:', session.id);
        // Handle async payment success (e.g., bank transfers)
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Async payment failed:', session.id);
        // Handle async payment failure
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        // Handle successful payment
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent failed:', paymentIntent.id);
        // Handle failed payment
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', subscription.id);
        // Handle new subscription
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        // Handle subscription update
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription cancelled:', subscription.id);

        // Handle subscription cancellation
        const customerId = subscription.customer as string;

        if (customerId) {
          try {
            // Find user by Stripe customer ID
            const { data: user, error: userError } = await supabase
              .from('users')
              .select('id, email')
              .eq('stripe_customer_id', customerId)
              .single();

            if (userError || !user) {
              console.error('User not found for customer:', customerId, userError);
              break;
            }

            // Remove subscription ID (keep customer ID for future subscriptions)
            // Note: We don't immediately deactivate the account; it will expire naturally
            // based on the existing account_active_until date
            const { error: updateError } = await supabase
              .from('users')
              .update({
                stripe_subscription_id: null,
              })
              .eq('id', user.id);

            if (updateError) {
              console.error('Failed to update user subscription:', updateError);
            } else {
              console.log('Subscription removed for user:', user.email);
            }
          } catch (error) {
            console.error('Error handling subscription cancellation:', error);
          }
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);

        // Handle successful recurring payment
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
        // Invoice.subscription can be string, Subscription object, or null
        const subscriptionId = (invoice as any).subscription
          ? (typeof (invoice as any).subscription === 'string'
              ? (invoice as any).subscription
              : (invoice as any).subscription?.id)
          : null;

        if (customerId && subscriptionId) {
          try {
            // Find user by Stripe customer ID
            const { data: user, error: userError } = await supabase
              .from('users')
              .select('id, email, account_active_until')
              .eq('stripe_customer_id', customerId)
              .single();

            if (userError || !user) {
              console.error('User not found for customer:', customerId, userError);
              break;
            }

            // Extend activation date by 30 days from current expiry or now (whichever is later)
            const now = new Date();
            const currentExpiry = user.account_active_until
              ? new Date(user.account_active_until)
              : now;

            const extensionDate = currentExpiry > now ? currentExpiry : now;
            extensionDate.setDate(extensionDate.getDate() + 30);

            // Update user's account expiry
            const { error: updateError } = await supabase
              .from('users')
              .update({
                account_active_until: extensionDate.toISOString(),
                stripe_subscription_id: subscriptionId,
              })
              .eq('id', user.id);

            if (updateError) {
              console.error('Failed to extend account:', updateError);
            } else {
              console.log('Account extended for user:', user.email, 'until', extensionDate.toISOString());
            }
          } catch (error) {
            console.error('Error extending account:', error);
          }
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', invoice.id);
        // Handle failed recurring payment
        // TODO: Notify user about payment failure
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
