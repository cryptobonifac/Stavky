import { redirect } from 'next/navigation'
import { Stack } from '@mui/material'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import ProfileInfoCard from '@/components/profile/ProfileInfoCard'
import ProfileDetailsForm from '@/components/profile/ProfileDetailsForm'
import ProfileSubscriptionHistory, {
  type SubscriptionHistoryEntry,
} from '@/components/profile/ProfileSubscriptionHistory'
import type { UserProfile } from '@/components/providers/auth-provider'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Profile | Stavky',
}

export default async function ProfilePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectedFrom=/profile')
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('id,email,role,account_active_until,full_name')
    .eq('id', user!.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // TypeScript: profile is guaranteed to be non-null after redirect check
  const { data: subscriptions } = await supabase
    .from('user_subscriptions')
    .select('id,month,valid_to,next_month_free')
    .eq('user_id', profile!.id)
    .order('month', { ascending: false })

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

  return (
    <MainLayout>
      <PageSection
        title="Profile"
        subtitle="Review your account details and keep your personal information up to date."
      >
        <Stack spacing={3}>
          <ProfileInfoCard profile={profileData} />
          <ProfileDetailsForm profile={profileData} />
          <ProfileSubscriptionHistory entries={subscriptionHistory} />
        </Stack>
      </PageSection>
    </MainLayout>
  )
}


