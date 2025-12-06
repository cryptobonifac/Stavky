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

type Company = {
  id: string
  name: string
}

type BettingCompaniesSectionProps = {
  companies: Company[]
}

const BettingCompaniesSection = ({
  companies: initialCompanies,
}: BettingCompaniesSectionProps) => {
  const t = useTranslations('settings.bettingCompanies')
  const tCommon = useTranslations('common')
  const [companies, setCompanies] = useState(initialCompanies)
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<{ id: string; name: string } | null>(null)

  // Sync local state with prop changes (e.g., after router.refresh())
  useEffect(() => {
    setCompanies(initialCompanies)
  }, [initialCompanies])

  const handleCreate = () => {
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch('/api/settings/betting-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? t('createFailed'))
        return
      }
      const newCompany = await response.json()
      setCompanies((prev) => [...prev, newCompany].sort((a, b) => a.name.localeCompare(b.name)))
      setFeedback(t('companyCreated'))
      setName('')
    })
  }

  const handleDeleteClick = (id: string, companyName: string) => {
    setCompanyToDelete({ id, name: companyName })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!companyToDelete) return
    setDeleteDialogOpen(false)
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch(
        `/api/settings/betting-companies/${companyToDelete.id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? t('deleteFailed'))
        return
      }
      setCompanies((prev) => prev.filter((company) => company.id !== companyToDelete.id))
      setFeedback(t('companyDeleted'))
      setCompanyToDelete(null)
    })
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setCompanyToDelete(null)
  }

  return (
    <Stack spacing={3}>
      {feedback && <Alert onClose={() => setFeedback(null)}>{feedback}</Alert>}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          label={t('newCompanyName')}
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
          size="small"
          inputProps={{ 'data-testid': 'settings-company-name-input' }}
        />
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={isPending || !name.trim()}
          sx={{ minWidth: 100 }}
          data-testid="settings-company-add-button"
        >
          {t('add')}
        </Button>
      </Stack>
      <Stack spacing={1.5}>
        {companies.map((company) => (
          <Card
            key={company.id}
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
                {company.name}
              </Typography>
              <IconButton
                aria-label={tCommon('delete')}
                onClick={() => handleDeleteClick(company.id, company.name)}
                size="small"
                data-testid={`settings-company-delete-${company.id}`}
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
        {companies.length === 0 && (
          <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
            {t('noCompanies')}
          </Typography>
        )}
      </Stack>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        data-testid="settings-company-delete-dialog"
      >
        <DialogTitle id="delete-dialog-title">
          {t('delete')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {companyToDelete && t('confirmDelete').replace('túto spoločnosť', companyToDelete.name).replace('this company', companyToDelete.name).replace('tuto kancelář', companyToDelete.name)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} data-testid="settings-company-delete-cancel">
            {tCommon('cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            data-testid="settings-company-delete-confirm"
          >
            {tCommon('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default BettingCompaniesSection


