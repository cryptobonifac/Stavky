import { redirect } from 'next/navigation'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import PendingTipsList from '@/components/admin/PendingTipsList'
import type { TipRecord } from '@/components/bettings/ActiveTipsList'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Manage betting tips | Stavky',
}

export default async function ManageBettingTipsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectedFrom=/bettings/manage')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect('/bettings')
  }

  const { data: tips } = await supabase
    .from('betting_tip')
    .select(
      `
        id,
        sport,
        league,
        match,
        odds,
        match_date,
        status,
        created_at,
        betting_companies:betting_company_id ( name )
      `
    )
    .eq('status', 'pending')
    .order('match_date', { ascending: false })

  // Normalize tips data to match TipRecord type
  const normalizedTips: TipRecord[] = ((tips ?? []) as any[]).map((tip) => {
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
      betting_companies: tip.betting_companies
        ? { name: tip.betting_companies.name ?? null }
        : null,
      sports: tip.sport ? { name: tip.sport } : null,
      leagues: tip.league ? { name: tip.league } : null,
    }
  })

  return (
    <MainLayout>
      <PageSection
        title="Pending tips"
        subtitle="Evaluate recent picks and mark them as win or loss."
      >
        <PendingTipsList tips={normalizedTips} />
      </PageSection>
    </MainLayout>
  )
}


