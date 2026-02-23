import { getTranslations } from 'next-intl/server'
import { redirect, notFound } from 'next/navigation'
import { Container, Typography } from '@mui/material'

import MainLayout from '@/components/layout/MainLayout'
import TopNav from '@/components/navigation/TopNav'
import { BlogPostForm } from '@/components/blog/admin'
import { getCategories, getAuthors, getPostById, updatePost } from '@/lib/supabase/blog'
import type { CreateBlogPostInput } from '@/lib/supabase/blog'
import { createSafeAuthClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Edit Blog Post | Stavky',
}

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

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

  const [post, categories, authors] = await Promise.all([
    getPostById(id),
    getCategories(),
    getAuthors(),
  ])

  if (!post) {
    notFound()
  }

  const t = await getTranslations('blog.admin')

  async function handleSave(data: CreateBlogPostInput): Promise<boolean> {
    'use server'

    const result = await updatePost({ id, ...data })
    return result !== null
  }

  return (
    <MainLayout>
      <TopNav showSettingsLink canAccessSettings />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 4 }}>
          {t('editPost')}
        </Typography>

        <BlogPostForm post={post} categories={categories} authors={authors} onSave={handleSave} />
      </Container>
    </MainLayout>
  )
}
