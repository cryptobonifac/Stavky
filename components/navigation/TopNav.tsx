'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material'

import { createClient } from '@/lib/supabase/client'

type TopNavProps = {
  showSettingsLink?: boolean
  canAccessSettings?: boolean
}

const TopNav = ({
  showSettingsLink = false,
  canAccessSettings = false,
}: TopNavProps) => {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/?signedOut=1')
  }

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        mb: 3,
        border: '1px solid rgba(15,23,42,0.1)',
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end', gap: 1 }}>
        {showSettingsLink && canAccessSettings && (
          <Button
            variant="text"
            component={NextLink}
            href="/settings"
          >
            Settings
          </Button>
        )}
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default TopNav


