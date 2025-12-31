import { createAdminClient } from '@/lib/supabase/admin';
import { createSafeAuthClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET: list all betting companies (id, name)
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('betting_companies')
    .select('id,name')
    .order('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST: create a new betting company
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
      { error: 'Company name is required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('betting_companies')
    .insert({ name: name.trim() })
    .select('id,name')
    .single();

  if (error) {
    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A company with this name already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
