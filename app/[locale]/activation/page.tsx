import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/routing'
import { Box, Card, CardContent, Stack, Typography, Divider } from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

import CopyToClipboardButton from '@/components/common/CopyToClipboardButton'
import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import { Link } from '@/i18n/routing'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

export async function generateMetadata() {
  const t = await getTranslations('activation')
  return {
    title: `${t('title')} | Stavky`,
  }
}

export default async function ActivationPage({
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
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/activation' } }, locale })
  }

  // Check if user is already active - redirect to bettings
  const { data: profile } = await supabase
    .from('users')
    .select('account_active_until,role')
    .eq('id', user!.id)
    .single()

  if (profile?.role === 'betting') {
    redirect({ href: '/bettings', locale })
  }

  const isActive = profile?.account_active_until
    && new Date(profile.account_active_until) >= new Date()

  if (isActive) {
    redirect({ href: '/bettings', locale })
  }

  // Fetch activation settings
  const { data: settings } = await supabase
    .from('activation_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  const monthlyPrice = settings?.monthly_price ?? 40
  const yearlyPrice = settings?.yearly_price ?? 360
  const iban = settings?.iban ?? ''

  // Get locale-specific message
  const messageKey = `message_${locale}` as keyof typeof settings
  const message = (settings && settings[messageKey] as string) || settings?.message_en || ''

  const t = await getTranslations('activation')

  return (
    <MainLayout>
      <TopNav />
      <PageSection>
        <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
          <Stack spacing={4} alignItems="center">
            <AccountBalanceIcon sx={{ fontSize: 64, color: 'primary.main' }} />

            <Typography variant="h4" fontWeight={700} textAlign="center">
              {t('heading')}
            </Typography>

            <Typography variant="body1" color="text.secondary" textAlign="center">
              {t('description')}
            </Typography>

            {message && (
              <Typography variant="body1" textAlign="center" sx={{ whiteSpace: 'pre-line' }}>
                {message}
              </Typography>
            )}

            {/* Pricing Cards */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ width: '100%' }}>
              <Card variant="outlined" sx={{ flex: 1 }}>
                <CardContent>
                  <Stack spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      {t('monthlyPrice')}
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="primary.main">
                      {monthlyPrice}€
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('perMonth')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ flex: 1, borderColor: 'primary.main', borderWidth: 2 }}>
                <CardContent>
                  <Stack spacing={1} alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      {t('yearlyPrice')}
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="primary.main">
                      {yearlyPrice}€
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('perYear')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            {/* IBAN Section */}
            {iban && (
              <>
                <Divider sx={{ width: '100%' }} />
                <Card variant="outlined" sx={{ width: '100%', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Stack spacing={2} alignItems="center">
                      <Typography variant="subtitle1" fontWeight={600}>
                        {t('paymentInstructions')}
                      </Typography>
                      <Stack spacing={0.5} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {t('ibanLabel')}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ fontFamily: 'monospace', letterSpacing: 1 }}
                          >
                            {iban}
                          </Typography>
                          <CopyToClipboardButton text={iban} />
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </>
            )}

            <Link href="/">
              {t('backToHome')}
            </Link>
          </Stack>
        </Box>
      </PageSection>
    </MainLayout>
  )
}
