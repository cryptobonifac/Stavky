'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSportLeagueTranslations } from '@/lib/i18n/translate-sports-leagues'
import dayjs from 'dayjs'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

import type { TipRecord } from '@/components/bettings/ActiveTipsList'

type PendingTipsListProps = {
  tips: TipRecord[]
}

const PendingTipsList = ({ tips }: PendingTipsListProps) => {
  const router = useRouter()
  const t = useTranslations('manage')
  const tBettings = useTranslations('bettings')
  const { translateSport } = useSportLeagueTranslations()
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleUpdate = (id: string, status: 'win' | 'loss') => {
    if (!id || id === 'undefined') {
      setFeedback({
        type: 'error',
        text: t('invalidTipId'),
      })
      return
    }

    startTransition(async () => {
      setFeedback(null)
      const response = await fetch(`/api/betting-tips/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback({
          type: 'error',
          text: payload.error ?? t('updateFailed'),
        })
        return
      }

      // Refresh the page to show updated status
      router.refresh()
    })
  }

  return (
    <Stack spacing={3}>
      {feedback && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
          {feedback.text}
        </Alert>
      )}
      {tips.length === 0 ? (
        <Alert severity="info">{t('noPendingTips')}</Alert>
      ) : (
        tips.map((tip) => (
          <Card key={tip.id} variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Stack spacing={1} flex={1}>
                    <Typography variant="h6">{tip.match}</Typography>
                    {tip.items && tip.items.length > 0 ? (
                      <Stack spacing={1} sx={{ mt: 1 }}>
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
                              {tBettings('tip')} {idx + 1}: {item.match}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {[
                                item.betting_companies?.name,
                                item.sports?.name ? translateSport(item.sports.name) : null,
                                item.leagues?.name,
                              ]
                                .filter(Boolean)
                                .join(' • ')}
                              {' • '}
                              {tBettings('odds')}: {item.odds.toFixed(3)}
                              {' • '}
                              {dayjs(item.match_date).format('DD.MM.YYYY HH:mm')}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(tip.match_date).format('DD.MM.YYYY HH:mm')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {[
                            tip.betting_companies?.name,
                            tip.sports?.name,
                            tip.leagues?.name,
                          ]
                            .filter(Boolean)
                            .join(' • ')}
                        </Typography>
                      </>
                    )}
                  </Stack>
                  <Stack
                    spacing={1}
                    alignItems={{ xs: 'flex-start', md: 'flex-end' }}
                  >
                    <Chip 
                      label={`${tBettings('odds')} ${tip.odds.toFixed(3)}`} 
                      color="primary"
                      sx={{ fontWeight: 600 }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        disabled={isPending}
                        onClick={() => handleUpdate(tip.id, 'win')}
                        data-testid={`pending-tip-${tip.id}-mark-win`}
                      >
                        {t('markAsWin')}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        disabled={isPending}
                        onClick={() => handleUpdate(tip.id, 'loss')}
                        data-testid={`pending-tip-${tip.id}-mark-loss`}
                      >
                        {t('markAsLoss')}
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  )
}

export default PendingTipsList


