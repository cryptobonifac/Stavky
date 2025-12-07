import { redirect } from 'next/navigation'

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

export default async function BettingTipsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectedFrom=/bettings')
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

  const subtitle = activeAccount
    ? 'Browse your live pending picks. This feed refreshes automatically as new bets are published.'
    : 'Only active customers can access this feed. Tips update automatically as new picks are published.'

  return (
    <MainLayout>
      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />
      <PageSection
        title="Active betting tips"
        subtitle={subtitle}
      >
        {activeAccount ? (
          <ActiveTipsList tips={normalizedTips} />
        ) : (
          <Alert severity="info">
            Your account is not active yet. Once your subscription is confirmed
            you will see the full list of pending tips here.
          </Alert>
        )}
      </PageSection>
    </MainLayout>
  )
}


