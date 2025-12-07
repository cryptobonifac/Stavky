'use client'

import { AuthProvider } from '@/components/providers/auth-provider'
import { AppThemeProvider } from '@/components/providers/app-theme-provider'
import type { ReactNode } from 'react'

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <AppThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppThemeProvider>
  )
}

