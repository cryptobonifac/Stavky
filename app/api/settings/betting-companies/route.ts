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
  if (!body.name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('betting_companies')
    .insert({ name: body.name })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}


