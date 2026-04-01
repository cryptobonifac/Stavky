import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import UserManagementSection from '@/components/settings/UserManagementSection'
import ActivationSettingsSection from '@/components/settings/ActivationSettingsSection'
import type { ManagedUser } from '@/components/settings/UserListSection'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'
import { Box, Paper, Stack, Typography } from '@mui/material'

export async function generateMetadata() {
  const t = await getTranslations('settings.activationSettings')
  return {
    title: `${t('title')} | Stavky`,
  }
}

export default async function AdminActivationPage({
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
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/admin/activation' } }, locale })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect({ href: '/bettings', locale })
  }

  const [usersRes, activationRes] = await Promise.all([
    supabase
      .from('users')
      .select('id,email,role,account_active_until')
      .order('email'),
    supabase
      .from('activation_settings')
      .select('*')
      .limit(1)
      .maybeSingle(),
  ])

  const managedUsers = (usersRes.data ?? []) as ManagedUser[]

  const t = await getTranslations('settings.activationSettings')

  return (
    <MainLayout>
      <TopNav />
      <PageSection>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
            {t('title')}
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Stack spacing={4}>
              <UserManagementSection users={managedUsers} />
              <ActivationSettingsSection settings={activationRes.data ?? null} />
            </Stack>
          </Paper>
        </Box>
      </PageSection>
    </MainLayout>
  )
}
