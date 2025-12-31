import { stripe } from '@/lib/stripe/stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function backfillSubscriptionPlanTypes() {
  console.log('🔄 Starting backfill of subscription plan types...\n');

  // Fetch all customers with stripe_subscription_id
  const { data: customers, error } = await supabase
    .from('users')
    .select('id, email, stripe_subscription_id, subscription_plan_type')
    .not('stripe_subscription_id', 'is', null);

  if (error) {
    console.error('❌ Error fetching customers:', error);
    return;
  }

  if (!customers || customers.length === 0) {
    console.log('✅ No customers with active subscriptions to backfill');
    return;
  }

  console.log(`📊 Found ${customers.length} customers with stripe_subscription_id\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const customer of customers) {
    // Skip if plan type already exists
    if (customer.subscription_plan_type) {
      console.log(`⏭️  ${customer.email} - already has plan type: ${customer.subscription_plan_type}`);
      skipped++;
      continue;
    }

    try {
      // Fetch subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(customer.stripe_subscription_id);
      const interval = subscription.items.data[0]?.price?.recurring?.interval;

      let planType: 'monthly' | 'yearly' | null = null;
      if (interval === 'month') {
        planType = 'monthly';
      } else if (interval === 'year') {
        planType = 'yearly';
      }

      if (planType) {
        // Update database
        const { error: updateError } = await supabase
          .from('users')
          .update({ subscription_plan_type: planType })
          .eq('id', customer.id);

        if (updateError) {
          console.error(`❌ ${customer.email} - update failed:`, updateError.message);
          failed++;
        } else {
          console.log(`✅ ${customer.email} → ${planType}`);
          updated++;
        }
      } else {
        console.warn(`⚠️  ${customer.email} - unexpected interval: ${interval}`);
        failed++;
      }

      // Rate limit: wait 100ms between API calls to avoid hitting Stripe rate limits
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ ${customer.email} - error:`, error instanceof Error ? error.message : String(error));
      failed++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 BACKFILL SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped (already had plan type): ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total processed: ${customers.length}`);
  console.log('='.repeat(80) + '\n');
}

// Run the backfill
backfillSubscriptionPlanTypes()
  .then(() => {
    console.log('✅ Backfill completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Backfill failed:', error);
    process.exit(1);
  });
