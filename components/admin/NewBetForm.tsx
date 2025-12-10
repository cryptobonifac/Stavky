'use client'

import { useMemo, useState, useTransition, useRef, useEffect } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import {
  Alert,
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
}

type TipForm = {
  id: string
  betting_company_id: string
  sport: string
  league: string
  match: string
  odds: string
  match_date: Dayjs
}

const steps = ['tips', 'stake', 'review'] as const
type StepType = typeof steps[number]

const NewBetForm = ({ bettingCompanies }: NewBetFormProps) => {
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
  const [isPending, startTransition] = useTransition()

  // Open modal automatically on mount
  useEffect(() => {
    setOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddTip = () => {
    const firstTipCompanyId = tips[0]?.betting_company_id || ''
    const newTip = createDefaultTip()
    if (firstTipCompanyId) {
      newTip.betting_company_id = firstTipCompanyId
    }
    setTips((prev) => [...prev, newTip])
    // Switch to the newly added tip
    setActiveTipIndex(tips.length)
  }

  const handleNextTip = () => {
    if (activeTipIndex < tips.length - 1) {
      setActiveTipIndex(activeTipIndex + 1)
    }
  }

  const handlePreviousTip = () => {
    if (activeTipIndex > 0) {
      setActiveTipIndex(activeTipIndex - 1)
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

  const validateTips = (): boolean => {
    for (const tip of tips) {
      const oddsValue = parseFloat(tip.odds)
      if (
        isNaN(oddsValue) ||
        oddsValue < 1.001 ||
        oddsValue > 2.0 ||
        !tip.betting_company_id ||
        !tip.sport.trim() ||
        !tip.league.trim() ||
        !tip.match.trim()
      ) {
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    setError(null)
    
    if (activeStep === 0) {
      // Validate tips
      if (!validateTips()) {
        setError(t('validationError'))
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
    setActiveStep((prev) => prev - 1)
  }

  const handleStepClick = (step: number) => {
    // Allow navigation to any previous step or current step
    if (step <= activeStep) {
      setActiveStep(step)
      setError(null)
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
    })
  }

  const handleClose = () => {
    if (isPending) return
    // Close the modal and reset form
    setOpen(false)
    setActiveStep(0)
    setActiveTipIndex(0)
    setError(null)
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
            <Typography variant="body2" color="text.secondary">
              {t('tip')} {activeTipIndex + 1} {t('of') || 'of'} {tips.length}
            </Typography>
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
                {activeTipIndex === 0 ? (
                  <TextField
                    select
                    label={t('bettingCompany')}
                    fullWidth
                    required
                    value={tipToShow.betting_company_id}
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
                <TextField
                  label={t('sport')}
                  fullWidth
                  required
                  value={tipToShow.sport}
                  onChange={(event) => {
                    handleTipChange(tipToShow.id, 'sport', event.target.value)
                  }}
                />
                <TextField
                  label={t('league')}
                  fullWidth
                  required
                  value={tipToShow.league}
                  onChange={(event) =>
                    handleTipChange(tipToShow.id, 'league', event.target.value)
                  }
                />
              </Stack>
              
              <TextField
                label={t('match')}
                placeholder={t('matchPlaceholder')}
                value={tipToShow.match}
                onChange={(event) => handleTipChange(tipToShow.id, 'match', event.target.value)}
                required
                fullWidth
              />
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label={t('odds')}
                  type="number"
                  value={tipToShow.odds}
                  onChange={(event) => handleOddsChange(tipToShow.id, event.target.value)}
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
                  onChange={(value: Dayjs | null) =>
                    handleTipChange(tipToShow.id, 'match_date', value ?? dayjs())
                  }
                  minDateTime={dayjs()}
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
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{t('title')}</Typography>
            <IconButton
              onClick={handleClose}
              disabled={isPending}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
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
