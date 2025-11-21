import { NextResponse } from 'next/server'

import { createClient as createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

  const { error } = await supabase
    .from('betting_tips')
    .update({ status })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}


