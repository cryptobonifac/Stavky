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
  
  // Default redirect path (without locale - middleware will add it)
  // Support both 'redirect' (new) and 'next' (legacy) parameters
  const redirectParam = requestUrl.searchParams.get('redirect') || requestUrl.searchParams.get('next')
  let next = redirectParam
    ? (redirectParam.startsWith('/') ? redirectParam : `/${redirectParam}`)
    : '/bettings'

  if (!code) {
    requestUrl.pathname = '/login'
    requestUrl.searchParams.set('error', 'missing_code')
    requestUrl.searchParams.set('locale', locale)
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
    requestUrl.pathname = '/login'
    requestUrl.searchParams.set('error', error.message)
    requestUrl.searchParams.set('locale', locale)
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
    // Only override if no explicit 'redirect' or 'next' parameter was provided
    // Don't add locale prefix - middleware will handle it
    if (!redirectParam) {
      const role = userProfile?.role
      next = role === 'betting' ? '/newbet' : '/bettings'
    }
  }
  
  // Redirect directly to locale-prefixed path
  // Build the full URL with locale prefix to avoid middleware adding it twice
  const localePrefixedPath = `/${locale}${next}`
  const finalRedirectUrl = new URL(localePrefixedPath, request.url)
  
  // Create redirect response and ensure session cookies are included
  // The response object already has the session cookies from exchangeCodeForSession
  const redirectResponse = NextResponse.redirect(finalRedirectUrl)
  
  // Copy all cookies from the session response to the redirect response
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
  })
  
  return redirectResponse
}

