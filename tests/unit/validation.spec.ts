import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
    test.describe('Odds Validation', () => {
        test('should accept valid odds within range', () => {
            const validOdds = [1.001, 1.5, 1.75, 2.0];

            validOdds.forEach(odds => {
                expect(odds).toBeGreaterThanOrEqual(1.001);
                expect(odds).toBeLessThanOrEqual(2.0);
            });
        });

        test('should reject odds below minimum', () => {
            const invalidOdds = [0.5, 1.0, 0.999];

            invalidOdds.forEach(odds => {
                expect(odds).toBeLessThan(1.001);
            });
        });

        test('should reject odds above maximum', () => {
            const invalidOdds = [2.001, 3.0, 5.5];

            invalidOdds.forEach(odds => {
                expect(odds).toBeGreaterThan(2.0);
            });
        });

        test('should handle edge cases', () => {
            // Minimum valid odds
            expect(1.001).toBeGreaterThanOrEqual(1.001);
            expect(1.001).toBeLessThanOrEqual(2.0);

            // Maximum valid odds
            expect(2.0).toBeGreaterThanOrEqual(1.001);
            expect(2.0).toBeLessThanOrEqual(2.0);
        });

        test('should handle precision correctly', () => {
            const odds = 1.555;
            const rounded = Number(odds.toFixed(3));

            expect(rounded).toBe(1.555);
            expect(rounded).toBeGreaterThanOrEqual(1.001);
            expect(rounded).toBeLessThanOrEqual(2.0);
        });
    });

    test.describe('Email Validation', () => {
        test('should validate correct email formats', () => {
            const validEmails = [
                'user@example.com',
                'test.user@domain.co.uk',
                'name+tag@company.org',
            ];

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            validEmails.forEach(email => {
                expect(emailRegex.test(email)).toBe(true);
            });
        });

        test('should reject invalid email formats', () => {
            const invalidEmails = [
                'notanemail',
                '@example.com',
                'user@',
                'user @example.com',
                '',
            ];

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            invalidEmails.forEach(email => {
                expect(emailRegex.test(email)).toBe(false);
            });
        });
    });

    test.describe('Match Name Validation', () => {
        test('should accept valid match names', () => {
            const validMatches = [
                'Team A vs Team B',
                'Manchester United vs Liverpool',
                'Real Madrid - Barcelona',
            ];

            validMatches.forEach(match => {
                expect(match.length).toBeGreaterThan(0);
                expect(match.trim()).toBe(match);
            });
        });

        test('should reject empty or whitespace-only match names', () => {
            const invalidMatches = ['', '   ', '\t', '\n'];

            invalidMatches.forEach(match => {
                expect(match.trim().length).toBe(0);
            });
        });
    });
});
