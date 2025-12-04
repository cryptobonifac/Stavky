# Internationalization (i18n) Setup Guide

This document describes the internationalization implementation for the Stavky application using `next-intl`.

## Overview

The application supports multiple languages:
- **English (en)** - Default language
- **Czech (cs)** - Česká republika
- **Slovak (sk)** - Slovensko

## Installation

The i18n setup uses `next-intl` library:

```bash
npm install next-intl
```

## Configuration Files

### 1. Routing Configuration (`i18n/routing.ts`)

Defines supported locales and default locale:

```typescript
export const routing = defineRouting({
  locales: ['en', 'cs', 'sk'],
  defaultLocale: 'en',
})
```

### 2. Request Configuration (`i18n/request.ts`)

Handles locale detection and message loading for each request.

### 3. Translation Files (`messages/`)

- `messages/en.json` - English translations
- `messages/cs.json` - Czech translations
- `messages/sk.json` - Slovak translations

## Project Structure

The application uses a locale-based routing structure:

```
app/
  [locale]/          # Locale segment
    layout.tsx       # Locale-specific layout
    page.tsx         # Homepage
    bettings/        # Betting tips page
    history/         # History page
    profile/         # Profile page
    ...
```

## App Router Setup

### Root Layout Structure

To properly implement i18n with Next.js App Router, you need to restructure your app directory:

**Before:**
```
app/
  layout.tsx
  page.tsx
  bettings/
  ...
```

**After:**
```
app/
  [locale]/
    layout.tsx
    page.tsx
    bettings/
    ...
```

### Migration Steps

1. **Create locale directory structure:**
   ```bash
   mkdir -p app/[locale]
   ```

2. **Move existing routes:**
   - Move all route directories into `app/[locale]/`
   - Keep API routes in `app/api/` (they don't need locale)

3. **Update layout.tsx:**
   ```typescript
   // app/[locale]/layout.tsx
   import { NextIntlClientProvider } from 'next-intl'
   import { getMessages } from 'next-intl/server'

   export default async function LocaleLayout({
     children,
     params: { locale }
   }: {
     children: React.ReactNode
     params: { locale: string }
   }) {
     const messages = await getMessages()

     return (
       <html lang={locale}>
         <body>
           <NextIntlClientProvider messages={messages}>
             {/* Your existing providers */}
             {children}
           </NextIntlClientProvider>
         </body>
       </html>
     )
   }
   ```

## Using Translations

### Server Components

```typescript
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations('home')
  const locale = useLocale()

  return (
    <h1>{t('title')}</h1>
  )
}
```

### Client Components

For client components, mark with `'use client'`:

```typescript
'use client'

import { useTranslations } from 'next-intl'

export default function MyClientComponent() {
  const t = useTranslations('navigation')

  return <button>{t('home')}</button>
}
```

### Formatting Values

```typescript
const t = useTranslations('manage')

// With parameters
t('confirmEvaluation', { status: 'win' })
```

## Language Switcher Component

A language switcher component is available at `components/navigation/LanguageSwitcher.tsx`.

To use it in your navigation:

```typescript
import LanguageSwitcher from '@/components/navigation/LanguageSwitcher'

export default function Navigation() {
  return (
    <nav>
      {/* Other nav items */}
      <LanguageSwitcher />
    </nav>
  )
}
```

## Middleware

The middleware (`middleware.ts`) handles:
- Locale detection from URL
- Automatic locale redirection
- Supabase session management
- Cookie handling

## Translation Keys Structure

Translation files are organized by feature:

```json
{
  "common": { ... },      // Common UI elements
  "home": { ... },        // Homepage content
  "auth": { ... },        // Authentication pages
  "bettings": { ... },    // Betting tips
  "history": { ... },     // Tip history
  "profile": { ... },     // User profile
  "newbet": { ... },      // New bet form
  "manage": { ... },      // Tip management
  "settings": { ... },    // Admin settings
  "navigation": { ... },  // Navigation items
  "errors": { ... }       // Error messages
}
```

## Adding New Translations

1. **Add key to all language files:**
   - `messages/en.json`
   - `messages/cs.json`
   - `messages/sk.json`

2. **Use the translation in your component:**
   ```typescript
   const t = useTranslations('yourNamespace')
   <p>{t('yourKey')}</p>
   ```

## URL Structure

With locale routing enabled:

- English: `/en/` or `/` (default)
- Czech: `/cs/`
- Slovak: `/sk/`

Example URLs:
- `/en/bettings` - English betting tips
- `/cs/bettings` - Czech betting tips
- `/sk/profile` - Slovak profile page

## Best Practices

1. **Always use translation keys** instead of hardcoded strings
2. **Keep translation files organized** by feature/namespace
3. **Test all languages** to ensure UI doesn't break with longer text
4. **Use proper formatting** for dates, numbers, and currencies
5. **Consider RTL languages** if expanding to Arabic/Hebrew

## Testing

To test different locales:

1. Visit `/en/` for English
2. Visit `/cs/` for Czech
3. Visit `/sk/` for Slovak
4. Use the language switcher component

## Troubleshooting

### Translations not showing

- Ensure `next-intl` is properly installed
- Check that translation files exist in `messages/`
- Verify middleware is configured correctly
- Check browser console for errors

### Locale not changing

- Clear browser cookies
- Check middleware configuration
- Verify routing configuration in `i18n/routing.ts`

### Build errors

- Ensure all translation keys exist in all language files
- Check for syntax errors in JSON files
- Verify Next.js config includes next-intl plugin

## Future Enhancements

Potential improvements:
- Add more languages (e.g., German, Polish)
- Implement locale-specific date/number formatting
- Add translation management tool integration
- Implement locale detection from browser settings
- Add RTL language support



