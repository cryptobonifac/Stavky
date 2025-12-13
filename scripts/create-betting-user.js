/**
 * Script to create a new betting user in production Supabase
 * 
 * Usage:
 *   node scripts/create-betting-user.js <email> <password> [role]
 * 
 * Example:
 *   node scripts/create-betting-user.js betting1@gmail.com betting123 betting
 * 
 * Environment variables required:
 *   NEXT_PUBLIC_SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Your Supabase service role key
 */

const { createClient } = require('@supabase/supabase-js')

const email = process.argv[2]
const password = process.argv[3]
const role = process.argv[4] || 'betting'

if (!email || !password) {
  console.error('Error: Email and password are required')
  console.error('Usage: node scripts/create-betting-user.js <email> <password> [role]')
  console.error('Example: node scripts/create-betting-user.js betting1@gmail.com betting123 betting')
  process.exit(1)
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createBettingUser() {
  try {
    console.log(`Creating user: ${email} with role: ${role}`)
    
    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists in auth. Checking public.users table...')
        // Get the user ID from auth
        const { data: existingUser } = await supabase.auth.admin.listUsers()
        const user = existingUser.users.find(u => u.email === email)
        if (!user) {
          console.error('Error: User exists but could not find in auth.users')
          process.exit(1)
        }
        
        // Update role in public.users
        const { error: updateError } = await supabase
          .from('users')
          .update({ role })
          .eq('id', user.id)
        
        if (updateError) {
          console.error('Error updating user role:', updateError.message)
          process.exit(1)
        }
        
        console.log(`✓ User role updated to '${role}'`)
        console.log(`User ID: ${user.id}`)
        return
      }
      console.error('Error creating user in auth:', authError.message)
      process.exit(1)
    }

    if (!authData?.user) {
      console.error('Error: User created but no user data returned')
      process.exit(1)
    }

    const userId = authData.user.id
    console.log(`✓ User created in auth.users: ${userId}`)

    // Step 2: Wait a moment for the trigger to create the public.users entry
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Step 3: Update role in public.users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user role:', updateError.message)
      // Try to insert manually if update fails (trigger might not have fired)
      const { error: insertError } = await supabase
        .from('users')
        .insert({ id: userId, email, role })
        .select()
      
      if (insertError) {
        console.error('Error inserting user:', insertError.message)
        process.exit(1)
      }
      console.log('✓ User inserted manually into public.users')
    } else {
      console.log(`✓ User role set to '${role}' in public.users`)
    }

    console.log('\n✓ User created successfully!')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log(`Role: ${role}`)
    console.log(`User ID: ${userId}`)

  } catch (error) {
    console.error('Unexpected error:', error.message)
    process.exit(1)
  }
}

createBettingUser()








