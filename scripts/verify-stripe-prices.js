// Script to verify Stripe Price IDs exist in your account
// Run with: node scripts/verify-stripe-prices.js
// Note: This script reads from .env.local manually since dotenv may not be installed

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

// Simple .env.local parser
function parseEnvFile(filePath) {
  const env = {};
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        // Remove inline comments (everything after # that's not in quotes)
        const withoutComment = trimmed.split(/(?<!#)#/)[0].trim();
        const match = withoutComment.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
          env[key] = value;
        }
      }
    });
  }
  return env;
}

const env = parseEnvFile(path.join(__dirname, '..', '.env.local'));

const stripeSecretKey = env.STRIPE_SECRET_KEY;
const oneTimePriceId = env.NEXT_PUBLIC_ONE_TIME_PRICE_ID;
const subscriptionPriceId = env.NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY is not set in .env.local');
  process.exit(1);
}

if (!oneTimePriceId || !subscriptionPriceId) {
  console.error('❌ Price IDs are not set in .env.local');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

const isTestMode = stripeSecretKey.startsWith('sk_test_');
const isLiveMode = stripeSecretKey.startsWith('sk_live_');

console.log('\n🔍 Verifying Stripe Price IDs...\n');
console.log(`Mode: ${isTestMode ? 'TEST' : isLiveMode ? 'LIVE' : 'UNKNOWN'}`);
console.log(`Secret Key: ${stripeSecretKey.substring(0, 20)}...\n`);

async function verifyPrice(priceId, name) {
  try {
    console.log(`Checking ${name}: ${priceId}`);
    const price = await stripe.prices.retrieve(priceId);
    
    console.log(`✅ ${name} FOUND:`);
    console.log(`   - ID: ${price.id}`);
    console.log(`   - Amount: ${price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A'} ${price.currency?.toUpperCase() || ''}`);
    console.log(`   - Type: ${price.type}`);
    console.log(`   - Recurring: ${price.recurring ? `${price.recurring.interval} (${price.recurring.interval_count}x)` : 'One-time'}`);
    console.log(`   - Active: ${price.active ? 'Yes' : 'No'}`);
    console.log(`   - Livemode: ${price.livemode ? 'LIVE' : 'TEST'}`);
    
    // Check mode mismatch
    if (isTestMode && price.livemode) {
      console.log(`   ⚠️  WARNING: You're using TEST mode keys but this price is from LIVE mode!`);
    } else if (isLiveMode && !price.livemode) {
      console.log(`   ⚠️  WARNING: You're using LIVE mode keys but this price is from TEST mode!`);
    }
    
    console.log('');
    return { success: true, price };
  } catch (error) {
    if (error.code === 'resource_missing') {
      console.log(`❌ ${name} NOT FOUND in your Stripe account`);
      console.log(`   Error: ${error.message}\n`);
      return { success: false, error: 'not_found' };
    } else {
      console.log(`❌ Error checking ${name}: ${error.message}\n`);
      return { success: false, error: error.message };
    }
  }
}

async function main() {
  const results = await Promise.all([
    verifyPrice(oneTimePriceId, 'One-Time Price ID'),
    verifyPrice(subscriptionPriceId, 'Subscription Price ID'),
  ]);

  console.log('\n📊 Summary:');
  console.log(`   One-Time: ${results[0].success ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Subscription: ${results[1].success ? '✅ Valid' : '❌ Invalid'}\n`);

  if (results[0].success && results[1].success) {
    console.log('✅ All Price IDs are valid! Your checkout should work.\n');
  } else {
    console.log('❌ Some Price IDs are invalid. Please:');
    console.log('   1. Go to Stripe Dashboard → Products');
    console.log(`   2. Make sure you're in ${isTestMode ? 'TEST' : 'LIVE'} mode`);
    console.log('   3. Find your products and copy the correct Price IDs');
    console.log('   4. Update your .env.local file\n');
    process.exit(1);
  }
}

main().catch(console.error);

