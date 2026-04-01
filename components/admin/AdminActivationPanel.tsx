'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import dayjs, { Dayjs } from 'dayjs'
import { useLocale, useTranslations } from 'next-intl'
import CopyToClipboardButton from '@/components/common/CopyToClipboardButton'
import DateTimePickerField from '@/components/ui/date-time-picker-field'

export type ManagedUser = {
  id: string
  email: string
  role: 'betting' | 'customer'
  account_active_until: string | null
  reference_number: string
}

type ActivationSettings = {
  id: string
  monthly_price: number
  yearly_price: number
  iban: string
  message_en: string
  message_cs: string
  message_sk: string
} | null

type Props = {
  users: ManagedUser[]
  settings: ActivationSettings
}

const AdminActivationPanel = ({ users, settings }: Props) => {
  const t = useTranslations('settings')
  const tAct = useTranslations('settings.activationSettings')
  const tCommon = useTranslations('common')
  const locale = useLocale()

  // User management state
  const [userFeedback, setUserFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isUserPending, startUserTransition] = useTransition()
  const [searchType, setSearchType] = useState<'email' | 'variable_symbol'>('email')
  const [drafts, setDrafts] = useState<Record<string, ManagedUser>>(() =>
    Object.fromEntries(users.map((user) => [user.id, user]))
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Activation settings state
  const [settingsFeedback, setSettingsFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [isSettingsPending, startSettingsTransition] = useTransition()
  const [monthlyPrice, setMonthlyPrice] = useState(settings?.monthly_price?.toString() ?? '40')
  const [yearlyPrice, setYearlyPrice] = useState(settings?.yearly_price?.toString() ?? '360')
  const iban = settings?.iban ?? ''
  const [messageEn, setMessageEn] = useState(settings?.message_en ?? '')
  const [messageCs, setMessageCs] = useState(settings?.message_cs ?? '')
  const [messageSk, setMessageSk] = useState(settings?.message_sk ?? '')
  const [activeTab, setActiveTab] = useState(0)

  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        label: searchType === 'email' ? user.email : user.reference_number,
        id: user.id,
      })),
    [users, searchType]
  )

  const selectedDraft = selectedId ? drafts[selectedId] : null

  const handleDateChange = (id: string, value: Dayjs | null) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], account_active_until: value ? value.toISOString() : null },
    }))
  }

  const handleSaveUser = (id: string) => {
    const draft = drafts[id]
    startUserTransition(async () => {
      setUserFeedback(null)
      const response = await fetch(`/api/settings/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setUserFeedback({ type: 'error', text: payload.error ?? t('users.updateFailed') })
        return
      }
      setUserFeedback({ type: 'success', text: t('users.userUpdated') })
    })
  }

  const handleSaveSettings = () => {
    startSettingsTransition(async () => {
      setSettingsFeedback(null)
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
        setSettingsFeedback({ type: 'error', text: payload.error ?? tAct('saveFailed') })
        return
      }
      setSettingsFeedback({ type: 'success', text: tAct('settingsSaved') })
    })
  }

  const messages = [messageEn, messageCs, messageSk]
  const setMessages = [setMessageEn, setMessageCs, setMessageSk]
  const previewMessage = messages[activeTab]

  const previewLabels = [
    { accountActivation: tAct('previewAccountActivation_en'), monthly: tAct('previewMonthly_en'), yearly: tAct('previewYearly_en'), referenceNumber: tAct('previewReferenceNumber_en') },
    { accountActivation: tAct('previewAccountActivation_cs'), monthly: tAct('previewMonthly_cs'), yearly: tAct('previewYearly_cs'), referenceNumber: tAct('previewReferenceNumber_cs') },
    { accountActivation: tAct('previewAccountActivation_sk'), monthly: tAct('previewMonthly_sk'), yearly: tAct('previewYearly_sk'), referenceNumber: tAct('previewReferenceNumber_sk') },
  ]
  const preview = previewLabels[activeTab]

  return (
    <Stack spacing={3}>
      {userFeedback && (
        <Alert severity={userFeedback.type} onClose={() => setUserFeedback(null)}>
          {userFeedback.text}
        </Alert>
      )}
      {settingsFeedback && (
        <Alert severity={settingsFeedback.type} onClose={() => setSettingsFeedback(null)}>
          {settingsFeedback.text}
        </Alert>
      )}

      {/* Top row: Search + Prices + IBAN */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
        <Box sx={{ display: 'flex', flex: 1, minWidth: 0 }}>
          <Select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value as 'email' | 'variable_symbol')
              setSelectedId(null)
            }}
            size="small"
            sx={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              minWidth: 160,
              '& .MuiOutlinedInput-notchedOutline': {
                borderRight: 0,
              },
            }}
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="variable_symbol">{t('users.variableSymbol')}</MenuItem>
          </Select>
          <Autocomplete
            options={userOptions}
            value={userOptions.find((o) => o.id === selectedId) ?? null}
            onChange={(_e, value) => setSelectedId(value?.id ?? null)}
            sx={{ flex: 1, minWidth: 0 }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t('users.searchPlaceholder')}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                }}
                inputProps={{
                  ...params.inputProps,
                  'data-testid': 'settings-user-search',
                }}
              />
            )}
            data-testid="settings-user-autocomplete"
          />
        </Box>
        <TextField
          label={tAct('monthlyPrice')}
          type="number"
          value={monthlyPrice}
          onChange={(e) => setMonthlyPrice(e.target.value)}
          size="small"
          sx={{ width: { xs: '100%', md: 150 } }}
          inputProps={{ 'data-testid': 'activation-monthly-price' }}
        />
        <TextField
          label={tAct('yearlyPrice')}
          type="number"
          value={yearlyPrice}
          onChange={(e) => setYearlyPrice(e.target.value)}
          size="small"
          sx={{ width: { xs: '100%', md: 150 } }}
          inputProps={{ 'data-testid': 'activation-yearly-price' }}
        />
      </Stack>

      {/* Selected user details */}
      {selectedDraft && (
        <Stack
          spacing={2}
          sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              value={selectedDraft.email}
              label={t('users.userEmail')}
              slotProps={{ input: { readOnly: true } }}
              size="small"
              sx={{ flex: 1 }}
              inputProps={{ 'data-testid': 'settings-user-email' }}
            />
            <TextField
              value={selectedDraft.reference_number}
              label={t('users.referenceNumber')}
              slotProps={{ input: { readOnly: true } }}
              size="small"
              sx={{ width: 180 }}
            />
            <Box sx={{ minWidth: 200 }}>
              <DateTimePickerField
                label={t('users.accountActiveUntil')}
                value={
                  selectedDraft.account_active_until
                    ? dayjs(selectedDraft.account_active_until)
                    : null
                }
                onChange={(value: Dayjs | null) => handleDateChange(selectedDraft.id, value)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    inputProps: { 'data-testid': 'settings-user-active-until' },
                  },
                }}
              />
            </Box>
          </Stack>
          <Button
            variant="contained"
            onClick={() => handleSaveUser(selectedDraft.id)}
            disabled={isUserPending}
            fullWidth
            data-testid="settings-user-save-button"
          >
            {tCommon('save')}
          </Button>
        </Stack>
      )}

      {/* Activation message with language tabs */}
      <Typography variant="subtitle2" fontWeight={600}>
        {tAct('activationMessage')}
      </Typography>
      <Box>
        <Tabs
          value={activeTab}
          onChange={(_e, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{
            bgcolor: 'grey.100',
            borderRadius: 1,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 40,
            },
            '& .MuiTab-root.Mui-selected': {
              bgcolor: 'primary.main',
              color: '#fff',
              borderRadius: 1,
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab label={tAct('tabEnglish')} />
          <Tab label={tAct('tabCzech')} />
          <Tab label={tAct('tabSlovak')} />
        </Tabs>
        <TextField
          value={messages[activeTab]}
          onChange={(e) => setMessages[activeTab](e.target.value)}
          multiline
          rows={3}
          size="small"
          fullWidth
          sx={{ mt: 1.5 }}
        />
      </Box>

      {/* Preview */}
      <Typography variant="subtitle2" fontWeight={600}>
        {tAct('preview')}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          variant="outlined"
          sx={{ bgcolor: 'grey.50', maxWidth: 440, width: '100%' }}
        >
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <AccountBalanceIcon sx={{ fontSize: 48, color: 'text.primary' }} />
              <Typography variant="h6" fontWeight={700}>
                {preview.accountActivation}
              </Typography>
              {previewMessage && (
                <Typography variant="body2" textAlign="center" sx={{ whiteSpace: 'pre-line' }}>
                  {previewMessage}
                </Typography>
              )}
              <Stack
                direction="row"
                spacing={3}
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700}>
                    {monthlyPrice}€
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {preview.monthly}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700}>
                    {yearlyPrice}€
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {preview.yearly}
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={0.5} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    IBAN: {iban}
                  </Typography>
                  {iban && <CopyToClipboardButton text={iban} />}
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {preview.referenceNumber}: 123456
                  </Typography>
                  <CopyToClipboardButton text="123456" />
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Save settings */}
      <Button
        variant="contained"
        onClick={handleSaveSettings}
        disabled={isSettingsPending}
        fullWidth
        data-testid="activation-settings-save"
      >
        {tCommon('save')}
      </Button>
    </Stack>
  )
}

export default AdminActivationPanel
