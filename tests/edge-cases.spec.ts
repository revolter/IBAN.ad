import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design and Mobile', () => {
  test('should work on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');
    
    // Check that elements are visible and usable on mobile
    await expect(page.locator('#iban')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#details')).toBeVisible();
    await expect(page.locator('#lang-select')).toBeVisible();
    
    // Test multi-currency functionality on mobile
    await page.locator('#iban').fill('DE89370400440532013000');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    await expect(addButton).toBeVisible();
    
    await addButton.click();
    await expect(page.locator('#currency-0')).toBeVisible();
    await expect(page.locator('#iban-0')).toBeVisible();
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Test touch-friendly button interactions
    await page.locator('#iban').fill('DE89370400440532013000');
    
    // Tap add button (using tap instead of click)
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    await addButton.tap();
    
    await expect(page.locator('#currency-0')).toBeVisible();
    
    // Test copy button tap
    await page.locator('#currency-0').fill('EUR');
    const copyButton = page.locator('.copy-btn[data-row-index="0"]');
    await copyButton.tap();
    
    // Tooltip should appear
    const tooltip = page.locator('#tooltip-iban-0');
    await expect(tooltip).toHaveClass(/opacity-100/);
  });

  test('should maintain usability in landscape mobile', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 }); // Landscape mobile
    await page.goto('/');
    
    // All essential elements should still be accessible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#iban')).toBeVisible();
    await expect(page.locator('#permalink-btn')).toBeVisible();
  });

  test('should work on tablet viewports', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/');
    
    // Test that layout adapts well to tablet size
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    
    // Create multiple rows to test layout
    await page.locator('#currency-0').fill('EUR');
    await page.locator('#currency-1').fill('USD');
    await page.locator('#iban-1').fill('US64SVBKUS6S3300958579');
    
    // All buttons should be properly sized and positioned
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const boundingBox = await button.boundingBox();
        expect(boundingBox?.width).toBeGreaterThan(20); // Ensure buttons are touch-friendly
        expect(boundingBox?.height).toBeGreaterThan(20);
      }
    }
  });
});

test.describe('Edge Cases and Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle very long IBAN values', async ({ page }) => {
    const longIban = 'DE89370400440532013000123456789012345678901234567890';
    await page.locator('#iban').fill(longIban);
    
    // Button should still appear
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    await expect(addButton).toBeVisible();
    
    // Copy should work
    const copyButton = page.locator('.copy-btn[data-copytarget="iban"]');
    await expect(copyButton).toBeEnabled();
  });

  test('should handle special characters in fields', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const specialValues = {
      name: 'José María Ñoño-García & Associates',
      details: 'Payment with symbols: €$£¥ @#%^&*()[]{}|\\`~'
    };
    
    for (const [field, value] of Object.entries(specialValues)) {
      await page.locator(`#${field}`).fill(value);
      const copyButton = page.locator(`.copy-btn[data-copytarget="${field}"]`);
      await copyButton.click();
      
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toBe(value);
    }
  });

  test('should handle rapid field clearing and refilling', async ({ page }) => {
    const ibanField = page.locator('#iban');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    
    for (let i = 0; i < 5; i++) {
      await ibanField.fill(`DE8937040044053201300${i}`);
      await expect(addButton).toBeVisible();
      
      await ibanField.clear();
      await expect(addButton).toBeHidden();
    }
  });

  test('should handle form with no JavaScript (graceful degradation)', async ({ page }) => {
    // Disable JavaScript
    await page.setJavaScriptEnabled(false);
    await page.goto('/');
    
    // Basic form should still be visible
    await expect(page.locator('#iban')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#details')).toBeVisible();
  });

  test('should handle clipboard permission denied', async ({ page, context }) => {
    // Don't grant clipboard permissions
    
    const ibanField = page.locator('#iban');
    const copyButton = page.locator('.copy-btn[data-copytarget="iban"]');
    
    await ibanField.fill('DE89370400440532013000');
    await copyButton.click();
    
    // Should not crash, might not copy but shouldn't break the app
    await expect(page.locator('#iban')).toHaveValue('DE89370400440532013000');
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Fill form and create permalink
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('#name').fill('Test User');
    await page.locator('#permalink-btn').click();
    
    // Navigate back
    await page.goBack();
    
    // Should handle empty state
    await expect(page.locator('#iban')).toHaveValue('');
    
    // Navigate forward
    await page.goForward();
    
    // Should restore state
    await expect(page.locator('#iban')).toHaveValue('DE89370400440532013000');
    await expect(page.locator('#name')).toHaveValue('Test User');
  });

  test('should handle window resize events', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    
    // Create multi-currency layout
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Layout should adapt
    await expect(page.locator('#currency-0')).toBeVisible();
    await expect(page.locator('#iban-0')).toBeVisible();
    
    // Resize back to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Should still work
    await expect(page.locator('#currency-0')).toBeVisible();
    await expect(page.locator('#iban-0')).toBeVisible();
  });

  test('should handle malformed URL parameters', async ({ page }) => {
    // Test with malformed parameters
    const malformedUrl = '/?iban=&name=%&details=&currency-0=&iban-0=&invalid=test';
    await page.goto(malformedUrl);
    
    // Should not crash and show empty form
    await expect(page.locator('#iban')).toHaveValue('');
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#details')).toHaveValue('');
    
    // App should still be functional
    await page.locator('#iban').fill('DE89370400440532013000');
    const addButton = page.locator('.add-row-btn[data-row-index="0"]');
    await expect(addButton).toBeVisible();
  });

  test('should handle maximum reasonable number of rows', async ({ page }) => {
    await page.locator('#iban').fill('DE89370400440532013000');
    await page.locator('.add-row-btn[data-row-index="0"]').click();
    await page.locator('#currency-0').fill('EUR');
    
    // Create several rows to test performance
    for (let i = 1; i < 10; i++) {
      await page.locator(`#currency-${i}`).fill(`CUR${i}`);
      await page.locator(`#iban-${i}`).fill(`DE8937040044053201${String(i).padStart(4, '0')}`);
      
      const addButton = page.locator(`.add-row-btn[data-row-index="${i}"]`);
      if (await addButton.isVisible()) {
        await addButton.click();
      }
    }
    
    // Should still be functional
    const lastVisibleRow = page.locator('.iban-row').last();
    await expect(lastVisibleRow).toBeVisible();
  });
});