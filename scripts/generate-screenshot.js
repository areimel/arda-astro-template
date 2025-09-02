import { chromium } from 'playwright';

async function generateScreenshot() {
  console.log('🚀 Starting screenshot generation...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to OpenGraph image dimensions
  await page.setViewportSize({ width: 1200, height: 630 });
  
  try {
    console.log('📡 Navigating to http://localhost:4321/');
    await page.goto('http://localhost:4321/');
    
    console.log('⏳ Waiting for page to load...');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('📸 Capturing screenshot...');
    await page.screenshot({ 
      path: 'tools_output/screenshots/screenshot-thumbnail.jpg',
      type: 'jpeg',
      quality: 90,
      fullPage: false
    });
    
    console.log('✅ Screenshot saved as tools_output/screenshots/screenshot-thumbnail.jpg');
    console.log('💡 You can now copy this file to replace /public/opengraph.jpg');
  } catch (error) {
    console.error('❌ Error generating screenshot:', error);
    console.log('💡 Make sure your development server is running at http://localhost:4321/');
    console.log('   Run: pnpm build && pnpm preview');
  }
  
  await browser.close();
}

generateScreenshot();