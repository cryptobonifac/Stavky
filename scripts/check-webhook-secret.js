#!/usr/bin/env node

/**
 * Check if STRIPE_WEBHOOK_SECRET is configured correctly
 * Compares with current stripe listen output if available
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔍 Checking Stripe Webhook Secret Configuration\n');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  console.log('   Expected location:', envPath);
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let webhookSecret = null;
let secretKey = null;
let sandboxKey = null;

envLines.forEach((line, index) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('STRIPE_WEBHOOK_SECRET=')) {
    webhookSecret = trimmed.split('=')[1]?.trim().replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('STRIPE_SECRET_KEY=')) {
    secretKey = trimmed.split('=')[1]?.trim().replace(/^["']|["']$/g, '');
  }
  if (trimmed.startsWith('STRIPE_SANDBOX_API_KEY=')) {
    sandboxKey = trimmed.split('=')[1]?.trim().replace(/^["']|["']$/g, '');
  }
});

console.log('📋 Configuration Status:');
console.log('   STRIPE_WEBHOOK_SECRET:', webhookSecret ? `✅ Set (${webhookSecret.substring(0, 10)}...)` : '❌ NOT SET');
console.log('   STRIPE_SECRET_KEY:', secretKey ? `✅ Set (${secretKey.substring(0, 10)}...)` : '❌ NOT SET');
console.log('   STRIPE_SANDBOX_API_KEY:', sandboxKey ? `✅ Set (${sandboxKey.substring(0, 10)}...)` : '❌ NOT SET');

if (!webhookSecret) {
  console.error('\n❌ STRIPE_WEBHOOK_SECRET is not set in .env.local');
  console.log('\n💡 Solution:');
  console.log('   1. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
  console.log('   2. Copy the webhook secret from the output (starts with whsec_)');
  console.log('   3. Add to .env.local: STRIPE_WEBHOOK_SECRET=whsec_xxxxx');
  console.log('   4. Restart Next.js dev server');
  process.exit(1);
}

// Validate format
if (!webhookSecret.startsWith('whsec_')) {
  console.warn('\n⚠️  WARNING: Webhook secret should start with "whsec_"');
  console.log('   Current value starts with:', webhookSecret.substring(0, 10));
}

// Check if keys match (for sandbox)
if (secretKey && sandboxKey && secretKey !== sandboxKey) {
  console.warn('\n⚠️  WARNING: STRIPE_SECRET_KEY and STRIPE_SANDBOX_API_KEY do not match');
  console.log('   If using Sandbox, they should be the same key');
}

console.log('\n✅ Webhook secret is configured');
console.log('\n💡 Next Steps:');
console.log('   1. Make sure stripe listen is running');
console.log('   2. Verify the webhook secret matches the output from stripe listen');
console.log('   3. Check Next.js terminal for signature verification errors');
console.log('   4. If using Sandbox, ensure stripe listen uses --api-key flag');
