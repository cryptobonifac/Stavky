'use client'

import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import {
  Card,
  CardContent,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'

export type TipRecord = {
  id: string
  match: string
  odds: number
  match_date: string
  status: 'pending' | 'win' | 'loss'
  betting_companies?: { name: string | null } | null
  sports?: { name: string | null } | null
  leagues?: { name: string | null } | null
}

const filters = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'all', label: 'All' },
] as const

type FilterValue = (typeof filters)[number]['value']

type ActiveTipsListProps = {
  tips: TipRecord[]
}

const ActiveTipsList = ({ tips }: ActiveTipsListProps) => {
  const [filter, setFilter] = useState<FilterValue>('today')

  const filteredTips = useMemo(() => {
    const now = dayjs()
    return tips.filter((tip) => {
      const matchDate = dayjs(tip.match_date)
      if (filter === 'all') return true
      if (filter === 'today') {
        return matchDate.isSame(now, 'day')
      }
      if (filter === 'tomorrow') {
        return matchDate.isSame(now.add(1, 'day'), 'day')
      }
      return matchDate.isAfter(now)
    })
  }, [tips, filter])

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h5">Current betting tips</Typography>
        <Typography variant="body2" color="text.secondary">
          Filter tips by upcoming dates. Only pending tips with future kickoff
          times are shown.
        </Typography>
      </Stack>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_event, next) => next && setFilter(next)}
        color="primary"
      >
        {filters.map(({ value, label }) => (
          <ToggleButton key={value} value={value}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Stack spacing={2}>
        {filteredTips.length === 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body1">
                No tips matched the selected filter.
              </Typography>
            </CardContent>
          </Card>
        )}
        {filteredTips.map((tip) => (
          <Card key={tip.id} variant="outlined">
            <CardContent>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="space-between"
              >
                <Stack spacing={1}>
                  <Typography variant="h6">{tip.match}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[
                      tip.betting_companies?.name,
                      tip.sports?.name,
                      tip.leagues?.name,
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kickoff: {dayjs(tip.match_date).format('DD.MM.YYYY HH:mm')}
                  </Typography>
                </Stack>
                <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                  <Chip label={`Odds ${tip.odds.toFixed(3)}`} color="primary" />
                  <Chip label={tip.status} variant="outlined" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {/* TODO: add pagination/infinite scroll when backend pagination is available */}
    </Stack>
  )
}

export default ActiveTipsList


