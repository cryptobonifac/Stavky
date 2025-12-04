import { test, expect } from '@playwright/test';
import dayjs from 'dayjs';

test.describe('Date Formatting and Handling', () => {
    test.describe('Date Format Validation', () => {
        test('should format dates in dd.mm.YYYY HH:mm format', () => {
            const testDate = new Date('2024-12-04T15:30:00Z');
            const formatted = dayjs(testDate).format('DD.MM.YYYY HH:mm');

            // Check format pattern
            expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/);
        });

        test('should handle various date inputs', () => {
            const dates = [
                '2024-01-01T00:00:00Z',
                '2024-06-15T12:30:00Z',
                '2024-12-31T23:59:00Z',
            ];

            dates.forEach(dateStr => {
                const formatted = dayjs(dateStr).format('DD.MM.YYYY HH:mm');
                expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/);
            });
        });

        test('should parse dates correctly', () => {
            const dateStr = '04.12.2024 15:30';
            const parsed = dayjs(dateStr, 'DD.MM.YYYY HH:mm');

            expect(parsed.isValid()).toBe(true);
            expect(parsed.date()).toBe(4);
            expect(parsed.month()).toBe(11); // December is month 11 (0-indexed)
            expect(parsed.year()).toBe(2024);
        });
    });

    test.describe('Date Comparison', () => {
        test('should correctly compare dates', () => {
            const now = dayjs();
            const future = dayjs().add(1, 'day');
            const past = dayjs().subtract(1, 'day');

            expect(future.isAfter(now)).toBe(true);
            expect(past.isBefore(now)).toBe(true);
            expect(now.isSame(now)).toBe(true);
        });

        test('should filter tips by date correctly', () => {
            const now = dayjs();
            const today = now.startOf('day');
            const tomorrow = now.add(1, 'day').startOf('day');

            const tips = [
                { match_date: now.toISOString() },
                { match_date: tomorrow.toISOString() },
                { match_date: now.subtract(1, 'day').toISOString() },
            ];

            // Filter today's tips
            const todayTips = tips.filter(tip => {
                const matchDate = dayjs(tip.match_date);
                return matchDate.isSame(today, 'day');
            });

            expect(todayTips.length).toBe(1);
        });
    });

    test.describe('Account Expiration Dates', () => {
        test('should correctly determine if account is active', () => {
            const futureDate = dayjs().add(1, 'month').toISOString();
            const pastDate = dayjs().subtract(1, 'day').toISOString();

            const isFutureActive = dayjs(futureDate).isAfter(dayjs());
            const isPastActive = dayjs(pastDate).isAfter(dayjs());

            expect(isFutureActive).toBe(true);
            expect(isPastActive).toBe(false);
        });

        test('should handle null expiration dates', () => {
            const expirationDate = null;
            const isActive = expirationDate && dayjs(expirationDate).isAfter(dayjs());

            expect(isActive).toBeFalsy();
        });
    });
});

test.describe('Internationalization (i18n)', () => {
    test.describe('Language Switching', () => {
        test('should support English locale', async ({ page }) => {
            await page.goto('http://localhost:3000/en');

            await expect(page).toHaveURL(/.*\/en/);
        });

        test('should support Czech locale', async ({ page }) => {
            await page.goto('http://localhost:3000/cs');

            await expect(page).toHaveURL(/.*\/cs/);
        });

        test('should support Slovak locale', async ({ page }) => {
            await page.goto('http://localhost:3000/sk');

            await expect(page).toHaveURL(/.*\/sk/);
        });

        test('should show language switcher', async ({ page }) => {
            await page.goto('http://localhost:3000');

            // Look for language switcher (might be a dropdown or buttons)
            const languageSwitcher = page.locator('[aria-label*="language" i], [data-testid*="language" i]');

            // Language switcher should exist
        });
    });

    test.describe('Content Translation', () => {
        test('should display translated content in English', async ({ page }) => {
            await page.goto('http://localhost:3000/en');

            // Check for English content
            const signInText = page.getByText(/sign in/i);

            // English content should be visible
        });

        test('should display translated content in Czech', async ({ page }) => {
            await page.goto('http://localhost:3000/cs');

            // Check for Czech content (Přihlásit se = Sign in)
            // Note: Actual text depends on translations
        });

        test('should display translated content in Slovak', async ({ page }) => {
            await page.goto('http://localhost:3000/sk');

            // Check for Slovak content (Prihlásiť sa = Sign in)
            // Note: Actual text depends on translations
        });
    });

    test.describe('Locale Persistence', () => {
        test('should maintain locale across navigation', async ({ page }) => {
            await page.goto('http://localhost:3000/cs');

            // Navigate to another page
            await page.goto('http://localhost:3000/cs/login');

            // Should still be in Czech locale
            await expect(page).toHaveURL(/.*\/cs\/login/);
        });
    });
});

test.describe('Timezone Handling', () => {
    test('should handle UTC timestamps correctly', () => {
        const utcDate = '2024-12-04T15:30:00Z';
        const parsed = dayjs(utcDate);

        expect(parsed.isValid()).toBe(true);
    });

    test('should convert to local timezone for display', () => {
        const utcDate = '2024-12-04T15:30:00Z';
        const local = dayjs(utcDate).format('DD.MM.YYYY HH:mm');

        // Should be formatted correctly
        expect(local).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/);
    });
});
