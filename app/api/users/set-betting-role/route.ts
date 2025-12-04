import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Call the SQL function to set betting role
    const { data, error } = await supabase.rpc('set_betting_role_by_email', {
      user_email: email,
    })

    if (error) {
      console.error('Error setting betting role:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to set betting role' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Betting role set successfully',
      user: {
        email: data.email,
        id: data.id,
        role: data.role,
        account_active_until: data.account_active_until,
      },
    })
  } catch (error: any) {
    console.error('Error in set-betting-role endpoint:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}



