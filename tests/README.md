# Unified Test Runner

A comprehensive Playwright-based testing suite that orchestrates screenshot capture, accessibility testing, and SEO analysis for your web application.

## Overview

The Unified Test Runner provides a single entry point to run all website testing capabilities:

- **📸 Screenshot Crawler**: Captures full-page screenshots across multiple viewports
- **♿ Accessibility Crawler**: Performs comprehensive WCAG compliance testing
- **🔍 SEO Crawler**: Analyzes on-page SEO elements and performance

## Quick Start

### Run All Tests
```bash
pnpm test:session
```

### Run Individual Test Suites
```bash
# Screenshots only
pnpm test:screenshots

# Desktop screenshots only  
pnpm test:screenshots-desktop

# Laptop screenshots only
pnpm test:screenshots-laptop

# Mobile screenshots only
pnpm test:screenshots-mobile

# Accessibility only
pnpm test:accessibility

# SEO only
pnpm test:seo
```

### Run Complete Test Suite
```bash
# Run all tests in a unified session
pnpm test:all
```

## Architecture

### File Structure
```
tests/
├── test-runner.spec.ts          # Unified test orchestrator
├── test-settings.ts             # Shared configuration and utilities
├── crawlers/                    # Modular test utilities
│   ├── index.ts                 # Crawler exports
│   ├── screenshot-crawler.ts    # Screenshot functionality
│   ├── accessibility-crawler.ts # Accessibility testing
│   └── seo-crawler.ts          # SEO analysis
└── README.md                   # This file
```

### Session Management

The test runner uses a **unified session timestamp** system:

- All tests in a session share the same timestamp ID
- Results are organized under `test-results/{timestamp}/`
- Each test type gets its own subdirectory but maintains session coherence

### Output Structure
```
test-results/
└── 2024-01-15T10-30-45/
    ├── test-session-summary.md     # Unified report
    ├── test-session-results.json   # Machine-readable results
    ├── screenshots/                # All captured screenshots
    │   ├── home_desktop.png
    │   ├── home_laptop.png
    │   └── home_mobile.png
    ├── accessibility/              # Accessibility test results
    │   ├── accessibility-report.md
    │   └── accessibility-results.json
    └── seo/                       # SEO analysis results
        ├── seo-report.md
        └── seo-results.json
```

## Configuration

### Pages Under Test
Configure the pages to test in `test-settings.ts`:

```typescript
export const pages = [
  { path: '/', title: 'Home' },
  { path: '/about', title: 'About' },
  { path: '/blog', title: 'Blog' },
  // Add more pages as needed
];
```

### Viewport Configurations
Customize viewports for screenshot testing:

```typescript
export const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'mobile', width: 375, height: 667 }
];
```

## Test Capabilities

### Screenshot Crawler
- Captures full-page screenshots across all configured viewports
- Waits for network idle and dynamic content
- Disables animations for consistent results
- Organized by page and viewport combination

### Accessibility Crawler
- Uses axe-core for comprehensive WCAG testing
- Tests against WCAG 2.0 A, AA, and 2.1 AA standards
- Generates detailed violation reports with remediation guidance
- Fails tests on critical accessibility violations

### SEO Crawler
- Extracts meta tags, headings, images, and links
- Analyzes page performance metrics
- Validates Open Graph and Twitter Card metadata
- Identifies SEO optimization opportunities
- Checks for missing alt text and proper link attributes

## Test Results

### Individual Reports
Each test type generates detailed reports:

- **Screenshots**: Visual captures for manual review
- **Accessibility**: WCAG compliance report with violation details
- **SEO**: Comprehensive analysis with optimization recommendations

### Unified Session Report
The test runner generates a unified summary that includes:

- Overall test status across all suites
- Key metrics and quick navigation
- Prioritized action items
- Links to detailed reports

### Programmatic Access
JSON results files enable:
- CI/CD integration
- Custom reporting
- Trend analysis
- Automated quality gates

## Best Practices

### Running Tests
1. **Start development server** before running tests (`pnpm dev`)
2. **Use consistent environment** for reliable results  
3. **Run complete suite** for comprehensive coverage
4. **Review all reports** to understand full picture

### Interpreting Results
1. **Critical accessibility violations** require immediate attention
2. **Missing meta tags** impact SEO performance
3. **Slow load times** affect user experience and rankings
4. **Screenshot differences** may indicate layout issues

### Integration
- **CI/CD**: Integrate into deployment pipeline
- **Quality Gates**: Fail builds on critical issues
- **Monitoring**: Track trends over time
- **Team Review**: Share reports with stakeholders

## Troubleshooting

### Common Issues

**Tests fail to start:**
- Ensure development server is running (`pnpm dev`)
- Check that all pages are accessible
- Verify Playwright is installed

**Accessibility tests fail:**
- Review violation details in the report
- Focus on critical and serious issues first
- Test with actual assistive technology

**Screenshots look inconsistent:**
- Check for loading animations or dynamic content
- Increase wait times if needed
- Ensure fonts and assets load completely

**SEO issues reported:**
- Review meta tag implementation
- Check for missing alt text on images
- Optimize page load performance

## Clean Up

To clean old test results:
```bash
pnpm test:clean
```

---

*For questions or issues, refer to the Playwright documentation or create an issue in the project repository.*