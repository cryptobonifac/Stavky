import dayjs from 'dayjs'
import { Card, CardContent, Chip, Stack, Typography } from '@mui/material'

import type { UserProfile } from '@/components/providers/auth-provider'
import { roleLabelMap } from '@/lib/auth/roles'

type ProfileInfoCardProps = {
  profile: UserProfile
}

const ProfileInfoCard = ({ profile }: ProfileInfoCardProps) => {
  const status =
    profile.account_active_until &&
    dayjs(profile.account_active_until).isAfter(dayjs())
      ? 'Active'
      : 'Inactive'

  const statusColor =
    status === 'Active' ? 'success' : ('default' as 'default' | 'success')

  const formattedDate = profile.account_active_until
    ? dayjs(profile.account_active_until).format('DD.MM.YYYY HH:mm')
    : 'Not set'

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5">Account overview</Typography>
            <Chip label={roleLabelMap[profile.role]} color="secondary" />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {profile.email}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Account status
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={status} color={statusColor} variant="outlined" />
              <Typography variant="body2" color="text.secondary">
                {status === 'Active'
                  ? `Valid until ${formattedDate}`
                  : 'No active subscription'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProfileInfoCard


