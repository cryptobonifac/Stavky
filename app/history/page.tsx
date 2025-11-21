import { redirect } from 'next/navigation'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import HistoryMonthView, {
  type HistoryMonth,
} from '@/components/history/HistoryMonthView'
import type { TipRecord } from '@/components/bettings/ActiveTipsList'
import { Alert } from '@mui/material'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'History | Stavky',
}

const isAccountActive = (accountActiveUntil: string | null) => {
  if (!accountActiveUntil) {
    return false
  }
  return new Date(accountActiveUntil) >= new Date()
}

const aggregateMonths = (tips: TipRecord[]): HistoryMonth[] => {
  const map = new Map<
    string,
    {
      label: string
      tips: TipRecord[]
      wins: number
      losses: number
      pending: number
    }
  >()

  tips.forEach((tip) => {
    const date = new Date(tip.match_date)
    const key = `${date.getUTCFullYear()}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, '0')}`
    const label = date.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    })
    if (!map.has(key)) {
      map.set(key, { label, tips: [], wins: 0, losses: 0, pending: 0 })
    }
    const entry = map.get(key)!
    entry.tips.push(tip)
    if (tip.status === 'win') entry.wins += 1
    else if (tip.status === 'loss') entry.losses += 1
    else entry.pending += 1
  })

  return Array.from(map.entries())
    .sort(([a], [b]) => (a > b ? -1 : 1))
    .map(([key, data]) => {
      const decided = data.wins + data.losses
      const successRate =
        decided === 0 ? 0 : (data.wins / decided) * 100
      return {
        key,
        label: data.label,
        wins: data.wins,
        losses: data.losses,
        pending: data.pending,
        total: data.tips.length,
        successRate,
        tips: data.tips.sort((a, b) =>
          a.match_date > b.match_date ? -1 : 1
        ),
      }
    })
}

export default async function HistoryPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectedFrom=/history')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('account_active_until')
    .eq('id', user.id)
    .single()

  const activeAccount = profile
    ? isAccountActive(profile.account_active_until)
    : false

  const { data: tips } = activeAccount
    ? await supabase
        .from('betting_tips')
        .select('id,match,odds,match_date,status')
        .order('match_date', { ascending: false })
    : { data: [] }

  const months = aggregateMonths((tips ?? []) as TipRecord[])

  return (
    <MainLayout>
      <PageSection
        title="History & performance"
        subtitle="Review win/loss ratios grouped by calendar month."
      >
        {activeAccount ? (
          <HistoryMonthView months={months} />
        ) : (
          <Alert severity="info">
            Activate your account to unlock historical win/loss statistics.
            Contact admin to activate your account.
          </Alert>
        )}
      </PageSection>
    </MainLayout>
  )
}


