#!/usr/bin/env node

/**
 * Helper script to start Next.js dev server with Stripe webhook forwarding
 * 
 * Usage:
 *   node scripts/start-dev-with-webhooks.js    # Reads STRIPE_SANDBOX_API_KEY from .env.local if available
 * 
 * Or use npm scripts:
 *   npm run dev:with-webhooks                  # Test mode (default Stripe CLI config)
 * 
 * Configuration:
 *   Add to .env.local:
 *   - STRIPE_SANDBOX_API_KEY=sk_test_...      # Optional: Use sandbox API key
 * 
 * Note: If STRIPE_SANDBOX_API_KEY is set in .env.local, it will be used.
 *       Otherwise, the script uses the default Stripe CLI configuration.
 */

const fs = require('fs');
const path = require('path');
const concurrently = require('concurrently');

// Read .env.local file
function readEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  const env = {};
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const equalIndex = trimmedLine.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmedLine.substring(0, equalIndex).trim();
          const value = trimmedLine.substring(equalIndex + 1).trim();
          // Remove quotes if present
          env[key] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
  }
  
  return env;
}

const env = readEnvFile();
const apiKey = env.STRIPE_SANDBOX_API_KEY || null;

// Check for Next.js lock file
const lockPath = path.join(process.cwd(), '.next', 'dev', 'lock');
if (fs.existsSync(lockPath)) {
  console.warn('⚠️  Warning: Next.js lock file exists. Another instance may be running.');
  console.warn('   Run: node scripts/cleanup-dev.js to clean up');
  console.warn('   Or manually kill the process using port 3000\n');
}

const commands = [
  {
    name: 'NEXT',
    command: 'npm run dev:skip-check',
    prefixColor: 'blue',
  },
  {
    name: 'STRIPE',
    command: apiKey
      ? `stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key ${apiKey}`
      : 'stripe listen --forward-to localhost:3000/api/webhooks/stripe',
    prefixColor: 'green',
  },
];

console.log('🚀 Starting development server with Stripe webhook forwarding...');
if (apiKey) {
  console.log('📦 Using sandbox API key from .env.local');
  console.log('   API Key:', apiKey.substring(0, 12) + '...' + apiKey.substring(apiKey.length - 4));
} else {
  console.log('🧪 Using default Stripe CLI configuration (test mode)');
  console.log('   To use a sandbox, add STRIPE_SANDBOX_API_KEY to .env.local');
}
console.log('');

// concurrently runs the commands and handles the process lifecycle
const result = concurrently(commands, {
  killOthersOnFail: true,
  restartTries: 0,
});

// Handle promise rejection to avoid unhandled rejection errors
if (result && result.result && typeof result.result.catch === 'function') {
  result.result.catch((error) => {
    // Errors are already logged by concurrently
    process.exit(1);
  });
}







