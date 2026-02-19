'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageBreadcrumbs from '@/components/navigation/PageBreadcrumbs';

interface UserLog {
  email: string;
  role: string;
  is_active: boolean;
  has_polar_customer: boolean;
  has_polar_subscription: boolean;
  subscription_plan_type: string | null;
  last_updated: string;
}

interface LogAnalysis {
  success: boolean;
  users?: UserLog[];
  user?: any;
  analysis?: any;
  webhook_status?: any;
  total?: number;
  error?: string;
}

export default function WebhookLogsPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<LogAnalysis | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchLogs = async () => {
    if (!email) {
      // Fetch all users
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/users?limit=20`);
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        setLogs({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch logs'
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Fetch specific user
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        setLogs({
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch logs'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLogs, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, email]);

  return (
    <div className="w-full">
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <PageBreadcrumbs />
      </div>
      <div className="px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Auto-refresh (5s)</span>
          </label>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to filter (leave empty for all users)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {logs && (
        <div className="space-y-4">
          {logs.success ? (
            <>
              {logs.user ? (
                // Single user view
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-lg">{logs.user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <p className={`text-lg font-semibold ${logs.user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                          {logs.user.is_active ? '✅ ACTIVE' : '❌ INACTIVE'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Subscription Plan</label>
                        <p className="text-lg capitalize">{logs.user.subscription_plan_type || 'None'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Polar Customer ID</label>
                        <p className="text-sm font-mono">{logs.user.polar_customer_id || 'NULL'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Polar Subscription ID</label>
                        <p className="text-sm font-mono">{logs.user.polar_subscription_id || 'NULL'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Last Updated</label>
                        <p className="text-sm">{new Date(logs.user.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {logs.analysis && (
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Account Status:</span>
                          <span className={logs.analysis.account_status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
                            {logs.analysis.account_status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Has Polar Customer:</span>
                          <span>{logs.analysis.has_polar_customer ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Days Since Last Update:</span>
                          <span>{logs.analysis.days_since_update !== null ? `${logs.analysis.days_since_update} days` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {logs.webhook_status && (
                    <div className={`rounded-lg shadow p-4 ${logs.webhook_status.likely_issue ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Webhook Processed:</span>
                          <span>{logs.webhook_status.webhook_processed ? '✅ Yes' : '❌ No'}</span>
                        </div>
                        {logs.webhook_status.likely_issue && (
                          <div className="mt-4 p-4 bg-yellow-100 rounded">
                            <p className="text-yellow-800 font-semibold">⚠️ Issue Detected:</p>
                            <p className="text-yellow-700">{logs.webhook_status.likely_issue}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // All users view
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Polar Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Polar Subscription</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {logs.users?.map((user, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={user.is_active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {user.is_active ? '✅ ACTIVE' : '❌ INACTIVE'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                              {user.subscription_plan_type || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {user.has_polar_customer ? '✅ Yes' : '❌ No'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {user.has_polar_subscription ? '✅ Yes' : '❌ No'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {new Date(user.last_updated).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{logs.error || 'Failed to fetch logs'}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="space-y-2 text-blue-700">
          <p><strong>✅ ACTIVE + Has Polar Customer:</strong> Webhook processed successfully</p>
          <p><strong>❌ INACTIVE + No Polar Customer:</strong> Webhook likely not processed</p>
          <p><strong>⚠️ Check Last Updated:</strong> If old, webhook may not have fired recently</p>
          <p><strong>💡 Tip:</strong> Use auto-refresh to monitor real-time changes after payments</p>
        </div>
      </div>
    </div>
    </div>
  );
}
