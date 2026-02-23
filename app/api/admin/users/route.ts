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
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    if (email) {
      // Fetch specific user
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, role, account_active_until, provider_customer_id, provider_subscription_id, subscription_plan_type, created_at, updated_at')
        .ilike('email', email)
        .maybeSingle();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found',
          note: 'Make sure the email exists in the database and matches exactly.'
        }, { status: 404 });
      }

      const now = new Date();
      const activeUntil = user.account_active_until ? new Date(user.account_active_until) : null;
      const isActive = activeUntil ? activeUntil >= now : false;

      return NextResponse.json({
        success: true,
        user: {
          ...user,
          is_active: isActive,
        },
        analysis: {
          account_status: isActive ? 'ACTIVE' : 'INACTIVE',
          has_provider_customer: !!user.provider_customer_id,
          has_provider_subscription: !!user.provider_subscription_id,
          subscription_plan_type: user.subscription_plan_type,
          activation_expired: activeUntil && activeUntil < now ? activeUntil.toISOString() : null,
          days_since_update: Math.floor((now.getTime() - new Date(user.updated_at).getTime()) / (1000 * 60 * 60 * 24)),
        },
        webhook_checklist: {
          'User exists in database': true,
          'Account should be activated by webhook': isActive
            ? 'Account is active - webhook processed correctly'
            : 'Account is inactive - webhook may not have processed',
          'Possible issues': getPossibleIssues(user, isActive),
        },
        webhook_status: {
          webhook_processed: !!(user.provider_customer_id || user.provider_subscription_id),
          likely_issue: !isActive && !user.provider_customer_id
            ? 'No provider customer ID set - webhook may not have been received or email mismatch'
            : null,
        },
      });
    } else {
      // Fetch all users (limited)
      const { data: users, error } = await supabase
        .from('users')
        .select('email, role, account_active_until, provider_customer_id, provider_subscription_id, subscription_plan_type, updated_at')
        .order('updated_at', { ascending: false })
        .limit(limit);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      const now = new Date();
      const processedUsers = users?.map(user => {
        const activeUntil = user.account_active_until ? new Date(user.account_active_until) : null;
        return {
          email: user.email,
          role: user.role,
          is_active: activeUntil ? activeUntil >= now : false,
          has_provider_customer: !!user.provider_customer_id,
          has_provider_subscription: !!user.provider_subscription_id,
          subscription_plan_type: user.subscription_plan_type,
          last_updated: user.updated_at,
        };
      }) || [];

      return NextResponse.json({
        success: true,
        users: processedUsers,
        total: processedUsers.length,
      });
    }
  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    }, { status: 500 });
  }
}

function getPossibleIssues(user: any, isActive: boolean): string[] {
  const issues: string[] = [];

  if (!isActive && !user.provider_customer_id) {
    issues.push('No provider customer ID - webhook may not have been received');
    issues.push('Check if customer email in payment provider matches database email exactly');
  }

  if (user.provider_customer_id && !user.provider_subscription_id && !isActive) {
    issues.push('Has provider customer but no subscription - subscription may have been cancelled');
  }

  if (!user.provider_customer_id && user.provider_subscription_id) {
    issues.push('Has subscription ID but no customer ID - data inconsistency');
  }

  return issues;
}
