import { test, expect } from '@playwright/test';

test.describe('Permalink Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should generate permalink with basic fields', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Fill form fields
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('#name').fill('John Doe');
    await page.locator('#details').fill('Test payment');
    
    // Click permalink button
    await page.locator('#permalink-btn').click();
    
    // Check that URL contains the expected parameters
    await expect(page).toHaveURL(/iban=DE89370400440532013000/);
    await expect(page).toHaveURL(/name=John\+Doe/);
    await expect(page).toHaveURL(/details=Test\+payment/);
    
    // Check that values are preserved after redirect
    await expect(page.locator('#iban')).toHaveValue('DE89370400440532013000');
    await expect(page.locator('#name')).toHaveValue('John Doe');
    await expect(page.locator('#details')).toHaveValue('Test payment');
  });

  test('should generate permalink with multi-currency fields', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Create first multi-currency row
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    await page.locator('#currency-0').fill('EUR');
    
    // Create second row
    await page.locator('#currency-1').fill('USD');
    await page.locator('#iban-1').fill('US64SVBKUS6S3300958579');
    await page.locator('.add-row-btn[data-row-index="1"]').click();
    
    // Fill other fields
    await page.locator('#name').fill('Multi Currency User');
    await page.locator('#details').fill('International payment');
    
    // Generate permalink
    await page.locator('#permalink-btn').click();
    
    // Check that URL contains multi-currency parameters
    await expect(page).toHaveURL(/currency-0=EUR/);
    await expect(page).toHaveURL(/iban-0=DE89370400440532013000/);
    await expect(page).toHaveURL(/currency-1=USD/);
    await expect(page).toHaveURL(/iban-1=US64SVBKUS6S3300958579/);
    await expect(page).toHaveURL(/name=Multi\+Currency\+User/);
    await expect(page).toHaveURL(/details=International\+payment/);
  });

  test('should restore state from permalink with basic fields', async ({ page }) => {
    const permalink = '/?iban=DE89370400440532013000&name=Jane%20Smith&details=Restored%20payment';
    await page.goto(permalink);
    
    await expect(page.locator('#iban')).toHaveValue('DE89370400440532013000');
    await expect(page.locator('#name')).toHaveValue('Jane Smith');
    await expect(page.locator('#details')).toHaveValue('Restored payment');
    
    // Copy buttons should be enabled
    await expect(page.locator('.copy-btn[data-copytarget="iban"]')).toBeEnabled();
    await expect(page.locator('.copy-btn[data-copytarget="name"]')).toBeEnabled();
    await expect(page.locator('.copy-btn[data-copytarget="details"]')).toBeEnabled();
  });

  test('should restore multi-currency state from permalink', async ({ page }) => {
    const permalink = '/?currency-0=EUR&iban-0=DE89370400440532013000&currency-1=USD&iban-1=US64SVBKUS6S3300958579&name=Multi%20User&details=Test';
    await page.goto(permalink);
    
    // Check that multi-currency rows are created
    await expect(page.locator('#currency-0')).toHaveValue('EUR');
    await expect(page.locator('#iban-0')).toHaveValue('DE89370400440532013000');
    await expect(page.locator('#currency-1')).toHaveValue('USD');
    await expect(page.locator('#iban-1')).toHaveValue('US64SVBKUS6S3300958579');
    await expect(page.locator('#name')).toHaveValue('Multi User');
    await expect(page.locator('#details')).toHaveValue('Test');
    
    // Check that original IBAN field is converted
    await expect(page.locator('#iban')).not.toBeVisible();
    
    // Copy buttons should be enabled
    await expect(page.locator('.copy-btn[data-row-index="0"]')).toBeEnabled();
    await expect(page.locator('.copy-btn[data-row-index="1"]')).toBeEnabled();
  });

  test('should show add button on last row when loaded from permalink', async ({ page }) => {
    const permalink = '/?currency-0=EUR&iban-0=DE89370400440532013000&currency-1=USD&iban-1=US64SVBKUS6S3300958579';
    await page.goto(permalink);
    
    // Add button should be visible on last row (row 1) since both fields are filled
    const addButton1 = page.locator('.add-row-btn[data-row-index="1"]');
    await expect(addButton1).toBeVisible();
    
    // Add button should not be visible on row 0 since it's not the last row
    const addButton0 = page.locator('.add-row-btn[data-row-index="0"]');
    await expect(addButton0).toBeHidden();
  });

  test('should show delete button on last row when loaded from permalink', async ({ page }) => {
    const permalink = '/?currency-0=EUR&iban-0=DE89370400440532013000&currency-1=USD&iban-1=US64SVBKUS6S3300958579';
    await page.goto(permalink);
    
    // Delete button should be visible on last row (row 1)
    const deleteButton1 = page.locator('.delete-row-btn[data-row-index="1"]');
    await expect(deleteButton1).toBeVisible();
    
    // Delete button should not be visible on row 0
    const deleteButton0 = page.locator('.delete-row-btn[data-row-index="0"]');
    await expect(deleteButton0).toBeHidden();
  });

  test('should handle language parameter in permalink', async ({ page }) => {
    const permalink = '/?lang=ro&iban=DE89370400440532013000';
    await page.goto(permalink);
    
    // Check that language is set to Romanian
    await expect(page.locator('#lang-select')).toHaveValue('ro');
    await expect(page.getByRole('heading')).toContainText('Informații IBAN');
    
    // Check that IBAN value is preserved
    await expect(page.locator('#iban')).toHaveValue('DE89370400440532013000');
  });

  test('should clear form but preserve language when site name clicked', async ({ page }) => {
    // Set up form with data and Romanian language
    const permalink = '/?lang=ro&iban=DE89370400440532013000&name=Test%20User';
    await page.goto(permalink);
    
    // Verify initial state
    await expect(page.locator('#iban')).toHaveValue('DE89370400440532013000');
    await expect(page.locator('#name')).toHaveValue('Test User');
    await expect(page.locator('#lang-select')).toHaveValue('ro');
    
    // Click site name to clear form
    await page.locator('#clear-form-btn').click();
    
    // Check that fields are cleared but language is preserved
    await expect(page.locator('#iban')).toHaveValue('');
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#lang-select')).toHaveValue('ro');
    await expect(page).toHaveURL(/lang=ro/);
    await expect(page).not.toHaveURL(/iban=/);
    await expect(page).not.toHaveURL(/name=/);
  });

  test('should copy permalink to clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('#name').fill('Test User');
    
    // Click permalink button
    await page.locator('#permalink-btn').click();
    
    // Wait for redirect and check clipboard
    await page.waitForURL(/iban=DE89370400440532013000/);
    
    // The permalink should be copied to clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('iban=DE89370400440532013000');
    expect(clipboardText).toContain('name=Test%20User');
    
    // Tooltip should show
    const tooltip = page.locator('#tooltip-permalink');
    await expect(tooltip).toHaveClass(/opacity-100/);
  });

  test('should handle empty permalink generation', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Click permalink with empty form
    await page.locator('#permalink-btn').click();
    
    // Should redirect to clean URL without parameters
    await expect(page).toHaveURL(/^[^?]*$/); // No query parameters
  });

  test('should handle partial multi-currency data in permalink', async ({ page }) => {
    // Permalink with only currency but no IBAN for row 1
    const permalink = '/?currency-0=EUR&iban-0=DE89370400440532013000&currency-1=USD';
    await page.goto(permalink);
    
    await expect(page.locator('#currency-0')).toHaveValue('EUR');
    await expect(page.locator('#iban-0')).toHaveValue('DE89370400440532013000');
    await expect(page.locator('#currency-1')).toHaveValue('USD');
    await expect(page.locator('#iban-1')).toHaveValue('');
    
    // Copy button for row 1 should be disabled since IBAN is empty
    await expect(page.locator('.copy-btn[data-row-index="1"]')).toBeDisabled();
    
    // Add button should not appear on row 1 since IBAN is empty
    const addButton1 = page.locator('.add-row-btn[data-row-index="1"]');
    await expect(addButton1).toBeHidden();
  });
});