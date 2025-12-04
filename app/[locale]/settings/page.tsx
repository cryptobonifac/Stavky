import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import CampaignIcon from '@mui/icons-material/Campaign'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import UserListSection, {
  type ManagedUser,
} from '@/components/settings/UserListSection'
import BettingCompaniesSection from '@/components/settings/BettingCompaniesSection'
import MarketingSettingsSection from '@/components/settings/MarketingSettingsSection'
import FreeMonthOverrideSection from '@/components/settings/FreeMonthOverrideSection'
import { createClient as createServerClient } from '@/lib/supabase/server'
import Grid from '@mui/material/Grid'
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Divider,
  useTheme,
} from '@mui/material'

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
    redirect('/login', { locale, searchParams: { redirectedFrom: '/settings' } })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role,email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect('/bettings', { locale })
  }

  const [usersRes, companiesRes, marketingRes] = await Promise.all([
    supabase
      .from('users')
      .select('id,email,role,account_active_until')
      .order('email'),
    supabase.from('betting_companies').select('id,name').order('name'),
    supabase
      .from('marketing_settings')
      .select('id,key,value')
      .eq('key', 'free_month_rules')
      .maybeSingle(),
  ])

  const managedUsers = (usersRes.data ?? []) as ManagedUser[]

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
      <PageSection
        title={t('title')}
        subtitle={t('subtitle')}
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={4}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PeopleIcon fontSize="small" />
                    </Box>
                    <Typography variant="h5" fontWeight={600}>
                      {t('users.title')}
                    </Typography>
                  </Stack>
                </Box>
                <CardContent sx={{ pt: 3 }}>
                  <UserListSection users={managedUsers} />
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'secondary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CardGiftcardIcon fontSize="small" />
                    </Box>
                    <Typography variant="h5" fontWeight={600}>
                      {t('freeMonthOverride.title')}
                    </Typography>
                  </Stack>
                </Box>
                <CardContent sx={{ pt: 3 }}>
                  <FreeMonthOverrideSection users={managedUsers} />
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={4}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BusinessIcon fontSize="small" />
                    </Box>
                    <Typography variant="h5" fontWeight={600}>
                      {t('bettingCompanies.title')}
                    </Typography>
                  </Stack>
                </Box>
                <CardContent sx={{ pt: 3 }}>
                  <BettingCompaniesSection companies={companiesRes.data ?? []} />
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'secondary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CampaignIcon fontSize="small" />
                    </Box>
                    <Typography variant="h5" fontWeight={600}>
                      {t('marketing.title')}
                    </Typography>
                  </Stack>
                </Box>
                <CardContent sx={{ pt: 3 }}>
                  <MarketingSettingsSection settings={marketingRes.data ?? null} />
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </PageSection>
    </MainLayout>
  )
}


