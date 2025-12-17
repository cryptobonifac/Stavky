'use client'

import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { Dayjs } from 'dayjs'
import { useState, useEffect } from 'react'

// MUI v8 changed the type signature - use props directly without generic
type BaseProps = DateTimePickerProps

type DateTimePickerFieldProps = Omit<BaseProps, 'format'> & {
  format?: string
  value?: Dayjs | null
  onChange?: (value: Dayjs | null) => void
  minDateTime?: Dayjs
  error?: boolean
  helperText?: string
}

// Internal component that actually renders the DateTimePicker
const DateTimePickerInternal = ({
  slotProps,
  format = 'DD.MM.YYYY HH:mm',
  error,
  helperText,
  ...props
}: DateTimePickerFieldProps) => (
  <DateTimePicker
    format={format}
    slotProps={{
      textField: {
        fullWidth: true,
        size: 'medium',
        error,
        helperText,
        ...slotProps?.textField,
      },
      ...slotProps,
    }}
    {...props}
  />
)

// Main component with client-side only rendering
const DateTimePickerField = ({
  value,
  label,
  format = 'DD.MM.YYYY HH:mm',
  slotProps,
  error,
  helperText,
  ...props
}: DateTimePickerFieldProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a TextField placeholder during SSR to prevent hydration mismatch
    return (
      <TextField
        fullWidth
        size="medium"
        label={label}
        value={value ? (value as any).format?.(format) || '' : ''}
        disabled
        error={error}
        helperText={helperText}
        {...(slotProps?.textField as any)}
      />
    )
  }

  return (
    <DateTimePickerInternal
      format={format}
      slotProps={slotProps}
      value={value}
      label={label}
      error={error}
      helperText={helperText}
      {...props}
    />
  )
}

export default DateTimePickerField


