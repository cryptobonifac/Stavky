import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import ActiveTipsList, {
  type TipRecord,
} from '@/components/bettings/ActiveTipsList'
import TopNav from '@/components/navigation/TopNav'
import { Alert } from '@mui/material'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Betting tips | Stavky',
}

const isAccountActive = (accountActiveUntil: string | null) => {
  if (!accountActiveUntil) {
    return false
  }
  return new Date(accountActiveUntil) >= new Date()
}

export default async function BettingTipsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/bettings' } }, locale })
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('account_active_until,role')
    .eq('id', user!.id)
    .single()

  const isBettingAdmin = profile?.role === 'betting'

  const activeAccount =
    isBettingAdmin ||
    (profile ? isAccountActive(profile.account_active_until) : false)

  const now = new Date().toISOString()
  const { data: tips } = activeAccount
    ? await supabase
        .from('betting_tips')
        .select(
          `
            id,
            description,
            match,
            odds,
            match_date,
            status,
            created_at,
            betting_companies ( name ),
            sports ( name ),
            leagues ( name ),
            betting_tip_items (
              id,
              match,
              odds,
              match_date,
              status,
              betting_companies ( name ),
              sports ( name ),
              leagues ( name )
            )
          `
        )
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
    : { data: [] }

  const normalizedTips: TipRecord[] = ((tips ?? []) as any[])
    .map((tip) => {
      // New structure: has items
      if (tip.betting_tip_items && tip.betting_tip_items.length > 0) {
        // Use the earliest match_date from items
        const earliestDate = tip.betting_tip_items.reduce((earliest: string, item: any) => {
          return !earliest || new Date(item.match_date) < new Date(earliest)
            ? item.match_date
            : earliest
        }, null)
        
        return {
          id: tip.id,
          match: tip.description || `Combined bet with ${tip.betting_tip_items.length} tips`,
          odds: tip.odds,
          match_date: earliestDate || tip.match_date || new Date().toISOString(),
          status: tip.status,
          betting_companies: null,
          sports: null,
          leagues: null,
          items: tip.betting_tip_items.map((item: any) => ({
            id: item.id,
            match: item.match,
            odds: item.odds,
            match_date: item.match_date,
            status: item.status,
            betting_companies: item.betting_companies
              ? { name: item.betting_companies.name ?? null }
              : null,
            sports: item.sports ? { name: item.sports.name ?? null } : null,
            leagues: item.leagues ? { name: item.leagues.name ?? null } : null,
          })),
        }
      }
      
      // Legacy structure: single tip
      return {
        id: tip.id,
        match: tip.match,
        odds: tip.odds,
        match_date: tip.match_date,
        status: tip.status,
        betting_companies: tip.betting_companies
          ? { name: tip.betting_companies.name ?? null }
          : null,
        sports: tip.sports ? { name: tip.sports.name ?? null } : null,
        leagues: tip.leagues ? { name: tip.leagues.name ?? null } : null,
      }
    })
    // Filter to only show upcoming matches
    .filter((tip) => {
      // For combined bets with items, check if earliest match_date is in the future
      if (tip.items && tip.items.length > 0) {
        const earliestItemDate = tip.items.reduce((earliest: string, item: any) => {
          return !earliest || new Date(item.match_date) < new Date(earliest)
            ? item.match_date
            : earliest
        }, null)
        return earliestItemDate ? new Date(earliestItemDate) >= new Date(now) : false
      }
      // For legacy tips, check if match_date is in the future
      return tip.match_date ? new Date(tip.match_date) >= new Date(now) : false
    })

  // Load translations explicitly with locale to ensure correct language
  const messages = (await import(`../../../messages/${locale}.json`)).default
  const bettingsMessages = messages.bettings as Record<string, string>
  const t = (key: string): string => {
    return bettingsMessages[key] || key
  }
  const subtitle = activeAccount
    ? t('subtitleActive')
    : t('subtitleInactive')

  return (
    <MainLayout>
      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />
      <PageSection
        title={t('title')}
        subtitle={subtitle}
      >
        {activeAccount ? (
          <ActiveTipsList tips={normalizedTips} />
        ) : (
          <Alert severity="info">
            {t('accountNotActive')}
          </Alert>
        )}
      </PageSection>
    </MainLayout>
  )
}


