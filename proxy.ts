import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { updateSession } from '@/lib/supabase'

const intlMiddleware = createMiddleware(routing)

const PROTECTED_ROUTES = [
  '/home',
  '/bettings',
  '/bettings/manage',
  '/history',
  '/newbet',
  '/settings',
]

const AUTH_ROUTES = ['/login']
const BETTING_ONLY_ROUTES = ['/newbet', '/bettings/manage', '/settings']

export default async function proxy(request: NextRequest) {
  // Handle Supabase session update first
  const { supabase, response: supabaseResponse } = await updateSession(request)
  
  // Get user, handling refresh token errors gracefully
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error: any) {
    // Ignore refresh token errors - these are expected when sessions expire
    if (error?.code !== 'refresh_token_not_found' && !error?.message?.includes('refresh_token_not_found')) {
      // Only log non-refresh-token errors
      console.error('Supabase auth error in proxy:', error)
    }
  }

  // Get the pathname
  const pathname = request.nextUrl.pathname

  // Handle i18n routing first
  const intlResponse = intlMiddleware(request)

  // If i18n middleware returns a redirect, handle it
  if (
    intlResponse.status === 307 ||
    intlResponse.status === 308 ||
    intlResponse.headers.get('location')
  ) {
    // Merge Supabase cookies into i18n redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return intlResponse
  }

  // Merge i18n cookies into Supabase response
  let response = supabaseResponse
  intlResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie)
  })

  // Extract path without locale for route checking
  const localeMatch = pathname.match(/^\/(en|cs|sk)(\/.*)?$/)
  const path = localeMatch ? (localeMatch[2] || '/') : pathname

  // Get user role for route protection
  let role: string | null = null
  if (user) {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    if (!error) {
      role = data?.role ?? null
    }
  }

  // Check route protection
  const isProtected = PROTECTED_ROUTES.some((route) => path.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route))
  const isBettingOnly = BETTING_ONLY_ROUTES.some((route) =>
    path.startsWith(route)
  )

  // Get current locale for building localized redirect paths
  const currentLocale = localeMatch ? localeMatch[1] : routing.defaultLocale
  const buildLocalizedPath = (targetPath: string) => {
    return `/${currentLocale}${targetPath}`
  }

  // Handle route protection - only if not already redirecting
  if (
    response.status !== 307 &&
    response.status !== 308 &&
    !response.headers.get('location')
  ) {
    if (!user && isProtected) {
      const redirectTo = request.nextUrl.clone()
      redirectTo.pathname = buildLocalizedPath('/login')
      redirectTo.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectTo)
    }

    if (user && isBettingOnly && role !== 'betting') {
      const redirectTo = request.nextUrl.clone()
      redirectTo.pathname = buildLocalizedPath('/bettings')
      return NextResponse.redirect(redirectTo)
    }

    if (user && isAuthRoute) {
      const redirectTo = request.nextUrl.clone()
      redirectTo.pathname = buildLocalizedPath(
        role === 'betting' ? '/newbet' : '/bettings'
      )
      redirectTo.searchParams.delete('redirectedFrom')
      return NextResponse.redirect(redirectTo)
    }
  }

  return response
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(cs|en|sk)/:path*',
    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    // Exclude: _next, _vercel, api routes, auth/callback, and static files
    '/((?!_next|_vercel|api|auth/callback|.*\\..*).*)',
  ],
}


