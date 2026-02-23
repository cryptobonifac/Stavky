import { getTranslations } from 'next-intl/server'
import AuthPageLayout from '@/components/auth/AuthPageLayout'
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.updatePassword' })
  return {
    title: `${t('pageTitle')} | Stavky`,
  }
}

export default async function UpdatePasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auth.updatePassword' })

  return (
    <AuthPageLayout
      title={t('pageTitle')}
      footer={{
        prompt: '',
        link: { href: '/login', label: '' },
      }}
    >
      <UpdatePasswordForm />
    </AuthPageLayout>
  )
}
