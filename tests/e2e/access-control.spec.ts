import { test, expect } from '@playwright/test';

test.describe('Role-Based Access Control E2E', () => {
    test.describe('Public Access', () => {
        test('should allow access to home page without authentication', async ({ page }) => {
            await page.goto('http://localhost:3000');

            await expect(page).toHaveURL(/.*\/(en|cs|sk)?\/?$/);

            // Should show sign in and sign up buttons
            const signInButton = page.getByRole('link', { name: /sign in/i }).first();
            const signUpButton = page.getByRole('link', { name: /sign up/i }).first();

            await expect(signInButton).toBeVisible();
            await expect(signUpButton).toBeVisible();
        });

        test('should allow access to login page', async ({ page }) => {
            await page.goto('http://localhost:3000/login');

            await expect(page).toHaveURL(/.*\/login/);
            await expect(page.getByLabel('Email')).toBeVisible();
            await expect(page.getByLabel('Password')).toBeVisible();
        });

        test('should allow access to signup page', async ({ page }) => {
            await page.goto('http://localhost:3000/signup');

            await expect(page).toHaveURL(/.*\/signup/);
            await expect(page.getByLabel('Email')).toBeVisible();
            await expect(page.getByLabel('Password')).toBeVisible();
        });
    });

    test.describe('Customer Role Access', () => {
        test('should redirect to login when accessing bettings without auth', async ({ page }) => {
            await page.goto('http://localhost:3000/bettings');

            // Should redirect to login
            await expect(page).toHaveURL(/.*\/login/);
        });

        test('should redirect to login when accessing profile without auth', async ({ page }) => {
            await page.goto('http://localhost:3000/profile');

            // Should redirect to login
            await expect(page).toHaveURL(/.*\/login/);
        });

        test('should redirect to login when accessing history without auth', async ({ page }) => {
            await page.goto('http://localhost:3000/history');

            // Should redirect to login
            await expect(page).toHaveURL(/.*\/login/);
        });
    });

    test.describe('Betting Admin Role Access', () => {
        test('should redirect to login when accessing newbet without auth', async ({ page }) => {
            await page.goto('http://localhost:3000/newbet');

            // Should redirect to login
            await expect(page).toHaveURL(/.*\/login/);
        });

        test('should redirect to login when accessing settings without auth', async ({ page }) => {
            await page.goto('http://localhost:3000/settings');

            // Should redirect to login or bettings
            await expect(page).toHaveURL(/.*\/(login|bettings)/);
        });

        test('should redirect to login when accessing manage without auth', async ({ page }) => {
            await page.goto('http://localhost:3000/manage');

            // Should redirect to login
            await expect(page).toHaveURL(/.*\/login/);
        });
    });

    test.describe('Navigation Visibility', () => {
        test('should show appropriate navigation for unauthenticated users', async ({ page }) => {
            await page.goto('http://localhost:3000');

            // Should show sign in and sign up
            const signInLink = page.getByRole('link', { name: /sign in/i }).first();
            const signUpLink = page.getByRole('link', { name: /sign up/i }).first();

            await expect(signInLink).toBeVisible();
            await expect(signUpLink).toBeVisible();

            // Should not show settings link
            const settingsLink = page.getByRole('link', { name: /settings/i });
            await expect(settingsLink).not.toBeVisible();
        });
    });

    test.describe('API Endpoint Protection', () => {
        test('should protect betting tips creation endpoint', async ({ request }) => {
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

            expect(response.status()).toBe(401);
        });

        test('should protect user activation endpoint', async ({ request }) => {
            const response = await request.post('http://localhost:3000/api/settings/users/activate', {
                data: {
                    userId: 'test-user-id',
                    activeUntil: new Date().toISOString(),
                },
            });

            expect(response.status()).toBe(401);
        });

        test('should protect marketing settings endpoint', async ({ request }) => {
            const response = await request.post('http://localhost:3000/api/settings/marketing', {
                data: {
                    autoFreeMonth: true,
                    lossThreshold: 3,
                },
            });

            expect(response.status()).toBe(401);
        });

        test('should protect betting company creation endpoint', async ({ request }) => {
            const response = await request.post('http://localhost:3000/api/settings/betting-companies', {
                data: {
                    name: 'Test Company',
                },
            });

            expect(response.status()).toBe(401);
        });

        test('should protect tip evaluation endpoint', async ({ request }) => {
            const response = await request.patch('http://localhost:3000/api/betting-tips/test-id', {
                data: {
                    status: 'win',
                },
            });

            expect(response.status()).toBe(401);
        });
    });
});
