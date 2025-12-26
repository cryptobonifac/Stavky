const { createClient } = require('@supabase/supabase-js');

// Use environment variables or defaults for local Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function manuallyActivateAccount(email, days = 30) {
  console.log(`\n🔧 Manually activating account for: ${email}\n`);
  
  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (userError || !user) {
    console.error(`❌ User not found: ${email}`);
    console.error('Error:', userError?.message || userError);
    process.exit(1);
  }

  console.log('✅ User found:');
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Current account_active_until: ${user.account_active_until || 'NULL'}`);

  // Calculate activation date
  const activationDate = new Date();
  activationDate.setDate(activationDate.getDate() + days);

  console.log(`\n📅 Setting account_active_until to: ${activationDate.toISOString()}`);

  // Update user account
  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({
      account_active_until: activationDate.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (updateError) {
    console.error('❌ Failed to activate account:', updateError.message);
    console.error('Error details:', updateError);
    process.exit(1);
  }

  console.log('\n✅ Account activated successfully!');
  console.log(`   Email: ${updatedUser.email}`);
  console.log(`   Account Active Until: ${updatedUser.account_active_until}`);
  console.log(`   Updated At: ${updatedUser.updated_at}`);
}

const email = process.argv[2] || 'customer11@gmail.com';
const days = parseInt(process.argv[3]) || 30;

manuallyActivateAccount(email, days).catch(console.error);
