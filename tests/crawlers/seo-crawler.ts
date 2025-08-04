import { Page } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { pages, createOutputDirectory } from '../test-settings';

export interface SEOOptions {
  outputDir?: string;
  pages?: Array<{ path: string; title: string }>;
  waitTime?: number;
  performanceThreshold?: number;
}

export interface SEOResult {
  page: string;
  title: string;
  url: string;
  meta: {
    title?: string;
    description?: string;
    keywords?: string;
    robots?: string;
    canonical?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    ogUrl?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    author?: string;
    generator?: string;
    viewport?: string;
    themeColor?: string;
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  images: Array<{
    src: string;
    alt?: string;
    title?: string;
    hasAlt: boolean;
  }>;
  links: Array<{
    href: string;
    text: string;
    title?: string;
    rel?: string;
    isExternal: boolean;
  }>;
  performance: {
    loadTime: number;
    domContentLoaded: number;
  };
  issues: string[];
  timestamp: string;
  success: boolean;
  error?: string;
}

export interface SEOSummary {
  totalPages: number;
  totalIssues: number;
  averageLoadTime: number;
  overallHealth: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  results: SEOResult[];
}

/**
 * Run SEO analysis on all specified pages
 */
export async function crawlSEO(
  page: Page,
  options: SEOOptions = {}
): Promise<SEOSummary> {
  const {
    outputDir = await createOutputDirectory('seo'),
    pages: targetPages = pages,
    waitTime = 2000,
    performanceThreshold = 3000
  } = options;

  const results: SEOResult[] = [];

  for (const pageInfo of targetPages) {
    const startTime = Date.now();
    let domContentLoadedTime = 0;
    
    // Listen for DOM content loaded
    page.on('domcontentloaded', () => {
      domContentLoadedTime = Date.now() - startTime;
    });

    const result: SEOResult = {
      page: pageInfo.path,
      title: pageInfo.title,
      url: '',
      meta: {},
      headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
      images: [],
      links: [],
      performance: { loadTime: 0, domContentLoaded: 0 },
      issues: [],
      timestamp: new Date().toISOString(),
      success: false
    };

    try {
      await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
      
      const loadTime = Date.now() - startTime;
      
      // Wait for dynamic content
      await page.waitForTimeout(waitTime);
      
      result.url = page.url();
      result.meta = await extractMetaData(page);
      result.headings = await extractHeadings(page);
      result.images = await extractImages(page);
      result.links = await extractLinks(page);
      result.performance = {
        loadTime,
        domContentLoaded: domContentLoadedTime
      };
      
      // Analyze for SEO issues
      result.issues = analyzeSEOIssues(result, performanceThreshold);
      result.success = true;
      
      console.log(`SEO analysis completed for ${pageInfo.title}: ${result.issues.length} issues found`);
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      console.error(`Failed SEO analysis for ${pageInfo.title}:`, error);
    }

    results.push(result);
  }

  // Generate summary
  const summary = generateSEOSummary(results);

  // Save reports
  await generateSEOReports(summary, outputDir);

  return summary;
}

/**
 * Run SEO analysis on a single page
 */
export async function analyzeSinglePageSEO(
  page: Page,
  pagePath: string,
  options: Omit<SEOOptions, 'pages'> = {}
): Promise<SEOResult> {
  const {
    waitTime = 2000,
    performanceThreshold = 3000
  } = options;

  const pageInfo = pages.find(p => p.path === pagePath);
  const pageTitle = pageInfo?.title || 'Unknown';

  const startTime = Date.now();
  let domContentLoadedTime = 0;
  
  // Listen for DOM content loaded
  page.on('domcontentloaded', () => {
    domContentLoadedTime = Date.now() - startTime;
  });

  const result: SEOResult = {
    page: pagePath,
    title: pageTitle,
    url: '',
    meta: {},
    headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
    images: [],
    links: [],
    performance: { loadTime: 0, domContentLoaded: 0 },
    issues: [],
    timestamp: new Date().toISOString(),
    success: false
  };

  try {
    await page.goto(pagePath, { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Wait for dynamic content
    await page.waitForTimeout(waitTime);
    
    result.url = page.url();
    result.meta = await extractMetaData(page);
    result.headings = await extractHeadings(page);
    result.images = await extractImages(page);
    result.links = await extractLinks(page);
    result.performance = {
      loadTime,
      domContentLoaded: domContentLoadedTime
    };
    
    // Analyze for SEO issues
    result.issues = analyzeSEOIssues(result, performanceThreshold);
    result.success = true;
    
    console.log(`SEO analysis completed for ${pageTitle}: ${result.issues.length} issues found`);
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error(`Failed SEO analysis for ${pageTitle}:`, error);
  }

  return result;
}

/**
 * Extract meta data from the page
 */
async function extractMetaData(page: Page) {
  return await page.evaluate(() => {
    const meta: any = {};
    
    // Title
    meta.title = document.title;
    
    // Meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach((tag: any) => {
      const name = tag.getAttribute('name') || tag.getAttribute('property');
      const content = tag.getAttribute('content');
      
      if (name && content) {
        switch (name.toLowerCase()) {
          case 'description':
            meta.description = content;
            break;
          case 'keywords':
            meta.keywords = content;
            break;
          case 'robots':
            meta.robots = content;
            break;
          case 'author':
            meta.author = content;
            break;
          case 'generator':
            meta.generator = content;
            break;
          case 'viewport':
            meta.viewport = content;
            break;
          case 'theme-color':
            meta.themeColor = content;
            break;
          case 'og:title':
            meta.ogTitle = content;
            break;
          case 'og:description':
            meta.ogDescription = content;
            break;
          case 'og:image':
            meta.ogImage = content;
            break;
          case 'og:type':
            meta.ogType = content;
            break;
          case 'og:url':
            meta.ogUrl = content;
            break;
          case 'twitter:card':
            meta.twitterCard = content;
            break;
          case 'twitter:title':
            meta.twitterTitle = content;
            break;
          case 'twitter:description':
            meta.twitterDescription = content;
            break;
          case 'twitter:image':
            meta.twitterImage = content;
            break;
        }
      }
    });
    
    // Canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      meta.canonical = canonical.getAttribute('href');
    }
    
    return meta;
  });
}

