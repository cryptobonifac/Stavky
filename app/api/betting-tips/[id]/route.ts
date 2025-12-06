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

  // Check if this betting_tip has items (new structure)
  const { data: bettingTip } = await supabase
    .from('betting_tips')
    .select('id')
    .eq('id', id)
    .single()

  if (!bettingTip) {
    return NextResponse.json(
      { error: 'Betting tip not found' },
      { status: 404 }
    )
  }

  // Check if there are items
  const { data: items } = await supabase
    .from('betting_tip_items')
    .select('id, status')
    .eq('betting_tip_id', id)

  if (items && items.length > 0) {
    // New structure: update all items and the main bet
    // If status is 'loss', all items become 'loss' and the bet becomes 'loss'
    // If status is 'win', we need to check if all items are 'win' to mark the bet as 'win'
    
    if (status === 'loss') {
      // If one item fails, the whole bet fails
      const { error: itemsError } = await supabase
        .from('betting_tip_items')
        .update({ status: 'loss' })
        .eq('betting_tip_id', id)

      if (itemsError) {
        return NextResponse.json(
          { error: itemsError.message },
          { status: 400 }
        )
      }

      const { error: betError } = await supabase
        .from('betting_tips')
        .update({ status: 'loss' })
        .eq('id', id)

      if (betError) {
        return NextResponse.json(
          { error: betError.message },
          { status: 400 }
        )
      }
    } else if (status === 'win') {
      // Mark all items as 'win'
      const { error: itemsError } = await supabase
        .from('betting_tip_items')
        .update({ status: 'win' })
        .eq('betting_tip_id', id)

      if (itemsError) {
        return NextResponse.json(
          { error: itemsError.message },
          { status: 400 }
        )
      }

      // Mark the bet as 'win' only if all items are now 'win'
      const { error: betError } = await supabase
        .from('betting_tips')
        .update({ status: 'win' })
        .eq('id', id)

      if (betError) {
        return NextResponse.json(
          { error: betError.message },
          { status: 400 }
        )
      }
    }
  } else {
    // Legacy structure: single tip, update directly
    const { error } = await supabase
      .from('betting_tips')
      .update({ status })
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
  }

  return NextResponse.json({ success: true })
}


