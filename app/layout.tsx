import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stavky - Sports Betting Tips',
  description: 'A minimalist web application for sports betting tipsters',
  other: {
    'google': 'notranslate',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html translate="no">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

