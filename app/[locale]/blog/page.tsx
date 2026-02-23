import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import {
  Box,
  Typography,
  Grid,
  Container,
  Stack,
  CircularProgress,
} from '@mui/material'
import type { Metadata } from 'next'

import MainLayout from '@/components/layout/MainLayout'
import TopNav from '@/components/navigation/TopNav'
import { BlogPostCard, BlogPagination } from '@/components/blog'
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter'
import { getPublishedPosts, getCategories } from '@/lib/supabase/blog'
import { createSafeAuthClient } from '@/lib/supabase/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('blog')

  return {
    title: `${t('title')} | Stavky`,
    description: t('latestPosts'),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        en: '/en/blog',
        cs: '/cs/blog',
        sk: '/sk/blog',
      },
    },
  }
}

function BlogLoading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  )
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { locale } = await params
  const { page: pageParam, category } = await searchParams
  const page = parseInt(pageParam || '1', 10)

  const supabase = await createSafeAuthClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data: profileData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = profileData
  }

  const [{ posts, totalPages }, categories] = await Promise.all([
    getPublishedPosts({ page, limit: 9, categorySlug: category }),
    getCategories(),
  ])

  const t = await getTranslations('blog')

  return (
    <MainLayout>
      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Suspense fallback={<BlogLoading />}>
          {/* Header */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Typography variant="h4" component="h1" fontWeight={700}>
              {t('title')}
            </Typography>

            {categories.length > 0 && (
              <BlogCategoryFilter
                categories={categories}
                selectedCategory={category}
              />
            )}
          </Stack>

          {/* Posts Grid */}
          {posts.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {posts.map((post) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                    <BlogPostCard post={post} />
                  </Grid>
                ))}
              </Grid>

              <BlogPagination page={page} totalPages={totalPages} />
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                {t('noPosts')}
              </Typography>
            </Box>
          )}
        </Suspense>
      </Container>
    </MainLayout>
  )
}
