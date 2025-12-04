import { Alert, Box, Button } from '@mui/material'

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
}

const ErrorState = ({ message = 'Something went wrong.', onRetry }: ErrorStateProps) => {
  return (
    <Box sx={{ p: 4 }}>
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      >
        {message}
      </Alert>
    </Box>
  )
}

export default ErrorState

