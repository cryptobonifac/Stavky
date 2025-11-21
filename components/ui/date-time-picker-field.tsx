'use client'

import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'

type BaseProps = DateTimePickerProps<Dayjs>

type DateTimePickerFieldProps = Omit<BaseProps, 'format'> & {
  format?: string
}

const DateTimePickerField = ({
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

export default DateTimePickerField


