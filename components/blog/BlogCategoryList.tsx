'use client'

import { List, ListItem, ListItemButton, ListItemText, Typography, Box } from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import type { BlogCategory, Locale } from '@/lib/supabase/blog-types'
import { getLocalizedContent } from '@/lib/supabase/blog-types'

type BlogCategoryListProps = {
  categories: BlogCategory[]
  selectedSlug?: string
}

const BlogCategoryList = ({ categories, selectedSlug }: BlogCategoryListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as Locale
  const t = useTranslations('blog')

  const handleCategoryClick = (slug: string | null) => {
    if (slug) {
      router.push(`/${locale}/blog/category/${slug}`)
    } else {
      router.push(`/${locale}/blog`)
    }
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, px: 2 }}>
        {t('allCategories')}
      </Typography>
      <List dense disablePadding>
        <ListItem disablePadding>
          <ListItemButton
            selected={!selectedSlug}
            onClick={() => handleCategoryClick(null)}
          >
            <ListItemText primary={t('allCategories')} />
          </ListItemButton>
        </ListItem>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton
              selected={selectedSlug === category.slug}
              onClick={() => handleCategoryClick(category.slug)}
            >
              <ListItemText
                primary={getLocalizedContent(category.name, locale)}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default BlogCategoryList
