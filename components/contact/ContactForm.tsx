'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material'
import { useTranslations } from 'next-intl'

type ContactFormProps = {
  showTitle?: boolean
  showDescription?: boolean
}

const ContactForm = ({ showTitle = true, showDescription = true }: ContactFormProps) => {
  const t = useTranslations('contact')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = t('emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('emailInvalid')
    }

    // Mobile and message are optional - no validation needed

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          mobile: mobile.trim() || '',
          message: message.trim() || '',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('error'))
      }

      setSubmitStatus('success')
      setEmail('')
      setMobile('')
      setMessage('')
      setErrors({})
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {showTitle && (
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t('title')}
        </Typography>
      )}
      {showDescription && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('subtitle')}
        </Typography>
      )}
      
      <Stack spacing={3}>
        {submitStatus === 'success' && (
          <Alert severity="success">{t('success')}</Alert>
        )}
        {submitStatus === 'error' && (
          <Alert severity="error">{t('error')}</Alert>
        )}

        <TextField
          label={t('email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          required
          fullWidth
          error={!!errors.email}
          helperText={errors.email}
          disabled={isSubmitting}
        />

        <TextField
          label={t('mobile')}
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder={t('mobilePlaceholder')}
          fullWidth
          error={!!errors.mobile}
          helperText={errors.mobile}
          disabled={isSubmitting}
        />

        <TextField
          label={t('message')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          fullWidth
          multiline
          rows={6}
          error={!!errors.message}
          helperText={errors.message}
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ alignSelf: 'flex-start' }}
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </Stack>
    </Box>
  )
}

export default ContactForm

