import dayjs from 'dayjs'
import {
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

export type SubscriptionHistoryEntry = {
  id: string
  month: string
  valid_to: string | null
  next_month_free: boolean | null
}

type ProfileSubscriptionHistoryProps = {
  entries: SubscriptionHistoryEntry[]
}

const ProfileSubscriptionHistory = ({
  entries,
}: ProfileSubscriptionHistoryProps) => (
  <Card variant="outlined">
    <CardContent>
      <Stack spacing={2}>
        <Typography variant="h5">Subscription history</Typography>
        {entries.length === 0 ? (
          <Typography color="text.secondary">
            No subscription records yet. Once you activate your account, the
            history will appear here.
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Valid to</TableCell>
                <TableCell>Free month</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {dayjs(entry.month).format('MMMM YYYY')}
                  </TableCell>
                  <TableCell>
                    {entry.valid_to
                      ? dayjs(entry.valid_to).format('DD.MM.YYYY')
                      : 'Not set'}
                  </TableCell>
                  <TableCell>
                    {entry.next_month_free ? (
                      <Chip label="Granted" size="small" color="success" />
                    ) : (
                      <Chip label="No" size="small" variant="outlined" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Stack>
    </CardContent>
  </Card>
)

export default ProfileSubscriptionHistory


