import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { Container, Typography } from '@mui/material'

import MainLayout from '@/components/layout/MainLayout'
import TopNav from '@/components/navigation/TopNav'
import { BlogPostForm } from '@/components/blog/admin'
import { getCategories, getAuthors, createPost } from '@/lib/supabase/blog'
import type { CreateBlogPostInput } from '@/lib/supabase/blog'
import { createSafeAuthClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'New Blog Post | Stavky',
}

export default async function AdminBlogNewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

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

  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ])

  const t = await getTranslations('blog.admin')

  async function handleSave(data: CreateBlogPostInput): Promise<boolean> {
    'use server'

    const result = await createPost(data)
    return result !== null
  }

  return (
    <MainLayout>
      <TopNav showSettingsLink canAccessSettings />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 4 }}>
          {t('newPost')}
        </Typography>

        <BlogPostForm categories={categories} authors={authors} onSave={handleSave} />
      </Container>
    </MainLayout>
  )
}
