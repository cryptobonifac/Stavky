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

  // Fetch all tips and items using admin client (public statistics)
  // Admin client uses service role key which bypasses RLS
  const adminSupabase = createAdminClient()

  // Fetch all betting_tips - NO FILTERING, admin client bypasses RLS
  // Include betting_company_id and join with betting_companies to get company name
  const { data: allTips, error: tipsError } = await adminSupabase
    .from('betting_tips')
    .select(`
      id, 
      description, 
      odds, 
      status, 
      created_at, 
      stake, 
      total_win,
      betting_company_id,
      betting_companies:betting_company_id (name)
    `)
    .order('created_at', { ascending: false })

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

  // Fetch all betting_tip_items - NO FILTERING
  // Include sport, league, and odds for full format display
  const { data: allItems, error: itemsError } = await adminSupabase
    .from('betting_tip_items')
    .select('id, betting_tip_id, match, match_date, sport, league, odds')
    .order('match_date', { ascending: false })

  if (itemsError) {
    console.error('❌ Error fetching tip items:', itemsError)
  }

  console.log('📊 Fetched items from database:', (allItems || []).length)

  // Create map of tip_id -> items
  const itemsByTipId = new Map<string, any[]>()
  ;(allItems || []).forEach((item: any) => {
    const tipId = item.betting_tip_id
    if (!itemsByTipId.has(tipId)) {
      itemsByTipId.set(tipId, [])
    }
    itemsByTipId.get(tipId)!.push(item)
  })

  // Build tips array - include ALL tips regardless of status
  const tips: TipRecord[] = (allTips || []).map((tip: any) => {
    const tipItems = itemsByTipId.get(tip.id) || []
    
    // Get earliest match_date from items, or fallback to created_at
    let matchDate: string
    if (tipItems.length > 0) {
      const dates = tipItems.map((item: any) => item.match_date).filter(Boolean)
      if (dates.length > 0) {
        matchDate = dates.sort((a: string, b: string) => 
          new Date(a).getTime() - new Date(b).getTime()
        )[0]
      } else {
        matchDate = tip.created_at
      }
    } else {
      matchDate = tip.created_at
    }
    
    // Build match description
    let matchDescription = tip.description
    if (tipItems.length === 1) {
      // Single tip item - construct full format: [company] [sport] [league] [match] [odds]
      const item = tipItems[0]
      const companyName = (tip.betting_companies as any)?.name || ''
      const sport = item.sport || ''
      const league = item.league || ''
      const match = item.match || ''
      // Format odds with comma as decimal separator (European format)
      const odds = item.odds ? item.odds.toFixed(2).replace('.', ',') : ''
      
      // Build full format string, filtering out empty parts
      const parts = [companyName, sport, league, match, odds].filter(Boolean)
      matchDescription = parts.join(' ')
    } else if (tipItems.length > 1) {
      // Multiple items - use description or generic message
      matchDescription = tip.description || `Combined bet with ${tipItems.length} tips`
    } else if (!matchDescription) {
      // No items and no description
      matchDescription = 'Unknown'
    }
    
    return {
      id: tip.id,
      match: matchDescription,
      odds: tip.odds,
      match_date: matchDate,
      status: tip.status, // CRITICAL: Preserve original status from database
      stake: tip.stake ?? null,
      total_win: tip.total_win ?? null,
    }
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
          <HistoryMonthView months={months} />
        </Suspense>
      </PageSection>
    </MainLayout>
  )
}
