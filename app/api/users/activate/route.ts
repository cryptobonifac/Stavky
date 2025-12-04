import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { email, active_until } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Call the SQL function to activate the account
    const { data, error } = await supabase.rpc('activate_account_by_email', {
      user_email: email,
      active_until_date: active_until || null, // null will use default (1 year from now)
    })

    if (error) {
      console.error('Error activating account:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to activate account' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account activated successfully',
      user: {
        email: data.email,
        id: data.id,
        role: data.role,
        account_active_until: data.account_active_until,
      },
    })
  } catch (error: any) {
    console.error('Error in activate endpoint:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}



