// Blog types and client-safe utilities (no server imports)

export type Locale = 'en' | 'cs' | 'sk'

export interface LocalizedContent {
  en?: string
  cs?: string
  sk?: string
}

export interface BlogCategory {
  id: string
  slug: string
  name: LocalizedContent
  description: LocalizedContent | null
  sort_order: number
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: LocalizedContent
  content: LocalizedContent
  excerpt: LocalizedContent | null
  featured_image_url: string | null
  category_id: string | null
  author_id: string | null
  status: 'draft' | 'published' | 'archived'
  meta_title: LocalizedContent | null
  meta_description: LocalizedContent | null
  tags: string[] | null
  published_at: string | null
  created_at: string
  updated_at: string
  category?: BlogCategory | null
  author?: { id: string; email: string } | null
}

export interface CreateBlogPostInput {
  slug: string
  title: LocalizedContent
  content: LocalizedContent
  excerpt?: LocalizedContent
  featured_image_url?: string
  category_id?: string
  status?: 'draft' | 'published' | 'archived'
  meta_title?: LocalizedContent
  meta_description?: LocalizedContent
  tags?: string[]
  published_at?: string
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string
}

export interface GetPostsOptions {
  page?: number
  limit?: number
  categorySlug?: string
  status?: 'draft' | 'published' | 'archived'
}

export interface GetPostsResult {
  posts: BlogPost[]
  total: number
  page: number
  totalPages: number
}

// ============== Client-safe Utilities ==============

export function getLocalizedContent(content: LocalizedContent | null | undefined, locale: Locale): string {
  if (!content) return ''
  return content[locale] || content.en || ''
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
