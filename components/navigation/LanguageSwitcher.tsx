'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
} from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'cs', label: 'Čeština' },
  { code: 'sk', label: 'Slovenčina' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname() // Returns pathname WITHOUT locale prefix (e.g., "/" or "/bettings")
  const params = useParams()
  // Get locale from URL params or fallback to useLocale hook
  const currentLocale = (params?.locale as string) || locale

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLocale = event.target.value

    // Don't do anything if already on the selected locale
    if (newLocale === currentLocale) {
      return
    }

    // Get current pathname from browser
    if (typeof window === 'undefined') return
    
    const currentPath = window.location.pathname
    
    // Extract the path without locale prefix
    // Examples:
    // "/cs" -> "/"
    // "/cs/bettings" -> "/bettings"
    // "/en/profile" -> "/profile"
    const localeMatch = currentPath.match(/^\/(en|cs|sk)(\/.*)?$/)
    
    let pathWithoutLocale = '/'
    if (localeMatch) {
      // match[2] is the path after locale (e.g., "/bettings" or undefined)
      pathWithoutLocale = localeMatch[2] || '/'
    }
    
    // Construct the new path with the new locale
    const newPath = pathWithoutLocale === '/' 
      ? `/${newLocale}` 
      : `/${newLocale}${pathWithoutLocale}`

    // Navigate to the new path using window.location for reliability
    window.location.href = newPath
  }

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="language-select-label">
        <LanguageIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
      </InputLabel>
      <Select
        labelId="language-select-label"
        value={currentLocale}
        onChange={handleLanguageChange}
        label={
          <LanguageIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
        }
        data-testid="language-switcher-select"
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code} data-testid={`language-option-${lang.code}`}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

