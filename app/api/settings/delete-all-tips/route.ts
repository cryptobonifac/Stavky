import { NextResponse } from 'next/server'

import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

export async function DELETE() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user has betting role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Delete all betting_tip records
    // Using a condition that's always true to delete all records
    const { error: tipsError } = await supabase
      .from('betting_tip')
      .delete()
      .gte('created_at', '1970-01-01') // This condition is always true for valid timestamps

    if (tipsError) {
      console.error('[DeleteAllTips] Error deleting betting_tip:', tipsError)
      return NextResponse.json(
        { error: 'Failed to delete betting tips' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DeleteAllTips] Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

