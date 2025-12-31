import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Creates a Supabase client with automatic refresh token error handling.
 * This wrapper intercepts auth.getUser() calls and gracefully handles
 * refresh_token_not_found errors by returning null user instead of throwing.
 *
 * Use this in server components and API routes to prevent unhandled errors
 * when refresh tokens expire in production.
 */
export async function createSafeAuthClient() {
  const supabase = await createClient()

  // Store original auth object
  const originalAuth = supabase.auth

  // Create a proxy to intercept auth.getUser() calls
  const authProxy = new Proxy(originalAuth, {
    get(target, prop, receiver) {
      if (prop === 'getUser') {
        return async () => {
          try {
            return await target.getUser()
          } catch (error: any) {
            // Handle expected refresh token errors gracefully
            if (
              error?.code === 'refresh_token_not_found' ||
              error?.message?.includes('refresh_token_not_found') ||
              error?.message?.includes('Invalid Refresh Token')
            ) {
              // Return null user for expired/invalid tokens (expected behavior)
              return { data: { user: null }, error: null }
            }

            // Log unexpected auth errors
            console.error('Unexpected Supabase auth error:', error)
            throw error
          }
        }
      }
      return Reflect.get(target, prop, receiver)
    }
  })

  // Replace auth with proxied version (maintains all other client methods)
  Object.defineProperty(supabase, 'auth', {
    value: authProxy,
    writable: false,
    configurable: true,
    enumerable: true
  })

  return supabase
}

