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

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'betting') {
    redirect('/bettings')
  }

  const [{ data: companies }, { data: sports }] = await Promise.all([
    supabase.from('betting_companies').select('id,name').order('name'),
    supabase
      .from('sports')
      .select('id,name,leagues(id,name)')
      .order('name'),
  ])

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


