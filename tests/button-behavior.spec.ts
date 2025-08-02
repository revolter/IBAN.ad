import { test, expect } from '@playwright/test';

test.describe('Button Visibility and Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should properly manage button visibility states', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    const copyButton = page.locator('.copy-btn[data-copytarget="iban"]');
    
    // Initially both buttons should be in disabled/hidden state
    await expect(addButton).toBeHidden();
    await expect(copyButton).toBeDisabled();
    
    // Enter text to activate buttons
    await ibanField.fill('DE89370400440532013000');
    await expect(addButton).toBeVisible();
    await expect(copyButton).toBeEnabled();
    
    // Partially clear to test responsiveness
    await ibanField.fill('DE89');
    await expect(addButton).toBeVisible();
    await expect(copyButton).toBeEnabled();
    
    // Completely clear
    await ibanField.clear();
    await expect(addButton).toBeHidden();
    await expect(copyButton).toBeDisabled();
  });

  test('should permanently hide add button after conversion', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    // Fill and convert
    await ibanField.fill('DE89370400440532013000');
    await addButton.click();
    
    // Button should be hidden after conversion
    await expect(addButton).toBeHidden();
    
    // Even after filling both currency and IBAN, button should stay hidden
    const currencyField = page.locator('#currency-0');
    const renamedIbanField = page.locator('#iban-0');
    
    await currencyField.fill('EUR');
    await expect(addButton).toBeHidden();
    
    await renamedIbanField.clear();
    await renamedIbanField.fill('FR1420041010050500013M02606');
    await expect(addButton).toBeHidden();
  });

  test('should show add button only on last row with complete data', async ({ page }) => {
    // Create multi-currency setup
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    await page.locator('#currency-0').fill('EUR');
    
    // Fill second row partially
    await page.locator('#currency-1').fill('USD');
    
    const addButton0 = page.locator('.add-row-btn[data-row-index="0"]');
    const addButton1 = page.locator('.add-row-btn[data-row-index="1"]');
    
    // Row 0 should not show add button (not last row)
    await expect(addButton0).toBeHidden();
    
    // Row 1 should not show add button (incomplete data)
    await expect(addButton1).toBeHidden();
    
    // Complete row 1
    await page.locator('#iban-1').fill('US64SVBKUS6S3300958579');
    
    // Now row 1 should show add button
    await expect(addButton1).toBeVisible();
    await expect(addButton0).toBeHidden();
  });

  test('should handle button transitions smoothly', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    // Test rapid typing
    await ibanField.type('DE89370400440532013000', { delay: 50 });
    await expect(addButton).toBeVisible();
    
    // Test rapid clearing
    await ibanField.selectText();
    await page.keyboard.press('Delete');
    await expect(addButton).toBeHidden();
    
    // Test partial fill and clear
    await ibanField.type('DE89', { delay: 50 });
    await expect(addButton).toBeVisible();
    
    await ibanField.selectText();
    await page.keyboard.press('Backspace');
    await expect(addButton).toBeHidden();
  });

  test('should handle button states across multiple deletions', async ({ page }) => {
    // Create multiple rows
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    await page.locator('#currency-0').fill('EUR');
    
    await page.locator('#currency-1').fill('USD');
    await page.locator('#iban-1').fill('US64SVBKUS6S3300958579');
    await page.locator('.add-row-btn[data-row-index="1"]').click();
    
    await page.locator('#currency-2').fill('GBP');
    await page.locator('#iban-2').fill('GB29NWBK60161331926819');
    
    // Delete buttons should appear correctly
    const deleteButton2 = page.locator('.delete-row-btn[data-row-index="2"]');
    const deleteButton1 = page.locator('.delete-row-btn[data-row-index="1"]');
    const deleteButton0 = page.locator('.delete-row-btn[data-row-index="0"]');
    
    await expect(deleteButton2).toBeVisible();
    await expect(deleteButton1).toBeHidden();
    await expect(deleteButton0).toBeHidden();
    
    // Delete row 2
    await deleteButton2.click();
    
    // Delete button should move to row 1
    await expect(deleteButton1).toBeVisible();
    await expect(deleteButton0).toBeHidden();
    
    // Add button should appear on row 1 since it's now the last row
    const addButton1 = page.locator('.add-row-btn[data-row-index="1"]');
    await expect(addButton1).toBeVisible();
  });

  test('should handle edge case of clearing required fields', async ({ page }) => {
    // Create multi-currency row
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    await page.locator('#currency-0').fill('EUR');
    
    // Fill second row
    await page.locator('#currency-1').fill('USD');
    await page.locator('#iban-1').fill('US64SVBKUS6S3300958579');
    
    const addButton1 = page.locator('.add-row-btn[data-row-index="1"]');
    const copyButton1 = page.locator('.copy-btn[data-row-index="1"]');
    
    // Both buttons should be active
    await expect(addButton1).toBeVisible();
    await expect(copyButton1).toBeEnabled();
    
    // Clear currency field
    await page.locator('#currency-1').clear();
    
    // Buttons should become inactive
    await expect(addButton1).toBeHidden();
    await expect(copyButton1).toBeDisabled();
    
    // Refill currency
    await page.locator('#currency-1').fill('USD');
    
    // Buttons should become active again
    await expect(addButton1).toBeVisible();
    await expect(copyButton1).toBeEnabled();
  });

  test('should handle button styling for disabled states', async ({ page }) => {
    const copyButton = page.locator('.copy-btn[data-copytarget="iban"]');
    
    // Check disabled styling
    await expect(copyButton).toHaveClass(/opacity-50/);
    await expect(copyButton).toHaveClass(/cursor-not-allowed/);
    
    // Enable button
    await page.locator('#iban').fill('DE89370400440532013000');
    
    // Check enabled styling
    await expect(copyButton).not.toHaveClass(/opacity-50/);
    await expect(copyButton).not.toHaveClass(/cursor-not-allowed/);
    await expect(copyButton).toHaveClass(/cursor-pointer/);
  });

  test('should maintain consistent button sizes', async ({ page }) => {
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    
    // Check that all buttons have consistent dimensions
    const buttons = [
      '.add-row-btn[data-row-index="1"]',
      '.delete-row-btn[data-row-index="1"]', 
      '.copy-btn[data-row-index="1"]'
    ];
    
    for (const buttonSelector of buttons) {
      const button = page.locator(buttonSelector);
      const boundingBox = await button.boundingBox();
      
      // All buttons should be 42x42 pixels
      expect(boundingBox?.width).toBe(42);
      expect(boundingBox?.height).toBe(42);
    }
  });

  test('should handle rapid button interactions', async ({ page }) => {
    // Fill initial data
    await page.locator('#iban').fill('DE89370400440532013000');
    
    // Rapidly click add button multiple times (should only create one row)
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    await addButton.click();
    await addButton.click(); // Should not create additional row
    await addButton.click(); // Should not create additional row
    
    // Should only have created one additional row
    await expect(page.locator('.iban-row[data-row-index="1"]')).toBeVisible();
    await expect(page.locator('.iban-row[data-row-index="2"]')).not.toBeVisible();
    
    // Original add button should be hidden
    await expect(addButton).toBeHidden();
  });
});