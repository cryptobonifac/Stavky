import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Stack,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'

import MainLayout from '@/components/layout/MainLayout'
import TopNav from '@/components/navigation/TopNav'
import { getAllPosts, getLocalizedContent } from '@/lib/supabase/blog'
import type { Locale } from '@/lib/supabase/blog'
import { createSafeAuthClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Blog Management | Stavky',
}

export default async function AdminBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale } = await params
  const { page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1', 10)

  const supabase = await createSafeAuthClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Check if user is admin (betting role)
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect(`/${locale}`)
  }

  const { posts, totalPages } = await getAllPosts({ page, limit: 20 })

  const t = await getTranslations('blog.admin')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success'
      case 'draft':
        return 'warning'
      case 'archived':
        return 'default'
      default:
        return 'default'
    }
  }

  return (
    <MainLayout>
      <TopNav showSettingsLink canAccessSettings />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
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
          <Button
            variant="contained"
            startIcon={<Add />}
            href={`/${locale}/admin/blog/new`}
          >
            {t('newPost')}
          </Button>
        </Stack>

        {/* Posts Table */}
        {posts.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Published</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {getLocalizedContent(post.title, locale as Locale)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        /{post.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {post.category && (
                        <Chip
                          label={getLocalizedContent(post.category.name, locale as Locale)}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={post.status}
                        size="small"
                        color={getStatusColor(post.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString(locale)
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        href={`/${locale}/admin/blog/${post.id}/edit`}
                        size="small"
                        title={t('editPost')}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('noPosts')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              href={`/${locale}/admin/blog/new`}
              sx={{ mt: 2 }}
            >
              {t('newPost')}
            </Button>
          </Box>
        )}
      </Container>
    </MainLayout>
  )
}
