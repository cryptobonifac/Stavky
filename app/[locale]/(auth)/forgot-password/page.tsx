import { getTranslations } from 'next-intl/server'
import AuthPageLayout from '@/components/auth/AuthPageLayout'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.forgotPassword' })
  return {
    title: `${t('pageTitle')} | Stavky`,
  }
}

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.forgotPassword' })

  return (
    <AuthPageLayout
      title={t('pageTitle')}
      footer={{
        prompt: '',
        link: { href: '/login', label: t('backToLogin') },
      }}
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  )
}
