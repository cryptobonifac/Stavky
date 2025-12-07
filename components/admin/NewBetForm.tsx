'use client'

import { useMemo, useState, useTransition, useRef } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslations } from 'next-intl'

import DateTimePickerField from '@/components/ui/date-time-picker-field'

type Option = {
  id: string
  name: string
}

type SportOption = Option & {
  leagues: Option[]
}

type NewBetFormProps = {
  bettingCompanies: Option[]
  sports: SportOption[]
}

type TipForm = {
  id: string
  betting_company_id: string
  sport_id: string
  league_id: string
  match: string
  odds: string
  match_date: Dayjs
}

const NewBetForm = ({ bettingCompanies, sports }: NewBetFormProps) => {
  const t = useTranslations('newbet')
  const idCounterRef = useRef(0)
  
  const createDefaultTip = (): TipForm => {
    idCounterRef.current += 1
    return {
      id: `tip-${idCounterRef.current}`,
      betting_company_id: '',
      sport_id: '',
      league_id: '',
      match: '',
      odds: '1.01',
      match_date: dayjs().add(1, 'hour'),
    }
  }
  
  const [tips, setTips] = useState<TipForm[]>(() => [createDefaultTip()])

  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  const getLeaguesForTip = (tipId: string) => {
    const tip = tips.find((t) => t.id === tipId)
    if (!tip) return []
    return sports.find((sport) => sport.id === tip.sport_id)?.leagues ?? []
  }

  const handleAddTip = () => {
    // Get the betting company from the first tip
    const firstTipCompanyId = tips[0]?.betting_company_id || ''
    const newTip = createDefaultTip()
    // Pre-select the betting company from the first tip
    if (firstTipCompanyId) {
      newTip.betting_company_id = firstTipCompanyId
    }
    setTips((prev) => [...prev, newTip])
  }

  const handleRemoveTip = (tipId: string) => {
    if (tips.length === 1) return // Keep at least one tip
    setTips((prev) => prev.filter((tip) => tip.id !== tipId))
  }

  const handleTipChange = (
    tipId: string,
    field: keyof Omit<TipForm, 'id'>,
    value: string | Dayjs | null
  ) => {
    setTips((prev) =>
      prev.map((tip) =>
        tip.id === tipId
          ? {
              ...tip,
              [field]: value,
              // Reset league_id when sport changes
              ...(field === 'sport_id' ? { league_id: '' } : {}),
            }
          : tip
      )
    )
  }

  const handleOddsChange = (tipId: string, value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      handleTipChange(tipId, 'odds', '1.01')
      return
    }
    // Clamp value between 1.001 and 2.0
    const clampedValue = Math.max(1.001, Math.min(2.0, numValue))
    handleTipChange(tipId, 'odds', clampedValue.toFixed(3))
  }

  const handleOddsIncrement = (tipId: string) => {
    const tip = tips.find((t) => t.id === tipId)
    if (!tip) return
    const currentValue = parseFloat(tip.odds) || 1.01
    const newValue = Math.min(2.0, currentValue + 0.001)
    handleTipChange(tipId, 'odds', newValue.toFixed(3))
  }

  const handleOddsDecrement = (tipId: string) => {
    const tip = tips.find((t) => t.id === tipId)
    if (!tip) return
    const currentValue = parseFloat(tip.odds) || 1.01
    const newValue = Math.max(1.001, currentValue - 0.001)
    handleTipChange(tipId, 'odds', newValue.toFixed(3))
  }

  // Calculate final odds by multiplying all individual odds
  const finalOdds = useMemo(() => {
    return tips.reduce((product, tip) => {
      const odds = parseFloat(tip.odds) || 1.01
      return product * odds
    }, 1)
  }, [tips])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    // Validate all tips
    for (const tip of tips) {
      const oddsValue = parseFloat(tip.odds)
      if (
        isNaN(oddsValue) ||
        oddsValue < 1.001 ||
        oddsValue > 2.0 ||
        !tip.betting_company_id ||
        !tip.sport_id ||
        !tip.league_id ||
        !tip.match.trim()
      ) {
        setMessage({
          type: 'error',
          text: t('validationError'),
        })
        return
      }
    }

    // Validate final odds
    if (finalOdds > 2.0) {
      setMessage({
        type: 'error',
        text: t('finalOddsExceedsMax'),
      })
      return
    }

    startTransition(async () => {
      // Create one betting tip with multiple items
      const response = await fetch('/api/betting-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tips: tips.map((tip) => ({
            betting_company_id: tip.betting_company_id,
            sport_id: tip.sport_id,
            league_id: tip.league_id,
            match: tip.match,
            odds: parseFloat(tip.odds),
            match_date: tip.match_date.toISOString(),
          })),
          final_odds: finalOdds,
          description: tips.map((tip, idx) => `${idx + 1}. ${tip.match}`).join(' | '),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setMessage({
          type: 'error',
          text: payload.error ?? t('error'),
        })
        return
      }

      setMessage({
        type: 'success',
        text: t('success'),
      })
      setTips([createDefaultTip()])
    })
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit} data-testid="newbet-form">
          {message && (
            <Alert
              severity={message.type}
              onClose={() => setMessage(null)}
              data-testid={`newbet-${message.type}-message`}
            >
              {message.text}
            </Alert>
          )}

          {tips.map((tip, index) => {
            const leagues = getLeaguesForTip(tip.id)
            const currentOddsValue = parseFloat(tip.odds) || 1.01
            const isAtMin = currentOddsValue <= 1.001
            const isAtMax = currentOddsValue >= 2.0

            return (
              <Box key={tip.id}>
                {index > 0 && <Divider sx={{ my: 3 }} />}
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">
                      {t('tip')} {index + 1}
                    </Typography>
                    {tips.length > 1 && (
                      <IconButton
                        onClick={() => handleRemoveTip(tip.id)}
                        color="error"
                        size="small"
                        data-testid={`newbet-remove-tip-${tip.id}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {index === 0 ? (
                      <TextField
                        select
                        id={`betting-company-${tip.id}`}
                        label={t('bettingCompany')}
                        fullWidth
                        required
                        value={tip.betting_company_id}
                        onChange={(event) => {
                          const newCompanyId = event.target.value
                          handleTipChange(tip.id, 'betting_company_id', newCompanyId)
                          // Update all other tips to use the same company
                          setTips((prev) =>
                            prev.map((t) =>
                              t.id !== tip.id
                                ? { ...t, betting_company_id: newCompanyId }
                                : t
                            )
                          )
                        }}
                        inputProps={{ 'data-testid': `newbet-betting-company-select-${tip.id}` }}
                      >
                        {bettingCompanies.map((company) => (
                          <MenuItem
                            key={company.id}
                            value={company.id}
                            data-testid={`newbet-company-${company.id}-tip-${tip.id}`}
                          >
                            {company.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        id={`betting-company-${tip.id}`}
                        label={t('bettingCompany')}
                        fullWidth
                        required
                        value={
                          bettingCompanies.find(
                            (c) => c.id === (tip.betting_company_id || tips[0]?.betting_company_id)
                          )?.name || ''
                        }
                        disabled
                        inputProps={{ 'data-testid': `newbet-betting-company-select-${tip.id}` }}
                        helperText={t('sameCompanyAsFirstTip')}
                      />
                    )}
                    <TextField
                      select
                      id={`sport-${tip.id}`}
                      label={t('sport')}
                      fullWidth
                      required
                      value={tip.sport_id}
                      onChange={(event) => {
                        handleTipChange(tip.id, 'sport_id', event.target.value)
                      }}
                      inputProps={{ 'data-testid': `newbet-sport-select-${tip.id}` }}
                    >
                      {sports.map((sport) => (
                        <MenuItem
                          key={sport.id}
                          value={sport.id}
                          data-testid={`newbet-sport-${sport.id}-tip-${tip.id}`}
                        >
                          {sport.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      id={`league-${tip.id}`}
                      label={t('league')}
                      fullWidth
                      required
                      value={tip.league_id}
                      onChange={(event) =>
                        handleTipChange(tip.id, 'league_id', event.target.value)
                      }
                      disabled={!tip.sport_id}
                      inputProps={{ 'data-testid': `newbet-league-select-${tip.id}` }}
                    >
                      {leagues.map((league) => (
                        <MenuItem
                          key={league.id}
                          value={league.id}
                          data-testid={`newbet-league-${league.id}-tip-${tip.id}`}
                        >
                          {league.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                  <TextField
                    id={`match-${tip.id}`}
                    label={t('match')}
                    placeholder={t('matchPlaceholder')}
                    value={tip.match}
                    onChange={(event) => handleTipChange(tip.id, 'match', event.target.value)}
                    required
                    fullWidth
                    inputProps={{ 'data-testid': `newbet-match-input-${tip.id}` }}
                  />
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      id={`odds-${tip.id}`}
                      label={t('odds')}
                      type="number"
                      value={tip.odds}
                      onChange={(event) => handleOddsChange(tip.id, event.target.value)}
                      onBlur={(event) => {
                        const value = parseFloat(event.target.value)
                        if (isNaN(value) || value < 1.001) {
                          handleTipChange(tip.id, 'odds', '1.001')
                        } else if (value > 2.0) {
                          handleTipChange(tip.id, 'odds', '2.0')
                        } else {
                          handleTipChange(tip.id, 'odds', value.toFixed(3))
                        }
                      }}
                      required
                      fullWidth
                      inputProps={{
                        step: 0.001,
                        min: 1.001,
                        max: 2.0,
                        'data-testid': `newbet-odds-input-${tip.id}`,
                      }}
                      error={currentOddsValue < 1.001 || currentOddsValue > 2.0}
                      helperText={
                        currentOddsValue < 1.001 || currentOddsValue > 2.0
                          ? t('oddsValidationError')
                          : t('oddsHelper')
                      }
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                aria-label={t('decreaseOdds')}
                                onClick={() => handleOddsDecrement(tip.id)}
                                disabled={isAtMin}
                                size="small"
                                data-testid={`newbet-odds-decrease-button-${tip.id}`}
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  minWidth: 32,
                                  minHeight: 32,
                                  '&:hover:not(:disabled)': {
                                    bgcolor: 'action.hover',
                                    borderColor: 'primary.main',
                                  },
                                  '&:disabled': {
                                    opacity: 0.4,
                                  },
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                aria-label={t('increaseOdds')}
                                onClick={() => handleOddsIncrement(tip.id)}
                                disabled={isAtMax}
                                size="small"
                                data-testid={`newbet-odds-increase-button-${tip.id}`}
                                sx={{
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  minWidth: 32,
                                  minHeight: 32,
                                  '&:hover:not(:disabled)': {
                                    bgcolor: 'action.hover',
                                    borderColor: 'primary.main',
                                  },
                                  '&:disabled': {
                                    opacity: 0.4,
                                  },
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <DateTimePickerField
                      label={t('matchKickoff')}
                      value={tip.match_date}
                      onChange={(value: Dayjs | null) =>
                        handleTipChange(tip.id, 'match_date', value ?? dayjs())
                      }
                      minDateTime={dayjs()}
                      slotProps={{
                        textField: {
                          inputProps: { 'data-testid': `newbet-match-date-input-${tip.id}` },
                        },
                      }}
                    />
                  </Stack>
                </Stack>
              </Box>
            )
          })}

          <Box
            sx={{
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{t('finalOdds')}</Typography>
              <Typography
                variant="h6"
                color={finalOdds > 2.0 ? 'error.main' : 'primary.main'}
                fontWeight="bold"
              >
                {finalOdds.toFixed(3)}
              </Typography>
            </Stack>
            {finalOdds > 2.0 && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {t('finalOddsExceedsMax')}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleAddTip}
              startIcon={<AddIcon />}
              data-testid="newbet-add-tip-button"
              sx={{ flex: 1 }}
            >
              {t('addAnotherTip')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
              data-testid="newbet-submit-button"
              sx={{ flex: 1 }}
            >
              {isPending ? t('publishing') : t('publishTip')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default NewBetForm


