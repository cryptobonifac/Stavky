import { MetadataRoute } from 'next'
import { getPublishedPosts, getCategories } from '@/lib/supabase/blog'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartbet365.com'
const locales = ['en', 'cs', 'sk']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = [
    '',
    '/statistics',
    '/blog',
    '/introduction',
    '/checkout',
    '/contact',
    '/terms',
    '/privacy',
    '/legal-disclaimer',
    '/risk-warning',
  ]

  // Add static pages for each locale
  for (const page of staticPages) {
    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      })
    }
  }

  // Add blog posts
  try {
    const { posts } = await getPublishedPosts({ limit: 100 })

    for (const post of posts) {
      for (const locale of locales) {
        routes.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  // Add blog categories
  try {
    const categories = await getCategories()

    for (const category of categories) {
      for (const locale of locales) {
        routes.push({
          url: `${baseUrl}/${locale}/blog/category/${category.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  return routes
}
