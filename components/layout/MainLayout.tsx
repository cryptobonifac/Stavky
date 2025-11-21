import { Box } from '@mui/material'
import type { ReactNode } from 'react'

type MainLayoutProps = {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <Box
    component="main"
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage:
        'linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)',
      py: 4,
      px: { xs: 2, md: 6 },
    }}
  >
    {children}
  </Box>
)

export default MainLayout


