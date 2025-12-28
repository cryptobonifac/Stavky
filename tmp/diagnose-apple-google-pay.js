// Diagnostic script to check Apple Pay and Google Pay configuration
// Run with: node tmp/diagnose-apple-google-pay.js

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

const envPath = path.join(__dirname, '..', '.env.local');
const env = parseEnvFile(envPath);

const stripeSecretKey = env.STRIPE_SECRET_KEY;
const publishableKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

console.log('\n🔍 Diagnosing Apple Pay and Google Pay Configuration...\n');

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY is not set');
  process.exit(1);
}

if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
  console.error('❌ STRIPE_SECRET_KEY is invalid');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
});

const isTestMode = stripeSecretKey.startsWith('sk_test_');

console.log(`Mode: ${isTestMode ? 'TEST' : 'LIVE'}`);
console.log(`Publishable Key: ${publishableKey ? publishableKey.substring(0, 20) + '...' : 'NOT SET'}\n`);

async function checkPaymentMethods() {
  try {
    console.log('📋 Checking Payment Methods in Stripe Dashboard...\n');
    
    // Get account information
    const account = await stripe.accounts.retrieve();
    console.log(`Account ID: ${account.id}`);
    console.log(`Country: ${account.country || 'N/A'}`);
    console.log(`Type: ${account.type || 'N/A'}\n`);
    
    // Check payment method settings
    console.log('💳 Payment Method Requirements:\n');
    console.log('1. ✅ Ensure Apple Pay is enabled in Stripe Dashboard:');
    console.log('   https://dashboard.stripe.com/settings/payment_methods');
    console.log('   → Toggle "Apple Pay" to ON\n');
    
    console.log('2. ✅ Ensure Google Pay is enabled in Stripe Dashboard:');
    console.log('   https://dashboard.stripe.com/settings/payment_methods');
    console.log('   → Toggle "Google Pay" to ON\n');
    
    console.log('3. 🌐 Domain Verification (Apple Pay only):');
    console.log('   https://dashboard.stripe.com/settings/payment_methods/apple_pay');
    console.log('   → Add your domain and upload verification file\n');
    
    console.log('4. 🔒 HTTPS Requirements:');
    console.log('   - Production: Must use HTTPS');
    console.log('   - Development: localhost works without HTTPS\n');
    
    console.log('5. 📱 Browser/Device Requirements:');
    console.log('   Apple Pay:');
    console.log('   - Safari on macOS 10.14.1+ or iOS 12.1+');
    console.log('   - Valid card in Apple Wallet');
    console.log('   - Supported countries only\n');
    console.log('   Google Pay:');
    console.log('   - Chrome 61+ or Safari');
    console.log('   - Valid card in Google Pay account');
    console.log('   - Supported countries only\n');
    
    console.log('6. 🧪 Testing Checklist:');
    console.log('   □ Payment methods enabled in Stripe Dashboard');
    console.log('   □ Domain verified (for Apple Pay in production)');
    console.log('   □ Using HTTPS (or localhost for dev)');
    console.log('   □ Testing on supported browser/device');
    console.log('   □ Card added to Apple Wallet/Google Pay');
    console.log('   □ Using supported country\n');
    
    console.log('💡 Note: Apple Pay and Google Pay appear automatically in Stripe Checkout');
    console.log('   when all conditions are met. They are NOT explicitly configured in code.\n');
    
    console.log('📝 Current Checkout Configuration:');
    console.log('   payment_method_types: ["card", "link"]');
    console.log('   → Apple Pay and Google Pay will appear automatically when available\n');
    
    console.log('🔗 Useful Links:');
    console.log('   - Payment Methods Settings: https://dashboard.stripe.com/settings/payment_methods');
    console.log('   - Apple Pay Setup: https://dashboard.stripe.com/settings/payment_methods/apple_pay');
    console.log('   - Stripe Apple Pay Docs: https://docs.stripe.com/apple-pay');
    console.log('   - Stripe Google Pay Docs: https://docs.stripe.com/google-pay\n');
    
  } catch (error) {
    console.error('❌ Error checking configuration:', error.message);
    process.exit(1);
  }
}

checkPaymentMethods().catch(console.error);

