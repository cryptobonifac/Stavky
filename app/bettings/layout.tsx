import { AppThemeProvider } from '@/components/providers/app-theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import '../globals.css'

export default function BettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" translate="no">
      <body>
        <AppThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AppThemeProvider>
      </body>
    </html>
  )
}
