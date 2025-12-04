/**
 * Test Utilities
 * 
 * Common helper functions and utilities for testing
 */

import { Page } from '@playwright/test';

/**
 * Helper to check if a user is redirected to login
 */
export async function expectLoginRedirect(page: Page) {
    const url = page.url();
    return url.includes('/login');
}

/**
 * Helper to check if a user is on a specific locale
 */
export function expectLocale(url: string, locale: 'en' | 'cs' | 'sk') {
    return url.includes(`/${locale}`);
}

/**
 * Mock betting tip data for testing
 */
export const mockBettingTip = {
    betting_company_id: '00000000-0000-0000-0000-000000000001',
    sport_id: '00000000-0000-0000-0000-000000000002',
    league_id: '00000000-0000-0000-0000-000000000003',
    match: 'Team A vs Team B',
    odds: 1.5,
    match_date: new Date().toISOString(),
};

/**
 * Mock user data for testing
 */
export const mockUsers = {
    bettingAdmin: {
        email: 'admin@test.com',
        password: 'TestPassword123!',
        role: 'betting',
    },
    customer: {
        email: 'customer@test.com',
        password: 'TestPassword123!',
        role: 'customer',
    },
    inactiveCustomer: {
        email: 'inactive@test.com',
        password: 'TestPassword123!',
        role: 'customer',
        account_active_until: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
};

/**
 * Mock betting company data
 */
export const mockBettingCompanies = [
    { id: '1', name: 'Bet365' },
    { id: '2', name: 'Fortuna' },
    { id: '3', name: 'Nike' },
    { id: '4', name: 'Tipsport' },
];

/**
 * Mock sports data with leagues
 */
export const mockSports = [
    {
        id: '1',
        name: 'Football',
        leagues: [
            { id: '1-1', name: 'Premier League' },
            { id: '1-2', name: 'La Liga' },
        ],
    },
    {
        id: '2',
        name: 'Basketball',
        leagues: [
            { id: '2-1', name: 'NBA' },
            { id: '2-2', name: 'EuroLeague' },
        ],
    },
];

/**
 * Validate odds range (1.001 to 2.00)
 */
export function isValidOdds(odds: number): boolean {
    return odds >= 1.001 && odds <= 2.0;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Format date in dd.mm.YYYY HH:mm format
 */
export function formatMatchDate(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Check if account is active
 */
export function isAccountActive(activeUntil: string | null): boolean {
    if (!activeUntil) return false;
    return new Date(activeUntil) > new Date();
}

/**
 * Calculate success rate
 */
export function calculateSuccessRate(wins: number, losses: number): number | null {
    const total = wins + losses;
    if (total === 0) return null;
    return (wins / total) * 100;
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
    page: Page,
    urlPattern: string | RegExp,
    timeout = 5000
) {
    return page.waitForResponse(
        (response) => {
            const url = response.url();
            if (typeof urlPattern === 'string') {
                return url.includes(urlPattern);
            }
            return urlPattern.test(url);
        },
        { timeout }
    );
}

/**
 * Generate future date for account activation
 */
export function generateFutureDate(monthsAhead = 1): string {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsAhead);
    return date.toISOString();
}

/**
 * Generate past date for expired account
 */
export function generatePastDate(daysAgo = 1): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
}

/**
 * Test data cleanup helper
 */
export const testDataCleanup = {
    bettingTipIds: [] as string[],
    userIds: [] as string[],
    companyIds: [] as string[],

    addBettingTip(id: string) {
        this.bettingTipIds.push(id);
    },

    addUser(id: string) {
        this.userIds.push(id);
    },

    addCompany(id: string) {
        this.companyIds.push(id);
    },

    reset() {
        this.bettingTipIds = [];
        this.userIds = [];
        this.companyIds = [];
    },
};
