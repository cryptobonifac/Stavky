import { redirect } from 'next/navigation'

import MainLayout from '@/components/layout/MainLayout'
import PageSection from '@/components/layout/PageSection'
import NewBetForm from '@/components/admin/NewBetForm'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'New betting tip | Stavky',
}

export default async function NewBetPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectedFrom=/newbet')
  }

  // TypeScript: user is guaranteed to be non-null after redirect check
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect('/bettings')
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

  return (
    <MainLayout>
      <PageSection
        title="Publish a new betting tip"
        subtitle="Fill out the match details, select the league, and set the kickoff time."
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


