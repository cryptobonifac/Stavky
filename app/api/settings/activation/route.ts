import { NextResponse } from 'next/server'

import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('activation_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const { monthly_price, yearly_price, message_en, message_cs, message_sk } = body

  // Get existing settings row
  const { data: existing } = await supabase
    .from('activation_settings')
    .select('id')
    .limit(1)
    .maybeSingle()

  if (!existing) {
    // Insert new row
    const { data, error } = await supabase
      .from('activation_settings')
      .insert({ monthly_price, yearly_price, message_en, message_cs, message_sk })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  }

  // Update existing
  const { data, error } = await supabase
    .from('activation_settings')
    .update({ monthly_price, yearly_price, message_en, message_cs, message_sk })
    .eq('id', existing.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
