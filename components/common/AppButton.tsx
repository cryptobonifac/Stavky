import { Button, ButtonProps, CircularProgress } from '@mui/material'
import { ReactNode } from 'react'

type AppButtonProps = ButtonProps & {
  loading?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
}

const AppButton = ({
  children,
  loading = false,
  disabled,
  startIcon,
  endIcon,
  ...props
}: AppButtonProps) => {
  return (
    <Button
      disabled={disabled || loading}
      startIcon={!loading ? startIcon : undefined}
      endIcon={!loading ? endIcon : undefined}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          color="inherit"
          sx={{ mr: 1 }}
        />
      )}
      {children}
    </Button>
  )
}

export default AppButton

