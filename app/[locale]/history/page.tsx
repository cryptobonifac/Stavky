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
    redirect('/login', { locale, searchParams: { redirectedFrom: '/history' } })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('account_active_until,role')
    .eq('id', user.id)
    .single()

  const activeAccount = profile
    ? isAccountActive(profile.account_active_until)
    : false

  let tips: TipRecord[] = []
  let monthlySummaries: TipMonthSummary[] = []

  if (activeAccount) {
    const cutoff = new Date()
    cutoff.setUTCDate(1)
    cutoff.setUTCHours(0, 0, 0, 0)
    cutoff.setUTCMonth(cutoff.getUTCMonth() - (HISTORY_MONTHS_LIMIT - 1))
    const cutoffIso = cutoff.toISOString()

    const [tipsRes, summaryRes] = await Promise.all([
      supabase
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
          betting_tip_items (
            id,
            match,
            odds,
            match_date,
            status
          )
        `
        )
        .gte('created_at', cutoffIso)
        .order('created_at', { ascending: false }),
      supabase.rpc('tip_monthly_summary', {
        months_back: HISTORY_MONTHS_LIMIT,
      }),
    ])

    // Normalize tips data to handle both old and new structures
    tips = ((tipsRes.data ?? []) as any[]).map((tip) => {
      // New structure: has items
      if (tip.betting_tip_items && tip.betting_tip_items.length > 0) {
        // Use the earliest match_date from items for grouping
        const earliestDate = tip.betting_tip_items.reduce((earliest: string, item: any) => {
          return !earliest || new Date(item.match_date) < new Date(earliest)
            ? item.match_date
            : earliest
        }, null)
        
        return {
          id: tip.id,
          match: tip.description || `Combined bet with ${tip.betting_tip_items.length} tips`,
          odds: tip.odds,
          match_date: earliestDate || tip.match_date || tip.created_at || new Date().toISOString(),
          status: tip.status,
        }
      }
      
      // Legacy structure: single tip with match_date
      if (tip.match_date) {
        return {
          id: tip.id,
          match: tip.match,
          odds: tip.odds,
          match_date: tip.match_date,
          status: tip.status,
        }
      }
      
      // Fallback: use created_at if match_date is null
      return {
        id: tip.id,
        match: tip.match || tip.description || 'Unknown',
        odds: tip.odds,
        match_date: tip.created_at || new Date().toISOString(),
        status: tip.status,
      }
    })
    // Filter out tips that don't have a valid match_date within the cutoff period
    .filter((tip) => {
      const tipDate = new Date(tip.match_date)
      return tipDate >= new Date(cutoffIso)
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
      <PageSection
        title={t('title')}
        subtitle={t('subtitle')}
      >
        {activeAccount ? (
          <HistoryMonthView months={months} />
        ) : (
          <Alert severity="info">
            {t('accountNotActive')}
          </Alert>
        )}
      </PageSection>
    </MainLayout>
  )
}


