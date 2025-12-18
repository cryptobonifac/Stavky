import { NextResponse } from 'next/server'

import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
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

  // New structure: body contains tips array and final odds
  if (body.tips && Array.isArray(body.tips)) {
    if (body.tips.length === 0) {
      return NextResponse.json(
        { error: 'At least one tip is required' },
        { status: 400 }
      )
    }

    // Validate all tips
    for (const tip of body.tips) {
      const requiredFields = [
        'betting_company_id',
        'sport',
        'league',
        'match',
        'result_id',
        'odds',
        'match_date',
      ]
      const missingField = requiredFields.find(
        (field) => tip[field] === undefined || tip[field] === ''
      )
      if (missingField) {
        return NextResponse.json(
          { error: `Missing field in tip: ${missingField}` },
          { status: 400 }
        )
      }
    }

    // Validate final odds
    if (!body.final_odds || body.final_odds < 1.001 || body.final_odds > 2.0) {
      return NextResponse.json(
        { error: 'Final odds must be between 1.001 and 2.0' },
        { status: 400 }
      )
    }

    // All tips must be from the same betting company (enforced by UI)
    // Extract betting_company_id from the first tip
    const bettingCompanyId = body.tips[0].betting_company_id

    // Create betting_tip records (one per tip in the array)
    const tipRecords = body.tips.map((tip: any) => {
      // Validate stake if provided
      let stake = null
      if (tip.stake !== undefined && tip.stake !== null && tip.stake !== '') {
        const stakeValue = parseFloat(tip.stake)
        if (isNaN(stakeValue) || stakeValue <= 0) {
          return null // Will be caught by validation below
        }
        stake = stakeValue
      }

      // Calculate total_win if stake is provided
      let totalWin = null
      if (tip.total_win !== undefined && tip.total_win !== null && tip.total_win !== '') {
        totalWin = parseFloat(tip.total_win)
      } else if (stake !== null && tip.odds) {
        // Calculate total_win = stake * odds if not provided
        totalWin = stake * parseFloat(tip.odds)
      }

      return {
        betting_company_id: bettingCompanyId,
        sport: tip.sport,
        league: tip.league,
        match: tip.match,
        result_id: tip.result_id,
        odds: tip.odds,
        match_date: tip.match_date,
        stake,
        total_win: totalWin,
        status: 'pending' as const,
      }
    })

    // Check if any tip record is null (validation failed)
    if (tipRecords.some((record: any) => record === null)) {
      return NextResponse.json(
        { error: 'Invalid stake value. Stake must be a positive number.' },
        { status: 400 }
      )
    }

    const { data: insertedTips, error: insertError } = await supabase
      .from('betting_tip')
      .insert(tipRecords)
      .select()

    if (insertError || !insertedTips || insertedTips.length === 0) {
      return NextResponse.json(
        { error: insertError?.message ?? 'Failed to create betting tips' },
        { status: 400 }
      )
    }

    // Return the first tip ID (for backward compatibility)
    return NextResponse.json({ success: true, id: insertedTips[0].id })
  }

  // Legacy structure: single tip (for backward compatibility)
  // Note: This structure is deprecated but kept for backward compatibility
  // New bets should use the tips array structure
  const REQUIRED_FIELDS = [
    'betting_company_id',
    'sport',
    'league',
    'match',
    'odds',
    'match_date',
  ] as const

  const missingField = REQUIRED_FIELDS.find(
    (field) => body[field] === undefined || body[field] === ''
  )
  if (missingField) {
    return NextResponse.json(
      { error: `Missing field: ${missingField}` },
      { status: 400 }
    )
  }

  // Handle stake and total_win for legacy structure
  let stake = null
  if (body.stake !== undefined && body.stake !== null && body.stake !== '') {
    const stakeValue = parseFloat(body.stake)
    if (!isNaN(stakeValue) && stakeValue > 0) {
      stake = stakeValue
    }
  }

  let totalWin = null
  if (body.total_win !== undefined && body.total_win !== null && body.total_win !== '') {
    totalWin = parseFloat(body.total_win)
  } else if (stake !== null && body.odds) {
    // Calculate total_win = stake * odds if not provided
    totalWin = stake * parseFloat(body.odds)
  }

  const { data: insertedTip, error } = await supabase
    .from('betting_tip')
    .insert({
      betting_company_id: body.betting_company_id,
      sport: body.sport,
      league: body.league,
      match: body.match,
      odds: body.odds,
      match_date: body.match_date,
      stake,
      total_win: totalWin,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true, id: insertedTip?.id })
}


