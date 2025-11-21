import { NextResponse } from 'next/server'

import { createClient as createServerClient } from '@/lib/supabase/server'

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
  const { autoFreeMonth, lossThreshold } = body

  const { error } = await supabase.from('marketing_settings').upsert(
    {
      key: 'free_month_rules',
      value: {
        autoFreeMonth,
        lossThreshold,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}


