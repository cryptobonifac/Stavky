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
        {/* TopNav handles mobile menu and user actions */}
        <Box sx={{ px: { xs: 2, md: 4 }, pt: 3 }}>
             {/* Only show TopNav inside MainLayout if we want it here, 
                 or individual pages can include it.
                 Previously TopNav was in pages. We'll integrate it here for consistency if user is logged in.
              */}
             {/* However, the previous design had TopNav inside pages. 
                 To keep backward compatibility with existing pages that might include TopNav,
                 we'll check if we should render a global header or let pages handle it.
                 For this phase, let's keep TopNav control in pages but provide the structure.
             */}
             {/* Actually, let's make MainLayout robust. */}
        </Box>
        
        <Box
          component="main"
          sx={{
            flex: 1,
            py: 4,
            px: { xs: 2, md: 6 },
            display: 'flex',
            flexDirection: 'column',
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
