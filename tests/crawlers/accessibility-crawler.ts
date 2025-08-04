import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { pages, createOutputDirectory } from '../test-settings';

export interface AccessibilityOptions {
  outputDir?: string;
  pages?: Array<{ path: string; title: string }>;
  tags?: string[];
  waitTime?: number;
  failOnCritical?: boolean;
}

export interface AccessibilityResult {
  page: string;
  title: string;
  violations: any[];
  passes: any[];
  incomplete: any[];
  url: string;
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface AccessibilitySummary {
  totalPages: number;
  totalViolations: number;
  criticalViolations: number;
  seriousViolations: number;
  moderateViolations: number;
  minorViolations: number;
  overallStatus: 'PASS' | 'FAIL';
  results: AccessibilityResult[];
}

/**
 * Run accessibility analysis on all specified pages
 */
export async function crawlAccessibility(
  page: Page,
  options: AccessibilityOptions = {}
): Promise<AccessibilitySummary> {
  const {
    outputDir = await createOutputDirectory('accessibility'),
    pages: targetPages = pages,
    tags = ['wcag2a', 'wcag2aa', 'wcag21aa'],
    waitTime = 2000,
    failOnCritical = true
  } = options;

  const results: AccessibilityResult[] = [];

  for (const pageInfo of targetPages) {
    const result: AccessibilityResult = {
      page: pageInfo.path,
      title: pageInfo.title,
      violations: [],
      passes: [],
      incomplete: [],
      url: '',
      timestamp: new Date().toISOString(),
      success: false
    };

    try {
      await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
      
      // Wait for dynamic content
      await page.waitForTimeout(waitTime);
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(tags)
        .analyze();
      
      result.violations = accessibilityScanResults.violations;
      result.passes = accessibilityScanResults.passes;
      result.incomplete = accessibilityScanResults.incomplete;
      result.url = page.url();
      result.success = true;
      
      // Check for critical violations if failOnCritical is enabled
      const criticalViolations = accessibilityScanResults.violations.filter(v => v.impact === 'critical');
      if (failOnCritical && criticalViolations.length > 0) {
        result.error = `Found ${criticalViolations.length} critical accessibility violations`;
      }
      
      console.log(`Accessibility check completed for ${pageInfo.title}: ${accessibilityScanResults.violations.length} violations found`);
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      console.error(`Failed accessibility check for ${pageInfo.title}:`, error);
    }

    results.push(result);
  }

  // Generate summary
  const summary = generateAccessibilitySummary(results);

  // Save reports
  await generateAccessibilityReports(summary, outputDir);

  return summary;
}

/**
 * Run accessibility analysis on a single page
 */
export async function checkSinglePageAccessibility(
  page: Page,
  pagePath: string,
  options: Omit<AccessibilityOptions, 'pages'> = {}
): Promise<AccessibilityResult> {
  const {
    tags = ['wcag2a', 'wcag2aa', 'wcag21aa'],
    waitTime = 2000
  } = options;

  const pageInfo = pages.find(p => p.path === pagePath);
  const pageTitle = pageInfo?.title || 'Unknown';

  const result: AccessibilityResult = {
    page: pagePath,
    title: pageTitle,
    violations: [],
    passes: [],
    incomplete: [],
    url: '',
    timestamp: new Date().toISOString(),
    success: false
  };

  try {
    await page.goto(pagePath, { waitUntil: 'networkidle' });
    
    // Wait for dynamic content
    await page.waitForTimeout(waitTime);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(tags)
      .analyze();
    
    result.violations = accessibilityScanResults.violations;
    result.passes = accessibilityScanResults.passes;
    result.incomplete = accessibilityScanResults.incomplete;
    result.url = page.url();
    result.success = true;
    
    console.log(`Accessibility check completed for ${pageTitle}: ${accessibilityScanResults.violations.length} violations found`);
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error(`Failed accessibility check for ${pageTitle}:`, error);
  }

  return result;
}

/**
 * Generate accessibility summary from results
 */
function generateAccessibilitySummary(results: AccessibilityResult[]): AccessibilitySummary {
  const totalViolations = results.reduce((sum, result) => sum + result.violations.length, 0);
  const criticalViolations = results.reduce((sum, result) => 
    sum + result.violations.filter(v => v.impact === 'critical').length, 0);
  const seriousViolations = results.reduce((sum, result) => 
    sum + result.violations.filter(v => v.impact === 'serious').length, 0);
  const moderateViolations = results.reduce((sum, result) => 
    sum + result.violations.filter(v => v.impact === 'moderate').length, 0);
  const minorViolations = results.reduce((sum, result) => 
    sum + result.violations.filter(v => v.impact === 'minor').length, 0);

  return {
    totalPages: results.length,
    totalViolations,
    criticalViolations,
    seriousViolations,
    moderateViolations,
    minorViolations,
    overallStatus: criticalViolations === 0 ? 'PASS' : 'FAIL',
    results
  };
}

/**
 * Generate both markdown and JSON reports
 */
async function generateAccessibilityReports(
  summary: AccessibilitySummary,
  outputDir: string
): Promise<{ markdownPath: string; jsonPath: string }> {
  // Generate markdown report
  const reportContent = generateAccessibilityMarkdownReport(summary);
  const markdownPath = path.join(outputDir, 'accessibility-report.md');
  await fs.writeFile(markdownPath, reportContent);
  
  // Generate JSON report for detailed analysis
  const jsonPath = path.join(outputDir, 'accessibility-results.json');
  await fs.writeFile(jsonPath, JSON.stringify(summary, null, 2));
  
  console.log(`Accessibility reports saved to: ${outputDir}`);
  
  return { markdownPath, jsonPath };
}

/**
 * Generate markdown report from accessibility summary
 */
function generateAccessibilityMarkdownReport(summary: AccessibilitySummary): string {
  let report = `# Accessibility Report
  
Generated: ${new Date().toISOString()}

## Summary

- **Total Pages Tested**: ${summary.totalPages}
- **Total Violations**: ${summary.totalViolations}
- **Critical Violations**: ${summary.criticalViolations}
- **Serious Violations**: ${summary.seriousViolations}
- **Moderate Violations**: ${summary.moderateViolations}
- **Minor Violations**: ${summary.minorViolations}
- **Overall Status**: ${summary.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL (Critical issues found)'}

## Page Results

`;

  for (const result of summary.results) {
    const criticalCount = result.violations.filter(v => v.impact === 'critical').length;
    const seriousCount = result.violations.filter(v => v.impact === 'serious').length;
    const moderateCount = result.violations.filter(v => v.impact === 'moderate').length;
    const minorCount = result.violations.filter(v => v.impact === 'minor').length;
    
    report += `### ${result.title} (${result.page})

- **URL**: ${result.url}
- **Status**: ${result.success ? (criticalCount === 0 ? '✅ PASS' : '❌ FAIL') : '❌ ERROR'}
- **Total Violations**: ${result.violations.length}
- **Critical**: ${criticalCount} | **Serious**: ${seriousCount} | **Moderate**: ${moderateCount} | **Minor**: ${minorCount}
${result.error ? `- **Error**: ${result.error}` : ''}

`;

    if (result.violations.length > 0) {
      report += `#### Violations

`;
      for (const violation of result.violations) {
        report += `**${violation.id}** (${violation.impact})
- **Description**: ${violation.description}
- **Help**: ${violation.help}
- **Affected Elements**: ${violation.nodes.length}
- **Help URL**: [${violation.helpUrl}](${violation.helpUrl})

`;
      }
    }

    if (result.incomplete.length > 0) {
      report += `#### Incomplete Checks

`;
      for (const incomplete of result.incomplete) {
        report += `**${incomplete.id}**
- **Description**: ${incomplete.description}
- **Help**: ${incomplete.help}

`;
      }
    }

    report += `---

`;
  }

  report += `## Recommendations

### Critical Issues
${summary.criticalViolations > 0 ? 'Address all critical accessibility violations immediately as they prevent users from accessing content.' : 'No critical issues found! 🎉'}

### Serious Issues  
${summary.seriousViolations > 0 ? 'Address serious violations as they significantly impact user experience for assistive technology users.' : 'No serious issues found! 🎉'}

### Best Practices
- Regularly test with screen readers
- Ensure proper color contrast ratios
- Test keyboard navigation
- Validate semantic HTML structure
- Consider users with cognitive disabilities

---
*Report generated by Playwright Accessibility Crawler*`;

  return report;
}

/**
 * Get accessibility violations by impact level
 */
export function getViolationsByImpact(
  results: AccessibilityResult[],
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
): Array<{ page: string; title: string; violations: any[] }> {
  return results.map(result => ({
    page: result.page,
    title: result.title,
    violations: result.violations.filter(v => v.impact === impact)
  })).filter(item => item.violations.length > 0);
}

/**
 * Check if accessibility standards are met (no critical violations)
 */
export function isAccessibilityCompliant(summary: AccessibilitySummary): boolean {
  return summary.criticalViolations === 0;
}