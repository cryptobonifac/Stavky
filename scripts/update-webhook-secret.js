#!/usr/bin/env node

/**
 * Update STRIPE_WEBHOOK_SECRET in .env.local
 * 
 * Usage:
 *   node scripts/update-webhook-secret.js whsec_xxxxx
 * 
 * Or pipe from stripe listen:
 *   stripe listen | grep whsec_ | node scripts/update-webhook-secret.js
 */

const fs = require('fs');
const path = require('path');

const webhookSecret = process.argv[2];

if (!webhookSecret) {
  console.error('❌ Error: Webhook secret required');
  console.log('\nUsage:');
  console.log('  node scripts/update-webhook-secret.js whsec_xxxxx');
  console.log('\nExample:');
  console.log('  node scripts/update-webhook-secret.js whsec_c6818e7c17afaa731fa76864760b12cdd8de8c0579b4a60a420fc37c5ae127f1');
  process.exit(1);
}

if (!webhookSecret.startsWith('whsec_')) {
  console.error('❌ Error: Webhook secret must start with "whsec_"');
  console.log('   Provided:', webhookSecret.substring(0, 20) + '...');
  process.exit(1);
}

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local file not found');
  console.log('   Expected location:', envPath);
  process.exit(1);
}

// Read current .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let updated = false;
let found = false;

const newLines = lines.map((line, index) => {
  const trimmed = line.trim();
  
  if (trimmed.startsWith('STRIPE_WEBHOOK_SECRET=')) {
    found = true;
    const oldValue = trimmed.split('=')[1]?.trim().replace(/^["']|["']$/g, '');
    
    if (oldValue === webhookSecret) {
      console.log('✅ Webhook secret already matches');
      console.log('   Current:', oldValue.substring(0, 20) + '...');
      return line; // No change needed
    }
    
    updated = true;
    console.log('📝 Updating webhook secret:');
    console.log('   Old:', oldValue ? oldValue.substring(0, 20) + '...' : 'NOT SET');
    console.log('   New:', webhookSecret.substring(0, 20) + '...');
    
    return `STRIPE_WEBHOOK_SECRET=${webhookSecret}`;
  }
  
  return line;
});

if (!found) {
  // Add new line if not found
  console.log('📝 Adding new STRIPE_WEBHOOK_SECRET to .env.local');
  newLines.push(`STRIPE_WEBHOOK_SECRET=${webhookSecret}`);
  updated = true;
}

if (updated) {
  // Write back to file
  fs.writeFileSync(envPath, newLines.join('\n'), 'utf8');
  console.log('\n✅ .env.local updated successfully!');
  console.log('\n⚠️  IMPORTANT: Restart Next.js dev server for changes to take effect');
  console.log('   1. Stop server (Ctrl+C)');
  console.log('   2. Run: npm run dev');
} else {
  console.log('\n✅ No changes needed');
}
