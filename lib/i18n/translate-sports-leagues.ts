/**
 * Helper functions for sports and leagues
 * Sports and leagues are no longer translated - they are displayed as stored in the database
 */

/**
 * Hook to get functions for sports and leagues (kept for backward compatibility)
 * Use this in client components
 * Note: Sport translations have been removed - functions now just return the name
 */
export function useSportLeagueTranslations() {
  return {
    translateSport: (sportName: string | null | undefined): string => {
      if (!sportName) return ''
      return sportName
    },
    translateLeague: (leagueName: string | null | undefined): string => {
      if (!leagueName) return ''
      return leagueName
    },
  }
}

/**
 * Server-side function for sports (kept for backward compatibility)
 * Use this in server components
 * Note: Sport translations have been removed - function now just returns the name
 */
export function translateSport(
  sportName: string | null | undefined,
  messages?: Record<string, any>
): string {
  if (!sportName) return ''
  return sportName
}

/**
 * Server-side function for leagues (kept for backward compatibility)
 * Use this in server components
 * Note: League translations have been removed - function now just returns the name
 */
export function translateLeague(
  leagueName: string | null | undefined,
  messages?: Record<string, any>
): string {
  if (!leagueName) return ''
  return leagueName
}

