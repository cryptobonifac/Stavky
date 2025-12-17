import { NextResponse } from 'next/server'

import { createClient as createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!id || id === 'undefined' || !uuidRegex.test(id)) {
    return NextResponse.json(
      { error: `Invalid tip ID: ${id}` },
      { status: 400 }
    )
  }

  const supabase = await createServerClient()
  const { status } = await request.json().catch(() => ({}))

  if (!['win', 'loss'].includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status value.' },
      { status: 400 }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check if betting_tip exists
  const { data: bettingTip } = await supabase
    .from('betting_tip')
    .select('id')
    .eq('id', id)
    .single()

  if (!bettingTip) {
    return NextResponse.json(
      { error: 'Betting tip not found' },
      { status: 404 }
    )
  }

  // Update the betting_tip status directly
  const { error } = await supabase
    .from('betting_tip')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}


