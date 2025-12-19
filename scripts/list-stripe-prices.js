// Script to list all available Stripe Prices in your account
// Run with: node scripts/list-stripe-prices.js

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
        // Remove inline comments
        const withoutComment = trimmed.split(/(?<!#)#/)[0].trim();
        const match = withoutComment.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          env[key] = value;
        }
      }
    });
  }
  return env;
}

const env = parseEnvFile(path.join(__dirname, '..', '.env.local'));
const stripeSecretKey = env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY is not set in .env.local');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

const isTestMode = stripeSecretKey.startsWith('sk_test_');
const isLiveMode = stripeSecretKey.startsWith('sk_live_');

console.log('\n📋 Listing all Stripe Prices in your account...\n');
console.log(`Mode: ${isTestMode ? 'TEST' : isLiveMode ? 'LIVE' : 'UNKNOWN'}`);
console.log(`Secret Key: ${stripeSecretKey.substring(0, 20)}...\n`);

async function listAllPrices() {
  try {
    const prices = await stripe.prices.list({ limit: 100 });
    
    if (prices.data.length === 0) {
      console.log('❌ No prices found in your Stripe account.');
      console.log('\n💡 To create prices:');
      console.log('   1. Go to https://dashboard.stripe.com/test/products');
      console.log('   2. Click "+ Add product"');
      console.log('   3. Set name, price, and billing period');
      console.log('   4. Save and copy the Price ID\n');
      return;
    }

    console.log(`✅ Found ${prices.data.length} price(s):\n`);
    
    prices.data.forEach((price, index) => {
      const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
      const currency = price.currency?.toUpperCase() || '';
      const recurring = price.recurring 
        ? `${price.recurring.interval} (every ${price.recurring.interval_count} ${price.recurring.interval})`
        : 'One-time';
      
      console.log(`${index + 1}. ${price.id}`);
      console.log(`   Product: ${price.product}`);
      console.log(`   Amount: ${amount} ${currency}`);
      console.log(`   Type: ${recurring}`);
      console.log(`   Active: ${price.active ? 'Yes' : 'No'}`);
      console.log(`   Livemode: ${price.livemode ? 'LIVE' : 'TEST'}`);
      
      // Check mode mismatch
      if (isTestMode && price.livemode) {
        console.log(`   ⚠️  WARNING: This is a LIVE mode price, but you're using TEST mode keys!`);
      } else if (isLiveMode && !price.livemode) {
        console.log(`   ⚠️  WARNING: This is a TEST mode price, but you're using LIVE mode keys!`);
      }
      console.log('');
    });

    console.log('\n💡 Copy the Price ID(s) you want to use and update your .env.local file:\n');
    console.log('   NEXT_PUBLIC_ONE_TIME_PRICE_ID=price_xxxxx  # For one-time payments');
    console.log('   NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID=price_xxxxx  # For recurring subscriptions\n');

  } catch (error) {
    console.error('❌ Error listing prices:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Your STRIPE_SECRET_KEY might be invalid. Check your .env.local file.');
    }
    process.exit(1);
  }
}

listAllPrices().catch(console.error);

