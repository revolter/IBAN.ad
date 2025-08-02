import { test, expect } from '@playwright/test';

test.describe('Language and Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch between English and Romanian', async ({ page }) => {
    // Default is English
    await expect(page.locator('#lang-select')).toHaveValue('en');
    await expect(page.getByRole('heading')).toContainText('IBAN Information');
    await expect(page.locator('label[for="name"]')).toContainText('Account Holder Name');
    
    // Switch to Romanian
    await page.selectOption('#lang-select', 'ro');
    await expect(page.getByRole('heading')).toContainText('Informații IBAN');
    await expect(page.locator('label[for="name"]')).toContainText('Nume titular cont');
    
    // Switch back to English
    await page.selectOption('#lang-select', 'en');
    await expect(page.getByRole('heading')).toContainText('IBAN Information');
    await expect(page.locator('label[for="name"]')).toContainText('Account Holder Name');
  });

  test('should preserve form data when switching languages', async ({ page }) => {
    // Fill form
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('#name').fill('Test User');
    await page.locator('#details').fill('Test payment');
    
    // Switch language
    await page.selectOption('#lang-select', 'ro');
    
    // Data should be preserved
    await expect(page.locator('#iban')).toHaveValue('DE89370400440532013000');
    await expect(page.locator('#name')).toHaveValue('Test User');
    await expect(page.locator('#details')).toHaveValue('Test payment');
    
    // But labels should be in Romanian
    await expect(page.locator('label[for="name"]')).toContainText('Nume titular cont');
  });

  test('should have proper aria labels and accessibility attributes', async ({ page }) => {
    // Check ARIA labels
    await expect(page.locator('#iban')).toHaveAttribute('aria-label', 'IBAN');
    await expect(page.locator('#name')).toHaveAttribute('aria-label', 'Account Holder Name');
    await expect(page.locator('#details')).toHaveAttribute('aria-label', 'Transaction Details');
    
    // Check copy button ARIA labels
    await expect(page.locator('.copy-btn[data-copytarget="iban"]')).toHaveAttribute('aria-label', 'Copy IBAN');
    await expect(page.locator('.copy-btn[data-copytarget="name"]')).toHaveAttribute('aria-label', 'Copy Account Holder Name');
    await expect(page.locator('.copy-btn[data-copytarget="details"]')).toHaveAttribute('aria-label', 'Copy Transaction Details');
    
    // Check form structure
    await expect(page.locator('form')).toHaveAttribute('aria-describedby', 'iban-info-desc');
    await expect(page.locator('#iban-info-desc')).toHaveClass(/sr-only/);
  });

  test('should have skip link for accessibility', async ({ page }) => {
    const skipLink = page.locator('#skip-link');
    await expect(skipLink).toHaveAttribute('href', '#iban-info-title');
    await expect(skipLink).toHaveClass(/sr-only/);
    
    // Skip link should become visible when focused
    await skipLink.focus();
    await expect(skipLink).toHaveClass(/focus:not-sr-only/);
  });

  test('should announce language changes to screen readers', async ({ page }) => {
    // Check that announcer element exists
    const announcer = page.locator('#a11y-announcer');
    await expect(announcer).toHaveAttribute('aria-live', 'polite');
    await expect(announcer).toHaveAttribute('aria-atomic', 'true');
    await expect(announcer).toHaveClass(/sr-only/);
  });

  test('should maintain lang attribute on html element', async ({ page }) => {
    // Default is English
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    
    // Switch to Romanian
    await page.selectOption('#lang-select', 'ro');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
    
    // Switch back to English  
    await page.selectOption('#lang-select', 'en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab'); // Language select
    await expect(page.locator('#lang-select')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Clear form button
    await expect(page.locator('#clear-form-btn')).toBeFocused();
    
    await page.keyboard.press('Tab'); // IBAN field
    await expect(page.locator('#iban')).toBeFocused();
    
    await page.keyboard.press('Tab'); // IBAN copy button
    await expect(page.locator('.copy-btn[data-copytarget="iban"]')).toBeFocused();
  });

  test('should support high contrast mode', async ({ page }) => {
    // Check that essential interactive elements have proper focus indicators
    const focusableElements = [
      '#iban',
      '#name', 
      '#details',
      '.copy-btn[data-copytarget="iban"]',
      '#permalink-btn',
      '#lang-select'
    ];
    
    for (const selector of focusableElements) {
      await page.locator(selector).focus();
      await expect(page.locator(selector)).toHaveCSS('outline-style', 'auto', { timeout: 1000 });
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Should have main h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('IBAN Information');
    await expect(h1).toHaveAttribute('id', 'iban-info-title');
    
    // No other heading levels should be present initially
    await expect(page.locator('h2, h3, h4, h5, h6')).toHaveCount(0);
  });

  test('should work with screen reader simulation', async ({ page }) => {
    // Test that form elements are properly labeled for screen readers
    await page.locator('#iban').fill('DE89370400440532013000');
    
    // Check that the field has proper labeling relationship
    const ibanLabel = page.locator('label[for="iban"]');
    await expect(ibanLabel).toBeVisible();
    await expect(ibanLabel).toContainText('IBAN');
    
    // Suggestion text should be properly associated
    const suggestion = page.locator('#name-suggestion');
    await expect(suggestion).toBeVisible();
    await expect(suggestion).toContainText('Tip:');
  });
});