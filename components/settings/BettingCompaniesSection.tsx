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
        setFeedback(payload.error ?? 'Failed to add company')
        return
      }
      setFeedback('Company created successfully')
      setName('')
    })
  }

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Delete this company?')
    if (!confirmed) return
    startTransition(async () => {
      setFeedback(null)
      const response = await fetch(
        `/api/settings/betting-companies/${id}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        setFeedback(payload.error ?? 'Failed to delete company')
        return
      }
      setFeedback('Company deleted. Refresh to see changes.')
    })
  }

  return (
    <Stack spacing={2}>
      {feedback && <Alert onClose={() => setFeedback(null)}>{feedback}</Alert>}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          label="New company name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={isPending || !name.trim()}
        >
          Add
        </Button>
      </Stack>
      <Stack spacing={1}>
        {companies.map((company) => (
          <Card key={company.id} variant="outlined">
            <CardContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography>{company.name}</Typography>
              <IconButton
                aria-label="Delete"
                onClick={() => handleDelete(company.id)}
              >
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))}
        {companies.length === 0 && (
          <Typography color="text.secondary">
            No betting companies yet.
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}

export default BettingCompaniesSection


