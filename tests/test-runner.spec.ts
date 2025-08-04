import { test, expect } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { 
  initializeSessionTimestamp, 
  getSessionTimestamp, 
  createOutputDirectory 
} from './test-settings';
import { 
  crawlScreenshots,
  crawlDesktopScreenshots,
  crawlLaptopScreenshots,
  crawlMobileScreenshots,
  crawlAccessibility, 
  crawlSEO,
  type AccessibilityResult,
  type AccessibilitySummary,
  type SEOResult,
  type SEOSummary,
  type ScreenshotResult
} from './crawlers';

interface TestSessionResults {
  sessionTimestamp: string;
  screenshots: {
    completed: boolean;
    results: ScreenshotResult[];
    outputDir: string;
  };
  accessibility: {
    completed: boolean;
    summary: AccessibilitySummary;
    outputDir: string;
    criticalViolations: number;
  };
  seo: {
    completed: boolean;
    summary: SEOSummary;
    outputDir: string;
    totalIssues: number;
  };
}

test.describe('Unified Test Runner', () => {
  let sessionResults: TestSessionResults;
  let sessionTimestamp: string;

  test.beforeAll(async () => {
    // Initialize session timestamp for unified test organization
    sessionTimestamp = initializeSessionTimestamp();
    console.log(`🚀 Starting unified test session: ${sessionTimestamp}`);

    // Initialize session results tracking
    sessionResults = {
      sessionTimestamp,
      screenshots: {
        completed: false,
        results: [],
        outputDir: ''
      },
      accessibility: {
        completed: false,
        summary: {} as AccessibilitySummary,
        outputDir: '',
        criticalViolations: 0
      },
      seo: {
        completed: false,
        summary: {} as SEOSummary,
        outputDir: '',
        totalIssues: 0
      }
    };
  });

  test.describe('Complete Test Suite', () => {
    test('Run all tests - Screenshots, Accessibility, and SEO', async ({ page }) => {
      console.log('📸 Starting screenshot crawler...');
      await runScreenshotTests(page);
      
      console.log('♿ Starting accessibility crawler...');
      await runAccessibilityTests(page);
      
      console.log('🔍 Starting SEO crawler...');
      await runSEOTests(page);
      
      console.log('📊 Generating unified test session report...');
      await generateSessionReport();
      
      console.log('✅ All tests completed successfully!');
    });
  });

  test.describe('Individual Test Suites', () => {
    test('Screenshot Testing', async ({ page }) => {
      await runScreenshotTests(page);
    });

    test('Screenshot Testing - Desktop', async ({ page }) => {
      await runDesktopScreenshotTests(page);
    });

    test('Screenshot Testing - Laptop', async ({ page }) => {
      await runLaptopScreenshotTests(page);
    });

    test('Screenshot Testing - Mobile', async ({ page }) => {
      await runMobileScreenshotTests(page);
    });

    test('Accessibility Testing', async ({ page }) => {
      await runAccessibilityTests(page);
      
      // Assert no critical violations for individual test
      expect(sessionResults.accessibility.criticalViolations).toBe(0);
    });

    test('SEO Testing', async ({ page }) => {
      await runSEOTests(page);
    });
  });

  // Screenshot test runner
  async function runScreenshotTests(page: any): Promise<void> {
    try {
      const outputDir = await createOutputDirectory('screenshots');
      sessionResults.screenshots.outputDir = outputDir;

      const results = await crawlScreenshots(page, {
        outputDir
      });

      sessionResults.screenshots.results = results;
      sessionResults.screenshots.completed = true;
      console.log('✅ Screenshot tests completed');
    } catch (error) {
      console.error('❌ Screenshot tests failed:', error);
      throw error;
    }
  }

  // Desktop screenshot test runner
  async function runDesktopScreenshotTests(page: any): Promise<void> {
    try {
      const outputDir = await createOutputDirectory('screenshots');
      sessionResults.screenshots.outputDir = outputDir;

      const results = await crawlDesktopScreenshots(page, {
        outputDir
      });

      sessionResults.screenshots.results = results;
      sessionResults.screenshots.completed = true;
      console.log('✅ Desktop screenshot tests completed');
    } catch (error) {
      console.error('❌ Desktop screenshot tests failed:', error);
      throw error;
    }
  }

  // Laptop screenshot test runner
  async function runLaptopScreenshotTests(page: any): Promise<void> {
    try {
      const outputDir = await createOutputDirectory('screenshots');
      sessionResults.screenshots.outputDir = outputDir;

      const results = await crawlLaptopScreenshots(page, {
        outputDir
      });

      sessionResults.screenshots.results = results;
      sessionResults.screenshots.completed = true;
      console.log('✅ Laptop screenshot tests completed');
    } catch (error) {
      console.error('❌ Laptop screenshot tests failed:', error);
      throw error;
    }
  }

  // Mobile screenshot test runner
  async function runMobileScreenshotTests(page: any): Promise<void> {
    try {
      const outputDir = await createOutputDirectory('screenshots');
      sessionResults.screenshots.outputDir = outputDir;

      const results = await crawlMobileScreenshots(page, {
        outputDir
      });

      sessionResults.screenshots.results = results;
      sessionResults.screenshots.completed = true;
      console.log('✅ Mobile screenshot tests completed');
    } catch (error) {
      console.error('❌ Mobile screenshot tests failed:', error);
      throw error;
    }
  }

  // Accessibility test runner
  async function runAccessibilityTests(page: any): Promise<void> {
    try {
      const outputDir = await createOutputDirectory('accessibility');
      sessionResults.accessibility.outputDir = outputDir;

      const summary = await crawlAccessibility(page, {
        outputDir
      });

      sessionResults.accessibility.summary = summary;
      sessionResults.accessibility.completed = true;
      sessionResults.accessibility.criticalViolations = summary.criticalViolations;

      console.log(`✅ Accessibility tests completed - ${summary.criticalViolations} critical violations found`);
    } catch (error) {
      console.error('❌ Accessibility tests failed:', error);
      throw error;
    }
  }

  // SEO test runner
  async function runSEOTests(page: any): Promise<void> {
    try {
      const outputDir = await createOutputDirectory('seo');
      sessionResults.seo.outputDir = outputDir;

      const summary = await crawlSEO(page, {
        outputDir
      });

      sessionResults.seo.summary = summary;
      sessionResults.seo.completed = true;
      sessionResults.seo.totalIssues = summary.totalIssues;

      console.log(`✅ SEO tests completed - ${summary.totalIssues} issues found`);
    } catch (error) {
      console.error('❌ SEO tests failed:', error);
      throw error;
    }
  }

  // Generate unified session report
  async function generateSessionReport(): Promise<void> {
    const reportContent = generateUnifiedReport(sessionResults);
    const sessionDir = path.join('test-results', sessionTimestamp);
    const reportPath = path.join(sessionDir, 'test-session-summary.md');
    
    await fs.mkdir(sessionDir, { recursive: true });
    await fs.writeFile(reportPath, reportContent);
    
    // Also save session results as JSON for programmatic access
    const jsonPath = path.join(sessionDir, 'test-session-results.json');
    await fs.writeFile(jsonPath, JSON.stringify(sessionResults, null, 2));
    
    console.log(`📋 Unified test session report saved to: ${reportPath}`);
  }

  test.afterAll(async () => {
    // Final session summary
    console.log('\n' + '='.repeat(60));
    console.log('🎯 TEST SESSION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Session ID: ${sessionTimestamp}`);
    console.log(`Screenshots: ${sessionResults.screenshots.completed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Accessibility: ${sessionResults.accessibility.completed ? '✅ PASS' : '❌ FAIL'} (${sessionResults.accessibility.criticalViolations} critical issues)`);
    console.log(`SEO: ${sessionResults.seo.completed ? '✅ PASS' : '❌ FAIL'} (${sessionResults.seo.totalIssues} issues)`);
    console.log(`Results Directory: test-results/${sessionTimestamp}/`);
    console.log('='.repeat(60));
  });
});

function generateUnifiedReport(results: TestSessionResults): string {
  const timestamp = new Date().toISOString();
  
  return `# Unified Test Session Report

**Session ID**: ${results.sessionTimestamp}  
**Generated**: ${timestamp}

## Test Summary

| Test Suite | Status | Key Metrics |
|------------|--------|-------------|
| Screenshots | ${results.screenshots.completed ? '✅ COMPLETED' : '❌ FAILED'} | All viewports captured |
| Accessibility | ${results.accessibility.completed ? '✅ COMPLETED' : '❌ FAILED'} | ${results.accessibility.criticalViolations} critical violations |
| SEO Analysis | ${results.seo.completed ? '✅ COMPLETED' : '❌ FAILED'} | ${results.seo.totalIssues} issues found |

## Overall Status

${getAllTestsStatus(results)}

## Quick Navigation

### Screenshots
- **Location**: \`${results.screenshots.outputDir}\`
- **Status**: ${results.screenshots.completed ? 'Generated successfully' : 'Failed to generate'}

### Accessibility Report
- **Location**: \`${results.accessibility.outputDir}/accessibility-report.md\`
- **Critical Issues**: ${results.accessibility.criticalViolations}
- **Total Pages Tested**: ${results.accessibility.summary.totalPages || 0}
- **Status**: ${results.accessibility.criticalViolations === 0 ? '✅ No critical accessibility issues' : '❌ Critical issues found - immediate attention required'}

### SEO Analysis
- **Location**: \`${results.seo.outputDir}/seo-report.md\`
- **Total Issues**: ${results.seo.totalIssues}
- **Pages Analyzed**: ${results.seo.summary.totalPages || 0}
- **Average Load Time**: ${results.seo.summary.averageLoadTime || 0}ms

## Action Items

### High Priority
${getHighPriorityActions(results)}

### Medium Priority
${getMediumPriorityActions(results)}

## Detailed Reports

For comprehensive analysis, see the individual reports:
- 📸 **Screenshots**: Browse captured screenshots in \`${results.screenshots.outputDir}\`
- ♿ **Accessibility**: Review detailed findings in \`${results.accessibility.outputDir}/accessibility-report.md\`
- 🔍 **SEO**: Check optimization recommendations in \`${results.seo.outputDir}/seo-report.md\`

---
*Generated by Playwright Unified Test Runner v1.0*
*Session: ${results.sessionTimestamp}*`;
}

function getAllTestsStatus(results: TestSessionResults): string {
  const allPassed = results.screenshots.completed && 
                   results.accessibility.completed && 
                   results.seo.completed &&
                   results.accessibility.criticalViolations === 0;
  
  if (allPassed) {
    return '🎉 **ALL TESTS PASSED** - Your site is looking great!';
  } else {
    return '⚠️ **ATTENTION REQUIRED** - Some issues need to be addressed';
  }
}

function getHighPriorityActions(results: TestSessionResults): string {
  const actions: string[] = [];
  
  if (results.accessibility.criticalViolations > 0) {
    actions.push(`- 🚨 **Fix ${results.accessibility.criticalViolations} critical accessibility violations** - These prevent users from accessing your content`);
  }
  
  if (results.seo.summary.results?.some(r => r.issues.some(i => i.includes('Missing')))) {
    actions.push('- 📝 **Add missing meta tags** - Essential for search engine optimization');
  }
  
  if (results.seo.summary.results?.some(r => r.performance.loadTime > 3000)) {
    actions.push('- ⚡ **Optimize page load times** - Pages loading slower than 3 seconds detected');
  }
  
  return actions.length > 0 ? actions.join('\n') : '- ✅ No high priority issues found!';
}

function getMediumPriorityActions(results: TestSessionResults): string {
  const actions: string[] = [];
  
  const seriousViolations = results.accessibility.summary.seriousViolations || 0;
  
  if (seriousViolations > 0) {
    actions.push(`- ♿ **Address ${seriousViolations} serious accessibility issues** - Improve user experience for assistive technology users`);
  }
  
  const imagesWithoutAlt = results.seo.summary.results?.reduce((sum, result) => 
    sum + result.images.filter(img => !img.hasAlt).length, 0) || 0;
  
  if (imagesWithoutAlt > 0) {
    actions.push(`- 🖼️ **Add alt text to ${imagesWithoutAlt} images** - Improves accessibility and SEO`);
  }
  
  return actions.length > 0 ? actions.join('\n') : '- ✅ No medium priority issues found!';
}