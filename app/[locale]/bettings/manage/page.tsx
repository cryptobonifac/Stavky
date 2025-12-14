import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import PendingTipsList from '@/components/admin/PendingTipsList'
import type { TipRecord } from '@/components/bettings/ActiveTipsList'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Manage betting tips | Stavky',
}

export default async function ManageBettingTipsPage() {
  const locale = await getLocale()
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/bettings/manage' } }, locale })
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect({ href: '/bettings', locale })
  }

  const { data: tips } = await supabase
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
        betting_companies ( name ),
        betting_tip_items (
          id,
          match,
          odds,
          match_date,
          status,
          sport,
          league
        )
      `
    )
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  // Normalize tips data to match TipRecord type
  const normalizedTips: TipRecord[] = ((tips ?? []) as any[]).map((tip) => {
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
        betting_companies: tip.betting_companies
          ? { name: tip.betting_companies.name ?? null }
          : null,
        sports: null,
        leagues: null,
        items: tip.betting_tip_items.map((item: any) => ({
          id: item.id,
          match: item.match,
          odds: item.odds,
          match_date: item.match_date,
          status: item.status,
          betting_companies: tip.betting_companies
            ? { name: tip.betting_companies.name ?? null }
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
    }
  })
  
  return (
    <MainLayout>
      <TopNav
        showSettingsLink={true}
        canAccessSettings={true}
      />
      <PageSection>
        <PendingTipsList tips={normalizedTips} />
      </PageSection>
    </MainLayout>
  )
}


