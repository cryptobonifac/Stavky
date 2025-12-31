import { createAdminClient } from '@/lib/supabase/admin'
import { createSafeAuthClient as createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    const adminSupabase = createAdminClient()
    const userSupabase = await createClient()

    const { count: adminCompanies } = await adminSupabase.from('betting_companies').select('*', { count: 'exact', head: true })

    const { count: userCompanies, error: userCompaniesError } = await userSupabase.from('betting_companies').select('*', { count: 'exact', head: true })

    return NextResponse.json({
        env: {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            // Mask key for security, show first/last 4 chars
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        adminView: {
            companies: adminCompanies,
        },
        userView: {
            companies: userCompanies,
            companiesError: userCompaniesError,
        }
    })
}
