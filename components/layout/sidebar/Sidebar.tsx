'use client'

import { Box, Drawer, List, Typography, useMediaQuery, Theme } from '@mui/material'
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'
import HistoryIcon from '@mui/icons-material/History'
import PersonIcon from '@mui/icons-material/Person'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTranslations } from 'next-intl'

import SidebarItem from './SidebarItem'

type SidebarProps = {
  role?: 'betting' | 'customer' | null
}

const Sidebar = ({ role }: SidebarProps) => {
  const t = useTranslations('navigation')
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  // In a real app we might control mobile drawer state here
  
  const content = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ px: 2, mb: 3, fontWeight: 700 }}>
        Stavky
      </Typography>
      <List>
        {role && (
          <>
            <SidebarItem href="/bettings" icon={<SportsSoccerIcon />} label={t('bettingTips')} />
            <SidebarItem href="/history" icon={<HistoryIcon />} label={t('history')} />
            <SidebarItem href="/profile" icon={<PersonIcon />} label={t('profile')} />
          </>
        )}

        {role === 'betting' && (
          <>
             <Typography variant="caption" sx={{ px: 2, mt: 2, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 600 }}>
              {t('admin')}
            </Typography>
            <SidebarItem href="/newbet" icon={<AdminPanelSettingsIcon />} label={t('newbet')} />
            <SidebarItem href="/bettings/manage" icon={<SportsSoccerIcon />} label={t('manage')} />
            <SidebarItem href="/settings" icon={<SettingsIcon />} label={t('settings')} />
          </>
        )}
      </List>
    </Box>
  )

  if (isMobile) {
    // For mobile we rely on TopNav drawer logic or leave it hidden for now as per minimal requirements
    // Returning null for now to keep existing mobile layout flow or could integrate Drawer
    return null 
  }

  return (
    <Box
      component="nav"
      sx={{
        width: 280,
        flexShrink: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        height: '100vh',
        position: 'sticky',
        top: 0,
        bgcolor: 'background.paper',
        display: { xs: 'none', md: 'block' },
      }}
    >
      {content}
    </Box>
  )
}

export default Sidebar

