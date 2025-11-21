import { type NextRequest, NextResponse } from 'next/server'

import { updateSession } from '@/lib/supabase'

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

export async function proxy(request: NextRequest) {
  const { supabase, response } = await updateSession(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

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

  if (user && path === '/') {
    await supabase.auth.signOut()
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = '/'
    return NextResponse.redirect(redirectTo)
  }

  const isProtected = PROTECTED_ROUTES.some((route) => path.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route))
  const isBettingOnly = BETTING_ONLY_ROUTES.some((route) =>
    path.startsWith(route)
  )

  if (!user && isProtected) {
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = '/login'
    redirectTo.searchParams.set('redirectedFrom', path)
    return NextResponse.redirect(redirectTo)
  }

  if (user && isBettingOnly && role !== 'betting') {
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = '/bettings'
    return NextResponse.redirect(redirectTo)
  }

  if (user && isAuthRoute) {
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = role === 'betting' ? '/newbet' : '/bettings'
    redirectTo.searchParams.delete('redirectedFrom')
    return NextResponse.redirect(redirectTo)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next|static|.*\\..*).*)'],
}


