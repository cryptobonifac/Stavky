'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import MessageIcon from '@mui/icons-material/Message'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { useTranslations } from 'next-intl'

dayjs.extend(localizedFormat)

export type ContactRecord = {
  id: string
  email: string
  mobile: string | null
  message: string | null
  created_at: string
}

type ContactsListProps = {
  contacts: ContactRecord[]
}

const ContactsList = ({ contacts }: ContactsListProps) => {
  const t = useTranslations('contacts')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<ContactRecord | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteClick = (contact: ContactRecord) => {
    setContactToDelete(contact)
    setDeleteDialogOpen(true)
    setError(null)
  }

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/contacts/${contactToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete contact')
      }

      // Reload the page to refresh the list
      window.location.reload()
    } catch (err: any) {
      console.error('Delete contact error:', err)
      setError(err.message || 'Failed to delete contact')
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setContactToDelete(null)
    setError(null)
  }

  if (contacts.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography color="text.secondary" textAlign="center">
            {t('noContacts')}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Stack spacing={2}>
        {contacts.map((contact) => (
          <Card key={contact.id} variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Stack spacing={1} flex={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight={600}>
                        {contact.email}
                      </Typography>
                    </Stack>
                    {contact.mobile && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {contact.mobile}
                        </Typography>
                      </Stack>
                    )}
                    {contact.message && (
                      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1 }}>
                        <MessageIcon fontSize="small" color="action" sx={{ mt: 0.5 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                          {contact.message}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={dayjs(contact.created_at).format('DD.MM.YYYY HH:mm')}
                      size="small"
                      variant="outlined"
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(contact)}
                      aria-label={t('delete')}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>{t('confirmDelete')}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography>
            {t('deleteConfirmation', { email: contactToDelete?.email || '' })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? t('deleting') : t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ContactsList

