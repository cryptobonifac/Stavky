import { redirect } from 'next/navigation'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import UserListSection, {
  type ManagedUser,
} from '@/components/settings/UserListSection'
import BettingCompaniesSection from '@/components/settings/BettingCompaniesSection'
import SportsSection from '@/components/settings/SportsSection'
import MarketingSettingsSection from '@/components/settings/MarketingSettingsSection'
import FreeMonthOverrideSection from '@/components/settings/FreeMonthOverrideSection'
import { createClient as createServerClient } from '@/lib/supabase/server'
import Grid from '@mui/material/Grid'
import { Card, CardContent, Stack, Typography } from '@mui/material'

export const metadata = {
  title: 'Settings | Stavky',
}

export default async function SettingsPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectedFrom=/settings')
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('role,email')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect('/bettings')
  }

  const [usersRes, companiesRes, sportsRes, marketingRes] = await Promise.all([
    supabase
      .from('users')
      .select('id,email,role,account_active_until')
      .order('email'),
    supabase.from('betting_companies').select('id,name').order('name'),
    supabase.from('sports').select('id,name').order('name'),
    supabase
      .from('marketing_settings')
      .select('id,key,value')
      .eq('key', 'free_month_rules')
      .maybeSingle(),
  ])

  const managedUsers = (usersRes.data ?? []) as ManagedUser[]

  return (
    <MainLayout>
      <TopNav />
      <PageSection>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, xl: 7 }}>
            <Stack spacing={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Users & subscriptions
                  </Typography>
                  <UserListSection users={managedUsers} />
                </CardContent>
              </Card>
              <FreeMonthOverrideSection users={managedUsers} />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, xl: 5 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Betting companies
                    </Typography>
                    <BettingCompaniesSection companies={companiesRes.data ?? []} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Sports
                    </Typography>
                    <SportsSection sports={sportsRes.data ?? []} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Marketing & free month logic
                    </Typography>
                    <MarketingSettingsSection settings={marketingRes.data ?? null} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </PageSection>
    </MainLayout>
  )
}


