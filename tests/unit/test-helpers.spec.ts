import { test, expect } from '@playwright/test';
import {
    isValidOdds,
    isValidEmail,
    formatMatchDate,
    isAccountActive,
    calculateSuccessRate,
    generateFutureDate,
    generatePastDate,
} from '../utils/test-helpers';

test.describe('Test Helper Utilities', () => {
    test.describe('isValidOdds', () => {
        test('should validate correct odds range', () => {
            expect(isValidOdds(1.001)).toBe(true);
            expect(isValidOdds(1.5)).toBe(true);
            expect(isValidOdds(2.0)).toBe(true);
        });

        test('should reject invalid odds', () => {
            expect(isValidOdds(0.5)).toBe(false);
            expect(isValidOdds(1.0)).toBe(false);
            expect(isValidOdds(2.001)).toBe(false);
            expect(isValidOdds(3.0)).toBe(false);
        });
    });

    test.describe('isValidEmail', () => {
        test('should validate correct email formats', () => {
            expect(isValidEmail('user@example.com')).toBe(true);
            expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
            expect(isValidEmail('name+tag@company.org')).toBe(true);
        });

        test('should reject invalid email formats', () => {
            expect(isValidEmail('notanemail')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });
    });

    test.describe('formatMatchDate', () => {
        test('should format date correctly', () => {
            const date = new Date('2024-12-04T15:30:00Z');
            const formatted = formatMatchDate(date);

            expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/);
        });

        test('should handle string dates', () => {
            const formatted = formatMatchDate('2024-12-04T15:30:00Z');

            expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/);
        });

        test('should pad single digits correctly', () => {
            const date = new Date('2024-01-05T09:05:00Z');
            const formatted = formatMatchDate(date);

            // Should have proper padding
            expect(formatted).toMatch(/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/);
        });
    });

    test.describe('isAccountActive', () => {
        test('should return true for future dates', () => {
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 1);

            expect(isAccountActive(futureDate.toISOString())).toBe(true);
        });

        test('should return false for past dates', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);

            expect(isAccountActive(pastDate.toISOString())).toBe(false);
        });

        test('should return false for null', () => {
            expect(isAccountActive(null)).toBe(false);
        });
    });

    test.describe('calculateSuccessRate', () => {
        test('should calculate success rate correctly', () => {
            expect(calculateSuccessRate(7, 3)).toBe(70);
            expect(calculateSuccessRate(5, 5)).toBe(50);
            expect(calculateSuccessRate(10, 0)).toBe(100);
            expect(calculateSuccessRate(0, 10)).toBe(0);
        });

        test('should return null for no tips', () => {
            expect(calculateSuccessRate(0, 0)).toBeNull();
        });

        test('should handle decimal results', () => {
            const rate = calculateSuccessRate(2, 3);
            expect(rate).toBeCloseTo(40, 0);
        });
    });

    test.describe('generateFutureDate', () => {
        test('should generate future date', () => {
            const futureDate = generateFutureDate(1);
            const date = new Date(futureDate);

            expect(date > new Date()).toBe(true);
        });

        test('should generate date N months ahead', () => {
            const threeMonthsAhead = generateFutureDate(3);
            const date = new Date(threeMonthsAhead);
            const now = new Date();

            const monthsDiff = (date.getFullYear() - now.getFullYear()) * 12 +
                (date.getMonth() - now.getMonth());

            expect(monthsDiff).toBe(3);
        });
    });

    test.describe('generatePastDate', () => {
        test('should generate past date', () => {
            const pastDate = generatePastDate(1);
            const date = new Date(pastDate);

            expect(date < new Date()).toBe(true);
        });

        test('should generate date N days ago', () => {
            const sevenDaysAgo = generatePastDate(7);
            const date = new Date(sevenDaysAgo);
            const now = new Date();

            const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

            expect(daysDiff).toBeGreaterThanOrEqual(6);
            expect(daysDiff).toBeLessThanOrEqual(7);
        });
    });
});
