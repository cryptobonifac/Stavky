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
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import InfoIcon from '@mui/icons-material/Info'
import ArticleIcon from '@mui/icons-material/Article'
import { useAuth } from '@/components/providers/auth-provider'
import LanguageSwitcher from './LanguageSwitcher'
import { isAccountActive } from '@/lib/utils/account'
import PageBreadcrumbs from './PageBreadcrumbs'

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
  const { user, profile, loading, profileLoading } = useAuth()
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations('navigation')
  const tCommon = useTranslations('common')
  
  // Don't show login buttons while auth is still loading to prevent flicker
  const isAuthLoading = loading || profileLoading
  // Use user (auth state) to determine if logged in, not profile (database state)
  const isLoggedIn = !!user
  // Check if user is an active customer
  const isActiveCustomer = profile?.role === 'customer' && profile?.account_active_until 
    ? isAccountActive(profile.account_active_until)
    : false

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerContent = (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          Menu
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle} 
          data-testid="nav-menu-close"
          sx={{
            minWidth: 44,
            minHeight: 44,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1, px: { xs: 0.5, sm: 1 } }}>
        <SidebarItem href="/" icon={<HomeIcon />} label={t('home')} />
        {!profile && (
          <>
            <SidebarItem href="/statistics" icon={<HistoryIcon />} label={t('statistics')} />
            <SidebarItem href="/blog" icon={<ArticleIcon />} label={t('blog')} />
            <SidebarItem href="/checkout" icon={<LocalOfferIcon />} label={t('plans')} />
            <SidebarItem href="/introduction" icon={<InfoIcon />} label={t('introduction')} />
          </>
        )}
        {profile && (
          <>
            {/* Betting tips only visible for betting role or active customers */}
            {(profile.role === 'betting' || isActiveCustomer) && (
              <SidebarItem href="/bettings" icon={<SportsSoccerIcon />} label={t('bettings')} />
            )}
            <SidebarItem href="/statistics" icon={<HistoryIcon />} label={t('statistics')} />
            <SidebarItem href="/profile" icon={<PersonIcon />} label={t('profile')} />
            <SidebarItem href="/subscription" icon={<CardMembershipIcon />} label={t('subscription')} />
          </>
        )}
        {profile?.role === 'betting' && (
          <>
             <Typography
               variant="caption"
               sx={{
                 px: { xs: 1.5, sm: 2 },
                 mt: 2,
                 mb: 1,
                 display: 'block',
                 color: 'text.secondary',
                 fontWeight: 600,
                 fontSize: { xs: '0.7rem', sm: '0.75rem' },
               }}
             >
              ADMIN
            </Typography>
            <SidebarItem href="/newbet" icon={<AdminPanelSettingsIcon />} label={t('newbet')} />
            <SidebarItem href="/bettings/manage" icon={<SportsSoccerIcon />} label={t('manage')} />
            <SidebarItem href="/settings" icon={<SettingsIcon />} label={t('settings')} />
          </>
        )}
      </List>
      <Box sx={{ 
        mt: 'auto', 
        pt: 2, 
        borderTop: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1.5,
        px: { xs: 1.5, sm: 2 },
        pb: 2,
      }}>
        {!isAuthLoading && !isLoggedIn ? (
          <>
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              fullWidth
              data-testid="nav-mobile-login-button"
              sx={{ minHeight: 44, fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {tCommon('login')}
            </Button>
            <Button
              component={Link}
              href="/signup"
              variant="contained"
              fullWidth
              data-testid="nav-mobile-signup-button"
              sx={{ minHeight: 44, fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              {tCommon('signup')}
            </Button>
          </>
        ) : (
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={handleLogout} 
            data-testid="nav-mobile-logout-button" 
            disabled={isAuthLoading}
            sx={{ minHeight: 44, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
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
          border: '1px solid rgba(15,23,42,0.1)',
          borderRadius: 0,
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: 56, md: 64 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          {/* Left section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                data-testid="nav-menu-toggle"
                sx={{
                  minWidth: 44,
                  minHeight: 44,
                  p: 1,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <PageBreadcrumbs />
          </Box>

          {/* Center navigation - Public links for non-logged users */}
          {!isMobile && !isLoggedIn && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                component={Link}
                href="/statistics"
                variant="text"
                color="inherit"
                sx={{ minHeight: 44 }}
              >
                {t('statistics')}
              </Button>
              <Button
                component={Link}
                href="/blog"
                variant="text"
                color="inherit"
                sx={{ minHeight: 44 }}
              >
                {t('blog')}
              </Button>
              <Button
                component={Link}
                href="/checkout"
                variant="text"
                color="inherit"
                sx={{ minHeight: 44 }}
              >
                {t('plans')}
              </Button>
              <Button
                component={Link}
                href="/introduction"
                variant="text"
                color="inherit"
                sx={{ minHeight: 44 }}
              >
                {t('introduction')}
              </Button>
            </Box>
          )}

          {/* Right section */}
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
            <LanguageSwitcher />
            {!isMobile && !isAuthLoading && !isLoggedIn && (
              <>
                <Button
                  component={Link}
                  href="/login"
                  variant="text"
                  color="inherit"
                  data-testid="nav-login-button"
                  sx={{ minHeight: 44 }}
                >
                  {tCommon('login')}
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  color="primary"
                  data-testid="nav-signup-button"
                  sx={{ minHeight: 44 }}
                >
                  {tCommon('signup')}
                </Button>
              </>
            )}
            {!isMobile && isLoggedIn && (
              <Button 
                variant="outlined" 
                onClick={handleLogout} 
                data-testid="nav-logout-button" 
                disabled={isAuthLoading}
                sx={{ minHeight: 44 }}
              >
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
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: { xs: '85%', sm: 320 },
            maxWidth: 320,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default TopNav
