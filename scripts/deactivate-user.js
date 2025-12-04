// Script to deactivate a user account by email
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load .env.local file
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function deactivateUser(email) {
  console.log(`🔍 Looking up user: ${email}...`)
  
  // Find the user by email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, role, account_active_until')
    .eq('email', email)
    .single()

  if (userError || !user) {
    console.error(`❌ User not found: ${email}`)
    console.error('Error:', userError?.message)
    process.exit(1)
  }

  console.log(`✅ Found user: ${user.email} (ID: ${user.id}, Role: ${user.role})`)
  console.log(`   Current activation: ${user.account_active_until || 'Not set'}`)

  console.log(`\n🔧 Deactivating account...`)

  // Update the user's account_active_until to null
  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update({ account_active_until: null })
    .eq('id', user.id)
    .select()
    .single()

  if (updateError) {
    console.error('❌ Failed to deactivate account:', updateError.message)
    process.exit(1)
  }

  console.log(`\n✅ Account deactivated successfully!`)
  console.log(`   Email: ${updatedUser.email}`)
  console.log(`   Active until: ${updatedUser.account_active_until || 'Not set'}`)
  console.log(`   Role: ${updatedUser.role}`)
}

const email = process.argv[2]
if (!email) {
  console.error('❌ Please provide an email address')
  console.error('Usage: node scripts/deactivate-user.js <email>')
  process.exit(1)
}

deactivateUser(email).catch(console.error)



