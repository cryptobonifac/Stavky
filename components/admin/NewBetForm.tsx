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
  stake: string
}

const NewBetForm = ({ bettingCompanies, sports, results }: NewBetFormProps) => {
  const t = useTranslations('newbet')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Generate stable IDs for form fields to prevent hydration mismatches
  const bettingCompanyId = useId()
  const sportId = useId()
  const leagueId = useId()
  const matchId = useId()
  const resultId = useId()
  const oddsId = useId()
  const stakeId = useId()
  const totalWinId = useId()

  const [formData, setFormData] = useState<TipForm>({
    betting_company_id: '',
    sport_id: '',
    sport: '',
    league: '',
    match: '',
    result_id: '',
    odds: '1.01',
    match_date: dayjs().add(1, 'hour'),
    stake: '',
  })

  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [openSportAutocomplete, setOpenSportAutocomplete] = useState(false)

  const currentOddsValue = parseFloat(formData.odds) || 1.01
  const isAtMin = currentOddsValue <= 1.001
  const isAtMax = currentOddsValue >= 2.0
  
  // Calculate total_win = stake * odds
  const stakeValue = parseFloat(formData.stake) || 0
  const totalWinValue = stakeValue > 0 && currentOddsValue > 0 
    ? (stakeValue * currentOddsValue).toFixed(2) 
    : ''

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
      stake: '',
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
      const stakeValue = parseFloat(formData.stake) || null
      const totalWinValue = stakeValue && oddsValue 
        ? stakeValue * oddsValue 
        : null

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
              stake: stakeValue,
              total_win: totalWinValue,
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
    <Card
      elevation={0}
      sx={{
        width: { xs: '100%', md: '90%', lg: '80%' },
        mx: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4} sx={{ width: '100%' }}>
            {error && (
              <Alert
                severity="error"
                onClose={() => setError(null)}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(211, 47, 47, 0.15)',
                }}
              >
                {error}
              </Alert>
            )}

            {/* Row 1: Betting Company, Sport, League */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2.5,
                alignItems: 'flex-start',
                p: { xs: 0, md: 2 },
                borderRadius: 2,
                backgroundColor: { xs: 'transparent', md: 'rgba(255, 255, 255, 0.6)' },
              }}
            >
              {/* Betting Company */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                >
                  {bettingCompanies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Sport */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white',
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* League */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Row 2: Match, Result, Odds, Date */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2.5,
                alignItems: 'flex-start',
                p: { xs: 0, md: 2 },
                borderRadius: 2,
                backgroundColor: { xs: 'transparent', md: 'rgba(255, 255, 255, 0.6)' },
              }}
            >
              {/* Match */}
              <Box sx={{ flex: 2, minWidth: { xs: '100%', md: 0 } }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>

              {/* Result */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                >
                  {results.map((result) => (
                    <MenuItem key={result.id} value={result.id}>
                      {result.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Odds */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
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
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
                <DateTimePickerField
                  label={t('matchKickoff') || 'Kickoff'}
                  value={formData.match_date}
                  onChange={(value: Dayjs | null) =>
                    handleFieldChange('match_date', value ?? dayjs())
                  }
                  error={!!fieldErrors.match_date}
                  helperText={fieldErrors.match_date}
                  slotProps={{
                    textField: {
                      size: 'small' as const,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'white',
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Row 3: Stake and Total Win */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2.5,
                alignItems: 'flex-start',
                p: { xs: 0, md: 2 },
                borderRadius: 2,
                backgroundColor: { xs: 'transparent', md: 'rgba(255, 255, 255, 0.6)' },
              }}
            >
              {/* Stake */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
                <TextField
                  id={stakeId}
                  label={t('stake') || 'Stake'}
                  type="number"
                  value={formData.stake}
                  onChange={(event) => {
                    const value = event.target.value
                    handleFieldChange('stake', value)
                  }}
                  fullWidth
                  size="small"
                  inputProps={{
                    step: 0.01,
                    min: 0,
                  }}
                  error={!!fieldErrors.stake}
                  helperText={fieldErrors.stake || t('stakeHelper')}
                  placeholder={t('stakeHelper')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>

              {/* Total Win (Read-only, calculated) */}
              <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 0 } }}>
                <TextField
                  id={totalWinId}
                  label={t('totalWin') || 'Total Win'}
                  type="text"
                  value={totalWinValue}
                  fullWidth
                  size="small"
                  disabled
                  helperText={t('finalOdds') || 'Calculated: stake × odds'}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 1, opacity: 0.6 }} />

            {/* Submit Button */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3 }}
              justifyContent="flex-end"
              sx={{ width: '100%', pt: 2 }}
            >
              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={isPending}
                  fullWidth
                  sx={{
                    minHeight: 48,
                    fontSize: { xs: '0.9375rem', md: '1rem' },
                    borderRadius: 2,
                    borderWidth: 2,
                    px: 4,
                    fontWeight: 500,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  {tCommon('cancel') || 'Cancel'}
                </Button>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isPending}
                  startIcon={<SaveIcon />}
                  size="large"
                  fullWidth
                  sx={{
                    minHeight: 48,
                    fontSize: { xs: '0.9375rem', md: '1rem' },
                    borderRadius: 2,
                    px: 5,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.35)',
                    },
                  }}
                >
                  {isPending
                    ? t('publishing') || 'Publishing...'
                    : t('confirmAndPublish') || 'Create Tip'}
                </Button>
              </Box>
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}

export default NewBetForm
