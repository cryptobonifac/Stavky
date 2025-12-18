'use client'

import { useState, useTransition, useMemo, useId } from 'react'
import { useRouter } from 'next/navigation'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Box,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import SaveIcon from '@mui/icons-material/Save'
import { useTranslations } from 'next-intl'

import DateTimePickerField from '@/components/ui/date-time-picker-field'

type Option = {
  id: string
  name: string
}

type NewBetFormProps = {
  bettingCompanies: Option[]
  sports: Option[]
  results: Option[]
}

type TipForm = {
  betting_company_id: string
  sport_id: string
  sport: string
  league: string
  match: string
  result_id: string
  odds: string
  match_date: Dayjs
}

const NewBetForm = ({ bettingCompanies, sports, results }: NewBetFormProps) => {
  const t = useTranslations('newbet')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState<TipForm>({
    betting_company_id: '',
    sport_id: '',
    sport: '',
    league: '',
    match: '',
    result_id: '',
    odds: '1.01',
    match_date: dayjs().add(1, 'hour'),
  })

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [openSportAutocomplete, setOpenSportAutocomplete] = useState(false)

  // Generate stable IDs for form fields to prevent hydration errors
  const bettingCompanyId = useId()
  const sportId = useId()
  const leagueId = useId()
  const matchId = useId()
  const resultId = useId()
  const oddsId = useId()
  const matchDateId = useId()

  const currentOddsValue = parseFloat(formData.odds) || 1.01
  const isAtMin = currentOddsValue <= 1.001
  const isAtMax = currentOddsValue >= 2.0

  const handleFieldChange = (field: keyof TipForm, value: string | Dayjs) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    setError(null)
  }

  const handleOddsChange = (value: string) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      handleFieldChange('odds', '1.01')
      return
    }
    const clampedValue = Math.max(1.001, Math.min(2.0, numValue))
    handleFieldChange('odds', clampedValue.toFixed(3))
  }

  const handleOddsIncrement = () => {
    const newValue = Math.min(2.0, currentOddsValue + 0.001)
    handleFieldChange('odds', newValue.toFixed(3))
  }

  const handleOddsDecrement = () => {
    const newValue = Math.max(1.001, currentOddsValue - 0.001)
    handleFieldChange('odds', newValue.toFixed(3))
  }

  const handleReset = () => {
    setFormData({
      betting_company_id: '',
      sport_id: '',
      sport: '',
      league: '',
      match: '',
      result_id: '',
      odds: '1.01',
      match_date: dayjs().add(1, 'hour'),
    })
    setError(null)
    setFieldErrors({})
    setOpenSportAutocomplete(false)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.betting_company_id) {
      errors.betting_company_id = t('validationErrors.bettingCompanyRequired')
    }

    if (!formData.sport_id || !formData.sport_id.trim()) {
      errors.sport = t('validationErrors.sportRequired')
    }

    if (!formData.league.trim()) {
      errors.league = t('validationErrors.leagueRequired')
    }

    if (!formData.match.trim()) {
      errors.match = t('validationErrors.matchRequired')
    }

    if (!formData.result_id || formData.result_id.trim() === '') {
      errors.result_id = t('validationErrors.resultRequired') || 'Result is required'
    }

    const oddsValue = parseFloat(formData.odds)
    if (isNaN(oddsValue)) {
      errors.odds = t('validationErrors.oddsRequired')
    } else if (oddsValue < 1.001 || oddsValue > 2.0) {
      errors.odds = t('validationErrors.oddsInvalid')
    }

    if (!formData.match_date || !formData.match_date.isValid()) {
      errors.match_date = t('validationErrors.matchDateRequired')
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!validateForm()) {
      setError(t('validationError') || 'Please fix the errors below')
      return
    }

    startTransition(async () => {
      const oddsValue = parseFloat(formData.odds)

      const response = await fetch('/api/betting-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tips: [
            {
              betting_company_id: formData.betting_company_id,
              sport: formData.sport.trim(),
              league: formData.league.trim(),
              match: formData.match.trim(),
              result_id: formData.result_id,
              odds: oddsValue,
              match_date: formData.match_date.toISOString(),
            },
          ],
          final_odds: oddsValue,
          description: formData.match.trim(),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setError(payload.error ?? t('error') ?? 'Failed to create betting tip')
        return
      }

      // Success - redirect to manage page
      router.push('/bettings/manage')
      router.refresh()
    })
  }

  const selectedSport = formData.sport_id
    ? sports.find((s) => s.id === formData.sport_id) || null
    : null

  return (
    <Card variant="outlined" sx={{ width: '75%', mx: 'auto' }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} sx={{ width: '100%' }}>
            <Box>
              <Typography variant="h5" gutterBottom fontWeight={600}>
                {t('title') || 'Create New Betting Tip'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('subtitle') || 'Fill in all fields to create a new betting tip'}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Single Row Form - Table-like Layout */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                '& > *': {
                  flex: { xs: '1 1 100%', md: '1 1 auto' },
                  minWidth: { xs: '100%', md: 0 },
                },
              }}
            >
              {/* Betting Company - Dropdown with sufficient width */}
              <Box sx={{ minWidth: { xs: '100%', md: 200 }, flex: { xs: '1 1 100%', md: '0 0 200px' } }}>
                <TextField
                  id={bettingCompanyId}
                  select
                  label={t('bettingCompany') || 'Company'}
                  fullWidth
                  required
                  size="small"
                  value={formData.betting_company_id}
                  error={!!fieldErrors.betting_company_id}
                  helperText={fieldErrors.betting_company_id}
                  onChange={(event) =>
                    handleFieldChange('betting_company_id', event.target.value)
                  }
                >
                  {bettingCompanies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Sport - Dropdown with sufficient width */}
              <Box sx={{ minWidth: { xs: '100%', md: 180 }, flex: { xs: '1 1 100%', md: '0 0 180px' } }}>
                <Autocomplete
                  open={openSportAutocomplete}
                  onOpen={() => setOpenSportAutocomplete(true)}
                  onClose={() => setOpenSportAutocomplete(false)}
                  options={sports}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={selectedSport}
                  onChange={(event, newValue) => {
                    if (newValue && 'id' in newValue && newValue.id) {
                      handleFieldChange('sport_id', newValue.id)
                      handleFieldChange('sport', newValue.name)
                      setOpenSportAutocomplete(false)
                    } else {
                      handleFieldChange('sport', '')
                      handleFieldChange('sport_id', '')
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id={sportId}
                      label={t('sport') || 'Sport'}
                      required
                      fullWidth
                      size="small"
                      error={!!fieldErrors.sport}
                      helperText={fieldErrors.sport}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                      }}
                    />
                  )}
                />
              </Box>

              {/* League */}
              <Box sx={{ minWidth: { xs: '100%', md: 150 }, flex: { xs: '1 1 100%', md: '1 1 150px' } }}>
                <TextField
                  id={leagueId}
                  label={t('league') || 'League'}
                  fullWidth
                  required
                  size="small"
                  value={formData.league}
                  error={!!fieldErrors.league}
                  helperText={fieldErrors.league}
                  onChange={(event) =>
                    handleFieldChange('league', event.target.value)
                  }
                />
              </Box>

              {/* Match */}
              <Box sx={{ minWidth: { xs: '100%', md: 200 }, flex: { xs: '1 1 100%', md: '1 1 200px' } }}>
                <TextField
                  id={matchId}
                  label={t('match') || 'Match'}
                  placeholder={t('matchPlaceholder') || 'e.g., Team A vs Team B'}
                  value={formData.match}
                  error={!!fieldErrors.match}
                  helperText={fieldErrors.match}
                  onChange={(event) =>
                    handleFieldChange('match', event.target.value)
                  }
                  required
                  fullWidth
                  size="small"
                />
              </Box>

              {/* Result */}
              <Box sx={{ minWidth: { xs: '100%', md: 100 }, flex: { xs: '1 1 100%', md: '0 0 100px' } }}>
                <TextField
                  id={resultId}
                  select
                  label={t('result') || 'Result'}
                  fullWidth
                  required
                  size="small"
                  value={formData.result_id}
                  error={!!fieldErrors.result_id}
                  helperText={fieldErrors.result_id}
                  onChange={(event) =>
                    handleFieldChange('result_id', event.target.value)
                  }
                >
                  {results.map((result) => (
                    <MenuItem key={result.id} value={result.id}>
                      {result.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Odds */}
              <Box sx={{ minWidth: { xs: '100%', md: 140 }, flex: { xs: '1 1 100%', md: '0 0 140px' } }}>
                <TextField
                  id={oddsId}
                  label={t('odds') || 'Odds'}
                  type="number"
                  value={formData.odds}
                  onChange={(event) => handleOddsChange(event.target.value)}
                  onBlur={(event) => {
                    const value = parseFloat(event.target.value)
                    if (isNaN(value) || value < 1.001) {
                      handleFieldChange('odds', '1.001')
                    } else if (value > 2.0) {
                      handleFieldChange('odds', '2.0')
                    } else {
                      handleFieldChange('odds', value.toFixed(3))
                    }
                  }}
                  required
                  fullWidth
                  size="small"
                  inputProps={{
                    step: 0.001,
                    min: 1.001,
                    max: 2.0,
                  }}
                  error={
                    currentOddsValue < 1.001 ||
                    currentOddsValue > 2.0 ||
                    !!fieldErrors.odds
                  }
                  helperText={
                    fieldErrors.odds ||
                    (currentOddsValue < 1.001 || currentOddsValue > 2.0
                      ? t('oddsValidationError') || '1.001-2.0'
                      : '')
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={0}>
                          <IconButton
                            onClick={handleOddsDecrement}
                            disabled={isAtMin}
                            size="small"
                            edge="end"
                            sx={{ p: 0.5 }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={handleOddsIncrement}
                            disabled={isAtMax}
                            size="small"
                            edge="end"
                            sx={{ p: 0.5 }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Match Date */}
              <Box sx={{ minWidth: { xs: '100%', md: 180 }, flex: { xs: '1 1 100%', md: '0 0 180px' } }}>
                <DateTimePickerField
                  label={t('matchKickoff') || 'Kickoff'}
                  value={formData.match_date}
                  onChange={(value: Dayjs | null) =>
                    handleFieldChange('match_date', value ?? dayjs())
                  }
                  minDateTime={dayjs()}
                  error={!!fieldErrors.match_date}
                  helperText={fieldErrors.match_date}
                  slotProps={{
                    textField: {
                      id: matchDateId,
                      size: 'small' as const,
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider />

            {/* Submit Button */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={isPending}
              >
                {tCommon('cancel') || 'Cancel'}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isPending}
                startIcon={<SaveIcon />}
                size="large"
              >
                {isPending
                  ? t('publishing') || 'Publishing...'
                  : t('confirmAndPublish') || 'Create Tip'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}

export default NewBetForm
