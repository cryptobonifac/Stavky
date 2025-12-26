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
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    if (email) {
      // Get user and recent activity
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError || !user) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
          searched_email: email
        }, { status: 404 });
      }

      // Get recent payments/activity (if you have a payments/transactions table)
      // For now, return user info with analysis
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
          last_updated: user.updated_at,
          days_since_update: user.updated_at 
            ? Math.floor((Date.now() - new Date(user.updated_at).getTime()) / (1000 * 60 * 60 * 24))
            : null,
        },
        webhook_status: {
          webhook_processed: !!(user.stripe_customer_id || isActive),
          likely_issue: !user.stripe_customer_id && !isActive 
            ? 'Webhook may not have processed payment - no Stripe IDs stored'
            : null,
        }
      });
    } else {
      // Get all users with recent activity
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, role, account_active_until, stripe_customer_id, stripe_subscription_id, updated_at')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        return NextResponse.json({
          success: false,
          error: 'Database query failed',
          message: error.message
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        users: users?.map(user => ({
          email: user.email,
          role: user.role,
          is_active: user.account_active_until && new Date(user.account_active_until) >= new Date(),
          has_stripe_customer: !!user.stripe_customer_id,
          has_stripe_subscription: !!user.stripe_subscription_id,
          last_updated: user.updated_at,
        })) || [],
        total: users?.length || 0
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Server error',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}



