import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

type MiddlewareClient = {
  supabase: SupabaseClient
  response: NextResponse
}

export async function updateSession(
  request: NextRequest,
  response?: NextResponse
): Promise<MiddlewareClient> {
  let supabaseResponse =
    response ??
    NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

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
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Try to get user, but handle refresh token errors gracefully
  // Invalid refresh tokens are expected when sessions expire
  try {
    await supabase.auth.getUser()
  } catch (error: any) {
    // Ignore refresh token errors - these are expected when sessions expire
    // The user will need to log in again, which is handled by the auth provider
    if (error?.code !== 'refresh_token_not_found' && !error?.message?.includes('refresh_token_not_found')) {
      // Only log non-refresh-token errors
      console.error('Supabase auth error in middleware:', error)
    }
  }

  return { supabase, response: supabaseResponse }
}

