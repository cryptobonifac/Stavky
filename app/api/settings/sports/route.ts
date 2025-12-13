import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET: list all sports (id, name)
// Note: Leagues are now stored as text in betting_tip_items, not as a separate table
export async function GET() {
    const supabase = createAdminClient();

    // Fetch sports
    const { data: sports, error: sportsError } = await supabase
        .from('sports')
        .select('id,name')
        .order('name');

    if (sportsError) {
        return NextResponse.json({ error: sportsError.message }, { status: 500 });
    }

    return NextResponse.json(sports ?? []);
}

// POST: create a new sport
// Note: Sports should be saved in English. Translations are handled on the frontend.
export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: acting } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (acting?.role !== 'betting') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { name } = body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json(
      { error: 'Sport name is required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('sports')
    .insert({ name: name.trim() })
    .select('id,name')
    .single();

  if (error) {
    // Handle unique constraint violation (case-insensitive)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A sport with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
