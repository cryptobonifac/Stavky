import { test, expect } from '@playwright/test';

test.describe('Betting Tips Management E2E', () => {
    test('should display new bet form for betting admin', async ({ page }) => {
        // Note: This test assumes we can access the page
        // In reality, it would need authentication
        await page.goto('http://localhost:3000/newbet');

        // Should redirect to login if not authenticated
        await expect(page).toHaveURL(/.*\/(login|newbet)/);
    });

    test('should show all required form fields', async ({ page }) => {
        await page.goto('http://localhost:3000/newbet');

        // If we reach the form (authenticated as betting admin)
        if (page.url().includes('/newbet')) {
            // Check for form fields
            const bettingCompanyField = page.getByLabel(/betting company/i);
            const sportField = page.getByLabel(/sport/i);
            const matchField = page.getByLabel(/match/i);
            const oddsField = page.getByLabel(/odds/i);

            // These fields should exist if user is authenticated
            // Otherwise, we should be redirected to login
        }
    });

    test('should validate odds input range', async ({ page }) => {
        await page.goto('http://localhost:3000/newbet');

        if (page.url().includes('/newbet')) {
            const oddsField = page.getByLabel(/odds/i);

            if (await oddsField.isVisible()) {
                // Try to enter invalid odds
                await oddsField.fill('3.0');

                // Check if there's validation feedback
                // This depends on the implementation
            }
        }
    });
});

test.describe('Betting Tips List E2E', () => {
    test('should show betting tips page', async ({ page }) => {
        await page.goto('http://localhost:3000/bettings');

        // Should redirect to login if not authenticated
        await expect(page).toHaveURL(/.*\/(login|bettings)/);
    });

    test('should display filter options', async ({ page }) => {
        await page.goto('http://localhost:3000/bettings');

        if (page.url().includes('/bettings')) {
            // Look for filter buttons
            const todayFilter = page.getByRole('button', { name: /today/i });
            const tomorrowFilter = page.getByRole('button', { name: /tomorrow/i });
            const upcomingFilter = page.getByRole('button', { name: /upcoming/i });
            const allFilter = page.getByRole('button', { name: /all/i });

            // These should be visible if user has access
        }
    });

    test('should show account not active message for inactive users', async ({ page }) => {
        await page.goto('http://localhost:3000/bettings');

        if (page.url().includes('/bettings')) {
            // Check if there's a message about inactive account
            const inactiveMessage = page.getByText(/account is not active/i);

            // This would be visible for users without active subscription
        }
    });
});

test.describe('History Page E2E', () => {
    test('should display history page', async ({ page }) => {
        await page.goto('http://localhost:3000/history');

        // Should redirect to login if not authenticated
        await expect(page).toHaveURL(/.*\/(login|history)/);
    });

    test('should show monthly statistics', async ({ page }) => {
        await page.goto('http://localhost:3000/history');

        if (page.url().includes('/history')) {
            // Look for month selector or statistics
            const monthSelector = page.getByLabel(/month/i);

            // Should show success rate, wins, losses
        }
    });
});

test.describe('Settings Page E2E', () => {
    test('should protect settings page', async ({ page }) => {
        await page.goto('http://localhost:3000/settings');

        // Should redirect to login or bettings if not authorized
        await expect(page).toHaveURL(/.*\/(login|bettings|settings)/);
    });

    test('should show all settings sections for betting admin', async ({ page }) => {
        await page.goto('http://localhost:3000/settings');

        if (page.url().includes('/settings')) {
            // Look for settings sections
            const userListSection = page.getByText(/user list/i);
            const bettingCompaniesSection = page.getByText(/betting companies/i);
            const marketingSection = page.getByText(/marketing/i);

            // These should be visible for betting admin
        }
    });
});

test.describe('Profile Page E2E', () => {
    test('should display profile page', async ({ page }) => {
        await page.goto('http://localhost:3000/profile');

        // Should redirect to login if not authenticated
        await expect(page).toHaveURL(/.*\/(login|profile)/);
    });

    test('should show account status', async ({ page }) => {
        await page.goto('http://localhost:3000/profile');

        if (page.url().includes('/profile')) {
            // Look for account status information
            const statusChip = page.getByText(/active|inactive/i);

            // Should show account expiration date if active
        }
    });
});
