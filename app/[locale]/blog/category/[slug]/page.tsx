import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import {
  Box,
  Typography,
  Grid,
  Container,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material'
import type { Metadata } from 'next'

import MainLayout from '@/components/layout/MainLayout'
import TopNav from '@/components/navigation/TopNav'
import { BlogPostCard, BlogPagination } from '@/components/blog'
import {
  getPublishedPosts,
  getCategories,
  getCategoryBySlug,
  getCategoriesForBuild,
  getLocalizedContent,
} from '@/lib/supabase/blog'
import type { Locale } from '@/lib/supabase/blog'
import { createSafeAuthClient } from '@/lib/supabase/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found | Stavky',
    }
  }

  const categoryName = getLocalizedContent(category.name, locale as Locale)
  const description = getLocalizedContent(category.description, locale as Locale)

  return {
    title: `${categoryName} | Blog | Stavky`,
    description: description || categoryName,
    alternates: {
      canonical: `/${locale}/blog/category/${slug}`,
      languages: {
        en: `/en/blog/category/${slug}`,
        cs: `/cs/blog/category/${slug}`,
        sk: `/sk/blog/category/${slug}`,
      },
    },
  }
}

export async function generateStaticParams() {
  const categories = await getCategoriesForBuild()

  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, slug } = await params
  const { page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1', 10)

  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

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

  const { posts, totalPages } = await getPublishedPosts({
    page,
    limit: 9,
    categorySlug: slug,
  })

  const t = await getTranslations('blog')
  const categoryName = getLocalizedContent(category.name, locale as Locale)

  return (
    <MainLayout>
      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink href={`/${locale}`} underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink href={`/${locale}/blog`} underline="hover" color="inherit">
            {t('title')}
          </MuiLink>
          <Typography color="text.primary">{categoryName}</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={700}>
            {categoryName}
          </Typography>
          {category.description && (
            <Typography variant="body1" color="text.secondary">
              {getLocalizedContent(category.description, locale as Locale)}
            </Typography>
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

            <BlogPagination
              page={page}
              totalPages={totalPages}
              basePath={`/${locale}/blog/category/${slug}`}
            />
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('noPosts')}
            </Typography>
          </Box>
        )}
      </Container>
    </MainLayout>
  )
}
