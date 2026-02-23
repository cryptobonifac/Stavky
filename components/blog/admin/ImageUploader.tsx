'use client'

import { useState, useRef } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Alert,
} from '@mui/material'
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material'
import { createBrowserClient } from '@supabase/ssr'

type ImageUploaderProps = {
  value?: string | null
  onChange: (url: string | null) => void
  bucket?: string
  folder?: string
}

const ImageUploader = ({
  value,
  onChange,
  bucket = 'images',
  folder = 'blog',
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onChange(urlData.publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {value ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            borderRadius: 1,
            overflow: 'hidden',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Box
            component="img"
            src={value}
            alt="Featured image"
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: 200,
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={handleClick}
              disabled={uploading}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              {uploading ? (
                <CircularProgress size={20} />
              ) : (
                <CloudUpload fontSize="small" />
              )}
            </IconButton>
            <IconButton
              size="small"
              onClick={handleRemove}
              disabled={uploading}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'error.light' },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box
          onClick={handleClick}
          sx={{
            width: '100%',
            maxWidth: 400,
            height: 150,
            border: 2,
            borderStyle: 'dashed',
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background-color 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          {uploading ? (
            <CircularProgress />
          ) : (
            <>
              <ImageIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Click to upload image
              </Typography>
              <Typography variant="caption" color="text.disabled">
                JPEG, PNG, GIF, WebP (max 5MB)
              </Typography>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}

export default ImageUploader
