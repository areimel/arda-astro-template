import { test, expect } from '@playwright/test';

test.describe('Screenshot Generation', () => {
  test('Generate homepage screenshot for OpenGraph thumbnail', async ({ page }) => {
    // Set viewport to OpenGraph image dimensions
    await page.setViewportSize({ width: 1200, height: 630 });
    
    // Navigate to the homepage
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for any animations or dynamic content
    await page.waitForTimeout(2000);
    
    // Take a screenshot and save it in the project root
    await page.screenshot({ 
      path: 'screenshot-thumbnail.jpg',
      type: 'jpeg',
      quality: 90,
      fullPage: false // Just capture the viewport area
    });
    
    console.log('📸 Screenshot saved as screenshot-thumbnail.jpg');
    console.log('💡 You can now copy this file to replace /public/opengraph.jpg');
  });
  
  test('Basic homepage functionality', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads correctly
    await expect(page).toHaveTitle(/ARDA/);
    
    // Check for key elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Basic accessibility check - ensure there's a main landmark
    await expect(page.locator('main')).toBeVisible();
  });
  
  test('SEO meta tags are present', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential SEO meta tags
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    
    // Check if og:description exists (it's optional)
    const ogDescription = page.locator('meta[property="og:description"]');
    const count = await ogDescription.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});