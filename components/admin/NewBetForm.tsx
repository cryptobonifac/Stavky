'use client'

import { useMemo, useState, useTransition, useRef, useEffect } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslations } from 'next-intl'

import DateTimePickerField from '@/components/ui/date-time-picker-field'

type Option = {
  id: string
  name: string
}

type NewBetFormProps = {
  bettingCompanies: Option[]
  sports: Option[]
}

type TipForm = {
  id: string
  betting_company_id: string
  sport_id: string
  sport: string
  league: string
  match: string
  odds: string
  match_date: Dayjs
}

const steps = ['tips', 'stake', 'review'] as const
type StepType = typeof steps[number]

const NewBetForm = ({ bettingCompanies, sports }: NewBetFormProps) => {
  const t = useTranslations('newbet')
  const tCommon = useTranslations('common')
  const idCounterRef = useRef(0)
  const [open, setOpen] = useState(true) // Open by default
  const [activeStep, setActiveStep] = useState(0)
  const [activeTipIndex, setActiveTipIndex] = useState(0) // Track which tip is being edited
  
  const createDefaultTip = (): TipForm => {
    idCounterRef.current += 1
    return {
      id: `tip-${idCounterRef.current}`,
      betting_company_id: '',
      sport_id: '',
      sport: '',
      league: '',
      match: '',
      odds: '1.01',
      match_date: dayjs().add(1, 'hour'),
    }
  }
  
  const [tips, setTips] = useState<TipForm[]>(() => [createDefaultTip()])
  const [stake, setStake] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Map<string, Record<string, string>>>(new Map())
  const [openSportAutocomplete, setOpenSportAutocomplete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Open modal automatically on mount
  useEffect(() => {
    setOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track when a new tip is added to open sport autocomplete
  const [newTipIdToOpen, setNewTipIdToOpen] = useState<string | null>(null)
  
  useEffect(() => {
    if (newTipIdToOpen) {
      const tipIndex = tips.findIndex(t => t.id === newTipIdToOpen)
      if (tipIndex >= 0) {
        setActiveTipIndex(tipIndex)
        setOpenSportAutocomplete(newTipIdToOpen)
        setNewTipIdToOpen(null) // Reset after opening
      }
    }
  }, [newTipIdToOpen, tips])

  const handleAddTip = () => {
    const firstTipCompanyId = tips[0]?.betting_company_id || ''
    const newTip = createDefaultTip()
    // Only copy betting company, NOT sport
    if (firstTipCompanyId) {
      newTip.betting_company_id = firstTipCompanyId
    }
    // Explicitly ensure sport fields are empty (not copied from previous tips)
    newTip.sport = ''
    newTip.sport_id = ''
    setTips((prev) => [...prev, newTip])
    // Mark this tip to have its sport autocomplete opened
    setNewTipIdToOpen(newTip.id)
  }

  const handleNextTip = () => {
    if (activeTipIndex < tips.length - 1) {
      setActiveTipIndex(activeTipIndex + 1)
      setOpenSportAutocomplete(null) // Close autocomplete when switching tips
    }
  }

  const handlePreviousTip = () => {
    if (activeTipIndex > 0) {
      setActiveTipIndex(activeTipIndex - 1)
      setOpenSportAutocomplete(null) // Close autocomplete when switching tips
    }
  }

  const handleRemoveTip = (tipId: string) => {
    if (tips.length === 1) return
    const tipIndex = tips.findIndex(tip => tip.id === tipId)
    setTips((prev) => prev.filter((tip) => tip.id !== tipId))
    // Adjust active tip index if needed
    if (activeTipIndex >= tips.length - 1 && activeTipIndex > 0) {
      setActiveTipIndex(activeTipIndex - 1)
    } else if (tipIndex < activeTipIndex) {
      setActiveTipIndex(activeTipIndex - 1)
    }
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

  const finalOdds = useMemo(() => {
    return tips.reduce((product, tip) => {
      const odds = parseFloat(tip.odds) || 1.01
      return product * odds
    }, 1)
  }, [tips])

  const totalWin = useMemo(() => {
    const stakeValue = parseFloat(stake) || 0
    if (stakeValue <= 0) return 0
    return finalOdds * stakeValue
  }, [finalOdds, stake])

  type ValidationErrors = {
    betting_company_id?: string
    sport?: string
    league?: string
    match?: string
    odds?: string
    match_date?: string
  }

  const validateTips = (): { isValid: boolean; errors: Map<string, ValidationErrors> } => {
    const errors = new Map<string, ValidationErrors>()
    let isValid = true

    tips.forEach((tip, index) => {
      const tipErrors: ValidationErrors = {}

      // Validate betting company
      if (!tip.betting_company_id) {
        tipErrors.betting_company_id = t('validationErrors.bettingCompanyRequired')
        isValid = false
      }

      // Validate sport - must be selected from list (sport_id required)
      if (!tip.sport_id || !tip.sport_id.trim()) {
        tipErrors.sport = t('validationErrors.sportRequired')
        isValid = false
      }

      // Validate league
      if (!tip.league.trim()) {
        tipErrors.league = t('validationErrors.leagueRequired')
        isValid = false
      }

      // Validate match
      if (!tip.match.trim()) {
        tipErrors.match = t('validationErrors.matchRequired')
        isValid = false
      }

      // Validate odds
      const oddsValue = parseFloat(tip.odds)
      if (isNaN(oddsValue)) {
        tipErrors.odds = t('validationErrors.oddsRequired')
        isValid = false
      } else if (oddsValue < 1.001 || oddsValue > 2.0) {
        tipErrors.odds = t('validationErrors.oddsInvalid')
        isValid = false
      }

      // Validate match date
      if (!tip.match_date || !tip.match_date.isValid()) {
        tipErrors.match_date = t('validationErrors.matchDateRequired')
        isValid = false
      }

      if (Object.keys(tipErrors).length > 0) {
        errors.set(tip.id, tipErrors)
      }
    })

    return { isValid, errors }
  }

  const handleNext = () => {
    setError(null)
    setFieldErrors(new Map())
    
    if (activeStep === 0) {
      // Validate tips
      const validation = validateTips()
      if (!validation.isValid) {
        setFieldErrors(validation.errors)
        // Create a summary error message
        const errorMessages: string[] = []
        validation.errors.forEach((errors, tipId) => {
          const tipIndex = tips.findIndex(t => t.id === tipId)
          if (tipIndex >= 0) {
            const fieldNames = Object.keys(errors).map(field => {
              switch (field) {
                case 'betting_company_id': return t('bettingCompany')
                case 'sport': return t('sport')
                case 'league': return t('league')
                case 'match': return t('match')
                case 'odds': return t('odds')
                case 'match_date': return t('matchKickoff')
                default: return field
              }
            }).join(', ')
            errorMessages.push(`${t('tip')} ${tipIndex + 1}: ${fieldNames}`)
          }
        })
        setError(errorMessages.join(' '))
        // Navigate to the first tip with errors
        const firstErrorTipId = Array.from(validation.errors.keys())[0]
        const firstErrorTipIndex = tips.findIndex(t => t.id === firstErrorTipId)
        if (firstErrorTipIndex >= 0) {
          setActiveTipIndex(firstErrorTipIndex)
        }
        return
      }
      if (finalOdds > 2.0) {
        setError(t('finalOddsExceedsMax'))
        return
      }
    } else if (activeStep === 1) {
      // Validate stake
      const stakeValue = parseFloat(stake)
      if (!stake || isNaN(stakeValue) || stakeValue <= 0) {
        setError(t('stakeRequired'))
        return
      }
    }
    
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setError(null)
    setFieldErrors(new Map())
    setActiveStep((prev) => prev - 1)
  }

  const handleStepClick = (step: number) => {
    // Allow navigation to any previous step or current step
    if (step <= activeStep) {
      setActiveStep(step)
      setError(null)
      setFieldErrors(new Map())
    }
  }

  const handleSubmit = () => {
    setError(null)
    const stakeValue = parseFloat(stake)
    
    if (!stake || isNaN(stakeValue) || stakeValue <= 0) {
      setError(t('stakeRequired'))
      return
    }

    startTransition(async () => {
      const response = await fetch('/api/betting-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tips: tips.map((tip) => ({
            betting_company_id: tip.betting_company_id,
            sport: tip.sport.trim(),
            league: tip.league.trim(),
            match: tip.match.trim(),
            odds: parseFloat(tip.odds),
            match_date: tip.match_date.toISOString(),
          })),
          final_odds: finalOdds,
          stake: stakeValue,
          description: tips.map((tip, idx) => `${idx + 1}. ${tip.match}`).join(' | '),
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setError(payload.error ?? t('error'))
        return
      }

      // Success - reset and keep modal open for next bet
      setTips([createDefaultTip()])
      setStake('')
      setActiveStep(0)
      setActiveTipIndex(0)
      setError(null)
      setFieldErrors(new Map())
    })
  }

  const handleClose = () => {
    if (isPending) return
    // Close the modal and reset form
    setOpen(false)
    setActiveStep(0)
    setActiveTipIndex(0)
    setError(null)
    setFieldErrors(new Map())
    // Reset form data
    setTips([createDefaultTip()])
    setStake('')
  }

  const renderTipsStep = () => {
    // Only show the active tip when there are multiple tips
    const tipToShow = tips[activeTipIndex]
    if (!tipToShow) return null

    const currentOddsValue = parseFloat(tipToShow.odds) || 1.01
    const isAtMin = currentOddsValue <= 1.001
    const isAtMax = currentOddsValue >= 2.0
    const tipErrors = fieldErrors.get(tipToShow.id) || {}

    return (
      <Stack spacing={3}>
        <Typography variant="body2" color="text.secondary">
          {t('tipsStepDescription') || 'Add one or more tips to your bet. All tips must be from the same betting company.'}
        </Typography>

        {tips.length > 1 && (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <Button
              variant="outlined"
              onClick={handlePreviousTip}
              disabled={activeTipIndex === 0}
              size="small"
            >
              {tCommon('back')}
            </Button>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t('tip')} {activeTipIndex + 1} {t('of') || 'of'} {tips.length}
              </Typography>
              {fieldErrors.has(tipToShow.id) && (
                <Chip 
                  label="!" 
                  color="error" 
                  size="small" 
                  sx={{ minWidth: 24, height: 24, fontSize: '0.75rem' }}
                />
              )}
            </Stack>
            <Button
              variant="outlined"
              onClick={handleNextTip}
              disabled={activeTipIndex === tips.length - 1}
              size="small"
            >
              {tCommon('next')}
            </Button>
          </Stack>
        )}
        
        {/* Show summary of tips with errors */}
        {fieldErrors.size > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              {t('validationError')}
            </Typography>
            <Stack spacing={0.5}>
              {Array.from(fieldErrors.entries()).map(([tipId, errors]) => {
                const tipIndex = tips.findIndex(t => t.id === tipId)
                if (tipIndex < 0) return null
                const fieldNames = Object.keys(errors).map(field => {
                  switch (field) {
                    case 'betting_company_id': return t('bettingCompany')
                    case 'sport': return t('sport')
                    case 'league': return t('league')
                    case 'match': return t('match')
                    case 'odds': return t('odds')
                    case 'match_date': return t('matchKickoff')
                    default: return field
                  }
                }).join(', ')
                return (
                  <Typography key={tipId} variant="body2" component="div">
                    • {t('tip')} {tipIndex + 1}: <strong>{fieldNames}</strong>
                  </Typography>
                )
              })}
            </Stack>
          </Alert>
        )}
        
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {t('tip')} {activeTipIndex + 1}
                </Typography>
                {tips.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveTip(tipToShow.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box sx={{ width: { xs: '100%', md: '30%' }, flexShrink: 0 }}>
                  {activeTipIndex === 0 ? (
                    <TextField
                      select
                      label={t('bettingCompany')}
                      fullWidth
                      required
                      value={tipToShow.betting_company_id}
                      error={!!tipErrors.betting_company_id}
                      helperText={tipErrors.betting_company_id}
                      onChange={(event) => {
                        const newCompanyId = event.target.value
                        handleTipChange(tipToShow.id, 'betting_company_id', newCompanyId)
                        setTips((prev) =>
                          prev.map((t) =>
                            t.id !== tipToShow.id
                              ? { ...t, betting_company_id: newCompanyId }
                              : t
                          )
                        )
                        // Clear error when field is filled
                        if (newCompanyId && tipErrors.betting_company_id) {
                          const newErrors = new Map(fieldErrors)
                          const tipError = { ...tipErrors }
                          delete tipError.betting_company_id
                          if (Object.keys(tipError).length === 0) {
                            newErrors.delete(tipToShow.id)
                          } else {
                            newErrors.set(tipToShow.id, tipError)
                          }
                          setFieldErrors(newErrors)
                        }
                      }}
                    >
                      {bettingCompanies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      label={t('bettingCompany')}
                      fullWidth
                      required
                      value={
                        bettingCompanies.find(
                          (c) => c.id === (tipToShow.betting_company_id || tips[0]?.betting_company_id)
                        )?.name || ''
                      }
                      disabled
                      helperText={t('sameCompanyAsFirstTip')}
                    />
                  )}
                </Box>
                <Box sx={{ width: { xs: '100%', md: '70%' }, flexGrow: 1 }}>
                  <Autocomplete
                    open={openSportAutocomplete === tipToShow.id}
                    onOpen={() => setOpenSportAutocomplete(tipToShow.id)}
                    onClose={() => setOpenSportAutocomplete(null)}
                    options={sports}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={
                      tipToShow.sport_id && tipToShow.sport_id.trim()
                        ? sports.find((s) => s.id === tipToShow.sport_id) || null
                        : null
                    }
                    onChange={(event, newValue) => {
                      if (newValue && 'id' in newValue && newValue.id) {
                        // User selected from dropdown - only allow selection from list
                        handleTipChange(tipToShow.id, 'sport_id', newValue.id)
                        handleTipChange(tipToShow.id, 'sport', newValue.name)
                        // Close dropdown after selection
                        setOpenSportAutocomplete(null)
                        // Clear error when field is filled
                        if (tipErrors.sport) {
                          const newErrors = new Map(fieldErrors)
                          const tipError = { ...tipErrors }
                          delete tipError.sport
                          if (Object.keys(tipError).length === 0) {
                            newErrors.delete(tipToShow.id)
                          } else {
                            newErrors.set(tipToShow.id, tipError)
                          }
                          setFieldErrors(newErrors)
                        }
                      } else {
                        // Cleared or null - reset both fields
                        handleTipChange(tipToShow.id, 'sport', '')
                        handleTipChange(tipToShow.id, 'sport_id', '')
                      }
                    }}
                    onInputChange={(event, newInputValue, reason) => {
                      // Only allow filtering/searching, not custom values
                      // Don't update sport/sport_id on input - only on selection
                      if (reason === 'reset' && !tipToShow.sport_id) {
                        // When dropdown is closed/reset and field is empty, ensure it stays empty
                        handleTipChange(tipToShow.id, 'sport', '')
                        handleTipChange(tipToShow.id, 'sport_id', '')
                      }
                    }}
                    ListboxProps={{
                      style: {
                        maxHeight: '300px',
                        whiteSpace: 'normal',
                      },
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          minWidth: '300px',
                        },
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('sport')}
                        required
                        fullWidth
                        error={!!tipErrors.sport}
                        helperText={tipErrors.sport}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: 'new-password', // disable browser autocomplete
                        }}
                      />
                    )}
                    renderOption={(props, option) => {
                      const { key, ...otherProps } = props
                      return (
                        <li
                          key={key}
                          {...otherProps}
                          style={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            paddingTop: '8px',
                            paddingBottom: '8px',
                          }}
                        >
                          {option.name}
                        </li>
                      )
                    }}
                  />
                </Box>
                <TextField
                  label={t('league')}
                  fullWidth
                  required
                  value={tipToShow.league}
                  error={!!tipErrors.league}
                  helperText={tipErrors.league}
                  onChange={(event) => {
                    handleTipChange(tipToShow.id, 'league', event.target.value)
                    // Clear error when field is filled
                    if (event.target.value.trim() && tipErrors.league) {
                      const newErrors = new Map(fieldErrors)
                      const tipError = { ...tipErrors }
                      delete tipError.league
                      if (Object.keys(tipError).length === 0) {
                        newErrors.delete(tipToShow.id)
                      } else {
                        newErrors.set(tipToShow.id, tipError)
                      }
                      setFieldErrors(newErrors)
                    }
                  }}
                />
              </Stack>
              
              <TextField
                label={t('match')}
                placeholder={t('matchPlaceholder')}
                value={tipToShow.match}
                error={!!tipErrors.match}
                helperText={tipErrors.match}
                onChange={(event) => {
                  handleTipChange(tipToShow.id, 'match', event.target.value)
                  // Clear error when field is filled
                  if (event.target.value.trim() && tipErrors.match) {
                    const newErrors = new Map(fieldErrors)
                    const tipError = { ...tipErrors }
                    delete tipError.match
                    if (Object.keys(tipError).length === 0) {
                      newErrors.delete(tipToShow.id)
                    } else {
                      newErrors.set(tipToShow.id, tipError)
                    }
                    setFieldErrors(newErrors)
                  }
                }}
                required
                fullWidth
              />
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('odds')}
                  type="number"
                  value={tipToShow.odds}
                  onChange={(event) => {
                    handleOddsChange(tipToShow.id, event.target.value)
                    // Clear error when field is valid
                    const newValue = parseFloat(event.target.value)
                    if (!isNaN(newValue) && newValue >= 1.001 && newValue <= 2.0 && tipErrors.odds) {
                      const newErrors = new Map(fieldErrors)
                      const tipError = { ...tipErrors }
                      delete tipError.odds
                      if (Object.keys(tipError).length === 0) {
                        newErrors.delete(tipToShow.id)
                      } else {
                        newErrors.set(tipToShow.id, tipError)
                      }
                      setFieldErrors(newErrors)
                    }
                  }}
                  onBlur={(event) => {
                    const value = parseFloat(event.target.value)
                    if (isNaN(value) || value < 1.001) {
                      handleTipChange(tipToShow.id, 'odds', '1.001')
                    } else if (value > 2.0) {
                      handleTipChange(tipToShow.id, 'odds', '2.0')
                    } else {
                      handleTipChange(tipToShow.id, 'odds', value.toFixed(3))
                    }
                  }}
                  required
                  fullWidth
                  inputProps={{
                    step: 0.001,
                    min: 1.001,
                    max: 2.0,
                  }}
                  error={currentOddsValue < 1.001 || currentOddsValue > 2.0 || !!tipErrors.odds}
                  helperText={
                    tipErrors.odds || (currentOddsValue < 1.001 || currentOddsValue > 2.0
                      ? t('oddsValidationError')
                      : t('oddsHelper'))
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            onClick={() => handleOddsDecrement(tipToShow.id)}
                            disabled={isAtMin}
                            size="small"
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleOddsIncrement(tipToShow.id)}
                            disabled={isAtMax}
                            size="small"
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
                  value={tipToShow.match_date}
                  onChange={(value: Dayjs | null) => {
                    handleTipChange(tipToShow.id, 'match_date', value ?? dayjs())
                    // Clear error when field is filled
                    if (value && value.isValid() && tipErrors.match_date) {
                      const newErrors = new Map(fieldErrors)
                      const tipError = { ...tipErrors }
                      delete tipError.match_date
                      if (Object.keys(tipError).length === 0) {
                        newErrors.delete(tipToShow.id)
                      } else {
                        newErrors.set(tipToShow.id, tipError)
                      }
                      setFieldErrors(newErrors)
                    }
                  }}
                  minDateTime={dayjs()}
                  error={!!tipErrors.match_date}
                  helperText={tipErrors.match_date}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Button
          variant="outlined"
          onClick={handleAddTip}
          startIcon={<AddIcon />}
          fullWidth
        >
          {t('addAnotherTip')}
        </Button>

        {finalOdds > 2.0 && (
          <Alert severity="error">
            {t('finalOddsExceedsMax')}
          </Alert>
        )}
      </Stack>
    )
  }

  const renderStakeStep = () => (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        {t('stakeStepDescription') || 'Enter the stake amount that will be applied to all tips in this bet.'}
      </Typography>
      
      <TextField
        label={t('stake')}
        type="number"
        value={stake}
        onChange={(event) => setStake(event.target.value)}
        required
        fullWidth
        inputProps={{
          step: 0.01,
          min: 0.01,
        }}
        helperText={t('stakeHelper')}
      />

      <Box
        sx={{
          p: 2,
          bgcolor: 'background.default',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">{t('finalOdds')}</Typography>
            <Typography
              variant="h6"
              color={finalOdds > 2.0 ? 'error.main' : 'primary.main'}
              fontWeight="bold"
            >
              {finalOdds.toFixed(3)}
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">{t('totalWin')}</Typography>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {totalWin.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )

  const renderReviewStep = () => (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        {t('reviewStepDescription') || 'Review your bet details before publishing.'}
      </Typography>

      <Stack spacing={2}>
        {tips.map((tip, index) => {
          const companyName = bettingCompanies.find(c => c.id === tip.betting_company_id)?.name || ''
          return (
            <Card key={tip.id} variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      {t('tip')} {index + 1}
                    </Typography>
                    <Chip label={`${t('odds')} ${tip.odds}`} size="small" color="primary" />
                  </Stack>
                  <Typography variant="body1" fontWeight={500}>
                    {tip.match}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {companyName} • {tip.sport} • {tip.league}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(tip.match_date).format('DD.MM.YYYY HH:mm')}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )
        })}
      </Stack>
      

      <Box
        sx={{
          p: 3,
          bgcolor: 'background.default',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">{t('stake')}</Typography>
            <Typography variant="h6" fontWeight="bold">
              {parseFloat(stake || '0').toFixed(2)}
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1">{t('finalOdds')}</Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {finalOdds.toFixed(3)}
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{t('totalWin')}</Typography>
            <Typography variant="h5" color="success.main" fontWeight="bold">
              {totalWin.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderTipsStep()
      case 1:
        return renderStakeStep()
      case 2:
        return renderReviewStep()
      default:
        return null
    }
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        disableEscapeKeyDown={isPending}
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={handleClose}
              disabled={isPending}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={4}>
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step 
                completed={activeStep > 0}
                sx={{ 
                  cursor: activeStep >= 0 ? 'pointer' : 'default',
                  '& .MuiStepLabel-root': {
                    cursor: activeStep >= 0 ? 'pointer' : 'default',
                  }
                }}
              >
                <StepLabel 
                  onClick={() => handleStepClick(0)}
                  sx={{ cursor: activeStep >= 0 ? 'pointer' : 'default' }}
                >
                  {t('stepTips') || 'Tips'}
                </StepLabel>
              </Step>
              <Step 
                completed={activeStep > 1}
                sx={{ 
                  cursor: activeStep >= 1 ? 'pointer' : 'default',
                  '& .MuiStepLabel-root': {
                    cursor: activeStep >= 1 ? 'pointer' : 'default',
                  }
                }}
              >
                <StepLabel 
                  onClick={() => handleStepClick(1)}
                  sx={{ cursor: activeStep >= 1 ? 'pointer' : 'default' }}
                >
                  {t('stepStake') || 'Stake'}
                </StepLabel>
              </Step>
              <Step 
                completed={activeStep > 2}
                sx={{ 
                  cursor: activeStep >= 2 ? 'pointer' : 'default',
                  '& .MuiStepLabel-root': {
                    cursor: activeStep >= 2 ? 'pointer' : 'default',
                  }
                }}
              >
                <StepLabel 
                  onClick={() => handleStepClick(2)}
                  sx={{ cursor: activeStep >= 2 ? 'pointer' : 'default' }}
                >
                  {t('stepReview') || 'Review'}
                </StepLabel>
              </Step>
            </Stepper>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Box sx={{ minHeight: 400 }}>
              {getStepContent(activeStep)}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                onClick={activeStep === 0 ? handleClose : handleBack}
                disabled={isPending}
              >
                {activeStep === 0 ? tCommon('cancel') : tCommon('back') || 'Back'}
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isPending}
                  startIcon={isPending ? null : <CheckCircleIcon />}
                >
                  {isPending ? t('publishing') : t('confirmAndPublish') || 'Confirm & Publish'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={isPending}
                >
                  {tCommon('next') || 'Next'}
                </Button>
              )}
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
  )
}

export default NewBetForm
