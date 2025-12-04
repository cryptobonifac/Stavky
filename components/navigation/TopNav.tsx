'use client'

import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { AppBar, Box, Button, IconButton, Toolbar, Drawer, List, useMediaQuery, Theme, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import SidebarItem from '../layout/sidebar/SidebarItem'
import HomeIcon from '@mui/icons-material/Home'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import HistoryIcon from '@mui/icons-material/History'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SettingsIcon from '@mui/icons-material/Settings'
import { useAuth } from '@/components/providers/auth-provider'
import LanguageSwitcher from './LanguageSwitcher'

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
  const { profile, loading, profileLoading } = useAuth()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations('navigation')
  const tCommon = useTranslations('common')
  
  // Don't show login buttons while auth is still loading to prevent flicker
  const isAuthLoading = loading || profileLoading

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerContent = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Menu</Typography>
        <IconButton onClick={handleDrawerToggle} data-testid="nav-menu-close">
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1 }}>
        <SidebarItem href="/" icon={<HomeIcon />} label={t('home')} />
        {profile && (
          <>
            <SidebarItem href="/bettings" icon={<SportsSoccerIcon />} label={t('bettings')} />
            <SidebarItem href="/history" icon={<HistoryIcon />} label={t('history')} />
            <SidebarItem href="/profile" icon={<PersonIcon />} label={t('profile')} />
          </>
        )}
        {profile?.role === 'betting' && (
          <>
             <Typography variant="caption" sx={{ px: 2, mt: 2, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 600 }}>
              ADMIN
            </Typography>
            <SidebarItem href="/newbet" icon={<AdminPanelSettingsIcon />} label={t('newbet')} />
            <SidebarItem href="/bettings/manage" icon={<SportsSoccerIcon />} label={t('manage')} />
            <SidebarItem href="/settings" icon={<SettingsIcon />} label={t('settings')} />
          </>
        )}
      </List>
      <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {!isAuthLoading && !profile ? (
          <>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              fullWidth
              data-testid="nav-mobile-login-button"
            >
              {tCommon('login')}
            </Button>
            <Button
              component={Link}
              href="/signup"
              variant="contained"
              fullWidth
              data-testid="nav-mobile-signup-button"
            >
              {tCommon('signup')}
            </Button>
          </>
        ) : (
          <Button variant="outlined" fullWidth onClick={handleLogout} data-testid="nav-mobile-logout-button" disabled={isAuthLoading}>
            {tCommon('logout')}
          </Button>
        )}
      </Box>
    </Box>
  )

  return (
    <>
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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
           {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              data-testid="nav-menu-toggle"
            >
              <MenuIcon />
            </IconButton>
          ) : <Box />}

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <LanguageSwitcher />
            {!isMobile && !isAuthLoading && !profile && (
              <>
                <Button
                  component={Link}
                  href="/login"
                  variant="text"
                  color="inherit"
                  data-testid="nav-login-button"
                >
                  {tCommon('login')}
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  color="primary"
                  data-testid="nav-signup-button"
                >
                  {tCommon('signup')}
                </Button>
              </>
            )}
            {!isMobile && (profile || isAuthLoading) && (
              <Button variant="outlined" onClick={handleLogout} data-testid="nav-logout-button" disabled={isAuthLoading}>
                {tCommon('logout')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default TopNav
