'use client'

import { useState, useTransition } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

const DeleteAllTipsSection = () => {
  const t = useTranslations('settings.deleteAllTips')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDeleteClick = () => {
    setDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDialogOpen(false)
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch('/api/settings/delete-all-tips', {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback({
          type: 'error',
          message: payload.error ?? t('deleteFailed'),
        })
        return
      }
      
      setFeedback({
        type: 'success',
        message: t('deleteSuccess'),
      })
      
      // Refresh the page to update the UI
      router.refresh()
    })
  }

  const handleDeleteCancel = () => {
    setDialogOpen(false)
  }

  return (
    <Stack spacing={2}>
      {feedback && (
        <Alert
          severity={feedback.type}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      )}
      
      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
          {t('description')}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
          disabled={isPending}
          sx={{
            alignSelf: 'flex-start',
          }}
          data-testid="settings-delete-all-tips-button"
        >
          {t('buttonLabel')}
        </Button>
      </Stack>

      <Dialog
        open={dialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-all-tips-dialog-title"
        aria-describedby="delete-all-tips-dialog-description"
        data-testid="settings-delete-all-tips-dialog"
      >
        <DialogTitle id="delete-all-tips-dialog-title">
          {t('dialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-all-tips-dialog-description">
            {t('dialogDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            disabled={isPending}
            data-testid="settings-delete-all-tips-cancel"
          >
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isPending}
            autoFocus
            data-testid="settings-delete-all-tips-confirm"
          >
            {tCommon('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default DeleteAllTipsSection






