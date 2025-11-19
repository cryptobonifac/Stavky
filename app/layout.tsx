import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stavky - Sports Betting Tips',
  description: 'A minimalist web application for sports betting tipsters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

