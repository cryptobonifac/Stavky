'use client'

import { useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

type CopyToClipboardButtonProps = {
  text: string
  tooltipCopied?: string
  tooltipCopy?: string
}

export default function CopyToClipboardButton({
  text,
  tooltipCopied = 'Copied!',
  tooltipCopy = 'Copy',
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tooltip title={copied ? tooltipCopied : tooltipCopy}>
      <IconButton onClick={handleCopy} size="small" data-testid="copy-iban-button">
        {copied ? (
          <CheckIcon fontSize="small" color="success" />
        ) : (
          <ContentCopyIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  )
}
