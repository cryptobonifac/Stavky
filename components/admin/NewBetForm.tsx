'use client'

import { useMemo, useState, useTransition } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Alert,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

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
  odds: '',
  match_date: dayjs(),
}

const NewBetForm = ({ bettingCompanies, sports }: NewBetFormProps) => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    startTransition(async () => {
      const response = await fetch('/api/betting-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          odds: Number(form.odds),
          match_date: (form.match_date as Dayjs).toISOString(),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setMessage({
          type: 'error',
          text: payload.error ?? 'Failed to save betting tip.',
        })
        return
      }

      setMessage({
        type: 'success',
        text: 'Betting tip created successfully.',
      })
      setForm({
        ...defaultState,
        match_date: dayjs(),
      })
    })
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <div>
            <Typography variant="h5">New betting tip</Typography>
            <Typography variant="body2" color="text.secondary">
              Publish a fresh pick including company, league, and kickoff time.
            </Typography>
          </div>
          {message && (
            <Alert
              severity={message.type}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              select
              label="Betting company"
              fullWidth
              required
              value={form.betting_company_id}
              onChange={(event) =>
                handleChange('betting_company_id', event.target.value)
              }
            >
              {bettingCompanies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Sport"
              fullWidth
              required
              value={form.sport_id}
              onChange={(event) => {
                handleChange('sport_id', event.target.value)
                handleChange('league_id', '')
              }}
            >
              {sports.map((sport) => (
                <MenuItem key={sport.id} value={sport.id}>
                  {sport.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="League"
              fullWidth
              required
              value={form.league_id}
              onChange={(event) =>
                handleChange('league_id', event.target.value)
              }
              disabled={!form.sport_id}
            >
              {leagues.map((league) => (
                <MenuItem key={league.id} value={league.id}>
                  {league.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            label="Match"
            placeholder="Team A vs Team B"
            value={form.match}
            onChange={(event) => handleChange('match', event.target.value)}
            required
            fullWidth
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Odds"
              type="number"
              inputProps={{ step: 0.001, min: 1.001, max: 2.0 }}
              value={form.odds}
              onChange={(event) => handleChange('odds', event.target.value)}
              required
              fullWidth
            />
            <DateTimePickerField
              label="Match kickoff"
              value={form.match_date}
              onChange={(value) =>
                handleChange('match_date', value ?? dayjs())
              }
              minDateTime={dayjs()}
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
          >
            {isPending ? 'Publishing...' : 'Publish tip'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default NewBetForm


