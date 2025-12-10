const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
  const email = 'busikpartners@gmail.com';
  
  console.log(`Checking user: ${email}\n`);
  
  // Check in public.users
  const { data: publicUser, error: publicError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (publicError) {
    console.error('Error querying public.users:', publicError);
  } else if (publicUser) {
    console.log('Found in public.users:');
    console.log(JSON.stringify(publicUser, null, 2));
  } else {
    console.log('User NOT found in public.users');
  }
  
  // Check in auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error querying auth.users:', authError);
  } else {
    const authUser = authUsers?.users?.find(u => u.email === email);
    if (authUser) {
      console.log('\nFound in auth.users:');
      console.log(JSON.stringify({
        id: authUser.id,
        email: authUser.email,
        created_at: authUser.created_at,
        email_confirmed_at: authUser.email_confirmed_at,
      }, null, 2));
    } else {
      console.log('\nUser NOT found in auth.users');
    }
  }
  
  // Try to set the role
  console.log('\n--- Attempting to set betting role ---');
  const { data: roleResult, error: roleError } = await supabase.rpc('set_betting_role_by_email', {
    user_email: email
  });
  
  if (roleError) {
    console.error('Error setting role:', roleError);
  } else {
    console.log('Role setting result:', JSON.stringify(roleResult, null, 2));
  }
}

checkUser().catch(console.error);

