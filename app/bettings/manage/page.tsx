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
    .order('match_date', { ascending: true })

  return (
    <MainLayout>
      <PageSection
        title="Pending tips"
        subtitle="Evaluate recent picks and mark them as win or loss."
      >
        <PendingTipsList tips={(tips ?? []) as TipRecord[]} />
      </PageSection>
    </MainLayout>
  )
}


