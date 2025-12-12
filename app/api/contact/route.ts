import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

// GET handler for testing route accessibility
export async function GET() {
  return NextResponse.json({ 
    message: 'Contact API is working',
  })
}

export async function POST(request: Request) {
  try {
    // Check environment variables before proceeding
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceRoleKey: !!supabaseServiceRoleKey,
      })
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: 'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
        },
        { status: 500 }
      )
    }

    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { email, mobile, message } = body

    // Validate required fields - only email is required
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Mobile and message are optional - no validation needed

    // Save contact submission to database
    // Use admin client to bypass RLS - allows anonymous users to submit contact form
    let supabase
    try {
      supabase = createAdminClient()
    } catch (adminError) {
      console.error('Failed to create admin client:', adminError)
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: adminError instanceof Error ? adminError.message : 'Failed to initialize database connection'
        },
        { status: 500 }
      )
    }

    const { data: contactData, error: dbError } = await supabase
      .from('contacts')
      .insert({
        email: email.trim(),
        mobile: mobile?.trim() || null,
        message: message?.trim() || null,
      })
      .select('id')
      .single()

    if (dbError) {
      console.error('Database error saving contact:', {
        error: dbError,
        code: dbError.code,
        message: dbError.message,
        details: dbError.details,
        hint: dbError.hint,
      })
      return NextResponse.json(
        { 
          error: 'Failed to save contact submission',
          details: dbError.message || 'Database operation failed',
          code: dbError.code || 'UNKNOWN_ERROR'
        },
        { status: 500 }
      )
    }

    if (!contactData || !contactData.id) {
      console.error('Contact data missing after insert:', { contactData })
      return NextResponse.json(
        { error: 'Failed to save contact submission', details: 'No data returned from database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact submission saved successfully',
      id: contactData.id,
    })
  } catch (error: unknown) {
    console.error('Contact API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage,
        ...(process.env.NODE_ENV === 'development' && errorStack ? { stack: errorStack } : {})
      },
      { status: 500 }
    )
  }
}

