import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import ActiveTipsList, {
  type TipRecord,
} from '@/components/bettings/ActiveTipsList'
import TopNav from '@/components/navigation/TopNav'
import ContactForm from '@/components/contact/ContactForm'
import { Alert, Box, Typography, Stack, Button } from '@mui/material'
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
            odds,
            status,
            created_at,
            stake,
            total_win,
            betting_tip_items (
              id,
              match,
              odds,
              match_date,
              status,
              sport,
              league,
              betting_companies ( name )
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
          match_date: earliestDate || tip.created_at || new Date().toISOString(),
          status: tip.status,
          betting_companies: null,
          sports: null,
          leagues: null,
          stake: tip.stake ?? null,
          total_win: tip.total_win ?? null,
          items: tip.betting_tip_items.map((item: any) => ({
            id: item.id,
            match: item.match,
            odds: item.odds,
            match_date: item.match_date,
            status: item.status,
            betting_companies: item.betting_companies
              ? { name: item.betting_companies.name ?? null }
              : null,
            sports: item.sport ? { name: item.sport } : null,
            leagues: item.league ? { name: item.league } : null,
          })),
        }
      }
      
      // Fallback: use created_at if no items
      return {
        id: tip.id,
        match: tip.description || 'Unknown',
        odds: tip.odds,
        match_date: tip.created_at || new Date().toISOString(),
        status: tip.status,
        betting_companies: null,
        sports: null,
        leagues: null,
        stake: tip.stake ?? null,
        total_win: tip.total_win ?? null,
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
  const contactMessages = messages.contact as Record<string, string>
  const t = (key: string): string => {
    return bettingsMessages[key] || key
  }
  const tContact = (key: string): string => {
    return contactMessages[key] || key
  }
  const subtitle = activeAccount
    ? t('subtitleActive')
    : t('subtitleInactive')

  // Check if user is inactive customer (not betting admin and account not active)
  const isInactiveCustomer = profile?.role === 'customer' && !activeAccount

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
          <Stack spacing={3}>
            <Alert severity="info">
              {t('accountNotActive')}
            </Alert>
            {isInactiveCustomer && (
              <>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {tContact('bettingPageTitle')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {tContact('bettingPageDescription')}
                  </Typography>
                  <ContactForm showTitle={false} showDescription={false} />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t('statistics') || 'Statistics'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('viewStatisticsDescription') || 'View your betting statistics and past tips.'}
                  </Typography>
                  <Button
                    variant="outlined"
                    href={`/${locale}/statistics`}
                    sx={{ mt: 1 }}
                  >
                    {t('viewStatistics') || 'View Statistics'}
                  </Button>
                </Box>
              </>
            )}
          </Stack>
        )}
      </PageSection>
    </MainLayout>
  )
}


