import { NextResponse } from 'next/server';

/**
 * Webhook handler stub - Payment provider is being updated
 */
export async function POST(req: Request) {
  console.log('Webhook received but payment system is being updated');
  return NextResponse.json({
    received: true,
    message: 'Webhook disabled - payment system is being updated',
  });
}
