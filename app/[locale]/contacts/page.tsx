import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import ContactsList, { type ContactRecord } from '@/components/contacts/ContactsList'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function generateMetadata() {
  const t = await getTranslations('contacts')
  return {
    title: `${t('title')} | Stavky`,
  }
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/contacts' } }, locale })
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  // Only betting role can access contacts page
  if (profile?.role !== 'betting') {
    redirect({ href: '/bettings', locale })
  }

  // Fetch contacts
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('id,email,mobile,message,created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
  }

  // Load translations explicitly with locale to ensure correct language
  const messages = (await import(`../../../messages/${locale}.json`)).default
  const contactsMessages = messages.contacts as Record<string, string>
  const t = (key: string): string => {
    return contactsMessages[key] || key
  }

  const contactsList: ContactRecord[] = (contacts ?? []).map((contact) => ({
    id: contact.id,
    email: contact.email,
    mobile: contact.mobile ?? null,
    message: contact.message ?? null,
    created_at: contact.created_at,
  }))

  return (
    <MainLayout>
      <TopNav
        showSettingsLink={true}
        canAccessSettings={true}
      />
      <PageSection
        title={t('title')}
        subtitle={t('subtitle')}
      >
        <ContactsList contacts={contactsList} />
      </PageSection>
    </MainLayout>
  )
}







