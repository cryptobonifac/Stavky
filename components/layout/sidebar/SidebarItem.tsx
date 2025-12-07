'use client'

import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material'
import { Link, usePathname } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { ReactNode } from 'react'

type SidebarItemProps = {
  href: string
  icon: ReactNode
  label: string
}

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
}))

const SidebarItem = ({ href, icon, label }: SidebarItemProps) => {
  const pathname = usePathname()
  const selected = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      <StyledListItemButton 
        selected={selected}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </StyledListItemButton>
    </Link>
  )
}

export default SidebarItem

