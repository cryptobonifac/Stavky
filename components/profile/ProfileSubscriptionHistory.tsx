'use client'

import dayjs from 'dayjs'
import {
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'

export type SubscriptionHistoryEntry = {
  id: string
  month: string
  valid_to: string | null
  next_month_free: boolean | null
}

type ProfileSubscriptionHistoryProps = {
  entries: SubscriptionHistoryEntry[]
}

const ProfileSubscriptionHistory = ({
  entries,
}: ProfileSubscriptionHistoryProps) => {
  const t = useTranslations('profile')
  const locale = useLocale()

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">{t('subscriptionHistory')}</Typography>
          {entries.length === 0 ? (
            <Typography color="text.secondary">
              {t('noSubscriptionRecords')}
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('month')}</TableCell>
                  <TableCell>{t('validTo')}</TableCell>
                  <TableCell>{t('freeMonth')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.month).toLocaleString(locale, {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      {entry.valid_to
                        ? dayjs(entry.valid_to).format('DD.MM.YYYY')
                        : t('notSet')}
                    </TableCell>
                    <TableCell>
                      {entry.next_month_free ? (
                        <Chip label={t('granted')} size="small" color="success" />
                      ) : (
                        <Chip label={t('no')} size="small" variant="outlined" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ProfileSubscriptionHistory


