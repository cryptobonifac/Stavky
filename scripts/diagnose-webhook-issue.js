/**
 * Diagnostic script to check webhook configuration and identify potential issues
 * Run this after a failed payment to diagnose why account activation didn't work
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple .env.local parser (without dotenv dependency)
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnoseWebhookIssue(email) {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 WEBHOOK DIAGNOSTIC TOOL');
  console.log('='.repeat(80));
  console.log(`Checking configuration for: ${email || 'ALL USERS'}\n`);

  // 1. Check environment variables
  console.log('1️⃣  ENVIRONMENT VARIABLES:');
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ SET' : '❌ MISSING',
    'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET ? '✅ SET' : '❌ MISSING',
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY ? '✅ SET' : '❌ MISSING',
  };
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (key.includes('KEY') || key.includes('SECRET')) {
      console.log(`   ${key}: ${value}`);
    } else {
      console.log(`   ${key}: ${value || '❌ MISSING'}`);
    }
  });

  // 2. Check user in database
  console.log('\n2️⃣  USER DATABASE CHECK:');
  if (email) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.log(`   ❌ User NOT FOUND: ${email}`);
      console.log(`   Error: ${error?.message || 'No error but user is null'}`);
      
      // Try case-insensitive
      const { data: userCI } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email)
        .maybeSingle();
      
      if (userCI) {
        console.log(`   ⚠️  Found user with case-insensitive match: ${userCI.email}`);
        console.log(`   💡 Email case mismatch detected!`);
      }
    } else {
      console.log(`   ✅ User FOUND: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Account Active Until: ${user.account_active_until || 'NULL (INACTIVE)'}`);
      console.log(`   Stripe Customer ID: ${user.stripe_customer_id || 'NULL'}`);
      console.log(`   Stripe Subscription ID: ${user.stripe_subscription_id || 'NULL'}`);
      
      // Check if account should be active
      const isActive = user.account_active_until && new Date(user.account_active_until) >= new Date();
      console.log(`   Current Status: ${isActive ? '✅ ACTIVE' : '❌ INACTIVE'}`);
    }
  } else {
    // Check all users with recent payments
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10);
    
    console.log(`   Found ${users?.length || 0} recent users`);
    users?.forEach(user => {
      const isActive = user.account_active_until && new Date(user.account_active_until) >= new Date();
      console.log(`   - ${user.email}: ${isActive ? 'ACTIVE' : 'INACTIVE'} (updated: ${user.updated_at})`);
    });
  }

  // 3. Check database schema
  console.log('\n3️⃣  DATABASE SCHEMA CHECK:');
  const { data: columns, error: schemaError } = await supabase
    .rpc('get_table_columns', { table_name: 'users' })
    .catch(async () => {
      // Fallback: try direct query
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      return { data: data ? Object.keys(data[0] || {}) : [], error };
    });

  const requiredColumns = ['id', 'email', 'account_active_until', 'stripe_customer_id', 'stripe_subscription_id'];
  console.log('   Required columns:', requiredColumns.join(', '));
  
  // 4. Check RLS policies (if possible)
  console.log('\n4️⃣  COMMON ISSUES TO CHECK:');
  console.log('   □ Webhook secret matches Stripe CLI output');
  console.log('   □ Stripe CLI is running: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
  console.log('   □ Email in Stripe matches email in database (case-sensitive)');
  console.log('   □ Payment status is "paid" or "complete"');
  console.log('   □ Checkout mode is "payment" or "subscription"');
  console.log('   □ User exists in database before payment');
  console.log('   □ Database update permissions (RLS policies)');

  // 5. Recent webhook activity check
  console.log('\n5️⃣  RECOMMENDED ACTIONS:');
  console.log('   1. Check terminal logs where webhook handler runs');
  console.log('   2. Look for these log messages:');
  console.log('      - "🔔 WEBHOOK EVENT RECEIVED"');
  console.log('      - "✅ CHECKOUT SESSION COMPLETED"');
  console.log('      - "📧 EMAIL LOCATIONS"');
  console.log('      - "🔐 ACTIVATION CONDITION CHECK"');
  console.log('      - "✅ DATABASE UPDATE SUCCESSFUL" or "❌ DATABASE UPDATE FAILED"');
  console.log('   3. If webhook not received:');
  console.log('      - Verify Stripe CLI is running');
  console.log('      - Check webhook URL in Stripe Dashboard');
  console.log('      - Verify STRIPE_WEBHOOK_SECRET matches');
  console.log('   4. If user not found:');
  console.log('      - Check email case sensitivity');
  console.log('      - Verify user exists: node scripts/check-user-status.js <email>');
  console.log('   5. If database update failed:');
  console.log('      - Check RLS policies');
  console.log('      - Verify SUPABASE_SERVICE_ROLE_KEY is set');
  console.log('      - Check database connection');

  console.log('\n' + '='.repeat(80));
  console.log('✅ DIAGNOSTIC COMPLETE');
  console.log('='.repeat(80) + '\n');
}

// Get email from command line or check all
const email = process.argv[2];
diagnoseWebhookIssue(email).catch(console.error);



