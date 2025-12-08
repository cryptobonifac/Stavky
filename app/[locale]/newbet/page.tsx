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

  // Try nested query first, fallback to separate queries if it fails
  let sportsRes = await supabase
    .from('sports')
    .select('id,name,leagues(id,name)')
    .order('name')

  // If nested query fails or returns empty leagues, try separate queries
  if (sportsRes.error || (sportsRes.data && sportsRes.data.some(sport => !sport.leagues || sport.leagues.length === 0))) {
    console.warn('[NewBetPage] Nested query failed or returned empty leagues, trying separate queries')
    
    // Fetch sports and leagues separately
    const [sportsOnlyRes, leaguesRes] = await Promise.all([
      supabase.from('sports').select('id,name').order('name'),
      supabase.from('leagues').select('id,name,sport_id').order('name'),
    ])

    if (sportsOnlyRes.error) {
      console.error('[NewBetPage] Error fetching sports:', sportsOnlyRes.error)
    }
    if (leaguesRes.error) {
      console.error('[NewBetPage] Error fetching leagues:', leaguesRes.error)
    }

    // Combine sports and leagues manually
    const sportsData = sportsOnlyRes.data ?? []
    const leaguesData = leaguesRes.data ?? []
    
    const sportsWithLeagues = sportsData.map(sport => ({
      id: sport.id,
      name: sport.name,
      leagues: leaguesData
        .filter(league => league.sport_id === sport.id)
        .map(league => ({ id: league.id, name: league.name })),
    }))

    sportsRes = { data: sportsWithLeagues, error: null }
  }

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
    console.log('[NewBetPage] Sample sport data:', JSON.stringify(sports[0], null, 2))
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


