import { Card, CardContent, CardProps, Typography, Box } from '@mui/material'
import { ReactNode } from 'react'

type AppCardProps = CardProps & {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  noPadding?: boolean
}

const AppCard = ({
  title,
  subtitle,
  action,
  children,
  noPadding = false,
  sx,
  ...props
}: AppCardProps) => {
  return (
    <Card variant="outlined" sx={{ ...sx }} {...props}>
      {(title || action) && (
        <Box
          sx={{
            p: 3,
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box>
            {title && <Typography variant="h6">{title}</Typography>}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
      )}
      <CardContent sx={noPadding ? { p: 0, '&:last-child': { pb: 0 } } : undefined}>
        {children}
      </CardContent>
    </Card>
  )
}

export default AppCard

