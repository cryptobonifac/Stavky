'use client'

import { Box, Typography } from '@mui/material'

type PullQuoteProps = {
  children: React.ReactNode
}

const PullQuote = ({ children }: PullQuoteProps) => {
  return (
    <Box
      component="blockquote"
      sx={{
        position: 'relative',
        my: 5,
        mx: 0,
        pl: 4,
        py: 2,
        borderLeft: '4px solid',
        borderColor: '#b8f15d',
        bgcolor: 'rgba(184, 241, 93, 0.04)',
        borderRadius: '0 8px 8px 0',
        '&::before': {
          content: '"\u201C"',
          position: 'absolute',
          left: 16,
          top: -8,
          fontSize: '4rem',
          fontFamily: '"Playfair Display", Georgia, serif',
          color: '#b8f15d',
          opacity: 0.3,
          lineHeight: 1,
        },
      }}
    >
      <Typography
        component="p"
        sx={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: '1.25rem',
          fontStyle: 'italic',
          lineHeight: 1.7,
          color: '#d8ddd4',
          mb: 0,
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

export default PullQuote
