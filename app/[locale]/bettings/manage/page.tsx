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
    redirect('/login', { locale, searchParams: { redirectedFrom: '/bettings/manage' } })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect('/bettings', { locale })
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
      <TopNav
        showSettingsLink={true}
        canAccessSettings={true}
      />
      <PageSection>
        <PendingTipsList tips={(tips ?? []) as TipRecord[]} />
      </PageSection>
    </MainLayout>
  )
}


