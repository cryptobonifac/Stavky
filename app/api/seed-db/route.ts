import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET() {
    const supabase = createAdminClient()
    const logs: string[] = []
    const log = (msg: string) => logs.push(msg)

    try {
        // Betting Companies
        const companies = ['Bet365']
        let companiesInserted = 0

        const { count: startCompanies } = await supabase.from('betting_companies').select('*', { count: 'exact', head: true })
        log(`Start companies count: ${startCompanies}`)

        for (const name of companies) {
            const { data } = await supabase.from('betting_companies').select('id').eq('name', name).single()
            if (!data) {
                log(`Inserting company: ${name}`)
                const { error } = await supabase.from('betting_companies').insert({ name })
                if (error) {
                    log(`Error inserting ${name}: ${error.message}`)
                } else {
                    companiesInserted++
                }
            } else {
                log(`Company exists: ${name}`)
            }
        }

        // Sports
        const sports = ['Soccer', 'Tennis', 'Basketball', 'Ice Hockey', 'Volleyball']
        let sportsInserted = 0

        const { count: startSports } = await supabase.from('sports').select('*', { count: 'exact', head: true })
        log(`Start sports count: ${startSports}`)

        for (const name of sports) {
            const { data } = await supabase.from('sports').select('id').eq('name', name).single()
            if (!data) {
                log(`Inserting sport: ${name}`)
                const { error } = await supabase.from('sports').insert({ name })
                if (error) {
                    log(`Error inserting ${name}: ${error.message}`)
                } else {
                    sportsInserted++
                }
            } else {
                log(`Sport exists: ${name}`)
            }
        }

        // Leagues
        const leaguesData = {
            'Soccer': ['Premier League', 'La Liga', 'Champions League', 'Serie A'],
            'Basketball': ['NBA', 'EuroLeague'],
            'Ice Hockey': ['NHL', 'KHL'],
            'Tennis': ['ATP', 'WTA']
        }

        let leaguesInserted = 0
        for (const [sportName, leagues] of Object.entries(leaguesData)) {
            const { data: sport } = await supabase.from('sports').select('id').eq('name', sportName).single()
            if (sport) {
                for (const leagueName of leagues) {
                    const { data: league } = await supabase.from('leagues').select('id').eq('name', leagueName).eq('sport_id', sport.id).single()
                    if (!league) {
                        log(`Inserting league: ${leagueName} for ${sportName}`)
                        const { error } = await supabase.from('leagues').insert({ name: leagueName, sport_id: sport.id })
                        if (error) {
                            log(`Error inserting ${leagueName}: ${error.message}`)
                        } else {
                            leaguesInserted++
                        }
                    }
                }
            } else {
                log(`Sport not found for leagues: ${sportName}`)
            }
        }

        const { count: endCompanies } = await supabase.from('betting_companies').select('*', { count: 'exact', head: true })
        const { count: endSports } = await supabase.from('sports').select('*', { count: 'exact', head: true })

        return NextResponse.json({
            message: 'Seeding complete',
            stats: {
                companiesInserted,
                sportsInserted,
                leaguesInserted,
                startCompanies,
                endCompanies,
                startSports,
                endSports
            },
            logs
        })
    } catch (e: any) {
        return NextResponse.json({ error: e.message, logs }, { status: 500 })
    }
}
