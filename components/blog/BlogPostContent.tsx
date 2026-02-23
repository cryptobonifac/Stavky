'use client'

import { Box, Typography, Chip, Divider, Stack } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import type { BlogPost, Locale } from '@/lib/supabase/blog-types'
import { getLocalizedContent } from '@/lib/supabase/blog-types'

type BlogPostContentProps = {
  post: BlogPost
}

const BlogPostContent = ({ post }: BlogPostContentProps) => {
  const locale = useLocale() as Locale
  const t = useTranslations('blog')

  const title = getLocalizedContent(post.title, locale)
  const content = getLocalizedContent(post.content, locale)
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

  return (
    <Box>
      {/* Featured Image */}
      {post.featured_image_url && (
        <Box
          component="img"
          src={post.featured_image_url}
          alt={title}
          sx={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 3,
          }}
        />
      )}

      {/* Category */}
      {categoryName && (
        <Chip
          label={categoryName}
          color="primary"
          size="small"
          sx={{ mb: 2 }}
        />
      )}

      {/* Title */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1.75rem', md: '2.5rem' },
        }}
      >
        {title}
      </Typography>

      {/* Meta Info */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ mb: 3 }}
      >
        {formattedDate && (
          <Typography variant="body2" color="text.secondary">
            {t('publishedOn')} {formattedDate}
          </Typography>
        )}
        {post.author?.email && (
          <>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('byAuthor')} {post.author.email.split('@')[0]}
            </Typography>
          </>
        )}
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* Content */}
      <Box
        sx={{
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            fontWeight: 600,
            mt: 4,
            mb: 2,
          },
          '& h2': { fontSize: '1.5rem' },
          '& h3': { fontSize: '1.25rem' },
          '& p': {
            mb: 2,
            lineHeight: 1.8,
          },
          '& ul, & ol': {
            mb: 2,
            pl: 3,
          },
          '& li': {
            mb: 1,
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1,
            my: 2,
          },
          '& a': {
            color: 'primary.main',
            textDecoration: 'underline',
          },
          '& blockquote': {
            borderLeft: 4,
            borderColor: 'primary.main',
            pl: 2,
            py: 1,
            my: 2,
            fontStyle: 'italic',
            bgcolor: 'action.hover',
          },
          '& pre': {
            bgcolor: 'grey.900',
            color: 'grey.100',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            my: 2,
          },
          '& code': {
            fontFamily: 'monospace',
            bgcolor: 'action.hover',
            px: 0.5,
            borderRadius: 0.5,
          },
          '& pre code': {
            bgcolor: 'transparent',
            px: 0,
          },
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  )
}

export default BlogPostContent
