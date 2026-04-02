import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SmartBet365 - Expert Sports Betting Tips',
  description: 'Get verified, high-probability sports betting tips from professional analysts. Data-driven match analysis with transparent results.',
  other: {
    'google': 'notranslate',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
