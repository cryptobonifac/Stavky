import type { Metadata } from 'next'
import './globals.css'
import { AppThemeProvider } from '@/components/providers/app-theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'

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
      <body>
        <AppThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppThemeProvider>
      </body>
    </html>
  )
}

