const { createClient } = require('@supabase/supabase-js');

// Use environment variables or defaults for local Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserStatus(email) {
  console.log(`\nChecking user status for: ${email}\n`);

  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (userError || !user) {
    console.error(`User not found: ${email}`);
    console.error('Error:', userError?.message || userError);
    return;
  }

  console.log('User found:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   Account Active Until: ${user.account_active_until || 'NULL (not active)'}`);
  console.log(`   Subscription Plan: ${user.subscription_plan_type || 'NULL'}`);
  console.log(`   Provider Customer ID: ${user.provider_customer_id || 'NULL'}`);
  console.log(`   Provider Subscription ID: ${user.provider_subscription_id || 'NULL'}`);
  console.log(`   Created At: ${user.created_at}`);
  console.log(`   Updated At: ${user.updated_at}`);

  // Check if account is currently active
  if (user.account_active_until) {
    const activeUntil = new Date(user.account_active_until);
    const now = new Date();
    const isActive = activeUntil >= now;

    console.log(`\nAccount Status:`);
    console.log(`   Active Until: ${activeUntil.toISOString()}`);
    console.log(`   Current Time: ${now.toISOString()}`);
    console.log(`   Is Active: ${isActive ? 'YES' : 'NO'}`);

    if (!isActive) {
      const diffMs = now - activeUntil;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      console.log(`   Expired: ${diffDays} day(s) ago`);
    } else {
      const diffMs = activeUntil - now;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      console.log(`   Days Remaining: ${diffDays}`);
    }
  } else {
    console.log(`\nAccount Status: NOT ACTIVE (account_active_until is NULL)`);
  }

  // Check auth.users table
  console.log(`\nChecking auth.users table...`);
  const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(user.id);

  if (authError) {
    console.error('   Error fetching auth user:', authError.message);
  } else if (authUser) {
    console.log(`   Auth user exists`);
    console.log(`   Email: ${authUser.user.email}`);
    console.log(`   Email Confirmed: ${authUser.user.email_confirmed_at ? 'Yes' : 'No'}`);
  }
}

const email = process.argv[2] || 'customer11@gmail.com';
checkUserStatus(email).catch(console.error);
