import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// GET handler for testing route accessibility and diagnostics
export async function GET() {
  const resendApiKey = process.env.RESEND_API_KEY
  const keyExists = !!resendApiKey
  const keyNotEmpty = !!(resendApiKey && resendApiKey.trim() !== '')
  const keyStartsWithRe = resendApiKey?.startsWith('re_') || false
  
  // Check for common issues
  const issues: string[] = []
  if (!keyExists) {
    issues.push('RESEND_API_KEY is not defined in process.env')
  } else if (!keyNotEmpty) {
    issues.push('RESEND_API_KEY exists but is empty or whitespace only')
  } else if (!keyStartsWithRe) {
    issues.push('RESEND_API_KEY does not start with "re_" (may be invalid format)')
  }
  
  return NextResponse.json({ 
    message: 'Contact API is working',
    resendConfigured: keyNotEmpty && keyStartsWithRe,
    diagnostics: {
      hasKey: keyExists,
      keyNotEmpty,
      keyLength: resendApiKey?.length || 0,
      keyStartsWithRe,
      keyPrefix: resendApiKey?.substring(0, 3) || 'N/A',
      nodeEnv: process.env.NODE_ENV,
      issues: issues.length > 0 ? issues : ['No issues detected'],
    },
    troubleshooting: keyNotEmpty && keyStartsWithRe ? [] : [
      '1. Verify .env.local file exists in project root (same level as package.json)',
      '2. Check variable format: RESEND_API_KEY=re_xxxxxxxxxxxxx (no quotes, no spaces)',
      '3. Restart dev server after adding/modifying .env.local',
      '4. Verify variable name is exactly RESEND_API_KEY (case-sensitive)',
      '5. Check server console for detailed error logs',
    ],
  })
}

export async function POST(request: Request) {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
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
    const supabase = await createServerClient()
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
      console.error('Database error saving contact:', dbError)
      return NextResponse.json(
        { error: 'Failed to save contact submission' },
        { status: 500 }
      )
    }

    // Optionally send email if RESEND_API_KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY
    const shouldSendEmail = resendApiKey && resendApiKey.trim() !== '' && resendApiKey.startsWith('re_')
    
    if (shouldSendEmail) {
      try {
        const resend = new Resend(resendApiKey)
        const { error: emailError } = await resend.emails.send({
          from: 'Stavky Contact Form <onboarding@resend.dev>',
          to: 'busikpartners@gmail.com',
          subject: 'Contact Form Submission from Stavky',
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Email:</strong> ${email}</p>
            ${mobile ? `<p><strong>Mobile:</strong> ${mobile}</p>` : ''}
            ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
          `,
          text: `
New Contact Form Submission

Email: ${email}
${mobile ? `Mobile: ${mobile}` : ''}
${message ? `\nMessage:\n${message}` : ''}
          `,
        })

        if (emailError) {
          console.error('Resend API error (non-blocking):', emailError)
          // Don't fail the request if email fails - contact is already saved
        }
      } catch (emailErr) {
        console.error('Email sending error (non-blocking):', emailErr)
        // Don't fail the request if email fails - contact is already saved
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contact submission saved successfully',
      id: contactData.id,
    })
  } catch (error: any) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

