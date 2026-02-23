import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Box, Stack } from '@mui/material'
import { ArrowBack, Home as HomeIcon } from '@mui/icons-material'
import type { Metadata } from 'next'
import Link from 'next/link'

import MainLayout from '@/components/layout/MainLayout'
import TopNav from '@/components/navigation/TopNav'
import { BlogPostContent } from '@/components/blog'
import { getPostBySlug, getLocalizedContent, getPublishedPostsForBuild } from '@/lib/supabase/blog'
import type { Locale } from '@/lib/supabase/blog'
import { createSafeAuthClient } from '@/lib/supabase/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Not Found | Stavky',
    }
  }

  const title = getLocalizedContent(post.meta_title, locale as Locale) ||
    getLocalizedContent(post.title, locale as Locale)
  const description = getLocalizedContent(post.meta_description, locale as Locale) ||
    getLocalizedContent(post.excerpt, locale as Locale)

  return {
    title: `${title} | Stavky`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at || undefined,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
    alternates: {
      canonical: `/${locale}/blog/${post.slug}`,
      languages: {
        en: `/en/blog/${post.slug}`,
        cs: `/cs/blog/${post.slug}`,
        sk: `/sk/blog/${post.slug}`,
      },
    },
  }
}

export async function generateStaticParams() {
  const { posts } = await getPublishedPostsForBuild({ limit: 100 })

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params

  const post = await getPostBySlug(slug)

  if (!post || post.status !== 'published') {
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

  const t = await getTranslations('blog')
  const tNav = await getTranslations('navigation')
  const title = getLocalizedContent(post.title, locale as Locale)
  const categoryName = post.category
    ? getLocalizedContent(post.category.name, locale as Locale)
    : null

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: post.featured_image_url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Stavky',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Stavky',
    },
  }

  return (
    <MainLayout>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />

      {/* Dark background wrapper */}
      <Box
        sx={{
          bgcolor: '#0c0f0a',
          minHeight: '100vh',
        }}
      >
        {/* Breadcrumb Navigation */}
        <Box
          sx={{
            maxWidth: 900,
            mx: 'auto',
            px: 3,
            pt: { xs: 2, md: 3 },
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              fontSize: '0.85rem',
              color: '#8a9182',
            }}
          >
            <Link
              href={`/${locale}`}
              style={{
                color: '#8a9182',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <HomeIcon sx={{ fontSize: 16 }} />
              {tNav('home')}
            </Link>
            <Box component="span" sx={{ color: '#2a3324' }}>/</Box>
            <Link
              href={`/${locale}/blog`}
              style={{
                color: '#8a9182',
                textDecoration: 'none',
              }}
            >
              {t('title')}
            </Link>
            {categoryName && (
              <>
                <Box component="span" sx={{ color: '#2a3324' }}>/</Box>
                <Link
                  href={`/${locale}/blog/category/${post.category?.slug}`}
                  style={{
                    color: '#8a9182',
                    textDecoration: 'none',
                  }}
                >
                  {categoryName}
                </Link>
              </>
            )}
          </Stack>

          {/* Back Button */}
          <Link
            href={`/${locale}/blog`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 16,
              color: '#8a9182',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <ArrowBack sx={{ fontSize: 18 }} />
            {t('backToBlog')}
          </Link>
        </Box>

        {/* Article Content */}
        <BlogPostContent post={post} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Box>
    </MainLayout>
  )
}
