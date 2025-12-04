import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

// GET: list all sports with nested leagues (id, name, leagues[])
export async function GET() {
    const supabase = createAdminClient();

    // Fetch sports first
    const { data: sports, error: sportsError } = await supabase
        .from('sports')
        .select('id,name')
        .order('name');

    if (sportsError) {
        return NextResponse.json({ error: sportsError.message }, { status: 500 });
    }

    // For each sport, fetch its leagues
    const sportsWithLeagues = await Promise.all(
        (sports ?? []).map(async (sport) => {
            const { data: leagues, error: leaguesError } = await supabase
                .from('leagues')
                .select('id,name')
                .eq('sport_id', sport.id)
                .order('name');

            return {
                ...sport,
                leagues: leaguesError ? [] : leagues,
            };
        })
    );

    return NextResponse.json(sportsWithLeagues);
}
