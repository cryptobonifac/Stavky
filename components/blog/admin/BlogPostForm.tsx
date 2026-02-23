'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Stack,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Autocomplete,
} from '@mui/material'
import { Save, Publish, ArrowBack } from '@mui/icons-material'
import type {
  BlogPost,
  BlogCategory,
  BlogAuthor,
  LocalizedContent,
  CreateBlogPostInput,
} from '@/lib/supabase/blog-types'
import { generateSlug, getLocalizedContent } from '@/lib/supabase/blog-types'
import BlogEditor from './BlogEditor'
import ImageUploader from './ImageUploader'

type Locale = 'en' | 'cs' | 'sk'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}

type BlogPostFormProps = {
  post?: BlogPost | null
  categories: BlogCategory[]
  authors: BlogAuthor[]
  onSave: (data: CreateBlogPostInput) => Promise<boolean>
}

const LOCALES: Locale[] = ['en', 'cs', 'sk']
const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  cs: 'Cestina',
  sk: 'Slovencina',
}

const BlogPostForm = ({ post, categories, authors, onSave }: BlogPostFormProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [slug, setSlug] = useState(post?.slug || '')
  const [titles, setTitles] = useState<LocalizedContent>(post?.title || {})
  const [contents, setContents] = useState<LocalizedContent>(post?.content || {})
  const [excerpts, setExcerpts] = useState<LocalizedContent>(post?.excerpt || {})
  const [metaTitles, setMetaTitles] = useState<LocalizedContent>(post?.meta_title || {})
  const [metaDescriptions, setMetaDescriptions] = useState<LocalizedContent>(
    post?.meta_description || {}
  )
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(
    post?.featured_image_url || null
  )
  const [categoryId, setCategoryId] = useState<string>(post?.category_id || '')
  const [authorId, setAuthorId] = useState<string>(post?.author_id || '')
  const [status, setStatus] = useState<'draft' | 'published'>(
    (post?.status as 'draft' | 'published') || 'draft'
  )
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [publishedAt, setPublishedAt] = useState<string>(
    post?.published_at ? post.published_at.slice(0, 16) : ''
  )

  // Auto-generate slug from English title
  useEffect(() => {
    if (!post && titles.en && !slug) {
      setSlug(generateSlug(titles.en))
    }
  }, [titles.en, post, slug])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const updateTitle = (locale: Locale, value: string) => {
    setTitles((prev) => ({ ...prev, [locale]: value }))
  }

  const updateContent = (locale: Locale, value: string) => {
    setContents((prev) => ({ ...prev, [locale]: value }))
  }

  const updateExcerpt = (locale: Locale, value: string) => {
    setExcerpts((prev) => ({ ...prev, [locale]: value }))
  }

  const updateMetaTitle = (locale: Locale, value: string) => {
    setMetaTitles((prev) => ({ ...prev, [locale]: value }))
  }

  const updateMetaDescription = (locale: Locale, value: string) => {
    setMetaDescriptions((prev) => ({ ...prev, [locale]: value }))
  }

  const handleSubmit = async (publishStatus: 'draft' | 'published') => {
    setError(null)

    // Validation
    if (!slug.trim()) {
      setError('Slug is required')
      return
    }
    if (!titles.en?.trim()) {
      setError('English title is required')
      return
    }
    if (!contents.en?.trim()) {
      setError('English content is required')
      return
    }

    setSaving(true)

    const data: CreateBlogPostInput = {
      slug: slug.trim(),
      title: titles,
      content: contents,
      excerpt: Object.keys(excerpts).length > 0 ? excerpts : undefined,
      meta_title: Object.keys(metaTitles).length > 0 ? metaTitles : undefined,
      meta_description:
        Object.keys(metaDescriptions).length > 0 ? metaDescriptions : undefined,
      featured_image_url: featuredImageUrl || undefined,
      category_id: categoryId || undefined,
      author_id: authorId || undefined,
      status: publishStatus,
      tags: tags.length > 0 ? tags : undefined,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : undefined,
    }

    const success = await onSave(data)

    setSaving(false)

    if (success) {
      router.push('/en/admin/blog')
    } else {
      setError('Failed to save post. Please try again.')
    }
  }

  const currentLocale = LOCALES[activeTab]

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/en/admin/blog')}
        >
          Back to Posts
        </Button>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={saving ? <CircularProgress size={20} /> : <Save />}
            onClick={() => handleSubmit('draft')}
            disabled={saving}
          >
            Save Draft
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} /> : <Publish />}
            onClick={() => handleSubmit('published')}
            disabled={saving}
          >
            Publish
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Language Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          {LOCALES.map((locale) => (
            <Tab key={locale} label={LOCALE_LABELS[locale]} />
          ))}
        </Tabs>
      </Box>

      {/* Localized Fields */}
      {LOCALES.map((locale, index) => (
        <TabPanel key={locale} value={activeTab} index={index}>
          <Stack spacing={3}>
            <TextField
              label={`Title (${LOCALE_LABELS[locale]})`}
              value={titles[locale] || ''}
              onChange={(e) => updateTitle(locale, e.target.value)}
              required={locale === 'en'}
              fullWidth
            />

            <TextField
              label={`Excerpt (${LOCALE_LABELS[locale]})`}
              value={excerpts[locale] || ''}
              onChange={(e) => updateExcerpt(locale, e.target.value)}
              multiline
              rows={2}
              fullWidth
              helperText="Short description for cards and SEO"
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Content ({LOCALE_LABELS[locale]})
              </Typography>
              <BlogEditor
                content={contents[locale] || ''}
                onChange={(html) => updateContent(locale, html)}
              />
            </Box>

            <TextField
              label={`Meta Title (${LOCALE_LABELS[locale]})`}
              value={metaTitles[locale] || ''}
              onChange={(e) => updateMetaTitle(locale, e.target.value)}
              fullWidth
              helperText="SEO title override (optional)"
            />

            <TextField
              label={`Meta Description (${LOCALE_LABELS[locale]})`}
              value={metaDescriptions[locale] || ''}
              onChange={(e) => updateMetaDescription(locale, e.target.value)}
              multiline
              rows={2}
              fullWidth
              helperText="SEO description (optional)"
            />
          </Stack>
        </TabPanel>
      ))}

      {/* Common Fields */}
      <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Post Settings
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            fullWidth
            helperText="URL-friendly identifier (auto-generated from English title)"
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Featured Image
            </Typography>
            <ImageUploader value={featuredImageUrl} onChange={setFeaturedImageUrl} />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category"
            >
              <MenuItem value="">
                <em>No category</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {getLocalizedContent(cat.name, 'en')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Author</InputLabel>
            <Select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              label="Author"
            >
              <MenuItem value="">
                <em>No author</em>
              </MenuItem>
              {authors.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.full_name || author.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {post && (
            <TextField
              label="Published Date"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Edit the publication date (only available when editing)"
            />
          )}

          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={tags}
            onChange={(_, newValue) => setTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tag and press Enter"
                helperText="Press Enter to add tags"
              />
            )}
          />

          <FormControl>
            <FormLabel>Status</FormLabel>
            <RadioGroup
              row
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            >
              <FormControlLabel value="draft" control={<Radio />} label="Draft" />
              <FormControlLabel
                value="published"
                control={<Radio />}
                label="Published"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
      </Box>
    </Box>
  )
}

export default BlogPostForm
