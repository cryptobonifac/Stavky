import { createClient } from '@supabase/supabase-js'

/**
 * Admin client with service role key.
 * WARNING: Only use this on the server side for admin operations.
 * Never expose the service role key to the client.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    )
  }

  // Warn if using publishable key instead of service role key
  // Local Supabase service role keys start with 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' and contain 'service_role'
  // Remote Supabase service role keys also start with 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' and contain 'service_role'
  // Publishable keys start with 'sb_publishable_' or are anon keys
  const isLocalServiceRole = supabaseServiceRoleKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9') && 
                             supabaseServiceRoleKey.includes('service_role')
  const isPublishableKey = supabaseServiceRoleKey.startsWith('sb_publishable_') || 
                           (supabaseServiceRoleKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9') && 
                            supabaseServiceRoleKey.includes('anon'))
  
  if (isPublishableKey) {
    console.warn(
      '⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY appears to be a publishable/anonymous key, not a service role key. ' +
      'Service role keys bypass RLS. ' +
      'For local: Run "supabase status --output json" and use the SERVICE_ROLE_KEY value. ' +
      'For remote: Get from Supabase Dashboard → Project Settings → API → service_role key'
    )
  } else if (!isLocalServiceRole && !supabaseServiceRoleKey.startsWith('eyJ')) {
    console.warn(
      '⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY format is unexpected. ' +
      'Expected a JWT token starting with "eyJ" or local Supabase service role key. ' +
      'For local: Run "supabase status --output json" and use the SERVICE_ROLE_KEY value.'
    )
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

