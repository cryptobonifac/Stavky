import { test, expect } from '@playwright/test';

test.describe('Betting Companies API', () => {
    test('should return seeded betting companies', async ({ request }) => {
        const response = await request.get('http://localhost:3000/api/settings/betting-companies');
        expect(response.ok()).toBeTruthy();

        const data = await response.json();
        expect(Array.isArray(data)).toBeTruthy();
        // At least the four seeded companies should be present
        expect(data.length).toBeGreaterThanOrEqual(4);

        for (const company of data) {
            expect(company).toHaveProperty('id');
            expect(company).toHaveProperty('name');
            expect(typeof company.name).toBe('string');
        }
    });
});
