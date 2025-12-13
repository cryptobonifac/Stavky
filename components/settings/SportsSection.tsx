'use client'

import { useState, useTransition, useEffect } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslations } from 'next-intl'
import { useSportLeagueTranslations } from '@/lib/i18n/translate-sports-leagues'

type Sport = {
  id: string
  name: string
}

type SportsSectionProps = {
  sports: Sport[]
}

const SportsSection = ({
  sports: initialSports,
}: SportsSectionProps) => {
  const t = useTranslations('settings.sports')
  const tCommon = useTranslations('common')
  const { translateSport } = useSportLeagueTranslations()
  const [sports, setSports] = useState(initialSports)
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sportToDelete, setSportToDelete] = useState<{ id: string; name: string } | null>(null)

  // Sync local state with prop changes (e.g., after router.refresh())
  useEffect(() => {
    setSports(initialSports)
  }, [initialSports])

  const handleCreate = () => {
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch('/api/settings/sports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? t('createFailed'))
        return
      }
      const newSport = await response.json()
      setSports((prev) => [...prev, newSport].sort((a, b) => a.name.localeCompare(b.name)))
      setFeedback(t('sportCreated'))
      setName('')
    })
  }

  const handleDeleteClick = (id: string, sportName: string) => {
    // Store English name for deletion, but display localized name in dialog
    setSportToDelete({ id, name: sportName })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!sportToDelete) return
    setDeleteDialogOpen(false)
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch(
        `/api/settings/sports/${sportToDelete.id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? t('deleteFailed'))
        return
      }
      setSports((prev) => prev.filter((sport) => sport.id !== sportToDelete.id))
      setFeedback(t('sportDeleted'))
      setSportToDelete(null)
    })
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSportToDelete(null)
  }

  return (
    <Stack spacing={3}>
      {feedback && <Alert onClose={() => setFeedback(null)}>{feedback}</Alert>}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          label={t('newSportName')}
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
          size="small"
          inputProps={{ 'data-testid': 'settings-sport-name-input' }}
        />
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={isPending || !name.trim()}
          sx={{ minWidth: 100 }}
          data-testid="settings-sport-add-button"
        >
          {t('add')}
        </Button>
      </Stack>
      <Stack spacing={1.5}>
        {sports.map((sport) => (
          <Card
            key={sport.id}
            variant="outlined"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: 1,
              },
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                '&:last-child': { pb: 1.5 },
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                {sport.name}
              </Typography>
              <IconButton
                aria-label={tCommon('delete')}
                onClick={() => handleDeleteClick(sport.id, sport.name)}
                size="small"
                data-testid={`settings-sport-delete-${sport.id}`}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'error.dark',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </CardContent>
          </Card>
        ))}
        {sports.length === 0 && (
          <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
            {t('noSports')}
          </Typography>
        )}
      </Stack>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        data-testid="settings-sport-delete-dialog"
      >
        <DialogTitle id="delete-dialog-title">
          {t('delete')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {sportToDelete && t('confirmDelete', { name: translateSport(sportToDelete.name) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} data-testid="settings-sport-delete-cancel">
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            data-testid="settings-sport-delete-confirm"
          >
            {tCommon('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default SportsSection


