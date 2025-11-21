import { NextResponse } from 'next/server'

import { createClient as createServerClient } from '@/lib/supabase/server'

const REQUIRED_FIELDS = [
  'betting_company_id',
  'sport_id',
  'league_id',
  'match',
  'odds',
  'match_date',
] as const

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const body = await request.json().catch(() => ({}))

  const missingField = REQUIRED_FIELDS.find(
    (field) => body[field] === undefined || body[field] === ''
  )
  if (missingField) {
    return NextResponse.json(
      { error: `Missing field: ${missingField}` },
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


