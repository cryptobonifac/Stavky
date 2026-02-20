import { NextResponse } from 'next/server'

import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

/**
 * Ensure user profile exists in public.users table.
 * This is a failsafe in case the auth trigger didn't fire.
 */
async function ensureUserProfile(supabase: any, user: any) {
  const { data: existingProfile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    // Profile doesn't exist, create it
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        role: 'customer',
        account_active_until: null,
        sign_up_method: user.app_metadata?.provider || 'email',
      })

    if (insertError) {
      console.error('Failed to create user profile:', insertError)
      return false
    }
    return true
  }
  return true
}

export async function GET() {
  const supabase = await createServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure user profile exists (failsafe for trigger failures)
  await ensureUserProfile(supabase, user)

  const { data, error } = await supabase
    .from('users')
    .select('id,email,role,account_active_until,full_name')
    .eq('id', user.id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const supabase = await createServerClient()
  const body = await request.json().catch(() => ({}))
  const fullNameInput = typeof body.full_name === 'string' ? body.full_name : ''
  const fullName = fullNameInput.trim()

  if (fullName && (fullName.length < 2 || fullName.length > 80)) {
    return NextResponse.json(
      { error: 'Full name must be between 2 and 80 characters.' },
      { status: 400 }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      full_name: fullName.length === 0 ? null : fullName,
    })
    .eq('id', user.id)
    .select('id,email,role,account_active_until,full_name')
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Unable to update profile' },
      { status: 400 }
    )
  }

  return NextResponse.json(data)
}


