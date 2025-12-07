import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  // Get locale from query param, referer, or default
  let locale = requestUrl.searchParams.get('locale')
  if (!locale) {
    // Try to extract from referer
    const referer = request.headers.get('referer')
    if (referer) {
      const refererUrl = new URL(referer)
      const localeMatch = refererUrl.pathname.match(/^\/(en|cs|sk)/)
      if (localeMatch) {
        locale = localeMatch[1]
      }
    }
  }
  // Default to default locale if still not found
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  
  // Default redirect to locale-aware path (will be overridden by role-based redirect if user exists)
  const nextParam = requestUrl.searchParams.get('next')
  let next = nextParam 
    ? (nextParam.startsWith('/') ? `/${locale}${nextParam}` : `/${locale}/${nextParam}`)
    : `/${locale}/bettings`

  if (!code) {
    requestUrl.pathname = `/${locale}/login`
    requestUrl.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(requestUrl)
  }

  // Create response - redirect destination will be updated after role check
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    requestUrl.pathname = `/${locale}/login`
    requestUrl.searchParams.set('error', error.message)
    return NextResponse.redirect(requestUrl)
  }

  // Get user and role to determine redirect destination
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    // Determine redirect based on role (similar to proxy.ts logic)
    // Only override if no explicit 'next' parameter was provided
    if (!nextParam) {
      const role = userProfile?.role
      next = role === 'betting' ? `/${locale}/newbet` : `/${locale}/bettings`
    }
  }
  
  // Update response with final redirect destination
  const finalRedirectUrl = new URL(next, request.url)
  return NextResponse.redirect(finalRedirectUrl)
}


