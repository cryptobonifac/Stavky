import { NextResponse } from 'next/server'

import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

const normalizeMonthInput = (raw: string | null | undefined) => {
  if (!raw) return null
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), 1))
}

export async function POST(request: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: acting } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (acting?.role !== 'betting') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const { userId, month, grantNextMonthFree } = body as {
    userId?: string
    month?: string
    grantNextMonthFree?: boolean
  }

  const normalizedMonth = normalizeMonthInput(month)

  if (!userId || !normalizedMonth) {
    return NextResponse.json(
      { error: 'Missing or invalid user/month values.' },
      { status: 400 }
    )
  }

  const nextMonth = new Date(
    Date.UTC(
      normalizedMonth.getUTCFullYear(),
      normalizedMonth.getUTCMonth() + 1,
      1
    )
  )

  const { error } = await supabase
    .from('user_subscriptions')
    .upsert(
      {
        user_id: userId,
        month: normalizedMonth.toISOString().split('T')[0],
        valid_to: nextMonth.toISOString(),
        next_month_free: grantNextMonthFree ?? true,
      },
      { onConflict: 'user_id,month' }
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    month: normalizedMonth.toISOString(),
    next_month_free: grantNextMonthFree ?? true,
  })
}


