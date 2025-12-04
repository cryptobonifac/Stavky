import { createAdminClient } from '@/lib/supabase/admin';
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
