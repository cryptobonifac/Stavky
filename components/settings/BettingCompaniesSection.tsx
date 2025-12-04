'use client'

import { useState, useTransition } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
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
  companies,
}: BettingCompaniesSectionProps) => {
  const t = useTranslations('settings.bettingCompanies')
  const tCommon = useTranslations('common')
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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
      setFeedback(t('companyCreated'))
      setName('')
    })
  }

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(t('confirmDelete'))
    if (!confirmed) return
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch(
        `/api/settings/betting-companies/${id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? t('deleteFailed'))
        return
      }
      setFeedback(t('companyDeleted'))
    })
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
                onClick={() => handleDelete(company.id)}
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
    </Stack>
  )
}

export default BettingCompaniesSection


