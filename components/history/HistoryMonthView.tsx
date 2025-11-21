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
  const [selectedKey, setSelectedKey] = useState(months[0]?.key ?? '')
  const selectedMonth = useMemo(
    () => months.find((month) => month.key === selectedKey) ?? months[0],
    [months, selectedKey]
  )

  if (!selectedMonth) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography>No history available yet.</Typography>
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
        <Typography variant="h5">Monthly performance</Typography>
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
                Success rate
              </Typography>
              <Typography variant="h3">
                {selectedMonth.successRate.toFixed(1)}%
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Chip label={`Wins ${selectedMonth.wins}`} color="success" />
              <Chip label={`Losses ${selectedMonth.losses}`} color="error" />
              <Chip label={`Pending ${selectedMonth.pending}`} />
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
                <Typography fontWeight={600}>{tip.match}</Typography>
                <Stack direction="row" spacing={2}>
                  <Typography color="text.secondary">
                    {dayjs(tip.match_date).format('DD.MM.YYYY')}
                  </Typography>
                  <Chip label={tip.status} size="small" />
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


