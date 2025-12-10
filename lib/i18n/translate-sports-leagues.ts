/**
 * Helper functions to translate sports and leagues based on locale
 * Sports and leagues are stored in English in the database
 * Translations from English to Slovak/Czech are provided via message files
 */

import { useTranslations } from 'next-intl'

/**
 * Hook to get translation functions for sports and leagues
 * Use this in client components
 */
export function useSportLeagueTranslations() {
  const tSport = useTranslations('sports')
  const tLeague = useTranslations('leagues')

  return {
    translateSport: (sportName: string | null | undefined): string => {
      if (!sportName) return ''
      return tSport(sportName) || sportName
    },
    translateLeague: (leagueName: string | null | undefined): string => {
      if (!leagueName) return ''
      return tLeague(leagueName) || leagueName
    },
  }
}

/**
 * Server-side translation function for sports
 * Use this in server components
 */
export function translateSport(
  sportName: string | null | undefined,
  messages: Record<string, any>
): string {
  if (!sportName) return ''
  return messages?.sports?.[sportName] || sportName
}

/**
 * Server-side translation function for leagues
 * Use this in server components
 */
export function translateLeague(
  leagueName: string | null | undefined,
  messages: Record<string, any>
): string {
  if (!leagueName) return ''
  return messages?.leagues?.[leagueName] || leagueName
}

