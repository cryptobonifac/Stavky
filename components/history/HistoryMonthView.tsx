'use client'

import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import {
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { useTranslations, useLocale } from 'next-intl'

import type { TipRecord } from '@/components/bettings/ActiveTipsList'

dayjs.extend(localizedFormat)

export type HistoryMonth = {
  key: string
  label: string
  wins: number
  losses: number
  pending: number
  total: number
  successRate: number
  tips: TipRecord[]
}

type HistoryMonthViewProps = {
  months: HistoryMonth[]
}

const HistoryMonthView = ({ months }: HistoryMonthViewProps) => {
  const t = useTranslations('statistics')
  const tBettings = useTranslations('bettings')
  const locale = useLocale()
  const [selectedKey, setSelectedKey] = useState(months[0]?.key ?? '')
  const selectedMonth = useMemo(
    () => months.find((month) => month.key === selectedKey) ?? months[0],
    [months, selectedKey]
  )

  if (!selectedMonth) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography>{t('noHistoryYet')}</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        <Typography variant="h5">{t('monthlyPerformance')}</Typography>
        <Select
          value={selectedMonth.key}
          onChange={(event) => setSelectedKey(event.target.value)}
          size="small"
        >
          {months.map((month) => (
            <MenuItem value={month.key} key={month.key}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Card variant="outlined">
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            justifyContent="space-between"
          >
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                {t('successRate')}
              </Typography>
              <Typography variant="h3">
                {selectedMonth.successRate.toFixed(1)}%
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Chip label={`${t('wins')} ${selectedMonth.wins}`} color="success" />
              <Chip label={`${t('losses')} ${selectedMonth.losses}`} color="error" />
              <Chip label={`${t('pending')} ${selectedMonth.pending}`} />
            </Stack>
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Stack spacing={1}>
            {selectedMonth.tips.map((tip) => (
              <Stack
                key={tip.id}
                direction={{ xs: 'column', md: 'row' }}
                spacing={1}
                justifyContent="space-between"
              >
                <Stack spacing={0.5} flex={1}>
                  <Typography fontWeight={600}>{tip.match}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  {(tip.stake || tip.total_win) && (
                    <Stack direction="row" spacing={2}>
                      {tip.stake && (
                        <Typography variant="caption" color="text.secondary">
                          {tBettings('stake')}: {Number(tip.stake).toFixed(2)}
                        </Typography>
                      )}
                      {tip.total_win && tip.status === 'win' && (
                        <Typography variant="caption" color="success.main" fontWeight={600}>
                          {tBettings('totalWin')}: {Number(tip.total_win).toFixed(2)}
                        </Typography>
                      )}
                      {tip.status === 'loss' && tip.stake && (
                        <Typography variant="caption" color="error.main" fontWeight={600}>
                          {tBettings('loss')}: {Number(tip.stake).toFixed(2)}
                        </Typography>
                      )}
                    </Stack>
                  )}
                  <Chip 
                    label={tip.status === 'win' ? tBettings('win') : tip.status === 'loss' ? tBettings('loss') : tBettings('pending')} 
                    size="small"
                    color={tip.status === 'win' ? 'success' : tip.status === 'loss' ? 'error' : 'default'}
                  />
                  <Typography color="text.secondary" variant="body2">
                    {dayjs(tip.match_date).format('DD.MM.YYYY')}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default HistoryMonthView


