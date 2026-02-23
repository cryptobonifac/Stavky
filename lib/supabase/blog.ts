import { createClient, createBuildClient } from './server'

// Re-export types and utilities from blog-types for backwards compatibility
export type {
  Locale,
  LocalizedContent,
  BlogCategory,
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  GetPostsOptions,
  GetPostsResult,
} from './blog-types'

export { getLocalizedContent, generateSlug } from './blog-types'

import type { BlogCategory, BlogPost, GetPostsOptions, GetPostsResult, CreateBlogPostInput, UpdateBlogPostInput } from './blog-types'

// ============== Categories ==============

export async function getCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

// ============== Posts (Public) ==============

export async function getPublishedPosts(options: GetPostsOptions = {}): Promise<GetPostsResult> {
  const { page = 1, limit = 10, categorySlug } = options
  const offset = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase
    .from('blog_posts')
    .select('*, category:blog_categories(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (categorySlug) {
    // First get the category ID
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], total: 0, page, totalPages: 0 }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    posts: data || [],
    total,
    page,
    totalPages
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, category:blog_categories(*), author:users(id, email)')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data
}

export async function getLatestPublishedPosts(limit: number = 3): Promise<BlogPost[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, category:blog_categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }

  return data || []
}

// ============== Posts (Admin) ==============

export async function getAllPosts(options: GetPostsOptions = {}): Promise<GetPostsResult> {
  const { page = 1, limit = 20, categorySlug, status } = options
  const offset = (page - 1) * limit

  const supabase = await createClient()

  let query = supabase
    .from('blog_posts')
    .select('*, category:blog_categories(*), author:users(id, email)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (categorySlug) {
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching all posts:', error)
    return { posts: [], total: 0, page, totalPages: 0 }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    posts: data || [],
    total,
    page,
    totalPages
  }
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, category:blog_categories(*), author:users(id, email)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post by ID:', error)
    return null
  }

  return data
}

export async function createPost(input: CreateBlogPostInput, authorId: string): Promise<BlogPost | null> {
  const supabase = await createClient()

  const postData = {
    ...input,
    author_id: authorId,
    published_at: input.status === 'published' ? (input.published_at || new Date().toISOString()) : null
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(postData)
    .select('*, category:blog_categories(*)')
    .single()

  if (error) {
    console.error('Error creating post:', error)
    return null
  }

  return data
}

export async function updatePost(input: UpdateBlogPostInput): Promise<BlogPost | null> {
  const { id, ...updateData } = input
  const supabase = await createClient()

  // If publishing for the first time, set published_at
  if (updateData.status === 'published') {
    const existing = await getPostById(id)
    if (existing && !existing.published_at) {
      updateData.published_at = new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select('*, category:blog_categories(*)')
    .single()

  if (error) {
    console.error('Error updating post:', error)
    return null
  }

  return data
}

export async function deletePost(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    return false
  }

  return true
}

// ============== Image Upload ==============

export async function uploadBlogImage(file: File): Promise<string | null> {
  const supabase = await createClient()

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `blog/${fileName}`

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

// ============== Build-time Functions (for generateStaticParams) ==============

/**
 * Fetches categories without using cookies.
 * Use this in generateStaticParams for static generation.
 */
export async function getCategoriesForBuild(): Promise<BlogCategory[]> {
  const supabase = createBuildClient()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories for build:', error)
    return []
  }

  return data || []
}

/**
 * Fetches published posts without using cookies.
 * Use this in generateStaticParams for static generation.
 */
export async function getPublishedPostsForBuild(options: GetPostsOptions = {}): Promise<GetPostsResult> {
  const { page = 1, limit = 100 } = options
  const offset = (page - 1) * limit

  const supabase = createBuildClient()

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*, category:blog_categories(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching posts for build:', error)
    return { posts: [], total: 0, page, totalPages: 0 }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    posts: data || [],
    total,
    page,
    totalPages
  }
}
