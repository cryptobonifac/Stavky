import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import ActiveCustomersList from '@/components/admin/ActiveCustomersList'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Active Customers | SmartBet365',
}

export type ActivationRecord = {
  id: string
  user_id: string
  active_from: string
  active_to: string
  created_at: string
}

export type ActiveCustomerData = {
  id: string
  email: string
  account_active_until: string | null
  reference_number: string | null
  status: 'active' | 'inactive'
  history: ActivationRecord[]
  totalActiveMonths: number
}

function calculateTotalActiveMonths(history: ActivationRecord[]): number {
  let totalDays = 0
  for (const record of history) {
    const from = new Date(record.active_from)
    const to = new Date(record.active_to)
    const diffMs = to.getTime() - from.getTime()
    totalDays += Math.max(0, diffMs / (1000 * 60 * 60 * 24))
  }
  return Math.round((totalDays / 30.44) * 10) / 10
}

export default async function ActiveCustomersPage() {
  const locale = await getLocale()
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/admin/active-customers' } }, locale })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect({ href: '/bettings', locale })
  }

  // Fetch all activation history
  const { data: history } = await supabase
    .from('activation_history')
    .select('id, user_id, active_from, active_to, created_at')
    .order('active_from', { ascending: false })

  // Get unique user IDs from history
  const userIdsWithHistory = [...new Set((history ?? []).map((h) => h.user_id))]

  if (userIdsWithHistory.length === 0) {
    return (
      <MainLayout>
        <TopNav showSettingsLink={true} canAccessSettings={true} />
        <PageSection>
          <ActiveCustomersList customers={[]} />
        </PageSection>
      </MainLayout>
    )
  }

  // Fetch user details for those with history
  const { data: users } = await supabase
    .from('users')
    .select('id, email, account_active_until, reference_number')
    .in('id', userIdsWithHistory)
    .order('email')

  // Group history by user_id
  const historyByUser = new Map<string, ActivationRecord[]>()
  for (const record of history ?? []) {
    const existing = historyByUser.get(record.user_id) ?? []
    existing.push(record)
    historyByUser.set(record.user_id, existing)
  }

  // Build customer data
  const now = new Date()
  const customerData: ActiveCustomerData[] = (users ?? []).map((u) => {
    const userHistory = historyByUser.get(u.id) ?? []
    const accountActiveUntil = u.account_active_until
      ? new Date(u.account_active_until)
      : null
    const isActive = accountActiveUntil && accountActiveUntil >= now

    return {
      id: u.id,
      email: u.email,
      account_active_until: u.account_active_until,
      reference_number: u.reference_number,
      status: isActive ? 'active' : 'inactive',
      history: userHistory,
      totalActiveMonths: calculateTotalActiveMonths(userHistory),
    }
  })

  return (
    <MainLayout>
      <TopNav showSettingsLink={true} canAccessSettings={true} />
      <PageSection>
        <ActiveCustomersList customers={customerData} />
      </PageSection>
    </MainLayout>
  )
}
