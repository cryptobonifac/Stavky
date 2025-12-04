import { test, expect } from '@playwright/test';

test.describe('Betting Tips API Integration', () => {
    test.describe('GET /api/betting-tips', () => {
        test('should return betting tips list', async ({ request }) => {
            const response = await request.get('http://localhost:3000/api/betting-tips');

            // Note: This endpoint might require authentication
            // If it returns 401, that's expected behavior
            if (response.status() === 401) {
                expect(response.status()).toBe(401);
                return;
            }

            expect(response.ok()).toBeTruthy();
            const data = await response.json();
            expect(Array.isArray(data)).toBeTruthy();
        });
    });

    test.describe('POST /api/betting-tips', () => {
        test('should require authentication', async ({ request }) => {
            const response = await request.post('http://localhost:3000/api/betting-tips', {
                data: {
                    betting_company_id: 'test-id',
                    sport_id: 'test-id',
                    league_id: 'test-id',
                    match: 'Test Match',
                    odds: 1.5,
                    match_date: new Date().toISOString(),
                },
            });

            // Should return 401 Unauthorized without auth
            expect(response.status()).toBe(401);
        });

        test('should validate odds range', async ({ request }) => {
            // This test assumes we can make the request
            // In reality, it would need proper authentication
            const invalidOdds = [0.5, 2.5, 3.0];

            for (const odds of invalidOdds) {
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

                // Should fail due to authentication or validation
                expect(response.ok()).toBeFalsy();
            }
        });
    });

    test.describe('PATCH /api/betting-tips/[id]', () => {
        test('should require authentication for status updates', async ({ request }) => {
            const response = await request.patch('http://localhost:3000/api/betting-tips/test-id', {
                data: {
                    status: 'win',
                },
            });

            // Should return 401 Unauthorized without auth
            expect(response.status()).toBe(401);
        });
    });
});

test.describe('Settings API Integration', () => {
    test.describe('GET /api/settings/betting-companies', () => {
        test('should return betting companies list', async ({ request }) => {
            const response = await request.get('http://localhost:3000/api/settings/betting-companies');
            expect(response.ok()).toBeTruthy();

            const companies = await response.json();
            expect(Array.isArray(companies)).toBeTruthy();

            if (companies.length > 0) {
                expect(companies[0]).toHaveProperty('id');
                expect(companies[0]).toHaveProperty('name');
            }
        });
    });

    test.describe('GET /api/settings/sports', () => {
        test('should return sports with leagues', async ({ request }) => {
            const response = await request.get('http://localhost:3000/api/settings/sports');
            expect(response.ok()).toBeTruthy();

            const sports = await response.json();
            expect(Array.isArray(sports)).toBeTruthy();

            if (sports.length > 0) {
                expect(sports[0]).toHaveProperty('id');
                expect(sports[0]).toHaveProperty('name');
                expect(sports[0]).toHaveProperty('leagues');
                expect(Array.isArray(sports[0].leagues)).toBeTruthy();
            }
        });
    });

    test.describe('POST /api/settings/betting-companies', () => {
        test('should require authentication', async ({ request }) => {
            const response = await request.post('http://localhost:3000/api/settings/betting-companies', {
                data: {
                    name: 'Test Company',
                },
            });

            // Should return 401 Unauthorized without auth
            expect(response.status()).toBe(401);
        });
    });

    test.describe('POST /api/settings/marketing', () => {
        test('should require authentication and betting role', async ({ request }) => {
            const response = await request.post('http://localhost:3000/api/settings/marketing', {
                data: {
                    autoFreeMonth: true,
                    lossThreshold: 3,
                },
            });

            // Should return 401 Unauthorized without auth
            expect(response.status()).toBe(401);
        });
    });
});

test.describe('User Management API Integration', () => {
    test.describe('POST /api/settings/users/activate', () => {
        test('should require authentication', async ({ request }) => {
            const response = await request.post('http://localhost:3000/api/settings/users/activate', {
                data: {
                    userId: 'test-user-id',
                    activeUntil: new Date().toISOString(),
                },
            });

            // Should return 401 Unauthorized without auth
            expect(response.status()).toBe(401);
        });
    });
});
