'use client'

import { Box, Stack } from '@mui/material'
import type { ReactNode } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import Footer from '@/components/layout/Footer'
import TopNav from '@/components/navigation/TopNav'
import { isAccountActive } from '@/lib/utils/account'

type MainLayoutProps = {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, profile, loading } = useAuth()
  
  // Check if user is an active customer
  const isActiveCustomer = profile?.role === 'customer' && profile?.account_active_until 
    ? isAccountActive(profile.account_active_until)
    : false
  
  // If we are loading or on public pages we might want different layout behavior,
  // but for now keeping it simple.
  
  return (
    <Stack direction="row" sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar visible on desktop */}
      <Sidebar role={profile?.role} isActiveCustomer={isActiveCustomer} />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
    </Stack>
  )
}

export default MainLayout
