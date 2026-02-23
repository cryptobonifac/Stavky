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
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

const DangerZoneSection = () => {
  const t = useTranslations('settings.deleteAllTips')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  )
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

      router.refresh()
    })
  }

  const handleDeleteCancel = () => {
    setDialogOpen(false)
  }

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} justifyContent="space-between">
      <Stack spacing={0.5}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t('title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('description')}
        </Typography>
      </Stack>

      <Button
        variant="contained"
        color="error"
        onClick={handleDeleteClick}
        disabled={isPending}
        sx={{ flexShrink: 0 }}
        data-testid="settings-delete-all-tips-button"
      >
        {t('buttonLabel')}
      </Button>

      {feedback && (
        <Alert
          severity={feedback.type}
          onClose={() => setFeedback(null)}
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
        >
          {feedback.message}
        </Alert>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-all-tips-dialog-title"
        data-testid="settings-delete-all-tips-dialog"
      >
        <DialogTitle id="delete-all-tips-dialog-title">{t('dialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('dialogDescription')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isPending}>
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isPending}
            data-testid="settings-delete-all-tips-confirm"
          >
            {tCommon('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default DangerZoneSection
