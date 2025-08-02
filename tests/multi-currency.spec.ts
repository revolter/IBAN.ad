import { test, expect } from '@playwright/test';

test.describe('Multi-Currency IBAN Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should convert single IBAN row to multi-currency when add button clicked', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    // Enter IBAN to show add button
    await ibanField.fill('DE89370400440532013000');
    await expect(addButton).toBeVisible();
    
    // Click add button
    await addButton.click();
    
    // Check that currency field appears
    const currencyField = page.locator('#currency-0');
    await expect(currencyField).toBeVisible();
    
    // Check that IBAN field is renamed to iban-0
    const renamedIbanField = page.locator('#iban-0');
    await expect(renamedIbanField).toBeVisible();
    await expect(renamedIbanField).toHaveValue('DE89370400440532013000');
    
    // Check that original IBAN field no longer exists
    await expect(page.locator('#iban')).not.toBeVisible();
    
    // Check that add button disappears after conversion
    await expect(addButton).toBeHidden();
  });

  test('should create new empty row after conversion', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    await ibanField.fill('DE89370400440532013000');
    await addButton.click();
    
    // Check that new row (row 1) exists
    const newCurrencyField = page.locator('#currency-1');
    const newIbanField = page.locator('#iban-1');
    await expect(newCurrencyField).toBeVisible();
    await expect(newIbanField).toBeVisible();
    await expect(newIbanField).toHaveValue('');
  });

  test('should enable copy button only when both currency and IBAN are filled', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    await ibanField.fill('DE89370400440532013000');
    await addButton.click();
    
    const currencyField = page.locator('#currency-0');
    const renamedIbanField = page.locator('#iban-0');
    const copyButton = page.locator('.copy-btn[data-row-index="0"]');
    
    // Initially should be disabled (IBAN filled but no currency)
    await expect(copyButton).toBeDisabled();
    
    // Fill currency, should now be enabled
    await currencyField.fill('EUR');
    await expect(copyButton).toBeEnabled();
    
    // Clear IBAN, should be disabled again
    await renamedIbanField.clear();
    await expect(copyButton).toBeDisabled();
    
    // Refill IBAN, should be enabled
    await renamedIbanField.fill('DE89370400440532013000');
    await expect(copyButton).toBeEnabled();
  });

  test('should copy combined currency and IBAN in multi-currency mode', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    await ibanField.fill('DE89370400440532013000');
    await addButton.click();
    
    const currencyField = page.locator('#currency-0');
    const copyButton = page.locator('.copy-btn[data-row-index="0"]');
    
    await currencyField.fill('EUR');
    await copyButton.click();
    
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('EUR DE89370400440532013000');
  });

  test('should show delete button only on last row', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    await ibanField.fill('DE89370400440532013000');
    await addButton.click();
    
    // Delete button should appear on row 1 (the new last row)
    const deleteButton1 = page.locator('.delete-row-btn[data-row-index="1"]');
    await expect(deleteButton1).toBeVisible();
    
    // No delete button on row 0
    const deleteButton0 = page.locator('.delete-row-btn[data-row-index="0"]');
    await expect(deleteButton0).toBeHidden();
  });

  test('should delete row and move delete button to new last row', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton0 = page.locator('.add-row-btn[data-row-index="0"]');
    
    // Create first multi-currency row
    await ibanField.fill('DE89370400440532013000');
    await addButton0.click();
    
    // Fill second row and add third
    const currencyField1 = page.locator('#currency-1');
    const ibanField1 = page.locator('#iban-1');
    await currencyField1.fill('USD');
    await ibanField1.fill('US64SVBKUS6S3300958579');
    
    const addButton1 = page.locator('.add-row-btn[data-row-index="1"]');
    await expect(addButton1).toBeVisible();
    await addButton1.click();
    
    // Now we have 3 rows (0, 1, 2), delete button should be on row 2
    let deleteButton2 = page.locator('.delete-row-btn[data-row-index="2"]');
    await expect(deleteButton2).toBeVisible();
    
    // Delete row 2
    await deleteButton2.click();
    
    // Row 2 should be gone
    const row2 = page.locator('.iban-row[data-row-index="2"]');
    await expect(row2).not.toBeVisible();
    
    // Delete button should now be on row 1
    const deleteButton1 = page.locator('.delete-row-btn[data-row-index="1"]');
    await expect(deleteButton1).toBeVisible();
  });

  test('should enforce sequential progression for add buttons', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton0 = page.locator('.add-row-btn[data-row-index="0"]');
    
    // Create first multi-currency row
    await ibanField.fill('DE89370400440532013000');
    await addButton0.click();
    
    const currencyField0 = page.locator('#currency-0');
    const currencyField1 = page.locator('#currency-1');
    const ibanField1 = page.locator('#iban-1');
    const addButton1 = page.locator('.add-row-btn[data-row-index="1"]');
    
    // Add button on row 1 should not appear until row 0 is complete
    await expect(addButton1).toBeHidden();
    
    // Fill currency on row 0
    await currencyField0.fill('EUR');
    // Add button still shouldn't appear because row 1 is not filled
    await expect(addButton1).toBeHidden();
    
    // Fill currency on row 1 
    await currencyField1.fill('USD');
    // Still shouldn't appear because IBAN is not filled
    await expect(addButton1).toBeHidden();
    
    // Fill IBAN on row 1
    await ibanField1.fill('US64SVBKUS6S3300958579');
    // Now it should appear
    await expect(addButton1).toBeVisible();
  });

  test('should never allow deletion of row 0', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    await ibanField.fill('DE89370400440532013000');
    await addButton.click();
    
    // Even after conversion, row 0 should never have a delete button
    const deleteButton0 = page.locator('.delete-row-btn[data-row-index="0"]');
    await expect(deleteButton0).toBeHidden();
  });

  test('should handle multiple currency types', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const currencies = ['EUR', 'USD', 'GBP', 'JPY'];
    const ibans = [
      'DE89370400440532013000',
      'US64SVBKUS6S3300958579', 
      'GB29NWBK60161331926819',
      'JP17BOFA15050000123456'
    ];
    
    // Convert first row
    await page.locator('#iban').fill(ibans[0]);
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    
    // Fill multiple currency rows
    for (let i = 0; i < currencies.length; i++) {
      const currencyField = page.locator(`#currency-${i}`);
      const ibanField = page.locator(`#iban-${i}`);
      const copyButton = page.locator(`.copy-btn[data-row-index="${i}"]`);
      
      await currencyField.fill(currencies[i]);
      if (i > 0) {
        await ibanField.fill(ibans[i]);
      }
      
      // Test copy functionality
      await copyButton.click();
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toBe(`${currencies[i]} ${ibans[i]}`);
      
      // Add next row if not the last one
      if (i < currencies.length - 1) {
        const addButton = page.locator(`.add-row-btn[data-row-index="${i}"]`);
        await expect(addButton).toBeVisible();
        await addButton.click();
      }
    }
  });
});