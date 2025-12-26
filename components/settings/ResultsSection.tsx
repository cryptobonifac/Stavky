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

type Result = {
  id: string
  name: string
}

type ResultsSectionProps = {
  results: Result[]
}

const ResultsSection = ({
  results: initialResults,
}: ResultsSectionProps) => {
  const t = useTranslations('settings.results')
  const tCommon = useTranslations('common')
  const [results, setResults] = useState(initialResults)
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resultToDelete, setResultToDelete] = useState<{ id: string; name: string } | null>(null)

  // Sync local state with prop changes (e.g., after router.refresh())
  useEffect(() => {
    setResults(initialResults)
  }, [initialResults])

  const handleCreate = () => {
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch('/api/settings/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? t('createFailed'))
        return
      }
      const newResult = await response.json()
      setResults((prev) => [...prev, newResult].sort((a, b) => a.name.localeCompare(b.name)))
      setFeedback(t('resultCreated'))
      setName('')
    })
  }

  const handleDeleteClick = (id: string, resultName: string) => {
    // Store English name for deletion, but display localized name in dialog
    setResultToDelete({ id, name: resultName })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!resultToDelete) return
    setDeleteDialogOpen(false)
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch(
        `/api/settings/results/${resultToDelete.id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? t('deleteFailed'))
        return
      }
      setResults((prev) => prev.filter((result) => result.id !== resultToDelete.id))
      setFeedback(t('resultDeleted'))
      setResultToDelete(null)
    })
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setResultToDelete(null)
  }

  return (
    <Stack spacing={3}>
      {feedback && <Alert onClose={() => setFeedback(null)}>{feedback}</Alert>}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          label={t('newResultName')}
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
          size="small"
          inputProps={{ 'data-testid': 'settings-result-name-input' }}
        />
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={isPending || !name.trim()}
          sx={{ minWidth: 100 }}
          data-testid="settings-result-add-button"
        >
          {t('add')}
        </Button>
      </Stack>
      <Stack spacing={1.5}>
        {results.map((result) => (
          <Card
            key={result.id}
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
                {result.name}
              </Typography>
              <IconButton
                aria-label={tCommon('delete')}
                onClick={() => handleDeleteClick(result.id, result.name)}
                size="small"
                data-testid={`settings-result-delete-${result.id}`}
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
        {results.length === 0 && (
          <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
            {t('noResults')}
          </Typography>
        )}
      </Stack>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        data-testid="settings-result-delete-dialog"
      >
        <DialogTitle id="delete-dialog-title">
          {t('delete')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {resultToDelete && t('confirmDelete', { name: resultToDelete.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} data-testid="settings-result-delete-cancel">
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            data-testid="settings-result-delete-confirm"
          >
            {tCommon('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default ResultsSection





