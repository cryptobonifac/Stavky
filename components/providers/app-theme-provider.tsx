'use client'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { ReactNode } from 'react'

import theme from '@/components/theme/theme'

type AppThemeProviderProps = {
  children: ReactNode
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => (
  <AppRouterCacheProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  </AppRouterCacheProvider>
)


