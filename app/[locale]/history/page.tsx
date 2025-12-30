import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import HistoryMonthView, {
  type HistoryMonth,
} from '@/components/history/HistoryMonthView'
import TopNav from '@/components/navigation/TopNav'
import type { TipRecord } from '@/components/bettings/ActiveTipsList'
import { Alert } from '@mui/material'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'History | Stavky',
}

const HISTORY_MONTHS_LIMIT = 12

type TipMonthSummary = {
  month_start: string
  wins: number
  losses: number
  pending: number
  total: number
  success_rate: number
}

const isAccountActive = (accountActiveUntil: string | null) => {
  if (!accountActiveUntil) {
    return false
  }
  return new Date(accountActiveUntil) >= new Date()
}

const toMonthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
    2,
    '0'
  )}`

const aggregateMonths = (
  tips: TipRecord[],
  summaries: TipMonthSummary[],
  locale: string
): HistoryMonth[] => {
  const summaryMap = new Map(
    summaries.map((summary) => [
      toMonthKey(new Date(summary.month_start)),
      summary,
    ])
  )

  const groupMap = new Map<
    string,
    { label: string; tips: TipRecord[]; wins: number; losses: number; pending: number }
  >()

  tips.forEach((tip) => {
    const date = new Date(tip.match_date)
    const key = toMonthKey(date)
    const label = date.toLocaleString(locale, {
      month: 'long',
      year: 'numeric',
    })
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        label,
        tips: [],
        wins: 0,
        losses: 0,
        pending: 0,
      })
    }
    const entry = groupMap.get(key)!
    entry.tips.push(tip)
    if (tip.status === 'win') entry.wins += 1
    else if (tip.status === 'loss') entry.losses += 1
    else entry.pending += 1
  })

  const allKeys = Array.from(
    new Set([
      ...Array.from(groupMap.keys()),
      ...Array.from(summaryMap.keys()),
    ])
  )

  return allKeys
    .sort((a, b) => (a > b ? -1 : 1))
    .map((key) => {
      const tipGroup = groupMap.get(key)
      const summary = summaryMap.get(key)
      const wins = summary?.wins ?? tipGroup?.wins ?? 0
      const losses = summary?.losses ?? tipGroup?.losses ?? 0
      const pending = summary?.pending ?? tipGroup?.pending ?? 0
      const total = summary?.total ?? tipGroup?.tips.length ?? 0
      const decided = wins + losses
      const successRate =
        summary?.success_rate ??
        (decided === 0 ? 0 : (wins / decided) * 100)

      const label =
        tipGroup?.label ??
        new Date(`${key}-01T00:00:00Z`).toLocaleString(locale, {
          month: 'long',
          year: 'numeric',
        })

      return {
        key,
        label,
        wins,
        losses,
        pending,
        total,
        successRate,
        tips: (tipGroup?.tips ?? []).sort((a, b) =>
          a.match_date > b.match_date ? -1 : 1
        ),
      }
    })
    .filter((entry) => entry.total > 0 || entry.tips.length > 0)
}

export default async function HistoryPage({
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
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/history' } }, locale })
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('account_active_until,role')
    .eq('id', user!.id)
    .single()

  const activeAccount = profile
    ? isAccountActive(profile.account_active_until)
    : false
  const isBettingAdmin = profile?.role === 'betting'

  // Allow history access for all logged-in users (including inactive accounts)
  let tips: TipRecord[] = []
  let monthlySummaries: TipMonthSummary[] = []

  // Fetch data for all logged-in users
  if (user) {
    const cutoff = new Date()
    cutoff.setUTCDate(1)
    cutoff.setUTCHours(0, 0, 0, 0)
    cutoff.setUTCMonth(cutoff.getUTCMonth() - (HISTORY_MONTHS_LIMIT - 1))
    const cutoffIso = cutoff.toISOString()

    const [tipsRes, summaryRes] = await Promise.all([
      supabase
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
          result_id,
          betting_companies:betting_company_id (name),
          results:result_id (name)
        `
        )
        .gte('match_date', cutoffIso)
        .order('match_date', { ascending: false }),
      supabase.rpc('tip_monthly_summary', {
        months_back: HISTORY_MONTHS_LIMIT,
      }),
    ])

    // Normalize tips data - each tip is now a single record
    tips = ((tipsRes.data ?? []) as any[]).map((tip) => {
      // Build match description from sport, league, match, result
      const companyName = (tip.betting_companies as any)?.name || ''
      const sport = tip.sport || ''
      const league = tip.league || ''
      const match = tip.match || ''
      // Result name is displayed as-is from database (not translated: 1, 2, X)
      const resultName = (tip.results as any)?.name || ''
      
      const parts = [companyName, sport, league, match, resultName].filter(Boolean)
      const matchDescription = parts.length > 0 ? parts.join(' ') : 'Unknown'
      
      return {
        id: tip.id,
        match: matchDescription,
        odds: tip.odds,
        match_date: tip.match_date || tip.created_at || new Date().toISOString(),
        status: tip.status,
        stake: tip.stake ?? null,
        total_win: tip.total_win ?? null,
      }
    }) as TipRecord[]
    monthlySummaries = ((summaryRes.data ?? []) as TipMonthSummary[]).map(
      (entry) => ({
        ...entry,
        success_rate:
          typeof entry.success_rate === 'string'
            ? Number(entry.success_rate)
            : entry.success_rate ?? 0,
      })
    )
  }

  const months = aggregateMonths(tips, monthlySummaries, locale)
  
  // Load translations explicitly with locale to ensure correct language
  const messages = (await import(`../../../messages/${locale}.json`)).default
  const historyMessages = messages.history as Record<string, string>
  const t = (key: string): string => {
    return historyMessages[key] || key
  }

  return (
    <MainLayout>
      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />
      <PageSection>
        <HistoryMonthView months={months} userRole={profile?.role} />
      </PageSection>
    </MainLayout>
  )
}


