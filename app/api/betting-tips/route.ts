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
        'sport_id',
        'league_id',
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

    // Create the main betting_tip record
    const { data: bettingTip, error: tipError } = await supabase
      .from('betting_tips')
      .insert({
        description: body.description || `Combined bet with ${body.tips.length} tips`,
        odds: body.final_odds,
        status: 'pending',
        created_by: user.id,
      })
      .select()
      .single()

    if (tipError || !bettingTip) {
      return NextResponse.json(
        { error: tipError?.message ?? 'Failed to create betting tip' },
        { status: 400 }
      )
    }

    // Create all tip items
    const tipItems = body.tips.map((tip: any) => ({
      betting_tip_id: bettingTip.id,
      betting_company_id: tip.betting_company_id,
      sport_id: tip.sport_id,
      league_id: tip.league_id,
      match: tip.match,
      odds: tip.odds,
      match_date: tip.match_date,
      status: 'pending' as const,
    }))

    const { error: itemsError } = await supabase
      .from('betting_tip_items')
      .insert(tipItems)

    if (itemsError) {
      // Rollback: delete the betting_tip if items insertion fails
      await supabase.from('betting_tips').delete().eq('id', bettingTip.id)
      return NextResponse.json(
        { error: itemsError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, id: bettingTip.id })
  }

  // Legacy structure: single tip (for backward compatibility)
  const REQUIRED_FIELDS = [
    'betting_company_id',
    'sport_id',
    'league_id',
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

  const { error } = await supabase.from('betting_tips').insert({
    betting_company_id: body.betting_company_id,
    sport_id: body.sport_id,
    league_id: body.league_id,
    match: body.match,
    odds: body.odds,
    match_date: body.match_date,
    status: 'pending',
    created_by: user.id,
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}


