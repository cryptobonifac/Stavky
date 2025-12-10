const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkMigrationStatus() {
  const email = 'busikpartners@gmail.com';
  
  console.log(`Checking migration status for: ${email}\n`);
  
  // Try to call activate_account_by_email to see if it exists
  let activateResult, activateError;
  try {
    const result = await supabase.rpc('activate_account_by_email', {
      user_email: email
    });
    activateResult = result.data;
    activateError = result.error;
  } catch (err) {
    activateError = { message: 'Function does not exist or error occurred: ' + err.message };
  }
  
  if (activateError) {
    console.log('⚠️  activate_account_by_email function:', activateError.message);
  } else {
    console.log('✅ activate_account_by_email function exists');
    console.log('Result:', JSON.stringify(activateResult, null, 2));
  }
  
  // Check all three users from the migration
  const emails = ['igorpod69@gmail.com', 'busikpartners@gmail.com', 'marek.rohon@gmail.com'];
  
  console.log('\n--- Checking all users from migration ---');
  for (const userEmail of emails) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (error) {
      console.log(`❌ ${userEmail}: Not found`);
    } else {
      console.log(`✅ ${userEmail}: role=${user.role}, active_until=${user.account_active_until}`);
    }
  }
}

checkMigrationStatus().catch(console.error);

