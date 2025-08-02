import { test, expect } from '@playwright/test';

test.describe('Configuration Tests', () => {
  test('should have proper test configuration', async () => {
    // Simple test that doesn't require browser
    expect(process.env.NODE_ENV).toBeDefined();
  });
  
  test('should validate test file structure', async () => {
    const fs = require('fs');
    const path = require('path');
    
    // Check that all required test files exist
    const testFiles = [
      'basic-functionality.spec.ts',
      'multi-currency.spec.ts', 
      'permalink.spec.ts',
      'accessibility.spec.ts',
      'button-behavior.spec.ts',
      'edge-cases.spec.ts'
    ];
    
    for (const file of testFiles) {
      const filePath = path.join(__dirname, file);
      expect(fs.existsSync(filePath)).toBe(true);
    }
  });
  
  test('should validate HTML file exists', async () => {
    const fs = require('fs');
    const path = require('path');
    
    const htmlPath = path.join(__dirname, '../docs/index.html');
    expect(fs.existsSync(htmlPath)).toBe(true);
    
    // Validate HTML contains expected elements
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    expect(htmlContent).toContain('IBAN Information');
    expect(htmlContent).toContain('id="iban"');
    expect(htmlContent).toContain('multi-currency');
  });
});