import { Box, CircularProgress, Typography } from '@mui/material'

type LoadingStateProps = {
  message?: string
}

const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        minHeight: 200,
      }}
    >
      <CircularProgress size={40} sx={{ mb: 2 }} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  )
}

export default LoadingState

