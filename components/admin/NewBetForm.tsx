'use client'

import { useMemo, useState, useTransition } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Alert,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
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

const defaultState = {
  betting_company_id: '',
  sport_id: '',
  league_id: '',
  match: '',
  odds: '1.01',
  match_date: dayjs().add(1, 'hour'),
}

const NewBetForm = ({ bettingCompanies, sports }: NewBetFormProps) => {
  const t = useTranslations('newbet')
  const [form, setForm] = useState<{
    betting_company_id: string
    sport_id: string
    league_id: string
    match: string
    odds: string
    match_date: Dayjs
  }>(defaultState)

  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  const leagues = useMemo(() => {
    return sports.find((sport) => sport.id === form.sport_id)?.leagues ?? []
  }, [sports, form.sport_id])

  const handleChange = (
    field: keyof typeof form,
    value: string | Dayjs | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleOddsChange = (value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      handleChange('odds', '1.01')
      return
    }
    // Clamp value between 1.001 and 2.0
    const clampedValue = Math.max(1.001, Math.min(2.0, numValue))
    handleChange('odds', clampedValue.toFixed(3))
  }

  const handleOddsIncrement = () => {
    const currentValue = parseFloat(form.odds) || 1.01
    const newValue = Math.min(2.0, currentValue + 0.001)
    handleChange('odds', newValue.toFixed(3))
  }

  const handleOddsDecrement = () => {
    const currentValue = parseFloat(form.odds) || 1.01
    const newValue = Math.max(1.001, currentValue - 0.001)
    handleChange('odds', newValue.toFixed(3))
  }

  const currentOddsValue = parseFloat(form.odds) || 1.01
  const isAtMin = currentOddsValue <= 1.001
  const isAtMax = currentOddsValue >= 2.0

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    // Validate odds
    const oddsValue = parseFloat(form.odds)
    if (isNaN(oddsValue) || oddsValue < 1.001 || oddsValue > 2.0) {
      setMessage({
        type: 'error',
        text: t('oddsValidationError'),
      })
      return
    }

    startTransition(async () => {
      const response = await fetch('/api/betting-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          odds: oddsValue,
          match_date: (form.match_date as Dayjs).toISOString(),
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
      setForm({
        ...defaultState,
        odds: '1.01',
        match_date: dayjs().add(1, 'hour'),
      })
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
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              select
              label={t('bettingCompany')}
              fullWidth
              required
              value={form.betting_company_id}
              onChange={(event) =>
                handleChange('betting_company_id', event.target.value)
              }
              inputProps={{ 'data-testid': 'newbet-betting-company-select' }}
            >
              {bettingCompanies.map((company) => (
                <MenuItem key={company.id} value={company.id} data-testid={`newbet-company-${company.id}`}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label={t('sport')}
              fullWidth
              required
              value={form.sport_id}
              onChange={(event) => {
                handleChange('sport_id', event.target.value)
                handleChange('league_id', '')
              }}
              inputProps={{ 'data-testid': 'newbet-sport-select' }}
            >
              {sports.map((sport) => (
                <MenuItem key={sport.id} value={sport.id} data-testid={`newbet-sport-${sport.id}`}>
                  {sport.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label={t('league')}
              fullWidth
              required
              value={form.league_id}
              onChange={(event) =>
                handleChange('league_id', event.target.value)
              }
              disabled={!form.sport_id}
              inputProps={{ 'data-testid': 'newbet-league-select' }}
            >
              {leagues.map((league) => (
                <MenuItem key={league.id} value={league.id} data-testid={`newbet-league-${league.id}`}>
                  {league.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            label={t('match')}
            placeholder={t('matchPlaceholder')}
            value={form.match}
            onChange={(event) => handleChange('match', event.target.value)}
            required
            fullWidth
            inputProps={{ 'data-testid': 'newbet-match-input' }}
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label={t('odds')}
              type="number"
              value={form.odds}
              onChange={(event) => handleOddsChange(event.target.value)}
              onBlur={(event) => {
                const value = parseFloat(event.target.value)
                if (isNaN(value) || value < 1.001) {
                  handleChange('odds', '1.001')
                } else if (value > 2.0) {
                  handleChange('odds', '2.0')
                } else {
                  handleChange('odds', value.toFixed(3))
                }
              }}
              required
              fullWidth
              inputProps={{
                step: 0.001,
                min: 1.001,
                max: 2.0,
                'data-testid': 'newbet-odds-input',
              }}
              error={
                parseFloat(form.odds) < 1.001 || parseFloat(form.odds) > 2.0
              }
              helperText={
                parseFloat(form.odds) < 1.001 || parseFloat(form.odds) > 2.0
                  ? t('oddsValidationError')
                  : t('oddsHelper')
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        aria-label={t('decreaseOdds')}
                        onClick={handleOddsDecrement}
                        disabled={isAtMin}
                        size="small"
                        data-testid="newbet-odds-decrease-button"
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
                        onClick={handleOddsIncrement}
                        disabled={isAtMax}
                        size="small"
                        data-testid="newbet-odds-increase-button"
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
              value={form.match_date}
              onChange={(value) =>
                handleChange('match_date', value ?? dayjs())
              }
              minDateTime={dayjs()}
              slotProps={{
                textField: {
                  inputProps: { 'data-testid': 'newbet-match-date-input' },
                },
              }}
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
            data-testid="newbet-submit-button"
          >
            {isPending ? t('publishing') : t('publishTip')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default NewBetForm


