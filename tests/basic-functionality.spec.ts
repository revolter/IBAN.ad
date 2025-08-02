import { test, expect } from '@playwright/test';

test.describe('Basic IBAN Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page with correct title and heading', async ({ page }) => {
    await expect(page).toHaveTitle('IBAN Information');
    await expect(page.getByRole('heading', { name: 'IBAN Information' })).toBeVisible();
  });

  test('should have all required form fields', async ({ page }) => {
    await expect(page.locator('#iban')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible(); 
    await expect(page.locator('#details')).toBeVisible();
  });

  test('should enable copy button when IBAN field has content', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const copyButton = page.locator('.copy-btn[data-copytarget="iban"]');
    
    // Initially disabled
    await expect(copyButton).toBeDisabled();
    
    // Enter IBAN and check button is enabled
    await ibanField.fill('DE89370400440532013000');
    await expect(copyButton).toBeEnabled();
    
    // Clear field and check button is disabled again
    await ibanField.clear();
    await expect(copyButton).toBeDisabled();
  });

  test('should show add button when IBAN field has content', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    // Initially hidden
    await expect(addButton).toBeHidden();
    
    // Enter IBAN and check button appears
    await ibanField.fill('DE89370400440532013000');
    await expect(addButton).toBeVisible();
    
    // Clear field and check button disappears
    await ibanField.clear();
    await expect(addButton).toBeHidden();
  });

  test('should copy IBAN to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const ibanField = page.locator('#iban');
    const copyButton = page.locator('.copy-btn[data-copytarget="iban"]');
    const testIban = 'DE89370400440532013000';
    
    await ibanField.fill(testIban);
    await copyButton.click();
    
    // Check clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(testIban);
    
    // Check tooltip appears
    const tooltip = page.locator('#tooltip-iban');
    await expect(tooltip).toHaveClass(/opacity-100/);
  });

  test('should show copied tooltip feedback', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const copyButton = page.locator('.copy-btn[data-copytarget="iban"]');
    const tooltip = page.locator('#tooltip-iban');
    
    await ibanField.fill('DE89370400440532013000');
    await copyButton.click();
    
    // Tooltip should appear and then disappear
    await expect(tooltip).toHaveClass(/opacity-100/);
    await expect(tooltip).toHaveClass(/opacity-0/, { timeout: 3000 });
  });

  test('should handle all form fields independently', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const fields = [
      { id: '#iban', value: 'DE89370400440532013000', target: 'iban' },
      { id: '#name', value: 'John Doe', target: 'name' },
      { id: '#details', value: 'Donation payment', target: 'details' }
    ];
    
    for (const field of fields) {
      await page.locator(field.id).fill(field.value);
      const copyButton = page.locator(`.copy-btn[data-copytarget="${field.target}"]`);
      await copyButton.click();
      
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toBe(field.value);
    }
  });
});