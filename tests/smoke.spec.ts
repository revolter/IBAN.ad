import { test, expect } from '@playwright/test';

test.describe('Basic Smoke Tests', () => {
  test('should load the page successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('IBAN Information');
    await expect(page.getByRole('heading', { name: 'IBAN Information' })).toBeVisible();
  });

  test('should show IBAN field', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#iban')).toBeVisible();
  });
});