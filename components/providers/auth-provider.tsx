'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AuthError,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/client'
import {
  canManageBets,
  hasRole,
  type UserRole,
} from '@/lib/auth/roles'

export type UserProfile = {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  account_active_until: string | null
}

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  profile: UserProfile | null
  profileLoading: boolean
  isBetting: boolean
  isCustomer: boolean
  canManageBets: boolean
  supabase: SupabaseClient
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>
  signUpWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>
  signInWithProvider: (
    provider: 'google'
  ) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = useMemo(() => createClient(), [])
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      // Ignore refresh token errors - user just needs to log in again
      if (error && error.message?.includes('refresh_token_not_found')) {
        setSession(null)
        setUser(null)
        setLoading(false)
        return
      }
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const loadProfile = useCallback(async () => {
    if (!session) {
      setProfile(null)
      setProfileLoading(false)
      return
    }

    setProfileLoading(true)
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to load profile')
      }
      const data = (await response.json()) as UserProfile
      setProfile(data)
    } catch {
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }, [session])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // Proactive token refresh: refresh session 5 minutes before expiry
  useEffect(() => {
    if (!session?.expires_at) return

    // Calculate time until token expires (with 5 min buffer)
    const expiresAt = session.expires_at * 1000 // Convert to milliseconds
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    const timeUntilRefresh = expiresAt - now - fiveMinutes

    // Only set timer if expiry is more than 5 minutes away
    if (timeUntilRefresh > 0) {
      const timer = setTimeout(async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession()
          if (!error && data.session) {
            setSession(data.session)
            setUser(data.session.user)
          } else if (error) {
            // Silently handle refresh errors - onAuthStateChange will handle logout
            console.log('Session refresh failed:', error.message)
          }
        } catch (error) {
          console.log('Error refreshing session:', error)
        }
      }, timeUntilRefresh)

      return () => clearTimeout(timer)
    }
  }, [session, supabase])

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    },
    [supabase]
  )

  const signUpWithPassword = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
        },
      })
      return { error }
    },
    [supabase]
  )

  const signInWithProvider = useCallback(
    async (
      provider: 'google'
    ): Promise<{ error: AuthError | null }> => {
      // Extract current locale from pathname
      const currentPath = window.location.pathname
      const localeMatch = currentPath.match(/^\/(en|cs|sk)/)
      const locale = localeMatch ? localeMatch[1] : 'en'

      // Get redirect parameter from current URL if it exists
      const searchParams = new URLSearchParams(window.location.search)
      const redirectParam = searchParams.get('redirect')

      // Build callback URL with locale parameter
      // Always use current origin (window.location.origin) to ensure it works in production
      // This will be the production URL when deployed, or localhost when in dev
      const currentOrigin = window.location.origin
      let callbackUrl: URL

      if (process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL) {
        // If env var is set, use it but replace hostname with current origin
        callbackUrl = new URL(process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL)
        const currentUrl = new URL(currentOrigin)
        callbackUrl.protocol = currentUrl.protocol
        callbackUrl.hostname = currentUrl.hostname
        callbackUrl.port = currentUrl.port
      } else {
        // Default to current origin
        callbackUrl = new URL(`${currentOrigin}/auth/callback`)
      }

      callbackUrl.searchParams.set('locale', locale)

      // Preserve redirect parameter if it exists
      if (redirectParam) {
        callbackUrl.searchParams.set('redirect', redirectParam)
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
        },
      })
      return { error }
    },
    [supabase]
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    await loadProfile()
  }, [loadProfile])

  const isBetting = hasRole(profile?.role, 'betting')
  const isCustomer = hasRole(profile?.role, 'customer')
  const canManage = canManageBets(profile?.role)

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      profile,
      profileLoading,
      isBetting,
      isCustomer,
      canManageBets: canManage,
      supabase,
      signInWithPassword,
      signUpWithPassword,
      signInWithProvider,
      signOut,
      refreshProfile,
    }),
    [
      session,
      user,
      loading,
      profile,
      profileLoading,
      isBetting,
      isCustomer,
      canManage,
      supabase,
      signInWithPassword,
      signUpWithPassword,
      signInWithProvider,
      signOut,
      refreshProfile,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    // Return default values during SSR or when provider is not available
    // This prevents build errors when pages are prerendered
    if (typeof window === 'undefined') {
      return {
        session: null,
        user: null,
        loading: true,
        profile: null,
        profileLoading: true,
        isBetting: false,
        isCustomer: false,
        canManageBets: false,
        supabase: createClient(),
        signInWithPassword: async () => ({ error: null }),
        signUpWithPassword: async () => ({ error: null }),
        signInWithProvider: async () => ({ error: null }),
        signOut: async () => ({ error: null }),
        refreshProfile: async () => {},
      } as AuthContextValue
    }
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


