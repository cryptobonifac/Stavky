import { permanentRedirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

// Root page permanently redirects to default locale (301)
export default function RootPage() {
  permanentRedirect(`/${routing.defaultLocale}`)
}
