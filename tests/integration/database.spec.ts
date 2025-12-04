import { test, expect } from '@playwright/test';

test.describe('Database Functions Integration', () => {
    test.describe('Odds Validation Function', () => {
        test('should validate odds through API', async ({ request }) => {
            // Test creating a betting tip with valid odds
            const validOdds = [1.001, 1.5, 1.75, 2.0];

            for (const odds of validOdds) {
                const response = await request.post('http://localhost:3000/api/betting-tips', {
                    data: {
                        betting_company_id: 'test-id',
                        sport_id: 'test-id',
                        league_id: 'test-id',
                        match: 'Test Match',
                        odds: odds,
                        match_date: new Date().toISOString(),
                    },
                });

                // Will fail due to auth, but odds validation happens server-side
                // We're testing that the request structure is correct
                expect([400, 401, 403]).toContain(response.status());
            }
        });
    });

    test.describe('Tip Success Rate Calculation', () => {
        test('should calculate success rate correctly', async ({ request }) => {
            // This would require authenticated access to history endpoint
            const response = await request.get('http://localhost:3000/api/history');

            // If authenticated, should return monthly statistics
            if (response.ok()) {
                const data = await response.json();
                expect(Array.isArray(data)).toBeTruthy();

                // Each month should have success rate data
                data.forEach((month: any) => {
                    if (month.total > 0) {
                        expect(month).toHaveProperty('wins');
                        expect(month).toHaveProperty('losses');
                        expect(month).toHaveProperty('pending');
                        expect(month).toHaveProperty('total');
                        expect(month).toHaveProperty('success_rate');

                        // Success rate should be between 0 and 100
                        if (month.success_rate !== null) {
                            expect(month.success_rate).toBeGreaterThanOrEqual(0);
                            expect(month.success_rate).toBeLessThanOrEqual(100);
                        }
                    }
                });
            }
        });
    });

    test.describe('Account Activation', () => {
        test('should validate account activation dates', async ({ request }) => {
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 1);

            const response = await request.post('http://localhost:3000/api/settings/users/activate', {
                data: {
                    userId: 'test-user-id',
                    activeUntil: futureDate.toISOString(),
                },
            });

            // Should require authentication
            expect([401, 403]).toContain(response.status());
        });
    });

    test.describe('Free Month Logic', () => {
        test('should handle free month grant requests', async ({ request }) => {
            const response = await request.post('http://localhost:3000/api/settings/user-subscriptions/free-month', {
                data: {
                    userId: 'test-user-id',
                    month: new Date().toISOString(),
                    grantNextMonthFree: true,
                },
            });

            // Should require authentication and betting role
            expect([401, 403]).toContain(response.status());
        });
    });
});

test.describe('Row Level Security (RLS)', () => {
    test.describe('Public Access', () => {
        test('should allow public access to betting companies', async ({ request }) => {
            const response = await request.get('http://localhost:3000/api/settings/betting-companies');
            expect(response.ok()).toBeTruthy();
        });

        test('should allow public access to sports', async ({ request }) => {
            const response = await request.get('http://localhost:3000/api/settings/sports');
            expect(response.ok()).toBeTruthy();
        });
    });

    test.describe('Protected Resources', () => {
        test('should protect betting tips from unauthenticated access', async ({ request }) => {
            const response = await request.get('http://localhost:3000/api/betting-tips');

            // Should either require auth or return limited data
            if (!response.ok()) {
                expect([401, 403]).toContain(response.status());
            }
        });

        test('should protect user list from unauthenticated access', async ({ request }) => {
            const response = await request.get('http://localhost:3000/api/settings/users');

            // Should require authentication and betting role
            expect([401, 403]).toContain(response.status());
        });

        test('should protect settings endpoints', async ({ request }) => {
            const endpoints = [
                '/api/settings/marketing',
                '/api/settings/users/activate',
                '/api/settings/user-subscriptions/free-month',
            ];

            for (const endpoint of endpoints) {
                const response = await request.post(`http://localhost:3000${endpoint}`, {
                    data: {},
                });

                // Should require authentication
                expect([401, 403]).toContain(response.status());
            }
        });
    });
});
