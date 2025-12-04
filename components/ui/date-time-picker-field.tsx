'use client'

import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers'
import { TextField } from '@mui/material'
import { Dayjs } from 'dayjs'
import { useState, useEffect } from 'react'

type BaseProps = DateTimePickerProps<Dayjs>

type DateTimePickerFieldProps = Omit<BaseProps, 'format'> & {
  format?: string
}

// Internal component that actually renders the DateTimePicker
const DateTimePickerInternal = ({
  slotProps,
  format = 'DD.MM.YYYY HH:mm',
  ...props
}: DateTimePickerFieldProps) => (
  <DateTimePicker
    format={format}
    slotProps={{
      textField: {
        fullWidth: true,
        size: 'medium',
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
  ...props
}: DateTimePickerFieldProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a TextField placeholder during SSR to prevent hydration mismatch
    const textFieldProps = {
      fullWidth: true,
      size: 'medium' as const,
      ...slotProps?.textField,
      label,
      value: value ? (value as any).format?.(format) || '' : '',
    }
    return <TextField {...textFieldProps} disabled />
  }

  return (
    <DateTimePickerInternal
      format={format}
      slotProps={slotProps}
      value={value}
      label={label}
      {...props}
    />
  )
}

export default DateTimePickerField


