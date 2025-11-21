'use client'

import { Card, CardContent, Stack, Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { useState } from 'react'

import DateTimePickerField from '@/components/ui/date-time-picker-field'

const DemoDatePlanner = () => {
  const [value, setValue] = useState<Dayjs | null>(dayjs().add(1, 'day'))

  return (
    <Card
      sx={{
        backgroundColor: 'rgba(20, 184, 166, 0.08)',
        borderColor: 'rgba(20, 184, 166, 0.4)',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Schedule the next betting tip
          </Typography>
          <DateTimePickerField
            label="Match kickoff"
            value={value}
            onChange={setValue}
            minDateTime={dayjs()}
          />
          {value && (
            <Typography variant="body2" color="text.secondary">
              Next tip planned for {value.format('DD.MM.YYYY HH:mm')}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default DemoDatePlanner


