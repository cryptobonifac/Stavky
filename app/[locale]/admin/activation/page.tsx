import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import AdminActivationPanel from '@/components/admin/AdminActivationPanel'
import type { ManagedUser } from '@/components/admin/AdminActivationPanel'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'
import { Box, Typography } from '@mui/material'

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
      .select('id,email,role,account_active_until,reference_number')
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
      <PageSection maxWidth="xl">
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
            {t('title')}
          </Typography>
          <AdminActivationPanel
            users={managedUsers}
            settings={activationRes.data ?? null}
          />
        </Box>
      </PageSection>
    </MainLayout>
  )
}
