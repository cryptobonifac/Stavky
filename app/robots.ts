import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartbet365.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*/login',
          '/*/signup',
          '/*/forgot-password',
          '/*/update-password',
          '/*/bettings',
          '/*/newbet',
          '/*/profile',
          '/*/settings',
          '/*/history',
          '/*/contacts',
          '/*/activation',
          '/*/admin',
          '/auth/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