/**
 * Extract heading structure from the page
 */
async function extractHeadings(page: Page) {
  return await page.evaluate(() => {
    const headings: any = {
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: []
    };
    
    for (let i = 1; i <= 6; i++) {
      const elements = document.querySelectorAll(`h${i}`);
      elements.forEach((el: any) => {
        headings[`h${i}`].push(el.textContent?.trim() || '');
      });
    }
    
    return headings;
  });
}

/**
 * Extract image information from the page
 */
async function extractImages(page: Page) {
  return await page.evaluate(() => {
    const images: any[] = [];
    const imgElements = document.querySelectorAll('img');
    
    imgElements.forEach((img: any) => {
      const src = img.getAttribute('src') || img.getAttribute('data-src');
      const alt = img.getAttribute('alt');
      const title = img.getAttribute('title');
      
      if (src) {
        images.push({
          src,
          alt,
          title,
          hasAlt: Boolean(alt)
        });
      }
    });
    
    return images;
  });
}

/**
 * Extract link information from the page
 */
async function extractLinks(page: Page) {
  return await page.evaluate(() => {
    const links: any[] = [];
    const linkElements = document.querySelectorAll('a[href]');
    
    linkElements.forEach((link: any) => {
      const href = link.getAttribute('href');
      const text = link.textContent?.trim() || '';
      const title = link.getAttribute('title');
      const rel = link.getAttribute('rel');
      
      if (href) {
        const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
        
        links.push({
          href,
          text,
          title,
          rel,
          isExternal
        });
      }
    });
    
    return links;
  });
}

/**
 * Analyze SEO issues for a given result
 */
