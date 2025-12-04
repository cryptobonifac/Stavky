'use client'

import dayjs from 'dayjs'
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useTranslations } from 'next-intl'

import type { UserProfile } from '@/components/providers/auth-provider'

type ProfileInfoCardProps = {
  profile: UserProfile
}

const ProfileInfoCard = ({ profile }: ProfileInfoCardProps) => {
  const t = useTranslations('profile')
  
  const status =
    profile.account_active_until &&
    dayjs(profile.account_active_until).isAfter(dayjs())
      ? 'active'
      : 'inactive'

  const statusColor =
    status === 'active' ? 'success' : ('default' as 'default' | 'success')

  const formattedDate = profile.account_active_until
    ? dayjs(profile.account_active_until).format('DD.MM.YYYY HH:mm')
    : t('notSet')

  const roleLabel = profile.role === 'betting' 
    ? t('roleBetting') 
    : t('roleCustomer')

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5">{t('accountOverview')}</Typography>
            <Chip label={roleLabel} color="secondary" />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {t('email')}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {profile.email}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {t('accountStatus')}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={t(status)} color={statusColor} variant="outlined" />
              <Typography variant="body2" color="text.secondary">
                {status === 'active'
                  ? `${t('validUntil')} ${formattedDate}`
                  : t('noActiveSubscription')}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProfileInfoCard


