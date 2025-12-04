import { test, expect } from '@playwright/test';
import { hasRole, canManageBets, canViewCustomerContent } from '../../lib/auth/roles';

test.describe('Role Utility Functions', () => {
    test.describe('hasRole', () => {
        test('should return true when role matches expected', () => {
            expect(hasRole('betting', 'betting')).toBe(true);
            expect(hasRole('customer', 'customer')).toBe(true);
        });

        test('should return false when role does not match expected', () => {
            expect(hasRole('customer', 'betting')).toBe(false);
            expect(hasRole('betting', 'customer')).toBe(false);
        });

        test('should handle null and undefined roles', () => {
            expect(hasRole(null, 'betting')).toBe(false);
            expect(hasRole(undefined, 'betting')).toBe(false);
        });

        test('should handle empty string role', () => {
            expect(hasRole('', 'betting')).toBe(false);
        });
    });

    test.describe('canManageBets', () => {
        test('should return true for betting role', () => {
            expect(canManageBets('betting')).toBe(true);
        });

        test('should return false for customer role', () => {
            expect(canManageBets('customer')).toBe(false);
        });

        test('should return false for null and undefined', () => {
            expect(canManageBets(null)).toBe(false);
            expect(canManageBets(undefined)).toBe(false);
        });
    });

    test.describe('canViewCustomerContent', () => {
        test('should return true for betting role', () => {
            expect(canViewCustomerContent('betting')).toBe(true);
        });

        test('should return true for customer role', () => {
            expect(canViewCustomerContent('customer')).toBe(true);
        });

        test('should return false for null and undefined', () => {
            expect(canViewCustomerContent(null)).toBe(false);
            expect(canViewCustomerContent(undefined)).toBe(false);
        });

        test('should return false for invalid roles', () => {
            expect(canViewCustomerContent('admin')).toBe(false);
            expect(canViewCustomerContent('')).toBe(false);
        });
    });
});
