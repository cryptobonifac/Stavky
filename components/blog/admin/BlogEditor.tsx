'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Box, ToggleButton, ToggleButtonGroup, Divider, IconButton, Tooltip } from '@mui/material'
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from '@mui/icons-material'
import { useCallback, useEffect, useRef } from 'react'

type BlogEditorProps = {
  content: string
  onChange: (html: string) => void
  onImageUpload?: () => void
  placeholder?: string
}

const BlogEditor = ({ content, onChange, onImageUpload, placeholder }: BlogEditorProps) => {
  const isInitialMount = useRef(true)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: content || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'blog-editor-content',
      },
    },
  })

  // Update content when prop changes (e.g., when switching languages)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt('Image URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 0.5,
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
        }}
      >
        <ToggleButtonGroup size="small">
          <ToggleButton
            value="bold"
            selected={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBold fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="italic"
            selected={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalic fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToggleButtonGroup size="small">
          <ToggleButton
            value="h2"
            selected={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </ToggleButton>
          <ToggleButton
            value="h3"
            selected={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToggleButtonGroup size="small">
          <ToggleButton
            value="bulletList"
            selected={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulleted fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="orderedList"
            selected={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumbered fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <ToggleButtonGroup size="small">
          <ToggleButton
            value="blockquote"
            selected={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FormatQuote fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value="codeBlock"
            selected={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Add Link">
          <IconButton size="small" onClick={setLink}>
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Image">
          <IconButton size="small" onClick={onImageUpload || addImage}>
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Undo">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Editor Content */}
      <Box
        sx={{
          minHeight: 300,
          p: 2,
          '& .blog-editor-content': {
            outline: 'none',
            minHeight: 250,
            '& > * + *': {
              mt: 1,
            },
            '& h2, & h3, & h4': {
              fontWeight: 600,
              mt: 3,
              mb: 1,
            },
            '& h2': { fontSize: '1.5rem' },
            '& h3': { fontSize: '1.25rem' },
            '& p': {
              minHeight: '1em',
            },
            '& ul, & ol': {
              pl: 3,
            },
            '& blockquote': {
              borderLeft: 3,
              borderColor: 'primary.main',
              pl: 2,
              py: 0.5,
              fontStyle: 'italic',
              bgcolor: 'action.hover',
            },
            '& pre': {
              bgcolor: 'grey.900',
              color: 'grey.100',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontFamily: 'monospace',
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
            '& .blog-image': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
          },
          '& .ProseMirror-focused': {
            outline: 'none',
          },
          '& p.is-editor-empty:first-child::before': {
            content: 'attr(data-placeholder)',
            color: 'text.disabled',
            pointerEvents: 'none',
            float: 'left',
            height: 0,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}

export default BlogEditor
