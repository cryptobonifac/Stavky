'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { createBrowserClient } from '@supabase/ssr'
import BlogPostCard from './BlogPostCard'
import type { BlogPost } from '@/lib/supabase/blog-types'

const LatestBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations('blog')
  const locale = useLocale()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, category:blog_categories(*)')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3)

        if (error) {
          console.error('Error fetching blog posts:', error)
          return
        }

        setPosts(data || [])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Don't render anything if there are no posts
  if (!loading && posts.length === 0) {
    return null
  }

  return (
    <Box sx={{ py: { xs: 6, sm: 8, md: 10 }, bgcolor: 'background.default', px: { xs: 1, sm: 2 } }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
            }}
          >
            {t('latestPosts')}
          </Typography>
          <Button
            component={Link}
            href="/blog"
            endIcon={<ArrowForward />}
            sx={{ minHeight: 44 }}
          >
            {t('readMore')}
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {posts.map((post) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                <BlogPostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default LatestBlogPosts
