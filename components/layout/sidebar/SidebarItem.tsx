'use client'

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material'
import { usePathname } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
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
  const locale = useLocale()
  const params = useParams()
  const currentLocale = (params?.locale as string) || locale
  const selected = pathname === href || pathname.startsWith(`${href}/`)

  // Construct the full path with locale
  const fullHref = `/${currentLocale}${href === '/' ? '' : href}`

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.href = fullHref
  }

  return (
    <StyledListItemButton 
      selected={selected}
      onClick={handleClick}
      component="a"
      href={fullHref}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </StyledListItemButton>
  )
}

export default SidebarItem

