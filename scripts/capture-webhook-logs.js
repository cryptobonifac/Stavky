/**
 * Script to help capture and analyze webhook logs
 * This script monitors the webhook endpoint and provides analysis
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'webhook-logs.jsonl');

// Create log file if it doesn't exist
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, '');
}

console.log('📋 Webhook Log Capture Tool');
console.log('='.repeat(80));
console.log('This tool helps you capture webhook logs.');
console.log('');
console.log('To view webhook logs:');
console.log('1. Check your terminal where "npm run dev" is running');
console.log('2. Look for logs starting with: 🔔 WEBHOOK EVENT RECEIVED');
console.log('3. Copy those logs and share them');
console.log('');
console.log('Alternatively, you can:');
console.log('1. Check Stripe Dashboard → Developers → Webhooks → Events');
console.log('2. Look for checkout.session.completed events');
console.log('3. Click on an event to see the request/response');
console.log('');
console.log('To test webhook locally:');
console.log('1. Make sure Stripe CLI is running:');
console.log('   stripe listen --forward-to localhost:3000/api/webhooks/stripe');
console.log('2. Make a test payment');
console.log('3. Check both terminals (Stripe CLI and Next.js dev server)');
console.log('');
console.log('Log file location:', LOG_FILE);
console.log('='.repeat(80));

// Provide analysis of what to look for
console.log('\n📊 What to Look For in Logs:\n');

const analysisGuide = {
  'Webhook Received': {
    pattern: '🔔 WEBHOOK EVENT RECEIVED',
    meaning: 'Webhook endpoint was called',
    action: 'If missing, webhook is not being called'
  },
  'Checkout Completed': {
    pattern: '✅ CHECKOUT SESSION COMPLETED',
    meaning: 'Payment was successful',
    action: 'Check payment_status value'
  },
  'Email Found': {
    pattern: '📧 EMAIL LOCATIONS',
    meaning: 'Email extraction from Stripe session',
    action: 'Verify email matches database email exactly'
  },
  'User Found': {
    pattern: '✅ USER FOUND IN DATABASE',
    meaning: 'User lookup succeeded',
    action: 'If missing, user not found - check email match'
  },
  'Database Update': {
    pattern: '✅ DATABASE UPDATE SUCCESSFUL',
    meaning: 'Account activation succeeded',
    action: 'If missing, check for error messages'
  },
  'Activation Skipped': {
    pattern: '⚠️  ACCOUNT ACTIVATION SKIPPED',
    meaning: 'Activation conditions not met',
    action: 'Check why conditions failed (mode, email, payment_status)'
  }
};

Object.entries(analysisGuide).forEach(([key, value]) => {
  console.log(`\n${key}:`);
  console.log(`  Pattern: ${value.pattern}`);
  console.log(`  Meaning: ${value.meaning}`);
  console.log(`  Action: ${value.action}`);
});

console.log('\n' + '='.repeat(80));
console.log('💡 TIP: Copy logs from your terminal and paste them for analysis');
console.log('='.repeat(80) + '\n');
