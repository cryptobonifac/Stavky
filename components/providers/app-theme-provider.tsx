'use client'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { ReactNode } from 'react'
import { useLocale } from 'next-intl'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/sk'
import 'dayjs/locale/cs'

import theme from '@/components/theme/theme'

type AppThemeProviderProps = {
  children: ReactNode
}

// Date picker translations
const datePickerTranslations = {
  en: {
    cancel: 'Cancel',
    clear: 'Clear',
    ok: 'OK',
    today: 'Today',
    next: 'Next',
    previous: 'Previous',
    selectDate: 'Select date',
    selectTime: 'Select time',
    selectDateTime: 'SELECT DATE & TIME',
  },
  sk: {
    cancel: 'Zrušiť',
    clear: 'Vymazať',
    ok: 'OK',
    today: 'Dnes',
    next: 'Ďalej',
    previous: 'Späť',
    selectDate: 'Vybrať dátum',
    selectTime: 'Vybrať čas',
    selectDateTime: 'VYBRAŤ DÁTUM A ČAS',
  },
  cs: {
    cancel: 'Zrušit',
    clear: 'Vymazat',
    ok: 'OK',
    today: 'Dnes',
    next: 'Další',
    previous: 'Zpět',
    selectDate: 'Vybrat datum',
    selectTime: 'Vybrat čas',
    selectDateTime: 'VYBRAT DATUM A ČAS',
  },
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const locale = useLocale()
  
  // Map next-intl locales to dayjs locales
  const dayjsLocale = locale === 'sk' ? 'sk' : locale === 'cs' ? 'cs' : 'en'
  
  // Set dayjs locale
  dayjs.locale(dayjsLocale)

  // Get date picker translations
  const localeText = datePickerTranslations[locale as keyof typeof datePickerTranslations] || datePickerTranslations.en

  return (
    <AppRouterCacheProvider>
      <LocalizationProvider 
        dateAdapter={AdapterDayjs}
        adapterLocale={dayjsLocale}
        localeText={localeText}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </LocalizationProvider>
    </AppRouterCacheProvider>
  )
}


