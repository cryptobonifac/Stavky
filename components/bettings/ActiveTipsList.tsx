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
  Box,
  Divider,
} from '@mui/material'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useTranslations } from 'next-intl'

export type TipItem = {
  id: string
  match: string
  odds: number
  match_date: string
  status: 'pending' | 'win' | 'loss'
  betting_companies?: { name: string | null } | null
  sports?: { name: string | null } | null
  leagues?: { name: string | null } | null
}

export type TipRecord = {
  id: string
  match: string
  odds: number
  match_date: string
  status: 'pending' | 'win' | 'loss'
  betting_companies?: { name: string | null } | null
  sports?: { name: string | null } | null
  leagues?: { name: string | null } | null
  items?: TipItem[]
  stake?: number | null
  total_win?: number | null
}

type FilterValue = 'today' | 'tomorrow' | 'upcoming' | 'all'

type ActiveTipsListProps = {
  tips: TipRecord[]
}

const ActiveTipsList = ({ tips }: ActiveTipsListProps) => {
  const t = useTranslations('bettings')
  const [filter, setFilter] = useState<FilterValue>('today')
  
  const filters = [
    { value: 'today' as const, label: t('filterToday') },
    { value: 'tomorrow' as const, label: t('filterTomorrow') },
    { value: 'upcoming' as const, label: t('filterUpcoming') },
    { value: 'all' as const, label: t('filterAll') },
  ]

  const filteredTips = useMemo(() => {
    const now = dayjs()
    return tips.filter((tip) => {
      // For tips with items, check if any item matches the filter
      if (tip.items && tip.items.length > 0) {
        if (filter === 'all') return true
        return tip.items.some((item) => {
          const matchDate = dayjs(item.match_date)
          if (filter === 'today') {
            return matchDate.isSame(now, 'day')
          }
          if (filter === 'tomorrow') {
            return matchDate.isSame(now.add(1, 'day'), 'day')
          }
          return matchDate.isAfter(now)
        })
      }
      
      // Legacy structure: single tip
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
    <Stack spacing={4}>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('filterDescription')}
        </Typography>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_event, next) => next && setFilter(next)}
        color="primary"
          fullWidth
          data-testid="bettings-filter-group"
          sx={{
            '& .MuiToggleButton-root': {
              py: 1.5,
              px: 3,
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            },
          }}
      >
        {filters.map(({ value, label }) => (
            <ToggleButton key={value} value={value} data-testid={`bettings-filter-${value}`}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      </Box>

      {filteredTips.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t('showing')} <strong>{filteredTips.length}</strong>{' '}
            {filteredTips.length === 1 ? t('tip') : t('tips')}
          </Typography>
        </Box>
      )}

      <Stack spacing={2.5}>
        {filteredTips.length === 0 && (
          <Card
            variant="outlined"
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 3,
              textAlign: 'center',
              py: 6,
              bgcolor: 'background.default',
            }}
          >
            <CardContent>
              <SportsSoccerIcon
                sx={{
                  fontSize: 48,
                  color: 'text.secondary',
                  opacity: 0.5,
                  mb: 2,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {t('noTipsForFilter')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('checkBackLater')}
              </Typography>
            </CardContent>
          </Card>
        )}
        {filteredTips.map((tip) => (
          <Card
            key={tip.id}
            variant="outlined"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: 2,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
              >
                  <Stack spacing={1.5} flex={1}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          p: 0.75,
                          borderRadius: 1.5,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SportsSoccerIcon fontSize="small" />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {tip.match}
                      </Typography>
                    </Stack>
                    {tip.items && tip.items.length > 0 ? (
                      <Stack spacing={1} sx={{ pl: 4.5, mt: 1 }}>
                        {tip.items.map((item, idx) => (
                          <Box
                            key={item.id}
                            sx={{
                              p: 1.5,
                              borderRadius: 1.5,
                              bgcolor: 'background.default',
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Typography variant="body2" fontWeight={500} gutterBottom>
                              {t('tip')} {idx + 1}: {item.match}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {[
                                item.betting_companies?.name,
                                item.sports?.name,
                                item.leagues?.name,
                              ]
                                .filter(Boolean)
                                .join(' • ')}
                              {' • '}
                              {t('odds')}: {item.odds.toFixed(3)}
                              {' • '}
                              {dayjs(item.match_date).format('DD.MM.YYYY HH:mm')}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Stack spacing={1} sx={{ pl: 4.5 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                      {[
                        tip.betting_companies?.name,
                        tip.sports?.name,
                        tip.leagues?.name,
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          <AccessTimeIcon fontSize="small" sx={{ fontSize: 16 }} />
                      {t('kickoff')}: {dayjs(tip.match_date).format('DD.MM.YYYY HH:mm')}
                    </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <Stack
                    direction={{ xs: 'row', md: 'column' }}
                    spacing={1.5}
                    alignItems={{ xs: 'center', md: 'flex-end' }}
                  >
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`${t('odds')} ${tip.odds.toFixed(3)}`}
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        height: 36,
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        },
                      }}
                    />
                    <Chip
                      label={t(tip.status)}
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        borderWidth: 1.5,
                        height: 36,
                      }}
                    />
                  </Stack>
                </Stack>
                {(tip.stake || tip.total_win) && (
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {tip.stake && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>{t('stake')}:</strong> {tip.stake.toFixed(2)}
                      </Typography>
                    )}
                    {tip.total_win && (
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        <strong>{t('totalWin')}:</strong> {tip.total_win.toFixed(2)}
                      </Typography>
                    )}
                  </Stack>
                )}
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


