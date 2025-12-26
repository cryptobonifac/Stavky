import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter required. Use ?email=user@example.com' },
      { status: 400 }
    );
  }

  try {
    // Check user status
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Try case-insensitive
      const { data: userCI } = await supabase
        .from('users')
        .select('*')
        .ilike('email', email)
        .maybeSingle();

      if (userCI) {
        return NextResponse.json({
          success: true,
          message: 'User found with case-insensitive match',
          user: {
            id: userCI.id,
            email: userCI.email,
            role: userCI.role,
            account_active_until: userCI.account_active_until,
            stripe_customer_id: userCI.stripe_customer_id,
            stripe_subscription_id: userCI.stripe_subscription_id,
            is_active: userCI.account_active_until && new Date(userCI.account_active_until) >= new Date(),
            created_at: userCI.created_at,
            updated_at: userCI.updated_at,
          },
          note: `Email case mismatch: searched for "${email}", found "${userCI.email}"`
        });
      }

      return NextResponse.json({
        success: false,
        error: 'User not found',
        searched_email: email,
        suggestion: 'Check if user exists in database or if email is correct'
      }, { status: 404 });
    }

    const isActive = user.account_active_until && new Date(user.account_active_until) >= new Date();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        account_active_until: user.account_active_until,
        stripe_customer_id: user.stripe_customer_id,
        stripe_subscription_id: user.stripe_subscription_id,
        is_active: isActive,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      analysis: {
        account_status: isActive ? 'ACTIVE' : 'INACTIVE',
        has_stripe_customer: !!user.stripe_customer_id,
        has_stripe_subscription: !!user.stripe_subscription_id,
        activation_expired: user.account_active_until ? new Date(user.account_active_until) < new Date() : null,
      },
      webhook_checklist: {
        'User exists in database': true,
        'Account should be activated by webhook': !isActive && !user.stripe_customer_id ? 'YES - waiting for payment' : 'NO - already active or has Stripe ID',
        'Possible issues': [
          !user.stripe_customer_id && !isActive ? 'No Stripe customer ID - webhook may not have processed payment' : null,
          user.account_active_until && new Date(user.account_active_until) < new Date() ? 'Account activation expired' : null,
        ].filter(Boolean)
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database query failed',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
