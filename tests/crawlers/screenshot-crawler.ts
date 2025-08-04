import { Page } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { pages, viewports, createOutputDirectory } from '../test-settings';

export interface ScreenshotOptions {
  outputDir?: string;
  viewports?: Array<{ name: string; width: number; height: number }>;
  pages?: Array<{ path: string; title: string }>;
  waitTime?: number;
  fullPage?: boolean;
  animations?: 'disabled' | 'allow';
}

export interface ScreenshotResult {
  page: string;
  title: string;
  viewport: string;
  filePath: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

/**
 * Take screenshots for all pages across all specified viewports
 */
export async function crawlScreenshots(
  page: Page,
  options: ScreenshotOptions = {}
): Promise<ScreenshotResult[]> {
  const {
    outputDir = await createOutputDirectory('screenshots'),
    viewports: targetViewports = viewports,
    pages: targetPages = pages,
    waitTime = 2000,
    fullPage = true,
    animations = 'disabled'
  } = options;

  const results: ScreenshotResult[] = [];

  for (const viewport of targetViewports) {
    // Set viewport size
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const pageInfo of targetPages) {
      const result: ScreenshotResult = {
        page: pageInfo.path,
        title: pageInfo.title,
        viewport: viewport.name,
        filePath: '',
        success: false,
        timestamp: new Date().toISOString()
      };

      try {
        await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
        
        // Wait for any animations or dynamic content
        await page.waitForTimeout(waitTime);
        
        const fileName = `${pageInfo.path.replace(/\//g, '_') || 'home'}_${viewport.name}.png`;
        const filePath = path.join(outputDir, fileName);
        
        await page.screenshot({ 
          path: filePath, 
          fullPage,
          animations
        });
        
        result.filePath = filePath;
        result.success = true;
        
        console.log(`Screenshot saved: ${filePath}`);
      } catch (error) {
        result.error = error instanceof Error ? error.message : String(error);
        console.error(`Failed to screenshot ${pageInfo.path} on ${viewport.name}:`, error);
      }

      results.push(result);
    }
  }

  return results;
}

/**
 * Take screenshots for all pages on desktop viewport only
 */
export async function crawlDesktopScreenshots(
  page: Page,
  options: Omit<ScreenshotOptions, 'viewports'> = {}
): Promise<ScreenshotResult[]> {
  const desktopViewport = viewports.find(v => v.name === 'desktop');
  if (!desktopViewport) {
    throw new Error('Desktop viewport not found in configuration');
  }

  return crawlScreenshots(page, {
    ...options,
    viewports: [desktopViewport]
  });
}

/**
 * Take screenshots for all pages on laptop viewport only
 */
export async function crawlLaptopScreenshots(
  page: Page,
  options: Omit<ScreenshotOptions, 'viewports'> = {}
): Promise<ScreenshotResult[]> {
  const laptopViewport = viewports.find(v => v.name === 'laptop');
  if (!laptopViewport) {
    throw new Error('Laptop viewport not found in configuration');
  }

  return crawlScreenshots(page, {
    ...options,
    viewports: [laptopViewport]
  });
}

/**
 * Take screenshots for all pages on mobile viewport only
 */
export async function crawlMobileScreenshots(
  page: Page,
  options: Omit<ScreenshotOptions, 'viewports'> = {}
): Promise<ScreenshotResult[]> {
  const mobileViewport = viewports.find(v => v.name === 'mobile');
  if (!mobileViewport) {
    throw new Error('Mobile viewport not found in configuration');
  }

  return crawlScreenshots(page, {
    ...options,
    viewports: [mobileViewport]
  });
}

/**
 * Take a screenshot of a single page on a specific viewport
 */
export async function screenshotSinglePage(
  page: Page,
  pagePath: string,
  viewportName: string,
  options: Pick<ScreenshotOptions, 'outputDir' | 'waitTime' | 'fullPage' | 'animations'> = {}
): Promise<ScreenshotResult> {
  const {
    outputDir = await createOutputDirectory('screenshots'),
    waitTime = 2000,
    fullPage = true,
    animations = 'disabled'
  } = options;

  const targetViewport = viewports.find(v => v.name === viewportName);
  if (!targetViewport) {
    throw new Error(`Viewport '${viewportName}' not found in configuration`);
  }

  const pageInfo = pages.find(p => p.path === pagePath);
  const pageTitle = pageInfo?.title || 'Unknown';

  const result: ScreenshotResult = {
    page: pagePath,
    title: pageTitle,
    viewport: viewportName,
    filePath: '',
    success: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Set viewport size
    await page.setViewportSize({ width: targetViewport.width, height: targetViewport.height });

    await page.goto(pagePath, { waitUntil: 'networkidle' });
    
    // Wait for any animations or dynamic content
    await page.waitForTimeout(waitTime);
    
    const fileName = `${pagePath.replace(/\//g, '_') || 'home'}_${viewportName}.png`;
    const filePath = path.join(outputDir, fileName);
    
    await page.screenshot({ 
      path: filePath, 
      fullPage,
      animations
    });
    
    result.filePath = filePath;
    result.success = true;
    
    console.log(`Screenshot saved: ${filePath}`);
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error(`Failed to screenshot ${pagePath} on ${viewportName}:`, error);
  }

  return result;
}

/**
 * Generate a summary report of screenshot results
 */
export async function generateScreenshotReport(
  results: ScreenshotResult[],
  outputDir: string
): Promise<string> {
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;
  
  const report = `# Screenshot Crawler Report

Generated: ${new Date().toISOString()}

## Summary

- **Total Screenshots**: ${results.length}
- **Successful**: ${successCount}
- **Failed**: ${failureCount}
- **Success Rate**: ${Math.round((successCount / results.length) * 100)}%

## Results

${results.map(result => `
### ${result.title} (${result.page}) - ${result.viewport}

- **Status**: ${result.success ? '✅ Success' : '❌ Failed'}
- **File Path**: ${result.success ? result.filePath : 'N/A'}
- **Timestamp**: ${result.timestamp}
${result.error ? `- **Error**: ${result.error}` : ''}
`).join('\n')}

---
*Report generated by Screenshot Crawler*`;

  const reportPath = path.join(outputDir, 'screenshot-report.md');
  await fs.writeFile(reportPath, report);
  
  return reportPath;
}