'use client'

import { Card, CardContent, CardMedia, Typography, Box, Chip, CardActionArea } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import type { BlogPost, Locale } from '@/lib/supabase/blog-types'
import { getLocalizedContent } from '@/lib/supabase/blog-types'

type BlogPostCardProps = {
  post: BlogPost
}

const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const router = useRouter()
  const locale = useLocale() as Locale
  const t = useTranslations('blog')

  const title = getLocalizedContent(post.title, locale)
  const excerpt = getLocalizedContent(post.excerpt, locale)
  const categoryName = post.category
    ? getLocalizedContent(post.category.name, locale)
    : null

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const handleClick = () => {
    router.push(`/${locale}/blog/${post.slug}`)
  }

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {post.featured_image_url && (
          <CardMedia
            component="img"
            height="180"
            image={post.featured_image_url}
            alt={title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {categoryName && (
            <Chip
              label={categoryName}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ alignSelf: 'flex-start', mb: 1 }}
            />
          )}
          <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {excerpt && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                flexGrow: 1,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {excerpt}
            </Typography>
          )}
          {formattedDate && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {formattedDate}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default BlogPostCard
