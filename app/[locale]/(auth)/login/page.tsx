import { getTranslations } from 'next-intl/server'
import AuthPageLayout from '@/components/auth/AuthPageLayout'
import LoginForm from '@/components/auth/LoginForm'

// Mark as dynamic because LoginForm uses useSearchParams()
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.login' })
  return {
    title: `${t('pageTitle')} | Stavky`,
  }
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.login' })
  
  return (
    <AuthPageLayout
      title={t('pageTitle')}
      footer={{
        prompt: t('noAccountPrompt'),
        link: { href: '/signup', label: t('createAccountLink') },
      }}
    >
      <LoginForm />
    </AuthPageLayout>
  )
}


