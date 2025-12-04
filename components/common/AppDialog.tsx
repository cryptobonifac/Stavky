import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

type AppDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  content: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  loading?: boolean
  variant?: 'default' | 'danger'
}

const AppDialog = ({
  open,
  onClose,
  title,
  content,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  loading = false,
  variant = 'default',
}: AppDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          autoFocus
          color={variant === 'danger' ? 'error' : 'primary'}
          variant="contained"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AppDialog

