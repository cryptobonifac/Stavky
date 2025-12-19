import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import HistoryMonthView, {
  type HistoryMonth,
} from '@/components/history/HistoryMonthView'
import TopNav from '@/components/navigation/TopNav'
import type { TipRecord } from '@/components/bettings/ActiveTipsList'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import StatisticsLoading from './loading'

export const metadata = {
  title: 'Statistics | Stavky',
}

type TipMonthSummary = {
  month_start: string
  wins: number
  losses: number
  pending: number
  total: number
  success_rate: number
}

const toMonthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`

const aggregateMonths = (
  tips: TipRecord[],
  locale: string
): HistoryMonth[] => {
  const groupMap = new Map<
    string,
    { label: string; tips: TipRecord[]; wins: number; losses: number; pending: number }
  >()

  // Group tips by month
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

  // Convert to array and calculate success rates
  return Array.from(groupMap.entries())
    .map(([key, group]) => {
      const decided = group.wins + group.losses
      const successRate = decided === 0 ? 0 : (group.wins / decided) * 100

      return {
        key,
        label: group.label,
        wins: group.wins,
        losses: group.losses,
        pending: group.pending,
        total: group.tips.length,
        successRate,
        tips: group.tips.sort((a, b) =>
          a.match_date > b.match_date ? -1 : 1
        ),
      }
    })
    .sort((a, b) => (a.key > b.key ? -1 : 1)) // Sort by month key (newest first)
    .filter((entry) => entry.total > 0) // Only show months with tips
}

export default async function StatisticsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile for role check
  let profile = null
  if (user) {
    const { data: profileData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    
    profile = profileData
  }

  // Fetch all tips using admin client (public statistics)
  // Admin client uses service role key which bypasses RLS
  const adminSupabase = createAdminClient()

  // Fetch all betting_tip records - NO FILTERING, admin client bypasses RLS
  // Include betting_company_id and join with betting_companies to get company name
  const { data: allTips, error: tipsError } = await adminSupabase
    .from('betting_tip')
    .select(`
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
      betting_company_id,
      result_id,
      betting_companies:betting_company_id (name),
      results:result_id (name)
    `)
    .order('match_date', { ascending: false })

  if (tipsError) {
    console.error('❌ Error fetching tips:', tipsError)
  }

  // Debug: Log what we're actually fetching
  const tipsByStatus = {
    win: (allTips || []).filter((t: any) => t.status === 'win').length,
    loss: (allTips || []).filter((t: any) => t.status === 'loss').length,
    pending: (allTips || []).filter((t: any) => t.status === 'pending').length,
    total: (allTips || []).length,
  }
  console.log('📊 Fetched tips from database:', tipsByStatus)
  console.log('📊 Sample win tips:', (allTips || []).filter((t: any) => t.status === 'win').slice(0, 3))
  console.log('📊 Sample loss tips:', (allTips || []).filter((t: any) => t.status === 'loss').slice(0, 3))

  // Build tips array - include ALL tips regardless of status
  // Each tip is now a single record with all fields
  const tips: TipRecord[] = (allTips || []).map((tip: any) => {
    const companyName = (tip.betting_companies as any)?.name || ''
    const sport = tip.sport || ''
    const league = tip.league || ''
    const match = tip.match || ''
    const resultName = (tip.results as any)?.name || ''
    
    // Build match description for display (sport, league, match)
    const matchParts = [sport, league, match].filter(Boolean)
    const matchDescription = matchParts.join(' ')
    
    return {
      id: tip.id,
      match: matchDescription,
      odds: tip.odds,
      match_date: tip.match_date || tip.created_at,
      status: tip.status,
      stake: tip.stake ?? null,
      total_win: tip.total_win ?? null,
      // Add structured data for new design
      companyName,
      resultName,
    } as TipRecord & { companyName: string; resultName: string }
  })

  // Debug: Log processed tips
  const processedByStatus = {
    win: tips.filter((t) => t.status === 'win').length,
    loss: tips.filter((t) => t.status === 'loss').length,
    pending: tips.filter((t) => t.status === 'pending').length,
    total: tips.length,
  }
  console.log('📊 Processed tips array:', processedByStatus)
  console.log('📊 Sample processed win tips:', tips.filter((t) => t.status === 'win').slice(0, 3))

  // Group by month
  const months = aggregateMonths(tips, locale)
  
  // Debug: Log final months
  console.log('📊 Final months:', months.length)
  months.forEach((month) => {
    console.log(`📊 Month ${month.label}: ${month.wins} wins, ${month.losses} losses, ${month.pending} pending`)
  })
  
  const t = await getTranslations('statistics')

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
        <Suspense fallback={<StatisticsLoading />}>
          <HistoryMonthView months={months} userRole={profile?.role} />
        </Suspense>
      </PageSection>
    </MainLayout>
  )
}


