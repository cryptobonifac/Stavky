import { getTranslations, getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/routing'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import TopNav from '@/components/navigation/TopNav'
import NewBetForm from '@/components/admin/NewBetForm'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function generateMetadata() {
  const t = await getTranslations('newbet')
  return {
    title: `${t('title')} | Stavky`,
  }
}

export default async function NewBetPage({
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
    redirect('/login', { locale, searchParams: { redirectedFrom: '/newbet' } })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect('/bettings', { locale })
  }

  const [companiesRes, sportsRes] = await Promise.all([
    supabase.from('betting_companies').select('id,name').order('name'),
    supabase
      .from('sports')
      .select('id,name,leagues(id,name)')
      .order('name'),
  ])

  // Log errors for debugging
  if (companiesRes.error) {
    console.error('[NewBetPage] Error fetching betting companies:', companiesRes.error)
  }
  if (sportsRes.error) {
    console.error('[NewBetPage] Error fetching sports:', sportsRes.error)
  }

  const companies = companiesRes.data ?? []
  const sports = sportsRes.data ?? []

  // Debug logging
  console.log('[NewBetPage] Companies count:', companies.length)
  console.log('[NewBetPage] Sports count:', sports.length)
  if (sports.length > 0) {
    console.log('[NewBetPage] First sport leagues:', sports[0].leagues?.length ?? 0)
  }

  // Load translations explicitly with locale to ensure correct language
  const messages = (await import(`../../../messages/${locale}.json`)).default
  const newbetMessages = messages.newbet as Record<string, string>
  const t = (key: string): string => {
    return newbetMessages[key] || key
  }
  
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
        <NewBetForm
          bettingCompanies={(companies ?? []).map((company) => ({
            id: company.id,
            name: company.name,
          }))}
          sports={(sports ?? []).map((sport) => ({
            id: sport.id,
            name: sport.name,
            leagues: (sport.leagues ?? []).map((league) => ({
              id: league.id,
              name: league.name,
            })),
          }))}
        />
      </PageSection>
    </MainLayout>
  )
}


