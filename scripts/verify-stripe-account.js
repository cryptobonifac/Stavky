// Script to verify Stripe account connection and list products/prices
// Run with: node scripts/verify-stripe-account.js

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

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

console.log('\n🔍 Verifying Stripe Account Connection...\n');
console.log(`Mode: ${isTestMode ? 'TEST' : isLiveMode ? 'LIVE' : 'UNKNOWN'}`);
console.log(`Secret Key: ${stripeSecretKey.substring(0, 20)}...\n`);

async function verifyAccount() {
  try {
    // Test API connection by retrieving account info
    const account = await stripe.accounts.retrieve();
    console.log('✅ Successfully connected to Stripe account');
    console.log(`   Account ID: ${account.id}`);
    console.log(`   Country: ${account.country || 'N/A'}`);
    console.log(`   Email: ${account.email || 'N/A'}\n`);

    // List all products
    console.log('📦 Fetching products...');
    const products = await stripe.products.list({ limit: 100 });
    console.log(`   Found ${products.data.length} product(s)\n`);

    if (products.data.length === 0) {
      console.log('⚠️  No products found. Creating sample products...\n');
      
      // Create a one-time product
      console.log('Creating one-time product...');
      const oneTimeProduct = await stripe.products.create({
        name: 'One-Time Purchase',
        description: 'Full access to all features - one-time payment',
      });
      
      const oneTimePrice = await stripe.prices.create({
        product: oneTimeProduct.id,
        unit_amount: 2999, // $29.99
        currency: 'usd',
      });
      
      console.log(`✅ Created one-time product: ${oneTimeProduct.name}`);
      console.log(`   Product ID: ${oneTimeProduct.id}`);
      console.log(`   Price ID: ${oneTimePrice.id}`);
      console.log(`   Amount: $29.99 USD\n`);

      // Create a subscription product
      console.log('Creating subscription product...');
      const subscriptionProduct = await stripe.products.create({
        name: 'Monthly Subscription',
        description: 'Monthly premium subscription',
      });
      
      const subscriptionPrice = await stripe.prices.create({
        product: subscriptionProduct.id,
        unit_amount: 999, // $9.99
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
      });
      
      console.log(`✅ Created subscription product: ${subscriptionProduct.name}`);
      console.log(`   Product ID: ${subscriptionProduct.id}`);
      console.log(`   Price ID: ${subscriptionPrice.id}`);
      console.log(`   Amount: $9.99 USD per month\n`);

      console.log('\n📋 UPDATE YOUR .env.local FILE:\n');
      console.log('='.repeat(80));
      console.log(`NEXT_PUBLIC_ONE_TIME_PRICE_ID=${oneTimePrice.id}`);
      console.log(`NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID=${subscriptionPrice.id}`);
      console.log('='.repeat(80));
      console.log('\n💡 Copy these Price IDs to your .env.local file and restart your dev server.\n');
      
      return;
    }

    // List all products with their prices
    console.log('📋 Products and Prices:\n');
    console.log('='.repeat(80));
    
    for (const product of products.data) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Active: ${product.active ? 'Yes' : 'No'}`);
      console.log(`   Livemode: ${product.livemode ? 'LIVE' : 'TEST'}`);
      
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 100,
      });
      
      if (prices.data.length > 0) {
        console.log(`\n   💰 Prices:`);
        prices.data.forEach((price, index) => {
          const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
          const currency = price.currency?.toUpperCase() || '';
          const recurring = price.recurring 
            ? `${price.recurring.interval}ly`
            : 'One-time';
          
          console.log(`\n   ${index + 1}. ${price.id}`);
          console.log(`      Amount: ${amount} ${currency}`);
          console.log(`      Type: ${recurring}`);
          console.log(`      Active: ${price.active ? 'Yes' : 'No'}`);
          console.log(`      Livemode: ${price.livemode ? 'LIVE' : 'TEST'}`);
        });
      } else {
        console.log(`   ⚠️  No prices found`);
      }
      
      console.log('\n' + '-'.repeat(80));
    }

    // Show copy-paste ready format
    console.log('\n\n📋 COPY-PASTE READY FOR .env.local:\n');
    console.log('='.repeat(80));
    
    let foundOneTime = false;
    let foundSubscription = false;
    
    for (const product of products.data) {
      const prices = await stripe.prices.list({
        product: product.id,
        limit: 100,
      });
      
      prices.data.forEach(price => {
        if (price.active && ((isTestMode && !price.livemode) || (isLiveMode && price.livemode))) {
          const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
          const currency = price.currency?.toUpperCase() || '';
          
          if (price.recurring && !foundSubscription) {
            console.log(`NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID=${price.id}  # ${product.name} - ${amount} ${currency} per ${price.recurring.interval}`);
            foundSubscription = true;
          } else if (!price.recurring && !foundOneTime) {
            console.log(`NEXT_PUBLIC_ONE_TIME_PRICE_ID=${price.id}  # ${product.name} - ${amount} ${currency}`);
            foundOneTime = true;
          }
        }
      });
    }
    
    if (!foundOneTime || !foundSubscription) {
      console.log('\n⚠️  Not all price types found. You may need to create missing products.');
    }
    
    console.log('='.repeat(80));
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Authentication failed. Your STRIPE_SECRET_KEY might be:');
      console.error('   - Invalid or expired');
      console.error('   - From a different Stripe account');
      console.error('   - Missing required permissions');
      console.error('\n   Get a new key from: https://dashboard.stripe.com/test/apikeys');
    } else if (error.type === 'StripeAPIError') {
      console.error('\n💡 Stripe API error:', error.code);
    }
    console.error('\n   Full error:', error);
    process.exit(1);
  }
}

verifyAccount().catch(console.error);








