// Quick script to verify environment variables are set
// Run with: node scripts/check-env-vars.js

require('dotenv').config({ path: '.env.local' });

const requiredVars = [
  'NEXT_PUBLIC_ONE_TIME_PRICE_ID',
  'NEXT_PUBLIC_SUBSCRIPTION_PRICE_ID',
];

console.log('\n🔍 Checking Stripe Price ID Environment Variables...\n');

let allSet = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    const isValid = value.startsWith('price_') && value.length > 10;
    console.log(`✅ ${varName}`);
    console.log(`   Value: ${value.substring(0, 15)}...`);
    console.log(`   Valid: ${isValid ? '✅ Yes' : '❌ No (must start with "price_")'}`);
    if (!isValid) allSet = false;
  } else {
    console.log(`❌ ${varName} - NOT SET`);
    allSet = false;
  }
  console.log('');
});

if (allSet) {
  console.log('✅ All environment variables are set correctly!');
  console.log('💡 Remember to restart your dev server: npm run dev\n');
} else {
  console.log('❌ Some environment variables are missing or invalid.');
  console.log('💡 Add them to your .env.local file in the project root.\n');
}




