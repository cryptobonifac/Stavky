'use client'

import { Box, Typography, Stack } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import type { BlogPost, Locale } from '@/lib/supabase/blog-types'
import { getLocalizedContent } from '@/lib/supabase/blog-types'
import BlogCTA from './BlogCTA'

type BlogPostContentProps = {
  post: BlogPost
}

// Calculate reading time from HTML content
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const text = content.replace(/<[^>]*>/g, '') // Strip HTML
  const wordCount = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

const BlogPostContent = ({ post }: BlogPostContentProps) => {
  const locale = useLocale() as Locale
  const t = useTranslations('blog')

  const title = getLocalizedContent(post.title, locale)
  const content = getLocalizedContent(post.content, locale)
  const categoryName = post.category
    ? getLocalizedContent(post.category.name, locale)
    : null

  const readingTime = calculateReadingTime(content)

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  // Get author name - fallback to "Stavky Advisory Team"
  const authorName = post.author?.full_name || t('advisoryTeam')

  return (
    <Box
      sx={{
        bgcolor: '#0c0f0a',
        color: '#d8ddd4',
        minHeight: '100vh',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          px: 3,
          py: { xs: 4, md: 8 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '180%',
            height: 400,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(184,241,93,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        {/* Category Tag */}
        {categoryName && (
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#b8f15d',
              border: '1px solid #6a8c2e',
              px: 1.75,
              py: 0.5,
              borderRadius: '2px',
              mb: 3,
            }}
          >
            {categoryName}
          </Box>
        )}

        {/* Title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            lineHeight: 1.15,
            color: '#f0f4ec',
            mb: 3,
          }}
        >
          {title}
        </Typography>

        {/* Meta Info */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 4 }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#8a9182' }}
          >
            {t('byAuthor', { author: authorName })}
          </Typography>
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline' },
              color: '#2a3324',
            }}
          >
            |
          </Box>
          {formattedDate && (
            <Typography variant="body2" sx={{ color: '#8a9182' }}>
              {formattedDate}
            </Typography>
          )}
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'inline' },
              color: '#2a3324',
            }}
          >
            |
          </Box>
          <Typography variant="body2" sx={{ color: '#8a9182' }}>
            {t('minRead', { minutes: readingTime })}
          </Typography>
        </Stack>

        {/* Featured Image */}
        {post.featured_image_url && (
          <Box
            component="img"
            src={post.featured_image_url}
            alt={title}
            sx={{
              width: '100%',
              maxHeight: 450,
              objectFit: 'cover',
              borderRadius: 2,
              mt: 2,
            }}
          />
        )}
      </Box>

      {/* Article Content */}
      <Box
        component="article"
        sx={{
          maxWidth: 680,
          mx: 'auto',
          px: 3,
          pb: 8,
          fontFamily: '"Source Sans 3", "Source Sans Pro", system-ui, sans-serif',

          // Drop cap for first paragraph
          '& > p:first-of-type::first-letter': {
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '3.4rem',
            float: 'left',
            lineHeight: 0.8,
            mr: 1.5,
            mt: 0.75,
            color: '#b8f15d',
            fontWeight: 700,
          },

          // Headings
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
            color: '#f0f4ec',
            mt: 5,
            mb: 2,
          },
          '& h2': {
            fontSize: '1.75rem',
            borderBottom: '1px solid #2a3324',
            pb: 1,
          },
          '& h3': {
            fontSize: '1.4rem',
            color: '#b8f15d',
          },
          '& h4': {
            fontSize: '1.15rem',
          },

          // Paragraphs
          '& p': {
            mb: 2.5,
            lineHeight: 1.85,
            fontSize: '1.05rem',
            color: '#d8ddd4',
          },

          // Lists
          '& ul, & ol': {
            mb: 2.5,
            pl: 3,
          },
          '& li': {
            mb: 1,
            lineHeight: 1.75,
            '&::marker': {
              color: '#b8f15d',
            },
          },

          // Links
          '& a': {
            color: '#b8f15d',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            transition: 'color 0.2s',
            '&:hover': {
              color: '#d4f18a',
            },
          },

          // Blockquotes (pull quotes)
          '& blockquote': {
            position: 'relative',
            my: 5,
            mx: 0,
            pl: 4,
            py: 2,
            borderLeft: '4px solid #b8f15d',
            bgcolor: 'rgba(184, 241, 93, 0.04)',
            borderRadius: '0 8px 8px 0',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: 'italic',
            '& p': {
              fontSize: '1.2rem',
              lineHeight: 1.7,
              mb: 0,
            },
          },

          // Code blocks
          '& pre': {
            bgcolor: '#151a12',
            color: '#d8ddd4',
            p: 3,
            borderRadius: 2,
            overflow: 'auto',
            my: 3,
            border: '1px solid #2a3324',
            fontSize: '0.9rem',
          },
          '& code': {
            fontFamily: 'ui-monospace, "Fira Code", monospace',
            bgcolor: '#151a12',
            color: '#b8f15d',
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            fontSize: '0.9em',
          },
          '& pre code': {
            bgcolor: 'transparent',
            px: 0,
            py: 0,
            color: '#d8ddd4',
          },

          // Images
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 2,
            my: 3,
          },

          // Tables
          '& table': {
            width: '100%',
            borderCollapse: 'collapse',
            my: 3,
            fontSize: '0.95rem',
          },
          '& th, & td': {
            border: '1px solid #2a3324',
            px: 2,
            py: 1.5,
            textAlign: 'left',
          },
          '& th': {
            bgcolor: '#151a12',
            fontWeight: 600,
            color: '#f0f4ec',
          },
          '& tr:nth-of-type(even) td': {
            bgcolor: 'rgba(21, 26, 18, 0.5)',
          },

          // Horizontal rule
          '& hr': {
            border: 'none',
            borderTop: '1px solid #2a3324',
            my: 5,
          },

          // Strong/Bold
          '& strong': {
            color: '#f0f4ec',
            fontWeight: 600,
          },

          // Key rule boxes (special class from content)
          '& .key-rule, & .golden-rule': {
            my: 4,
            p: 3,
            bgcolor: '#1a2016',
            borderRadius: 2,
            border: '1px solid #2a3324',
            position: 'relative',
          },
          '& .key-rule::before, & .golden-rule::before': {
            position: 'absolute',
            top: -12,
            left: 16,
            bgcolor: '#1a2016',
            px: 1.5,
            py: 0.25,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: 'uppercase',
          },
          '& .key-rule::before': {
            content: '"KEY RULE"',
            color: '#b8f15d',
          },
          '& .golden-rule::before': {
            content: '"THE GOLDEN RULE"',
            color: '#d4a843',
          },
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* CTA Box */}
      <Box sx={{ maxWidth: 680, mx: 'auto', px: 3, pb: 8 }}>
        <BlogCTA />
      </Box>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <Box sx={{ maxWidth: 680, mx: 'auto', px: 3, pb: 8 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {post.tags.map((tag) => (
              <Box
                key={tag}
                component="span"
                sx={{
                  fontSize: '0.8rem',
                  color: '#8a9182',
                  border: '1px solid #2a3324',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  mb: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#6a8c2e',
                    color: '#b8f15d',
                  },
                }}
              >
                #{tag}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default BlogPostContent
