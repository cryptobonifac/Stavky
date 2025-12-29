import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'
import { Stack } from '@mui/material'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import ProfileInfoCard from '@/components/profile/ProfileInfoCard'
import ProfileSubscriptionHistory, {
  type SubscriptionHistoryEntry,
} from '@/components/profile/ProfileSubscriptionHistory'
import type { UserProfile } from '@/components/providers/auth-provider'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function generateMetadata() {
  const t = await getTranslations('profile')
  return {
    title: `${t('title')} | Stavky`,
  }
}

export default async function ProfilePage({
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
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/profile' } }, locale })
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('id,email,role,account_active_until,full_name')
    .eq('id', user!.id)
    .single()

  if (!profile) {
    redirect({ href: '/login', locale })
  }

  // TypeScript: profile is guaranteed to be non-null after redirect check
  const { data: subscriptions } = await supabase
    .from('user_subscriptions')
    .select('id,month,valid_to,next_month_free')
    .eq('user_id', profile!.id)
    .order('month', { ascending: false })

  // TypeScript: profile is guaranteed to be non-null after redirect check
  const profileData: UserProfile = {
    id: profile!.id,
    email: profile!.email,
    role: profile!.role as UserProfile['role'],
    account_active_until: profile!.account_active_until,
    full_name: profile!.full_name,
  }

  const subscriptionHistory: SubscriptionHistoryEntry[] = (subscriptions ?? []).map(
    (entry) => ({
      id: entry.id,
      month: entry.month,
      valid_to: entry.valid_to,
      next_month_free: entry.next_month_free,
    })
  )

  // Load translations explicitly with locale to ensure correct language
  const messages = (await import(`../../../messages/${locale}.json`)).default
  const profileMessages = messages.profile as Record<string, string>
  const t = (key: string): string => {
    return profileMessages[key] || key
  }
  
  return (
    <MainLayout>
      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />
      <PageSection
      >
        <Stack spacing={3}>
          <ProfileInfoCard profile={profileData} />
          <ProfileSubscriptionHistory entries={subscriptionHistory} />
        </Stack>
      </PageSection>
    </MainLayout>
  )
}


