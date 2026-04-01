import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import SystemConfigurationSection from '@/components/settings/SystemConfigurationSection'
import DangerZoneSection from '@/components/settings/DangerZoneSection'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'
import Grid from '@mui/material/Grid'
import { Box, Paper, Stack, Typography } from '@mui/material'

export async function generateMetadata() {
  const t = await getTranslations('settings')
  return {
    title: `${t('title')} | Stavky`,
  }
}

export default async function SettingsPage({
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
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/settings' } }, locale })
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('role,email')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect({ href: '/bettings', locale })
  }

  const [companiesRes, sportsRes] = await Promise.all([
    supabase.from('betting_companies').select('id,name').order('name'),
    supabase.from('sports').select('id,name').order('name'),
  ])

  // Load translations explicitly with locale to ensure correct language
  const messages = (await import(`../../../messages/${locale}.json`)).default
  const settingsMessages = messages.settings as Record<string, any>
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = settingsMessages
    for (const k of keys) {
      value = value?.[k]
    }
    return typeof value === 'string' ? value : key
  }

  return (
    <MainLayout>
      <TopNav />
      <PageSection>
        <Grid container spacing={3}>
          {/* System Configuration */}
          <Grid size={12}>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
                {t('systemConfiguration.title')}
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
                <SystemConfigurationSection
                  companies={companiesRes.data ?? []}
                  sports={sportsRes.data ?? []}
                />
              </Paper>
            </Box>
          </Grid>

          {/* Full Width - Danger Zone */}
          <Grid size={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'error.main',
                borderRadius: 2,
                bgcolor: 'error.50',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <WarningAmberIcon sx={{ color: 'error.main' }} />
                <Typography variant="subtitle1" fontWeight={600} color="error.main">
                  {t('dangerZone.title')}
                </Typography>
              </Stack>
              <DangerZoneSection />
            </Paper>
          </Grid>
        </Grid>
      </PageSection>
    </MainLayout>
  )
}
