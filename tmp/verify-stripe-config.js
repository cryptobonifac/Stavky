// Quick verification script to check Stripe configuration
// Run after updating STRIPE_SECRET_KEY in .env.local

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

function parseEnvFile(filePath) {
  const env = {};
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Read line by line - last occurrence of a key wins (handles duplicates)
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

console.log('\n🔍 Verifying Stripe Configuration...\n');

// Check STRIPE_SECRET_KEY
const secretKey = env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.log('❌ STRIPE_SECRET_KEY is not set');
  process.exit(1);
}

if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
  console.log('❌ STRIPE_SECRET_KEY is invalid (should start with sk_test_ or sk_live_)');
  console.log(`   Current value starts with: ${secretKey.substring(0, 10)}...`);
  process.exit(1);
}

console.log('✅ STRIPE_SECRET_KEY format is correct');

// Check price IDs
const monthlyPriceId = env.NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID;
const yearlyPriceId = env.NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID;

if (!monthlyPriceId) {
  console.log('⚠️  NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID is not set');
} else {
  console.log(`✅ NEXT_PUBLIC_SUBSCRIPTION_MONTHLY_PRICE_ID is set: ${monthlyPriceId}`);
}

if (!yearlyPriceId) {
  console.log('⚠️  NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID is not set');
} else {
  console.log(`✅ NEXT_PUBLIC_SUBSCRIPTION_YEARLY_PRICE_ID is set: ${yearlyPriceId}`);
}

// Try to verify prices with Stripe API
if (monthlyPriceId || yearlyPriceId) {
  console.log('\n🔗 Verifying price IDs with Stripe API...\n');
  
  const stripe = new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover',
  });
  
  async function verifyPrice(priceId, name) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log(`✅ ${name} is valid:`);
      console.log(`   Amount: ${price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A'} ${price.currency?.toUpperCase() || ''}`);
      console.log(`   Interval: ${price.recurring?.interval || 'N/A'}`);
      console.log(`   Active: ${price.active ? 'Yes' : 'No'}`);
      return true;
    } catch (error) {
      console.log(`❌ ${name} is invalid: ${error.message}`);
      return false;
    }
  }
  
  (async () => {
    const results = [];
    if (monthlyPriceId) {
      results.push(await verifyPrice(monthlyPriceId, 'Monthly Price'));
    }
    if (yearlyPriceId) {
      results.push(await verifyPrice(yearlyPriceId, 'Yearly Price'));
    }
    
    console.log('\n📊 Summary:');
    if (results.every(r => r)) {
      console.log('✅ All configured price IDs are valid!');
      console.log('\n💡 Next steps:');
      console.log('   1. Restart your dev server: npm run dev');
      console.log('   2. Refresh the checkout page');
      console.log('   3. Prices should now display correctly\n');
    } else {
      console.log('❌ Some price IDs are invalid. Please check your Stripe dashboard.\n');
    }
  })();
} else {
  console.log('\n⚠️  No price IDs configured. Run: node tmp/setup-subscription-prices.js\n');
}
