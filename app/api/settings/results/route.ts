import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET: list all results (id, name)
export async function GET() {
    const supabase = createAdminClient();

    // Fetch results
    const { data: results, error: resultsError } = await supabase
        .from('results')
        .select('id,name')
        .order('name');

    if (resultsError) {
        return NextResponse.json({ error: resultsError.message }, { status: 500 });
    }

    return NextResponse.json(results ?? []);
}

// POST: create a new result
// Note: Results should be saved in English. Translations are handled on the frontend.
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
      { error: 'Result name is required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('results')
    .insert({ name: name.trim() })
    .select('id,name')
    .single();

  if (error) {
    // Handle unique constraint violation (case-insensitive)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A result with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}


