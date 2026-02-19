import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import ActiveTipsList, {
  type TipRecord,
} from '@/components/bettings/ActiveTipsList'
import TopNav from '@/components/navigation/TopNav'
import ProfileRefresher from '@/components/bettings/ProfileRefresher'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

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

  // Redirect non-active customers to subscription page
  if (!activeAccount) {
    redirect({ href: '/subscription', locale })
  }

  const now = new Date().toISOString()
  const { data: tips } = await supabase
    .from('betting_tip')
    .select(
      `
        id,
        sport,
        league,
        match,
        odds,
        status,
        match_date,
        created_at,
        stake,
        total_win,
        betting_companies:betting_company_id ( name )
      `
    )
    .eq('status', 'pending')
    .order('match_date', { ascending: false })

  const normalizedTips: TipRecord[] = ((tips ?? []) as any[])
    .map((tip) => {
      // Build match description from sport, league, match
      const companyName = (tip.betting_companies as any)?.name || ''
      const sport = tip.sport || ''
      const league = tip.league || ''
      const match = tip.match || ''
      
      const parts = [companyName, sport, league, match].filter(Boolean)
      const matchDescription = parts.length > 0 ? parts.join(' ') : 'Unknown'
      
      return {
        id: tip.id,
        match: matchDescription,
        odds: tip.odds,
        match_date: tip.match_date || tip.created_at || new Date().toISOString(),
        status: tip.status,
        stake: tip.stake ?? null,
        total_win: tip.total_win ?? null,
        betting_companies: tip.betting_companies
          ? { name: tip.betting_companies.name ?? null }
          : null,
        sports: tip.sport ? { name: tip.sport } : null,
        leagues: tip.league ? { name: tip.league } : null,
      }
    })
    // Filter to only show upcoming matches
    .filter((tip) => {
      return tip.match_date ? new Date(tip.match_date) >= new Date(now) : false
    })

  return (
    <MainLayout>
      <ProfileRefresher />
      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />
      <PageSection>
        <ActiveTipsList tips={normalizedTips} />
      </PageSection>
    </MainLayout>
  )
}


