// Script to list all Stripe Products and their Price IDs
// Run with: node scripts/list-stripe-products-and-prices.js

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

console.log('\n📋 Listing all Stripe Products and their Price IDs...\n');
console.log(`Mode: ${isTestMode ? 'TEST' : isLiveMode ? 'LIVE' : 'UNKNOWN'}`);
console.log(`Secret Key: ${stripeSecretKey.substring(0, 20)}...\n`);

async function listProductsAndPrices() {
  try {
    // List all products
    const products = await stripe.products.list({ limit: 100, expand: ['data.default_price'] });
    
    if (products.data.length === 0) {
      console.log('❌ No products found in your Stripe account.\n');
      return;
    }

    console.log(`✅ Found ${products.data.length} product(s):\n`);
    console.log('='.repeat(80));
    
    for (const product of products.data) {
      console.log(`\n📦 Product: ${product.name}`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Description: ${product.description || 'N/A'}`);
      console.log(`   Active: ${product.active ? 'Yes' : 'No'}`);
      console.log(`   Livemode: ${product.livemode ? 'LIVE' : 'TEST'}`);
      
      // Get all prices for this product
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 100,
      });
      
      if (prices.data.length === 0) {
        console.log(`   ⚠️  No prices found for this product`);
      } else {
        console.log(`\n   💰 Prices (${prices.data.length}):`);
        prices.data.forEach((price, index) => {
          const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
          const currency = price.currency?.toUpperCase() || '';
          const recurring = price.recurring 
            ? `${price.recurring.interval} (every ${price.recurring.interval_count} ${price.recurring.interval})`
            : 'One-time';
          
          console.log(`\n   ${index + 1}. Price ID: ${price.id}`);
          console.log(`      Amount: ${amount} ${currency}`);
          console.log(`      Type: ${recurring}`);
          console.log(`      Active: ${price.active ? 'Yes' : 'No'}`);
          console.log(`      Livemode: ${price.livemode ? 'LIVE' : 'TEST'}`);
          
          // Check mode mismatch
          if (isTestMode && price.livemode) {
            console.log(`      ⚠️  WARNING: This is a LIVE mode price!`);
          } else if (isLiveMode && !price.livemode) {
            console.log(`      ⚠️  WARNING: This is a TEST mode price!`);
          }
        });
      }
      
      console.log('\n' + '='.repeat(80));
    }

    // Summary with copy-paste ready Price IDs
    console.log('\n\n📋 COPY-PASTE READY PRICE IDs:\n');
    console.log('='.repeat(80));
    
    let oneTimePrices = [];
    let subscriptionPrices = [];
    
    for (const product of products.data) {
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 100,
      });
      
      prices.data.forEach(price => {
        if (price.active && ((isTestMode && !price.livemode) || (isLiveMode && price.livemode))) {
          if (price.recurring) {
            subscriptionPrices.push({
              id: price.id,
              amount: price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A',
              currency: price.currency?.toUpperCase() || '',
              interval: price.recurring.interval,
              product: product.name,
            });
          } else {
            oneTimePrices.push({
              id: price.id,
              amount: price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A',
              currency: price.currency?.toUpperCase() || '',
              product: product.name,
            });
          }
        }
      });
    }
    
    if (oneTimePrices.length > 0) {
      console.log('\n💳 ONE-TIME PRICES:');
      oneTimePrices.forEach((price, index) => {
        console.log(`\n   Option ${index + 1}:`);
        console.log(`   NEXT_PUBLIC_ONE_TIME_PRICE_ID=${price.id}`);
        console.log(`   # ${price.product} - ${price.amount} ${price.currency}`);
      });
    }
    
    if (subscriptionPrices.length > 0) {
      console.log('\n🔄 SUBSCRIPTION PRICES:');
      subscriptionPrices.forEach((price, index) => {
        console.log(`\n   Option ${index + 1}:`);
        console.log(`   NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID=${price.id}`);
        console.log(`   # ${price.product} - ${price.amount} ${price.currency} per ${price.interval}`);
      });
    }
    
    if (oneTimePrices.length === 0 && subscriptionPrices.length === 0) {
      console.log('\n   ⚠️  No active prices found in the correct mode.');
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n💡 Copy the Price IDs above and update your .env.local file\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Your STRIPE_SECRET_KEY might be invalid. Check your .env.local file.');
    } else if (error.type === 'StripeAPIError') {
      console.error('\n💡 Stripe API error. Check your internet connection and Stripe account status.');
    }
    process.exit(1);
  }
}

listProductsAndPrices().catch(console.error);

