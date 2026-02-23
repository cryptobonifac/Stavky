import { NextRequest, NextResponse } from 'next/server';

/**
 * Manual subscription sync stub - Payment provider is being updated
 */
export async function POST(req: NextRequest) {
  return NextResponse.json(
    {
      error: 'Service temporarily unavailable',
      message: 'Payment system is being updated. Subscription sync is disabled.',
    },
    { status: 503 }
  );
}
