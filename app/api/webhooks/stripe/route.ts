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
  // Add immediate logging to confirm endpoint is reached
  console.log('\n🔔 WEBHOOK REQUEST RECEIVED');
  console.log('   URL:', req.url);
  console.log('   Method:', req.method);
  console.log('   Timestamp:', new Date().toISOString());

  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('🔧 Configuration Check:');
  console.log('   STRIPE_WEBHOOK_SECRET exists:', !!webhookSecret);
  console.log('   Secret prefix:', webhookSecret?.substring(0, 10) || 'MISSING');
  console.log('   Signature present:', !!signature);
  console.log('   Body length:', body.length, 'bytes');

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is not set');
    console.error('   Set this in .env.local and restart the dev server');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('\n' + '='.repeat(80));
    console.error('❌ WEBHOOK SIGNATURE VERIFICATION FAILED');
    console.error('='.repeat(80));
    console.error('Error Type:', err instanceof Error ? err.constructor.name : typeof err);
    console.error('Error Message:', err instanceof Error ? err.message : String(err));
    console.error('Error Details:', err);
    console.error('\n🔍 DIAGNOSTIC INFO:');
    console.error('   Webhook Secret Present:', !!webhookSecret);
    console.error('   Webhook Secret Prefix:', webhookSecret ? webhookSecret.substring(0, 10) + '...' : 'N/A');
    console.error('   Signature Header Present:', !!signature);
    console.error('   Signature Header Prefix:', signature ? signature.substring(0, 20) + '...' : 'N/A');
    console.error('   Body Length:', body.length, 'bytes');
    console.error('\n💡 SOLUTION:');
    console.error('   1. Get current webhook secret from stripe listen output');
    console.error('   2. Update STRIPE_WEBHOOK_SECRET in .env.local');
    console.error('   3. Restart Next.js dev server');
    console.error('   4. If using Sandbox, ensure stripe listen uses --api-key flag');
    console.error('='.repeat(80) + '\n');
    return NextResponse.json(
      { 
        error: 'Invalid signature',
        message: err instanceof Error ? err.message : String(err),
        hint: 'Webhook secret may not match stripe listen output. Check Next.js terminal for details.'
      },
      { status: 400 }
    );
  }

  // Log complete event information at the start
  const timestamp = new Date().toISOString();
  console.log('\n' + '='.repeat(80));
  console.log('🔔 WEBHOOK EVENT RECEIVED');
  console.log('='.repeat(80));
  console.log('Timestamp:', timestamp);
  console.log('Event Type:', event.type);
  console.log('Event ID:', event.id);
  console.log('Event Created:', new Date(event.created * 1000).toISOString());
  console.log('Livemode:', event.livemode);
  console.log('API Version:', event.api_version);
  console.log('Request ID:', event.request?.id || 'N/A');
  
  // Log complete event object (sanitized - remove sensitive data)
  const eventLog: any = {
    id: event.id,
    object: event.object,
    type: event.type,
    created: event.created,
    livemode: event.livemode,
    api_version: event.api_version,
    request: event.request,
    data: {
      object: event.data.object,
    },
  };
  
  // For checkout.session.completed, log full session
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    eventLog.data.object = {
      id: session.id,
      object: session.object,
      customer: session.customer,
      customer_details: session.customer_details,
      customer_email: session.customer_email,
      subscription: session.subscription,
      mode: session.mode,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent,
      metadata: session.metadata,
      amount_total: session.amount_total,
      currency: session.currency,
      created: session.created,
      success_url: session.success_url,
      cancel_url: session.cancel_url,
    };
  }
  
  console.log('📦 Complete Event Object:', JSON.stringify(eventLog, null, 2));
  console.log('='.repeat(80) + '\n');

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('✅ CHECKOUT SESSION COMPLETED');
        console.log('Session ID:', session.id);
        console.log('Payment Status:', session.payment_status);
        console.log('Mode:', session.mode);
        console.log('Amount Total:', session.amount_total);
        console.log('Currency:', session.currency);
        console.log('Created:', new Date(session.created * 1000).toISOString());
        
        // Log complete session object (sanitized)
        const sessionLog = {
          id: session.id,
          object: session.object,
          customer: session.customer,
          customer_details: session.customer_details,
          customer_email: session.customer_email,
          subscription: session.subscription,
          mode: session.mode,
          payment_status: session.payment_status,
          payment_intent: session.payment_intent,
          metadata: session.metadata,
          amount_total: session.amount_total,
          currency: session.currency,
          created: session.created,
          success_url: session.success_url,
          cancel_url: session.cancel_url,
        };
        console.log('📋 Complete Session Object:', JSON.stringify(sessionLog, null, 2));
        
        // Log all possible email locations
        console.log('\n📧 EMAIL LOCATIONS:');
        console.log('   customer_details?.email:', session.customer_details?.email || 'NULL');
        console.log('   customer_email:', session.customer_email || 'NULL');
        if (typeof session.customer === 'object' && session.customer) {
          console.log('   customer.email:', (session.customer as any).email || 'NULL');
        }
        console.log('   metadata?.userId:', session.metadata?.userId || 'NULL');
        console.log('   All metadata:', JSON.stringify(session.metadata || {}, null, 2));

        // Extract values with comprehensive logging
        // Try all possible email locations
        let customerEmail: string | null = null;
        if (session.customer_details?.email) {
          customerEmail = session.customer_details.email;
        } else if (session.customer_email) {
          customerEmail = session.customer_email;
        } else if (typeof session.customer === 'object' && session.customer && (session.customer as any).email) {
          customerEmail = (session.customer as any).email;
        }
        
        const customerId = typeof session.customer === 'string' 
          ? session.customer 
          : (session.customer as any)?.id || null;
        const subscriptionId = typeof session.subscription === 'string' 
          ? session.subscription 
          : (session.subscription as any)?.id || null;
        const mode = session.mode;

        console.log('\n🔍 EXTRACTED VALUES:');
        console.log('   Customer ID:', customerId || 'NULL');
        console.log('   Customer Email:', customerEmail || 'NULL');
        console.log('   Subscription ID:', subscriptionId || 'NULL');
        console.log('   Mode:', mode);
        console.log('   Customer Type:', typeof session.customer);
        if (typeof session.customer === 'object' && session.customer) {
          console.log('   Customer Object:', JSON.stringify(session.customer, null, 2));
        }

        // Check activation condition
        const modeCheck = mode === 'subscription' || mode === 'payment';
        const identifierCheck = !!(customerEmail || session.metadata?.userId);
        const paymentStatusCheck = session.payment_status === 'paid';
        const shouldActivate = modeCheck && identifierCheck && paymentStatusCheck;
        
        console.log('\n🔐 ACTIVATION CONDITION CHECK:');
        console.log('   Mode check (subscription || payment):', modeCheck, `(mode: ${mode})`);
        console.log('   Identifier check (email || userId):', identifierCheck, `(email: ${customerEmail || 'none'}, userId: ${session.metadata?.userId || 'none'})`);
        console.log('   Payment status check (paid):', paymentStatusCheck, `(status: ${session.payment_status})`);
        console.log('   Should activate:', shouldActivate);
        
        if (!paymentStatusCheck) {
          console.warn('   ⚠️  WARNING: Payment status is not "paid". Account will NOT be activated.');
        }
        
        // Activate account for both subscription and one-time payment modes
        if (shouldActivate) {
          console.log('\n🔍 STARTING USER LOOKUP...');
          try {
            let user: { id: string; email: string; account_active_until: string | null; stripe_customer_id: string | null; stripe_subscription_id: string | null } | null = null;
            let userError: any = null;
            let lookupMethod = 'none';

            // Try to find user by userId from metadata first (more reliable)
            if (session.metadata?.userId) {
              console.log('   Attempting lookup by userId from metadata:', session.metadata.userId);
              const { data, error } = await supabase
                .from('users')
                .select('id, email, account_active_until, stripe_customer_id, stripe_subscription_id')
                .eq('id', session.metadata.userId)
                .single();
              
              console.log('   Lookup by userId result:', error ? `ERROR: ${error.message}` : `SUCCESS: Found user ${data?.email}`);
              if (error) {
                console.log('   Error details:', JSON.stringify(error, null, 2));
              }
              
              user = data;
              userError = error;
              lookupMethod = error ? 'userId-failed' : 'userId-success';
            }

            // Fallback to email if userId not found or not in metadata
            // Use case-insensitive email lookup
            if ((userError || !user) && customerEmail) {
              console.log('   Attempting lookup by email (case-insensitive):', customerEmail);
              
              // Try exact match first
              let { data, error } = await supabase
                .from('users')
                .select('id, email, account_active_until, stripe_customer_id, stripe_subscription_id')
                .eq('email', customerEmail)
                .single();
              
              // If exact match fails, try case-insensitive (PostgreSQL ILIKE)
              if (error && error.code === 'PGRST116') {
                console.log('   Exact email match failed, trying case-insensitive...');
                const { data: dataCI, error: errorCI } = await supabase
                  .from('users')
                  .select('id, email, account_active_until, stripe_customer_id, stripe_subscription_id')
                  .ilike('email', customerEmail)
                  .maybeSingle();
                
                if (!errorCI && dataCI) {
                  data = dataCI;
                  error = null;
                  console.log('   Case-insensitive lookup SUCCESS:', dataCI.email);
                } else {
                  console.log('   Case-insensitive lookup also failed');
                }
              }
              
              console.log('   Lookup by email result:', error ? `ERROR: ${error.message}` : `SUCCESS: Found user ${data?.email}`);
              if (error) {
                console.log('   Error details:', JSON.stringify(error, null, 2));
              }
              
              user = data;
              userError = error;
              lookupMethod = error ? 'email-failed' : (lookupMethod === 'userId-failed' ? 'email-fallback-success' : 'email-success');
            }

            console.log('\n📊 USER LOOKUP SUMMARY:');
            console.log('   Lookup method used:', lookupMethod);
            console.log('   User found:', !!user);
            console.log('   User ID:', user?.id || 'NULL');
            console.log('   User Email:', user?.email || 'NULL');
            console.log('   Current account_active_until:', user?.account_active_until || 'NULL');
            console.log('   Current stripe_customer_id:', user?.stripe_customer_id || 'NULL');
            console.log('   Current stripe_subscription_id:', user?.stripe_subscription_id || 'NULL');
            
            if (userError || !user) {
              console.error('\n❌ USER NOT FOUND IN DATABASE');
              console.error('   Searched email:', customerEmail);
              console.error('   Searched userId:', session.metadata?.userId);
              console.error('   Lookup method:', lookupMethod);
              console.error('   Error:', userError ? JSON.stringify(userError, null, 2) : 'No error but user is null');
              console.error('   This payment will NOT activate any account.');
              // Don't break - continue to log the event even if user not found
            } else {
              console.log(`\n✅ USER FOUND IN DATABASE`);
              console.log(`   Email: ${user.email}`);
              console.log(`   ID: ${user.id}`);
              console.log(`   Current Status: ${user.account_active_until ? 'ACTIVE until ' + user.account_active_until : 'INACTIVE'}`);

              // Calculate activation date: 30 days from now
              const activationDate = new Date();
              activationDate.setDate(activationDate.getDate() + 30);

              console.log('\n📅 CALCULATING ACTIVATION DATE:');
              console.log('   Current time:', new Date().toISOString());
              console.log('   Activation date (30 days from now):', activationDate.toISOString());

              // For subscriptions, also store subscription ID
              // For one-time payments, only store customer ID
              // Note: customerId might be null for some payment methods, so make it optional
              const updateData: {
                stripe_customer_id?: string | null;
                stripe_subscription_id?: string | null;
                account_active_until: string;
              } = {
                account_active_until: activationDate.toISOString(),
              };

              // Only add customer_id if it exists
              if (customerId) {
                updateData.stripe_customer_id = customerId;
                console.log('   Will update stripe_customer_id:', customerId);
              } else {
                console.log('   stripe_customer_id: NULL (not updating)');
              }

              if (mode === 'subscription' && subscriptionId) {
                updateData.stripe_subscription_id = subscriptionId;
                console.log('   Will update stripe_subscription_id:', subscriptionId);
              } else {
                console.log('   stripe_subscription_id: NULL (not updating)');
              }

              console.log('\n📝 DATABASE UPDATE PREPARATION:');
              console.log('   Table: users');
              console.log('   Where: id =', user.id);
              console.log('   Update data:', JSON.stringify(updateData, null, 2));
              console.log('   SQL equivalent: UPDATE users SET', Object.entries(updateData).map(([k, v]) => `${k} = '${v}'`).join(', '), `WHERE id = '${user.id}'`);

              // Update user with Stripe info and activate account
              console.log('\n💾 EXECUTING DATABASE UPDATE...');
              const updateStartTime = Date.now();
              
              const { error: updateError, data: updatedUser, count } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', user.id)
                .select()
                .single();

              const updateDuration = Date.now() - updateStartTime;
              console.log(`   Update duration: ${updateDuration}ms`);

              if (updateError) {
                console.error('\n❌ DATABASE UPDATE FAILED');
                console.error('   Error code:', updateError.code);
                console.error('   Error message:', updateError.message);
                console.error('   Error details:', updateError.details);
                console.error('   Error hint:', updateError.hint);
                console.error('   Update data attempted:', JSON.stringify(updateData, null, 2));
                console.error('   User ID:', user.id);
                console.error('   Full error object:', JSON.stringify(updateError, null, 2));
              } else {
                console.log('\n✅ DATABASE UPDATE SUCCESSFUL');
                console.log(`   User: ${customerEmail} (${mode} mode)`);
                console.log(`   Account active until: ${activationDate.toISOString()}`);
                console.log(`   Updated fields: ${Object.keys(updateData).join(', ')}`);
                if (updatedUser) {
                  console.log('\n📋 VERIFICATION - UPDATED USER RECORD:');
                  console.log('   account_active_until:', updatedUser.account_active_until || 'NULL');
                  console.log('   stripe_customer_id:', updatedUser.stripe_customer_id || 'NULL');
                  console.log('   stripe_subscription_id:', updatedUser.stripe_subscription_id || 'NULL');
                  console.log('   updated_at:', updatedUser.updated_at);
                  
                  // Verify the update actually worked
                  const isNowActive = updatedUser.account_active_until && new Date(updatedUser.account_active_until) >= new Date();
                  console.log('   Account is now ACTIVE:', isNowActive ? '✅ YES' : '❌ NO');
                } else {
                  console.warn('   ⚠️  WARNING: Update succeeded but no user data returned');
                }
              }
            }
          } catch (error) {
            console.error('\n❌ EXCEPTION DURING ACCOUNT ACTIVATION');
            console.error('   Error type:', error instanceof Error ? error.constructor.name : typeof error);
            console.error('   Error message:', error instanceof Error ? error.message : String(error));
            console.error('   Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            console.error('   Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
          }
        } else {
          console.log('\n⚠️  ACCOUNT ACTIVATION SKIPPED');
          console.log(`   Reason: Activation condition not met`);
          console.log(`   Mode: ${mode} (required: 'subscription' or 'payment')`);
          console.log(`   Email: ${customerEmail || 'none'} (required: present)`);
          console.log(`   UserId in metadata: ${session.metadata?.userId || 'none'} (optional)`);
          console.log(`   Condition result: modeCheck=${modeCheck}, identifierCheck=${identifierCheck}`);
        }
        
        console.log('\n' + '='.repeat(80));
        console.log('✅ WEBHOOK PROCESSING COMPLETE FOR checkout.session.completed');
        console.log('='.repeat(80) + '\n');

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
