'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useTranslations } from 'next-intl'

type Item = {
  id: string
  name: string
}

type SystemConfigurationSectionProps = {
  companies: Item[]
  sports: Item[]
}

const CompactList = ({
  items,
  onDelete,
  emptyText,
  testIdPrefix,
}: {
  items: Item[]
  onDelete: (id: string, name: string) => void
  emptyText: string
  testIdPrefix: string
}) => {
  if (items.length === 0) {
    return (
      <Typography color="text.secondary" variant="body2" sx={{ py: 1 }}>
        {emptyText}
      </Typography>
    )
  }

  return (
    <List disablePadding sx={{ maxHeight: 200, overflow: 'auto' }}>
      {items.map((item) => (
        <ListItem
          key={item.id}
          disablePadding
          sx={{
            py: 0.75,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-child': { borderBottom: 'none' },
          }}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDelete(item.id, item.name)}
              size="small"
              sx={{ color: 'text.secondary' }}
              data-testid={`${testIdPrefix}-delete-${item.id}`}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          }
        >
          <ListItemText
            primary={item.name}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </ListItem>
      ))}
    </List>
  )
}

const SystemConfigurationSection = ({
  companies: initialCompanies,
  sports: initialSports,
}: SystemConfigurationSectionProps) => {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')

  // Companies state
  const [companies, setCompanies] = useState(initialCompanies)
  const [companyName, setCompanyName] = useState('')
  const [companyFeedback, setCompanyFeedback] = useState<string | null>(null)
  const [isCompanyPending, startCompanyTransition] = useTransition()

  // Sports state
  const [sports, setSports] = useState(initialSports)
  const [sportName, setSportName] = useState('')
  const [sportFeedback, setSportFeedback] = useState<string | null>(null)
  const [isSportPending, startSportTransition] = useTransition()

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    id: string
    name: string
    type: 'company' | 'sport'
  } | null>(null)

  // Sync local state with prop changes
  useEffect(() => {
    setCompanies(initialCompanies)
  }, [initialCompanies])

  useEffect(() => {
    setSports(initialSports)
  }, [initialSports])

  // Company handlers
  const handleCreateCompany = () => {
    startCompanyTransition(async () => {
      setCompanyFeedback(null)
      const response = await fetch('/api/settings/betting-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: companyName }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setCompanyFeedback(payload.error ?? t('bettingCompanies.createFailed'))
        return
      }
      const newCompany = await response.json()
      setCompanies((prev) =>
        [...prev, newCompany].sort((a, b) => a.name.localeCompare(b.name))
      )
      setCompanyName('')
    })
  }

  // Sport handlers
  const handleCreateSport = () => {
    startSportTransition(async () => {
      setSportFeedback(null)
      const response = await fetch('/api/settings/sports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sportName }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setSportFeedback(payload.error ?? t('sports.createFailed'))
        return
      }
      const newSport = await response.json()
      setSports((prev) =>
        [...prev, newSport].sort((a, b) => a.name.localeCompare(b.name))
      )
      setSportName('')
    })
  }

  // Delete handlers
  const handleDeleteClick = (id: string, name: string, type: 'company' | 'sport') => {
    setItemToDelete({ id, name, type })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return
    setDeleteDialogOpen(false)

    const { id, type } = itemToDelete
    const endpoint =
      type === 'company'
        ? `/api/settings/betting-companies/${id}`
        : `/api/settings/sports/${id}`

    const transition = type === 'company' ? startCompanyTransition : startSportTransition
    const setFeedback = type === 'company' ? setCompanyFeedback : setSportFeedback
    const setItems = type === 'company' ? setCompanies : setSports
    const errorMsg =
      type === 'company'
        ? t('bettingCompanies.deleteFailed')
        : t('sports.deleteFailed')

    transition(async () => {
      setFeedback(null)
      const response = await fetch(endpoint, { method: 'DELETE' })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? errorMsg)
        return
      }
      setItems((prev) => prev.filter((item) => item.id !== id))
      setItemToDelete(null)
    })
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
      {/* Betting Companies */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          {t('bettingCompanies.title')}
        </Typography>

        {companyFeedback && (
          <Alert severity="info" onClose={() => setCompanyFeedback(null)} sx={{ mb: 2 }}>
            {companyFeedback}
          </Alert>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            placeholder={t('bettingCompanies.addPlaceholder')}
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            size="small"
            sx={{ flex: 1 }}
            inputProps={{ 'data-testid': 'settings-company-name-input' }}
          />
          <Button
            variant="contained"
            onClick={handleCreateCompany}
            disabled={isCompanyPending || !companyName.trim()}
            data-testid="settings-company-add-button"
          >
            {t('bettingCompanies.add')}
          </Button>
        </Stack>

        <CompactList
          items={companies}
          onDelete={(id, name) => handleDeleteClick(id, name, 'company')}
          emptyText={t('bettingCompanies.noCompanies')}
          testIdPrefix="settings-company"
        />
      </Box>

      {/* Sports */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          {t('sports.title')}
        </Typography>

        {sportFeedback && (
          <Alert severity="info" onClose={() => setSportFeedback(null)} sx={{ mb: 2 }}>
            {sportFeedback}
          </Alert>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            placeholder={t('sports.addPlaceholder')}
            value={sportName}
            onChange={(event) => setSportName(event.target.value)}
            size="small"
            sx={{ flex: 1 }}
            inputProps={{ 'data-testid': 'settings-sport-name-input' }}
          />
          <Button
            variant="contained"
            onClick={handleCreateSport}
            disabled={isSportPending || !sportName.trim()}
            data-testid="settings-sport-add-button"
          >
            {t('sports.add')}
          </Button>
        </Stack>

        <CompactList
          items={sports}
          onDelete={(id, name) => handleDeleteClick(id, name, 'sport')}
          emptyText={t('sports.noSports')}
          testIdPrefix="settings-sport"
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        data-testid="settings-delete-dialog"
      >
        <DialogTitle id="delete-dialog-title">
          {itemToDelete?.type === 'company'
            ? t('bettingCompanies.delete')
            : t('sports.delete')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {itemToDelete?.type === 'company'
              ? t('bettingCompanies.confirmDelete')
              : t('sports.confirmDelete', { name: itemToDelete?.name ?? '' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>{tCommon('cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {tCommon('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default SystemConfigurationSection
