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
    redirect({ href: { pathname: '/login', query: { redirectedFrom: '/newbet' } }, locale })
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect({ href: '/bettings', locale })
  }

  // Fetch betting companies
  const companiesRes = await supabase
    .from('betting_companies')
    .select('id,name')
    .order('name')

  if (companiesRes.error) {
    console.error('[NewBetPage] Error fetching betting companies:', companiesRes.error)
  }

  const companies = companiesRes.data ?? []

  // Fetch sports
  const sportsRes = await supabase
    .from('sports')
    .select('id,name')
    .order('name')

  if (sportsRes.error) {
    console.error('[NewBetPage] Error fetching sports:', sportsRes.error)
  }

  const sports = sportsRes.data ?? []

  // Fetch results
  const resultsRes = await supabase
    .from('results')
    .select('id,name')
    .order('name')

  if (resultsRes.error) {
    console.error('[NewBetPage] Error fetching results:', resultsRes.error)
  }

  const results = resultsRes.data ?? []

  // Load translations
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
      <PageSection>
        <NewBetForm
          bettingCompanies={companies.map((company) => ({
            id: company.id,
            name: company.name,
          }))}
          sports={sports.map((sport) => ({
            id: sport.id,
            name: sport.name,
          }))}
          results={results.map((result) => ({
            id: result.id,
            name: result.name,
          }))}
        />
      </PageSection>
    </MainLayout>
  )
}


