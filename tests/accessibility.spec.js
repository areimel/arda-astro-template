import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('Homepage accessibility basics', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one h1
    
    // Check that images have alt text
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy(); // Alt should not be null/empty
    }
    
    // Check for proper landmarks
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Check that interactive elements are focusable
    const buttons = await page.locator('button, a[href], input').all();
    for (const element of buttons) {
      await element.focus();
      expect(await element.evaluate(el => document.activeElement === el)).toBe(true);
    }
  });
  
  test('Color theme switching accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Look for the color palette selector if it exists
    const colorSelector = page.locator('[data-color-selector]').first();
    
    if (await colorSelector.isVisible()) {
      // Test keyboard navigation
      await colorSelector.focus();
      await page.keyboard.press('Enter');
      
      // Check if theme selection is accessible
      const themeOptions = page.locator('[data-theme-option]');
      if (await themeOptions.count() > 0) {
        await themeOptions.first().focus();
        await page.keyboard.press('Enter');
        
        // Verify theme change occurred
        await expect(page.locator('html')).toHaveAttribute('data-theme');
      }
    }
  });
});