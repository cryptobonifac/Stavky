import { NextResponse } from 'next/server'

import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

export async function GET(
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

  // Fetch betting tip with related data
  const { data: bettingTip, error } = await supabase
    .from('betting_tip')
    .select(`
      id,
      sport,
      league,
      match,
      odds,
      match_date,
      status,
      stake,
      total_win,
      betting_company_id,
      result_id,
      betting_companies:betting_company_id (name),
      results:result_id (name)
    `)
    .eq('id', id)
    .single()

  if (error || !bettingTip) {
    return NextResponse.json(
      { error: 'Betting tip not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, tip: bettingTip })
}

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
  const body = await request.json().catch(() => ({}))

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

  // Build update object from body
  const updateData: any = {}

  // Handle status (backward compatibility - if only status is provided)
  if (body.status && Object.keys(body).length === 1) {
    if (!['win', 'loss', 'pending'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value. Must be win, loss, or pending.' },
        { status: 400 }
      )
    }
    updateData.status = body.status

    // If status is changed to 'loss', set total_win to 0
    if (body.status === 'loss') {
      updateData.total_win = 0
    }
  } else {
    // Full update - validate and include all provided fields
    if (body.status !== undefined) {
      if (!['win', 'loss', 'pending'].includes(body.status)) {
        return NextResponse.json(
          { error: 'Invalid status value. Must be win, loss, or pending.' },
          { status: 400 }
        )
      }
      updateData.status = body.status

      // If status is changed to 'loss', set total_win to 0
      if (body.status === 'loss') {
        updateData.total_win = 0
      }
    }

    if (body.sport !== undefined) updateData.sport = body.sport
    if (body.league !== undefined) updateData.league = body.league
    if (body.match !== undefined) updateData.match = body.match
    if (body.betting_company_id !== undefined) updateData.betting_company_id = body.betting_company_id
    if (body.result_id !== undefined) updateData.result_id = body.result_id

    if (body.odds !== undefined) {
      const oddsValue = parseFloat(body.odds)
      if (isNaN(oddsValue) || oddsValue < 1.001 || oddsValue > 2.0) {
        return NextResponse.json(
          { error: 'Odds must be between 1.001 and 2.0' },
          { status: 400 }
        )
      }
      updateData.odds = oddsValue
    }

    if (body.match_date !== undefined) {
      updateData.match_date = body.match_date
    }

    // Handle stake
    if (body.stake !== undefined && body.stake !== null && body.stake !== '') {
      const stakeValue = parseFloat(body.stake)
      if (isNaN(stakeValue) || stakeValue <= 0) {
        return NextResponse.json(
          { error: 'Stake must be a positive number' },
          { status: 400 }
        )
      }
      updateData.stake = stakeValue
    } else if (body.stake === null || body.stake === '') {
      updateData.stake = null
    }

    // Handle total_win
    // If status is 'loss', total_win should always be 0 (already set above)
    // Otherwise, handle total_win normally
    if (updateData.status !== 'loss') {
      if (body.total_win !== undefined && body.total_win !== null && body.total_win !== '') {
        updateData.total_win = parseFloat(body.total_win)
      } else if (body.total_win === null || body.total_win === '') {
        updateData.total_win = null
      } else if (updateData.stake !== undefined && updateData.odds !== undefined) {
        // Calculate total_win if stake and odds are provided
        updateData.total_win = updateData.stake * updateData.odds
      } else if (updateData.stake !== undefined && body.odds === undefined) {
        // If only stake is updated, recalculate total_win with existing odds
        const { data: existingTip } = await supabase
          .from('betting_tip')
          .select('odds')
          .eq('id', id)
          .single()

        if (existingTip?.odds) {
          updateData.total_win = updateData.stake * existingTip.odds
        }
      }
    }
  }

  // Update the betting_tip
  const { error } = await supabase
    .from('betting_tip')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
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

  // Delete the betting_tip
  const { error } = await supabase
    .from('betting_tip')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
