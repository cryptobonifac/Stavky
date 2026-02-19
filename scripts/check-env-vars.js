// Quick script to verify Polar environment variables are set
// Run with: node scripts/check-env-vars.js

require('dotenv').config({ path: '.env.local' });

const requiredVars = [
  'POLAR_ACCESS_TOKEN',
  'POLAR_ORGANIZATION_ID',
  'POLAR_WEBHOOK_SECRET',
  'POLAR_MONTHLY_PRODUCT_ID',
  'POLAR_YEARLY_PRODUCT_ID',
  'POLAR_ENVIRONMENT',
];

console.log('\n🔍 Checking Polar Environment Variables...\n');

let allSet = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value && value !== `your_${varName.toLowerCase().replace('polar_', '')}`) {
    const displayValue = varName.includes('SECRET') || varName.includes('TOKEN')
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
      : value;
    console.log(`✅ ${varName}`);
    console.log(`   Value: ${displayValue}`);
  } else {
    console.log(`❌ ${varName} - NOT SET or placeholder value`);
    allSet = false;
  }
  console.log('');
});

if (allSet) {
  console.log('✅ All Polar environment variables are set!');
  console.log('💡 Remember to restart your dev server: npm run dev\n');
} else {
  console.log('❌ Some environment variables are missing or still have placeholder values.');
  console.log('💡 Update them in your .env.local file with values from Polar dashboard.');
  console.log('   https://polar.sh/dashboard\n');
}
