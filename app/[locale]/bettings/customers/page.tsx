import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import CustomersList from '@/components/admin/CustomersList'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Customers | Stavky',
}

type CustomerData = {
  id: string
  email: string
  created_at: string
  account_active_until: string | null
  valid_to: string | null
  status: 'active' | 'inactive'
  subscription_plan_type: 'monthly' | 'yearly' | 'one-time' | null
  sign_up_method: 'email' | 'google' | string | null
}

export default async function CustomersPage() {
  const locale = await getLocale()
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/bettings/customers' } }, locale })
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  // Log for debugging
  console.log('User ID:', user!.id)
  console.log('Profile:', profile)
  if (profileError) {
    console.error('Error fetching profile:', profileError)
  }

  if (profile?.role !== 'betting') {
    redirect({ href: '/bettings', locale })
  }

  // Fetch all customers
  const { data: customers, error: customersError } = await supabase
    .from('users')
    .select('id, email, created_at, account_active_until, role, subscription_plan_type, sign_up_method')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  // Log error for debugging
  if (customersError) {
    console.error('Error fetching customers:', customersError)
  }

  if (!customers || customers.length === 0) {
    const t = await getTranslations('customers')
    return (
      <MainLayout>
        <TopNav showSettingsLink={true} canAccessSettings={true} />
        <PageSection>
          <CustomersList customers={[]} />
        </PageSection>
      </MainLayout>
    )
  }

  // Fetch latest subscription valid_to for each customer
  const customerIds = customers.map((c) => c.id)
  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from('user_subscriptions')
    .select('user_id, valid_to, month')
    .in('user_id', customerIds)
    .order('month', { ascending: false })

  // Log error for debugging
  if (subscriptionsError) {
    console.error('Error fetching subscriptions:', subscriptionsError)
  }

  // Group subscriptions by user_id and get the latest valid_to
  const latestValidToByUser = new Map<string, string | null>()
  if (subscriptions) {
    subscriptions.forEach((sub) => {
      if (!latestValidToByUser.has(sub.user_id)) {
        latestValidToByUser.set(sub.user_id, sub.valid_to)
      }
    })
  }

  // Process customer data
  const now = new Date()
  const customerData: CustomerData[] = customers.map((customer) => {
    const latestValidTo = latestValidToByUser.get(customer.id) || null
    const accountActiveUntil = customer.account_active_until
      ? new Date(customer.account_active_until)
      : null
    const validToDate = latestValidTo ? new Date(latestValidTo) : null

    // User is active if account_active_until >= now OR latest valid_to >= now
    const isActive =
      (accountActiveUntil && accountActiveUntil >= now) ||
      (validToDate && validToDate >= now)

    return {
      id: customer.id,
      email: customer.email,
      created_at: customer.created_at,
      account_active_until: customer.account_active_until,
      valid_to: latestValidTo,
      status: isActive ? 'active' : 'inactive',
      subscription_plan_type: customer.subscription_plan_type,
      sign_up_method: customer.sign_up_method || 'email',
    }
  })

  const t = await getTranslations('customers')

  return (
    <MainLayout>
      <TopNav showSettingsLink={true} canAccessSettings={true} />
      <PageSection>
        <CustomersList customers={customerData} />
      </PageSection>
    </MainLayout>
  )
}








