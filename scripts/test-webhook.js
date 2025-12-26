#!/usr/bin/env node

/**
 * Stripe Webhook Testing Script
 *
 * This script helps test Stripe webhook integration by creating test checkout sessions
 * and optionally simulating webhook events.
 *
 * Prerequisites:
 * - STRIPE_SECRET_KEY set in .env.local
 * - Stripe CLI installed (for event triggering)
 * - Local dev server running with webhooks (npm run dev:with-webhooks)
 *
 * Usage:
 *   node scripts/test-webhook.js create-session
 *   node scripts/test-webhook.js trigger-event
 *   node scripts/test-webhook.js check-user <email>
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const command = process.argv[2];
const arg = process.argv[3];

/**
 * Create a test checkout session
 */
async function createTestSession() {
  console.log('🚀 Creating test checkout session...\n');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'czk',
            product_data: {
              name: 'Test Subscription',
              description: 'Test subscription for webhook testing',
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: 29900, // 299 CZK
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/subscription',
      metadata: {
        // Add test user ID if you have one
        // userId: 'your-user-uuid',
        test: 'true',
      },
      customer_email: arg || 'test@example.com',
    });

    console.log('✅ Checkout session created successfully!');
    console.log('\nSession ID:', session.id);
    console.log('Customer Email:', session.customer_email || 'Not set');
    console.log('Mode:', session.mode);
    console.log('Payment Status:', session.payment_status);
    console.log('\n🔗 Checkout URL:');
    console.log(session.url);
    console.log('\n💡 Next steps:');
    console.log('1. Open the URL above in your browser');
    console.log('2. Use test card: 4242 4242 4242 4242');
    console.log('3. Complete the checkout');
    console.log('4. Check your terminal for webhook logs');
    console.log('5. Verify database update in Supabase Studio');
  } catch (error) {
    console.error('❌ Error creating session:', error.message);
    if (error.type) {
      console.error('   Error type:', error.type);
    }
    process.exit(1);
  }
}

/**
 * Trigger a test webhook event using Stripe CLI
 */
async function triggerTestEvent() {
  console.log('🔔 Triggering test webhook event...\n');
  console.log('⚠️  Make sure Stripe CLI is installed and running!');
  console.log('   Run: npm run dev:with-webhooks\n');

  const { exec } = require('child_process');

  exec('stripe trigger checkout.session.completed', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error triggering event:', error.message);
      console.error('\n💡 Make sure Stripe CLI is installed:');
      console.error('   https://stripe.com/docs/stripe-cli#install');
      return;
    }

    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }

    console.log('\n✅ Test event triggered!');
    console.log('Check your Next.js terminal for webhook logs.');
  });
}

/**
 * Check user record in database
 */
async function checkUser(email) {
  if (!email) {
    console.error('❌ Please provide an email address');
    console.error('Usage: node scripts/test-webhook.js check-user test@example.com');
    process.exit(1);
  }

  console.log(`🔍 Checking user record for: ${email}\n`);

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, account_active_until, stripe_customer_id, stripe_subscription_id, created_at, updated_at')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.error('❌ User not found:', error?.message || 'No user with that email');
      process.exit(1);
    }

    console.log('✅ User found!\n');
    console.log('📋 User Details:');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Created:', user.created_at);
    console.log('   Updated:', user.updated_at);
    console.log('\n💳 Stripe Integration:');
    console.log('   Customer ID:', user.stripe_customer_id || '❌ NOT SET');
    console.log('   Subscription ID:', user.stripe_subscription_id || '❌ NOT SET');
    console.log('   Account Active Until:', user.account_active_until || '❌ NOT SET');

    if (user.account_active_until) {
      const activeUntil = new Date(user.account_active_until);
      const now = new Date();
      const isActive = activeUntil >= now;

      console.log('\n📅 Account Status:');
      console.log('   Active:', isActive ? '✅ YES' : '❌ NO (expired)');
      console.log('   Expires:', activeUntil.toISOString());

      if (isActive) {
        const daysLeft = Math.ceil((activeUntil - now) / (1000 * 60 * 60 * 24));
        console.log('   Days remaining:', daysLeft);
      }
    } else {
      console.log('\n📅 Account Status: ❌ INACTIVE (no expiration date set)');
    }

    // If we have a customer ID, fetch Stripe data
    if (user.stripe_customer_id) {
      console.log('\n🔗 Fetching Stripe customer data...');
      try {
        const customer = await stripe.customers.retrieve(user.stripe_customer_id);
        console.log('   Customer Name:', customer.name || 'Not set');
        console.log('   Customer Email:', customer.email);
        console.log('   Default Payment Method:', customer.invoice_settings?.default_payment_method || 'None');

        if (user.stripe_subscription_id) {
          console.log('\n📊 Fetching Stripe subscription data...');
          const subscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
          console.log('   Status:', subscription.status);
          console.log('   Current Period End:', new Date(subscription.current_period_end * 1000).toISOString());
          console.log('   Cancel At Period End:', subscription.cancel_at_period_end ? 'YES' : 'NO');
        }
      } catch (stripeError) {
        console.error('   ⚠️  Could not fetch Stripe data:', stripeError.message);
      }
    }

  } catch (error) {
    console.error('❌ Error checking user:', error.message);
    process.exit(1);
  }
}

/**
 * Show help
 */
function showHelp() {
  console.log('Stripe Webhook Testing Script\n');
  console.log('Commands:');
  console.log('  create-session [email]   Create a test checkout session');
  console.log('                          Optional: specify customer email');
  console.log('  trigger-event           Trigger a test webhook event via Stripe CLI');
  console.log('  check-user <email>      Check user record in database');
  console.log('  help                    Show this help message');
  console.log('\nExamples:');
  console.log('  node scripts/test-webhook.js create-session');
  console.log('  node scripts/test-webhook.js create-session test@example.com');
  console.log('  node scripts/test-webhook.js trigger-event');
  console.log('  node scripts/test-webhook.js check-user test@example.com');
  console.log('\nPrerequisites:');
  console.log('  - STRIPE_SECRET_KEY in .env.local');
  console.log('  - NEXT_PUBLIC_SUPABASE_URL in .env.local');
  console.log('  - SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.log('  - Dev server running: npm run dev:with-webhooks');
}

// Main execution
(async () => {
  switch (command) {
    case 'create-session':
      await createTestSession();
      break;
    case 'trigger-event':
      await triggerTestEvent();
      break;
    case 'check-user':
      await checkUser(arg);
      break;
    case 'help':
    default:
      showHelp();
      break;
  }

  process.exit(0);
})();
