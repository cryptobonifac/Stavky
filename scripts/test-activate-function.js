// Test script for activate_account_by_email function
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

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testFunction(email) {
  console.log(`Testing activate_account_by_email function with: ${email}\n`)
  
  const { data, error } = await supabase.rpc('activate_account_by_email', {
    user_email: email
  })

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log('✅ Function result:')
  console.log(JSON.stringify(data, null, 2))
}

const email = process.argv[2] || 'customer5@gmail.com'
testFunction(email).catch(console.error)



