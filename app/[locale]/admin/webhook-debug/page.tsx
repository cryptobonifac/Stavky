'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageBreadcrumbs from '@/components/navigation/PageBreadcrumbs';

interface UserData {
  id: string;
  email: string;
  role: string;
  account_active_until: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface AnalysisResult {
  success: boolean;
  user?: UserData;
  analysis?: {
    account_status: string;
    has_stripe_customer: boolean;
    has_stripe_subscription: boolean;
    activation_expired: string | null;
  };
  webhook_checklist?: {
    'User exists in database': boolean;
    'Account should be activated by webhook': string;
    'Possible issues': string[];
  };
  error?: string;
  note?: string;
}

export default function WebhookDebugPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeUser = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/webhooks/debug?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user data'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <PageBreadcrumbs />
      </div>
      <div className="px-4 py-3">

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex gap-4 mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email (e.g., customer14@gmail.com)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={analyzeUser}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze User'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {result.success && result.user ? (
            <>
              {/* User Information */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{result.user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-sm font-mono">{result.user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="text-lg">{result.user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <p className={`text-lg font-semibold ${result.user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {result.user.is_active ? '✅ ACTIVE' : '❌ INACTIVE'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Active Until</label>
                    <p className="text-lg">{result.user.account_active_until || 'NULL'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Stripe Customer ID</label>
                    <p className="text-sm font-mono">{result.user.stripe_customer_id || 'NULL'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Stripe Subscription ID</label>
                    <p className="text-sm font-mono">{result.user.stripe_subscription_id || 'NULL'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm">{new Date(result.user.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Analysis */}
              {result.analysis && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Account Status:</span>
                      <span className={result.analysis.account_status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
                        {result.analysis.account_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Has Stripe Customer:</span>
                      <span>{result.analysis.has_stripe_customer ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Has Stripe Subscription:</span>
                      <span>{result.analysis.has_stripe_subscription ? '✅ Yes' : '❌ No'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Webhook Checklist */}
              {result.webhook_checklist && (
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span>{result.webhook_checklist['User exists in database'] ? '✅' : '❌'}</span>
                      <span>User exists in database</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>ℹ️</span>
                      <span>{result.webhook_checklist['Account should be activated by webhook']}</span>
                    </div>
                    {result.webhook_checklist['Possible issues'].length > 0 && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Possible Issues:</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {result.webhook_checklist['Possible issues'].map((issue, idx) => (
                            <li key={idx} className="text-yellow-700">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-blue-700">
                  <li>Check your terminal logs where <code className="bg-blue-100 px-1 rounded">npm run dev</code> is running</li>
                  <li>Look for logs starting with <code className="bg-blue-100 px-1 rounded">🔔 WEBHOOK EVENT RECEIVED</code></li>
                  <li>If no webhook logs appear, verify Stripe CLI is running:
                    <code className="block bg-blue-100 px-2 py-1 rounded mt-1">stripe listen --forward-to localhost:3000/api/webhooks/stripe</code>
                  </li>
                  <li>Check Stripe Dashboard → Developers → Webhooks → Events for recent <code className="bg-blue-100 px-1 rounded">checkout.session.completed</code> events</li>
                  <li>Verify the email in Stripe matches the database email exactly (case-sensitive)</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{result.error || 'User not found'}</p>
              {result.note && (
                <p className="mt-2 text-sm text-red-600">{result.note}</p>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}