function analyzeSEOIssues(result: SEOResult, performanceThreshold: number): string[] {
  const issues: string[] = [];
  
  // Title issues
  if (!result.meta.title) {
    issues.push('Missing page title');
  } else if (result.meta.title.length < 30) {
    issues.push('Page title too short (recommended: 30-60 characters)');
  } else if (result.meta.title.length > 60) {
    issues.push('Page title too long (recommended: 30-60 characters)');
  }
  
  // Meta description issues
  if (!result.meta.description) {
    issues.push('Missing meta description');
  } else if (result.meta.description.length < 120) {
    issues.push('Meta description too short (recommended: 120-160 characters)');
  } else if (result.meta.description.length > 160) {
    issues.push('Meta description too long (recommended: 120-160 characters)');
  }
  
  // Heading structure issues
  if (result.headings.h1.length === 0) {
    issues.push('Missing H1 heading');
  } else if (result.headings.h1.length > 1) {
    issues.push('Multiple H1 headings found (should be unique)');
  }
  
  // Image issues
  const imagesWithoutAlt = result.images.filter(img => !img.hasAlt);
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images missing alt text`);
  }
  
  // Open Graph issues
  if (!result.meta.ogTitle) {
    issues.push('Missing Open Graph title');
  }
  if (!result.meta.ogDescription) {
    issues.push('Missing Open Graph description');
  }
  if (!result.meta.ogImage) {
    issues.push('Missing Open Graph image');
  }
  
  // Performance issues
  if (result.performance.loadTime > performanceThreshold) {
    issues.push(`Slow page load time (>${performanceThreshold / 1000} seconds)`);
  }
  
  // External links without rel attributes
  const externalLinksWithoutRel = result.links.filter(link => 
    link.isExternal && (!link.rel || (!link.rel.includes('noopener') && !link.rel.includes('noreferrer')))
  );
  if (externalLinksWithoutRel.length > 0) {
    issues.push(`${externalLinksWithoutRel.length} external links missing security attributes (rel="noopener noreferrer")`);
  }
  
  return issues;
}

/**
 * Generate SEO summary from results
 */
function generateSEOSummary(results: SEOResult[]): SEOSummary {
  const totalIssues = results.reduce((sum, result) => sum + result.issues.length, 0);
  const avgLoadTime = results.reduce((sum, result) => sum + result.performance.loadTime, 0) / results.length;
  
  let overallHealth: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT';
  if (totalIssues === 0) {
    overallHealth = 'EXCELLENT';
  } else if (totalIssues < 10) {
    overallHealth = 'GOOD';
  } else {
    overallHealth = 'NEEDS_IMPROVEMENT';
  }

  return {
    totalPages: results.length,
    totalIssues,
    averageLoadTime: Math.round(avgLoadTime),
    overallHealth,
    results
  };
}

/**
 * Generate both markdown and JSON reports
 */
async function generateSEOReports(
  summary: SEOSummary,
  outputDir: string
): Promise<{ markdownPath: string; jsonPath: string }> {
  // Generate markdown report
  const reportContent = generateSEOMarkdownReport(summary);
  const markdownPath = path.join(outputDir, 'seo-report.md');
  await fs.writeFile(markdownPath, reportContent);
  
  // Generate JSON report for detailed analysis
  const jsonPath = path.join(outputDir, 'seo-results.json');
  await fs.writeFile(jsonPath, JSON.stringify(summary, null, 2));
  
  console.log(`SEO reports saved to: ${outputDir}`);
  
  return { markdownPath, jsonPath };
}

/**
 * Generate markdown report from SEO summary
 */
function generateSEOMarkdownReport(summary: SEOSummary): string {
  let report = `# SEO Analysis Report
  
Generated: ${new Date().toISOString()}

## Summary

- **Total Pages Analyzed**: ${summary.totalPages}
- **Total SEO Issues**: ${summary.totalIssues}
- **Average Load Time**: ${summary.averageLoadTime}ms
- **Overall SEO Health**: ${summary.overallHealth === 'EXCELLENT' ? '✅ EXCELLENT' : summary.overallHealth === 'GOOD' ? '⚠️ GOOD' : '❌ NEEDS IMPROVEMENT'}

## Page Analysis

`;

  for (const result of summary.results) {
    report += `### ${result.title} (${result.page})

- **URL**: ${result.url}
- **Status**: ${result.success ? '✅ Success' : '❌ Failed'}
- **Load Time**: ${result.performance.loadTime}ms
- **DOM Content Loaded**: ${result.performance.domContentLoaded}ms
- **Issues Found**: ${result.issues.length}
${result.error ? `- **Error**: ${result.error}` : ''}

#### Meta Data
- **Title**: ${result.meta.title || 'Missing'} ${result.meta.title ? `(${result.meta.title.length} chars)` : ''}
- **Description**: ${result.meta.description || 'Missing'} ${result.meta.description ? `(${result.meta.description.length} chars)` : ''}
- **Keywords**: ${result.meta.keywords || 'Not specified'}
- **Canonical URL**: ${result.meta.canonical || 'Not specified'}

#### Open Graph Data
- **OG Title**: ${result.meta.ogTitle || 'Missing'}
- **OG Description**: ${result.meta.ogDescription || 'Missing'}
- **OG Image**: ${result.meta.ogImage || 'Missing'}
- **OG Type**: ${result.meta.ogType || 'Not specified'}

#### Twitter Card Data
- **Twitter Card**: ${result.meta.twitterCard || 'Not specified'}
- **Twitter Title**: ${result.meta.twitterTitle || 'Not specified'}
- **Twitter Description**: ${result.meta.twitterDescription || 'Not specified'}
- **Twitter Image**: ${result.meta.twitterImage || 'Not specified'}

#### Content Structure
- **H1 Headings**: ${result.headings.h1.length} (${result.headings.h1.join(', ') || 'None'})
- **H2 Headings**: ${result.headings.h2.length}
- **H3 Headings**: ${result.headings.h3.length}
- **Total Images**: ${result.images.length}
- **Images with Alt Text**: ${result.images.filter(img => img.hasAlt).length}
- **Total Links**: ${result.links.length}
- **External Links**: ${result.links.filter(link => link.isExternal).length}

`;

    if (result.issues.length > 0) {
      report += `#### SEO Issues

`;
      for (const issue of result.issues) {
        report += `- ❌ ${issue}
`;
      }
    } else {
      report += `#### SEO Issues
- ✅ No issues found!

`;
    }

    report += `---

`;
  }

  report += `## Overall Recommendations

### Critical Issues
${summary.results.some(r => r.issues.some(i => i.includes('Missing'))) ? 
  '- Fix all missing meta tags and essential SEO elements' : 
  '- No critical missing elements found! 🎉'}

### Performance
- Optimize page load times (target: <3 seconds)
- Compress images and optimize assets
- Implement proper caching strategies

### Content Optimization
- Ensure unique, descriptive titles for each page
- Write compelling meta descriptions
- Use proper heading hierarchy (H1 → H2 → H3)
- Add alt text to all images

### Social Media
- Complete Open Graph and Twitter Card metadata
- Use high-quality social sharing images
- Test social sharing appearance

### Technical SEO
- Implement proper canonical URLs
- Add security attributes to external links
- Ensure mobile-friendly design
- Submit XML sitemap to search engines

---
*Report generated by Playwright SEO Crawler*`;

  return report;
}

/**
 * Get pages with specific SEO issues
 */
export function getPagesByIssueType(
  results: SEOResult[],
  issueType: string
): Array<{ page: string; title: string; issues: string[] }> {
  return results.map(result => ({
    page: result.page,
    title: result.title,
    issues: result.issues.filter(issue => issue.toLowerCase().includes(issueType.toLowerCase()))
  })).filter(item => item.issues.length > 0);
}

/**
 * Check if SEO standards are met (no critical issues)
 */
export function isSEOCompliant(summary: SEOSummary): boolean {
  return summary.overallHealth === 'EXCELLENT';
}

/**
 * Get performance metrics summary
 */
export function getPerformanceMetrics(results: SEOResult[]): {
  averageLoadTime: number;
  fastestPage: { page: string; loadTime: number };
  slowestPage: { page: string; loadTime: number };
} {
  const loadTimes = results.map(r => ({ page: r.page, loadTime: r.performance.loadTime }));
  const averageLoadTime = loadTimes.reduce((sum, item) => sum + item.loadTime, 0) / loadTimes.length;
  const fastestPage = loadTimes.reduce((fastest, current) => 
    current.loadTime < fastest.loadTime ? current : fastest);
  const slowestPage = loadTimes.reduce((slowest, current) => 
    current.loadTime > slowest.loadTime ? current : slowest);

  return {
    averageLoadTime: Math.round(averageLoadTime),
    fastestPage,
    slowestPage
  };
}