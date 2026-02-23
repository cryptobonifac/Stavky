import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Container, Button, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import type { Metadata } from 'next'

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
      <TopNav
        showSettingsLink={profile?.role === 'betting'}
        canAccessSettings={profile?.role === 'betting'}
      />
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink href={`/${locale}`} underline="hover" color="inherit">
            Home
          </MuiLink>
          <MuiLink href={`/${locale}/blog`} underline="hover" color="inherit">
            {t('title')}
          </MuiLink>
          {categoryName && (
            <MuiLink
              href={`/${locale}/blog/category/${post.category?.slug}`}
              underline="hover"
              color="inherit"
            >
              {categoryName}
            </MuiLink>
          )}
          <Typography color="text.primary" noWrap sx={{ maxWidth: 200 }}>
            {title}
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button href={`/${locale}/blog`} startIcon={<ArrowBack />} sx={{ mb: 3 }}>
          {t('backToBlog')}
        </Button>

        {/* Article Content */}
        <BlogPostContent post={post} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Container>
    </MainLayout>
  )
}
