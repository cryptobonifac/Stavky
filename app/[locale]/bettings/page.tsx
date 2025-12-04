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
    redirect('/login', { locale, searchParams: { redirectedFrom: '/bettings' } })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('account_active_until,role')
    .eq('id', user.id)
    .single()

  const isBettingAdmin = profile?.role === 'betting'

  const activeAccount =
    isBettingAdmin ||
    (profile ? isAccountActive(profile.account_active_until) : false)

  const { data: tips } = activeAccount
    ? await supabase
        .from('betting_tips')
        .select(
          `
            id,
            match,
            odds,
            match_date,
            status,
            betting_companies ( name ),
            sports ( name ),
            leagues ( name )
          `
        )
        .eq('status', 'pending')
        .gte('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
    : { data: [] }

  const normalizedTips: TipRecord[] = ((tips ?? []) as any[]).map((tip) => ({
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
  }))

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


