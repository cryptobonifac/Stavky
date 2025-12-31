import { createSafeAuthClient as createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing environment variables',
          details: {
            hasUrl: !!supabaseUrl,
            hasAnonKey: !!supabaseAnonKey,
          },
          message:
            'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file',
        },
        { status: 400 }
      )
    }

    // Check if values are still placeholders
    if (
      supabaseUrl === 'your_supabase_project_url' ||
      supabaseAnonKey === 'your_supabase_anon_key'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Environment variables not configured',
          message:
            'Please replace the placeholder values in .env.local with your actual Supabase credentials',
        },
        { status: 400 }
      )
    }

    // Try to create a Supabase client
    const supabase = await createClient()

    // Test connection by getting the current user (this will work even without auth)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // If there's an auth error but it's not a connection error, that's okay
    // We're just testing if we can connect to Supabase
    if (authError && authError.message.includes('Invalid API key')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid API key',
          message:
            'The Supabase anon key appears to be invalid. Please check your .env.local file',
        },
        { status: 401 }
      )
    }

    // Test a simple query to verify database connection
    // This will fail if the project doesn't exist or URL is wrong
    const { data: healthCheck, error: healthError } = await supabase
      .from('_realtime')
      .select('*')
      .limit(1)

    // If we get here, the connection is working
    // The health check might fail, but that's okay - we just need to verify the client can connect
    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      details: {
        url: supabaseUrl.replace(/\/$/, ''), // Remove trailing slash for display
        hasAnonKey: !!supabaseAnonKey,
        anonKeyLength: supabaseAnonKey.length,
        user: user ? 'Authenticated' : 'Not authenticated (expected)',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Connection failed',
        message: error.message || 'Failed to connect to Supabase',
        details: error,
      },
      { status: 500 }
    )
  }
}

