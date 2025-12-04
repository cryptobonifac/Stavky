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
    provider: 'google' | 'facebook'
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
      provider: 'google' | 'facebook'
    ): Promise<{ error: AuthError | null }> => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL ??
            `${window.location.origin}/auth/callback`,
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
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


