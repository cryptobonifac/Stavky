import { test, expect } from '@playwright/test';

test.describe('Sports API', () => {
    test('should return seeded sports with leagues', async ({ request }) => {
        const response = await request.get('http://localhost:3000/api/settings/sports');
        expect(response.ok()).toBeTruthy();

        const sports = await response.json();
        expect(Array.isArray(sports)).toBeTruthy();
        // At least the five seeded sports should be present
        expect(sports.length).toBeGreaterThanOrEqual(5);

        for (const sport of sports) {
            expect(sport).toHaveProperty('id');
            expect(sport).toHaveProperty('name');
            expect(sport).toHaveProperty('leagues');
            expect(Array.isArray(sport.leagues)).toBeTruthy();

            for (const league of sport.leagues) {
                expect(league).toHaveProperty('id');
                expect(league).toHaveProperty('name');
            }
        }
    });
});
