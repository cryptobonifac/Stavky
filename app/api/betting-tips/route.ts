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

    // Validate stake
    const stake = parseFloat(body.stake)
    if (!stake || stake <= 0) {
      return NextResponse.json(
        { error: 'Stake must be a positive number' },
        { status: 400 }
      )
    }

    // Calculate total_win per tip (stake * individual odds)
    // For combined bets, each tip gets its share of the stake
    const stakePerTip = stake / body.tips.length
    const total_win = body.final_odds * stake

    // All tips must be from the same betting company (enforced by UI)
    // Extract betting_company_id from the first tip
    const bettingCompanyId = body.tips[0].betting_company_id

    // Create betting_tip records (one per tip in the array)
    const tipRecords = body.tips.map((tip: any) => ({
      betting_company_id: bettingCompanyId,
      sport: tip.sport,
      league: tip.league,
      match: tip.match,
      odds: tip.odds,
      match_date: tip.match_date,
      stake: stakePerTip,
      total_win: tip.odds * stakePerTip,
      status: 'pending' as const,
    }))

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

  // Validate stake for legacy structure
  const stake = parseFloat(body.stake || '0')
  const total_win = stake > 0 ? (body.odds || 1) * stake : null

  const { data: insertedTip, error } = await supabase
    .from('betting_tip')
    .insert({
      betting_company_id: body.betting_company_id,
      sport: body.sport,
      league: body.league,
      match: body.match,
      odds: body.odds,
      match_date: body.match_date,
      stake: stake > 0 ? stake : null,
      total_win: total_win,
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


