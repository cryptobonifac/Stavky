import { NextResponse } from 'next/server'
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerClient()
  
  const [companiesRes, sportsRes, leaguesRes] = await Promise.all([
    supabase.from('betting_companies').select('id,name').order('name'),
    supabase.from('sports').select('id,name').order('name'),
    supabase.from('leagues').select('id,name,sport_id').order('name'),
  ])

  return NextResponse.json({
    companies: {
      data: companiesRes.data,
      error: companiesRes.error?.message,
      count: companiesRes.data?.length ?? 0,
    },
    sports: {
      data: sportsRes.data,
      error: sportsRes.error?.message,
      count: sportsRes.data?.length ?? 0,
    },
    leagues: {
      data: leaguesRes.data,
      error: leaguesRes.error?.message,
      count: leaguesRes.data?.length ?? 0,
    },
  })
}

