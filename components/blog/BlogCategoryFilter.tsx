'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { BlogCategory, Locale } from '@/lib/supabase/blog-types'
import { getLocalizedContent } from '@/lib/supabase/blog-types'

type BlogCategoryFilterProps = {
  categories: BlogCategory[]
  selectedCategory?: string
}

const BlogCategoryFilter = ({ categories, selectedCategory }: BlogCategoryFilterProps) => {
  const router = useRouter()
  const locale = useLocale() as Locale
  const t = useTranslations('blog')
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    params.delete('page') // Reset to page 1 when changing category
    router.push(`/${locale}/blog${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>{t('allCategories')}</InputLabel>
      <Select
        value={selectedCategory || ''}
        label={t('allCategories')}
        onChange={(e) => handleChange(e.target.value)}
      >
        <MenuItem value="">
          {t('allCategories')}
        </MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.slug}>
            {getLocalizedContent(cat.name, locale)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default BlogCategoryFilter
