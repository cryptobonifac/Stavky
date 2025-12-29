import { getTranslations } from 'next-intl/server'
import AuthPageLayout from '@/components/auth/AuthPageLayout'
import SignupForm from '@/components/auth/SignupForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.signup' })
  return {
    title: `${t('pageTitle')} | Stavky`,
  }
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.signup' })
  
  return (
    <AuthPageLayout
      title={t('pageTitle')}
      footer={{
        prompt: t('hasAccountPrompt'),
        link: { href: '/login', label: t('signInLink') },
      }}
    >
      <SignupForm />
    </AuthPageLayout>
  )
}


