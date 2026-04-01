'use client'

import { useState, useTransition } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import CopyToClipboardButton from '@/components/common/CopyToClipboardButton'
import { useLocale, useTranslations } from 'next-intl'

type ActivationSettings = {
  id: string
  monthly_price: number
  yearly_price: number
  iban: string
  message_en: string
  message_cs: string
  message_sk: string
} | null

type ActivationSettingsSectionProps = {
  settings: ActivationSettings
}

const ActivationSettingsSection = ({ settings }: ActivationSettingsSectionProps) => {
  const t = useTranslations('settings.activationSettings')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const [monthlyPrice, setMonthlyPrice] = useState(settings?.monthly_price?.toString() ?? '40')
  const [yearlyPrice, setYearlyPrice] = useState(settings?.yearly_price?.toString() ?? '360')
  const iban = settings?.iban ?? ''
  const [messageEn, setMessageEn] = useState(settings?.message_en ?? '')
  const [messageCs, setMessageCs] = useState(settings?.message_cs ?? '')
  const [messageSk, setMessageSk] = useState(settings?.message_sk ?? '')

  const handleSave = () => {
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch('/api/settings/activation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthly_price: parseFloat(monthlyPrice) || 40,
          yearly_price: parseFloat(yearlyPrice) || 360,
          message_en: messageEn,
          message_cs: messageCs,
          message_sk: messageSk,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback({ type: 'error', text: payload.error ?? t('saveFailed') })
        return
      }

      setFeedback({ type: 'success', text: t('settingsSaved') })
    })
  }

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        {t('description')}
      </Typography>

      {feedback && (
        <Alert severity={feedback.type} onClose={() => setFeedback(null)}>
          {feedback.text}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label={t('monthlyPrice')}
          type="number"
          value={monthlyPrice}
          onChange={(e) => setMonthlyPrice(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
          inputProps={{ 'data-testid': 'activation-monthly-price' }}
        />
        <TextField
          label={t('yearlyPrice')}
          type="number"
          value={yearlyPrice}
          onChange={(e) => setYearlyPrice(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
          inputProps={{ 'data-testid': 'activation-yearly-price' }}
        />
      </Stack>

      <TextField
        label={t('iban')}
        value={iban}
        size="small"
        fullWidth
        disabled
        inputProps={{ 'data-testid': 'activation-iban' }}
        helperText={t('ibanFixed')}
      />

      <Divider />

      <Typography variant="subtitle2" fontWeight={600}>
        {t('activationMessage')}
      </Typography>

      <TextField
        label={t('messageEnglish')}
        value={messageEn}
        onChange={(e) => setMessageEn(e.target.value)}
        multiline
        rows={3}
        size="small"
        fullWidth
        inputProps={{ 'data-testid': 'activation-message-en' }}
      />

      <TextField
        label={t('messageCzech')}
        value={messageCs}
        onChange={(e) => setMessageCs(e.target.value)}
        multiline
        rows={3}
        size="small"
        fullWidth
        inputProps={{ 'data-testid': 'activation-message-cs' }}
      />

      <TextField
        label={t('messageSlovak')}
        value={messageSk}
        onChange={(e) => setMessageSk(e.target.value)}
        multiline
        rows={3}
        size="small"
        fullWidth
        inputProps={{ 'data-testid': 'activation-message-sk' }}
      />

      <Divider />

      {/* Preview */}
      <Typography variant="subtitle2" fontWeight={600}>
        {t('preview')}
      </Typography>

      <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <AccountBalanceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={600}>
              {t('accountActivation')}
            </Typography>
            {(() => {
              const previewMessage = locale === 'sk' ? messageSk : locale === 'cs' ? messageCs : messageEn
              return previewMessage ? (
                <Typography variant="body2" textAlign="center" sx={{ whiteSpace: 'pre-line' }}>
                  {previewMessage}
                </Typography>
              ) : null
            })()}
            <Stack direction="row" spacing={2}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {monthlyPrice}€
                </Typography>
                <Typography variant="caption">{t('monthly')}</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {yearlyPrice}€
                </Typography>
                <Typography variant="caption">{t('yearly')}</Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                {t('iban')}: {iban}
              </Typography>
              {iban && <CopyToClipboardButton text={iban} />}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isPending}
        fullWidth
        data-testid="activation-settings-save"
      >
        {tCommon('save')}
      </Button>
    </Stack>
  )
}

export default ActivationSettingsSection
