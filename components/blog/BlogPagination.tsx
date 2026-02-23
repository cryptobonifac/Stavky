'use client'

import { Pagination, Box } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'

type BlogPaginationProps = {
  page: number
  totalPages: number
  basePath?: string
}

const BlogPagination = ({ page, totalPages, basePath }: BlogPaginationProps) => {
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()

  if (totalPages <= 1) {
    return null
  }

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', value.toString())

    const path = basePath || `/${locale}/blog`
    router.push(`${path}?${params.toString()}`)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  )
}

export default BlogPagination
