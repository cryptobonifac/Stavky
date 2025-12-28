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
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: { xs: 1.5, md: 2 },
            fontSize: { xs: '0.75rem', md: '0.875rem' },
          }}
        >
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
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            '& .MuiToggleButton-root': {
              py: { xs: 1, md: 1.5 },
              px: { xs: 2, md: 3 },
              fontWeight: 500,
              textTransform: 'none',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              fontSize: { xs: '0.875rem', md: '1rem' },
              minHeight: 44,
              flex: { xs: '1 1 calc(50% - 4px)', sm: '1 1 auto' },
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
            p: { xs: 1.5, md: 2 },
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
          >
            {t('showing')} <strong>{filteredTips.length}</strong>{' '}
            {filteredTips.length === 1 ? t('tip') : t('tips')}
          </Typography>
        </Box>
      )}

      <Stack spacing={{ xs: 2, md: 2.5 }}>
        {filteredTips.length === 0 && (
          <Card
            variant="outlined"
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: { xs: 2, md: 3 },
              textAlign: 'center',
              py: { xs: 4, md: 6 },
              bgcolor: 'background.default',
            }}
          >
            <CardContent>
              <SportsSoccerIcon
                sx={{
                  fontSize: { xs: 40, md: 48 },
                  color: 'text.secondary',
                  opacity: 0.5,
                  mb: { xs: 1.5, md: 2 },
                }}
              />
              <Typography 
                variant="h6" 
                color="text.secondary" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                {t('noTipsForFilter')}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
              >
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
              borderRadius: { xs: 2, md: 3 },
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: 2,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={{ xs: 2, md: 2.5 }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 1.5, md: 2 }}
                justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
              >
                  <Stack spacing={{ xs: 1, md: 1.5 }} flex={1} sx={{ width: '100%' }}>
                    <Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="center">
                      <Box
                        sx={{
                          p: { xs: 0.5, md: 0.75 },
                          borderRadius: { xs: 1, md: 1.5 },
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: { xs: 32, md: 36 },
                          minHeight: { xs: 32, md: 36 },
                        }}
                      >
                        <SportsSoccerIcon fontSize="small" />
                      </Box>
                      <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{ 
                          fontSize: { xs: '1rem', md: '1.25rem' },
                          wordBreak: 'break-word',
                        }}
                      >
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
                    spacing={{ xs: 1, md: 1.5 }}
                    alignItems={{ xs: 'center', md: 'flex-end' }}
                    sx={{ flexShrink: 0 }}
                  >
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`${t('odds')} ${tip.odds.toFixed(3)}`}
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                        height: { xs: 32, md: 36 },
                        '& .MuiChip-icon': {
                          color: 'inherit',
                          fontSize: { xs: '1rem', md: '1.2rem' },
                        },
                      }}
                    />
                    <Chip
                      label={t(tip.status)}
                      variant="outlined"
                      sx={{
                        fontWeight: 500,
                        borderWidth: 1.5,
                        height: { xs: 32, md: 36 },
                        fontSize: { xs: '0.8rem', md: '0.875rem' },
                      }}
                    />
                  </Stack>
                </Stack>
                {(tip.stake || tip.total_win) && (
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1, sm: 2 }}
                    sx={{
                      mt: { xs: 1.5, md: 2 },
                      pt: { xs: 1.5, md: 2 },
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {tip.stake && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                      >
                        <strong>{t('stake')}:</strong> {tip.stake.toFixed(2)}
                      </Typography>
                    )}
                    {tip.total_win && (
                      <Typography 
                        variant="body2" 
                        color="success.main" 
                        fontWeight={600}
                        sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                      >
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


