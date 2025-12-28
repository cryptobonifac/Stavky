// Script to help set up monthly and yearly subscription price IDs
// Run with: node tmp/setup-subscription-prices.js

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

// Simple .env.local parser
// Note: If a key appears multiple times, the last value wins
function parseEnvFile(filePath) {
  const env = {};
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const withoutComment = trimmed.split(/(?<!#)#/)[0].trim();
        const match = withoutComment.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          // Always use the last value if key appears multiple times
          env[key] = value;
        }
      }
    });
  }
  return env;
}

const envPath = path.join(__dirname, '..', '.env.local');
const env = parseEnvFile(envPath);

const stripeSecretKey = env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY is not set in .env.local');
  console.error('   Please add your Stripe secret key (starts with sk_test_ or sk_live_)');
  process.exit(1);
}

// Check if it's a valid API key (not a webhook secret)
if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
  console.error('❌ STRIPE_SECRET_KEY appears to be invalid.');
  console.error('   It should start with "sk_test_" (test mode) or "sk_live_" (live mode)');
  console.error('   Current value starts with:', stripeSecretKey.substring(0, 10) + '...');
  console.error('\n💡 To fix:');
  console.error('   1. Go to https://dashboard.stripe.com/test/apikeys (for test mode)');
  console.error('   2. Or https://dashboard.stripe.com/apikeys (for live mode)');
  console.error('   3. Copy the "Secret key" (not the webhook secret)');
  console.error('   4. Update STRIPE_SECRET_KEY in .env.local\n');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

const isTestMode = stripeSecretKey.startsWith('sk_test_');

console.log('\n📋 Finding subscription prices in your Stripe account...\n');
console.log(`Mode: ${isTestMode ? 'TEST' : 'LIVE'}\n`);

async function findSubscriptionPrices() {
  try {
    const prices = await stripe.prices.list({ 
      limit: 100,
      active: true,
    });
    
    // Filter for recurring subscription prices
    const subscriptionPrices = prices.data.filter(price => 
      price.recurring && 
      price.type === 'recurring' &&
      price.active
    );
    
    if (subscriptionPrices.length === 0) {
      console.log('❌ No active subscription prices found in your Stripe account.');
      console.log('\n💡 To create subscription prices:');
      console.log('   1. Go to https://dashboard.stripe.com/test/products');
      console.log('   2. Click "+ Add product"');
      console.log('   3. Set name, price, and billing period (month or year)');
      console.log('   4. Make sure "Recurring" is selected');
      console.log('   5. Save and copy the Price ID\n');
      return;
    }
    
    console.log(`✅ Found ${subscriptionPrices.length} active subscription price(s):\n`);
    
    const monthlyPrices = [];
    const yearlyPrices = [];
    
    subscriptionPrices.forEach((price, index) => {
      const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
      const currency = price.currency?.toUpperCase() || '';
      const interval = price.recurring?.interval || 'unknown';
      const intervalCount = price.recurring?.interval_count || 1;
      
      console.log(`${index + 1}. ${price.id}`);
      console.log(`   Product: ${price.product}`);
      console.log(`   Amount: ${amount} ${currency}`);
      console.log(`   Billing: Every ${intervalCount} ${interval}(s)`);
      console.log(`   Livemode: ${price.livemode ? 'LIVE' : 'TEST'}`);
      
      // Check mode mismatch
      if (isTestMode && price.livemode) {
        console.log(`   ⚠️  WARNING: This is a LIVE mode price, but you're using TEST mode keys!`);
      } else if (!isTestMode && !price.livemode) {
        console.log(`   ⚠️  WARNING: This is a TEST mode price, but you're using LIVE mode keys!`);
      }
      
      // Categorize by interval
      if (interval === 'month' && intervalCount === 1) {
        monthlyPrices.push(price);
        console.log(`   ✅ Identified as MONTHLY subscription`);
      } else if (interval === 'year' && intervalCount === 1) {
        yearlyPrices.push(price);
        console.log(`   ✅ Identified as YEARLY subscription`);
      }
      
      console.log('');
    });
    
    console.log('\n📊 Summary:');
    console.log(`   Monthly prices found: ${monthlyPrices.length}`);
    console.log(`   Yearly prices found: ${yearlyPrices.length}\n`);
    
    // Update .env.local
    const updatedEnv = { ...env };
    let updated = false;
    
    if (monthlyPrices.length > 0) {
      const selectedMonthly = monthlyPrices[0]; // Use first monthly price
      if (env.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID !== selectedMonthly.id) {
        updatedEnv.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID = selectedMonthly.id;
        updated = true;
        console.log(`✅ Setting NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID=${selectedMonthly.id}`);
      } else {
        console.log(`✅ NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID is already set correctly`);
      }
    } else {
      console.log(`⚠️  No monthly subscription price found. You'll need to create one.`);
    }
    
    if (yearlyPrices.length > 0) {
      const selectedYearly = yearlyPrices[0]; // Use first yearly price
      if (env.NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID !== selectedYearly.id) {
        updatedEnv.NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID = selectedYearly.id;
        updated = true;
        console.log(`✅ Setting NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID=${selectedYearly.id}`);
      } else {
        console.log(`✅ NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID is already set correctly`);
      }
    } else {
      console.log(`⚠️  No yearly subscription price found. You'll need to create one.`);
    }
    
    if (updated) {
      // Update .env.local file
      const currentEnv = parseEnvFile(envPath);
      const newEnv = { ...currentEnv, ...updatedEnv };
      
      // Read current file
      let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      
      // Remove old subscription price ID variables
      content = content.split('\n').filter(line => {
        const trimmed = line.trim();
        return !trimmed.startsWith('NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID=') &&
               !trimmed.startsWith('NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID=');
      }).join('\n');
      
      // Add new variables
      if (updatedEnv.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID) {
        content += `\nNEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID=${updatedEnv.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID}`;
      }
      if (updatedEnv.NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID) {
        content += `\nNEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID=${updatedEnv.NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID}`;
      }
      
      fs.writeFileSync(envPath, content + '\n', 'utf8');
      console.log('\n✅ Updated .env.local file!');
      console.log('\n💡 Next steps:');
      console.log('   1. Restart your development server (npm run dev)');
      console.log('   2. Refresh your checkout page');
      console.log('   3. The prices should now be displayed correctly\n');
    } else if (monthlyPrices.length === 0 || yearlyPrices.length === 0) {
      console.log('\n⚠️  You need to create missing subscription prices in Stripe:');
      if (monthlyPrices.length === 0) {
        console.log('   - Create a monthly subscription (billing interval: month)');
      }
      if (yearlyPrices.length === 0) {
        console.log('   - Create a yearly subscription (billing interval: year)');
      }
      console.log('\n   Then run this script again to automatically configure them.\n');
    } else {
      console.log('\n✅ All subscription price IDs are already configured correctly!\n');
    }
    
  } catch (error) {
    console.error('❌ Error fetching prices:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Your STRIPE_SECRET_KEY might be invalid. Check your .env.local file.');
    }
    process.exit(1);
  }
}

findSubscriptionPrices().catch(console.error);
