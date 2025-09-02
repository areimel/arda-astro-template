# Content Scraper Research & Planning Document

## Project Overview

This document outlines the research findings and implementation plan for replacing the existing file-system based content scraper with a new Playwright-based solution that generates AI-optimized documentation following the llms.txt standard.

## Research Findings

### The llms.txt Standard

**Origin**: Proposed in September 2024 by Jeremy Howard (Co-Founder of Answer.AI)
**Purpose**: Standardize AI-readable website content to help language models efficiently process website information

#### Core Specifications

1. **File Location**: Must be accessible at domain root (`/llms.txt`)
2. **Format**: Structured Markdown with specific syntax requirements
3. **Structure**:
   - Single H1 heading (`#`) for project/site name (REQUIRED)
   - Blockquote (`>`) for summary/description
   - H2 sections (`##`) for content organization
   - Structured links with descriptions

#### Example Format:
```markdown
# Project Name
> Brief project summary or description

## Core Documentation
- [Quick Start](url): Description of the resource
- [API Reference](url): API documentation details

## Additional Resources
- [Examples](url): Code examples and tutorials
- [Community](url): Community resources and support
```

#### Key Benefits
- **Context Window Optimization**: Removes HTML noise and focuses on content
- **AI Processing Efficiency**: Structured format optimized for language models
- **Content Curation**: Provides guided access to most important information
- **Real-time Processing**: Designed for inference-time usage vs indexed content

### Comparison to Other Standards

| Standard | Purpose | Target | Content Type |
|----------|---------|--------|--------------|
| `robots.txt` | Access control for crawlers | Search engines | Rules/permissions |
| `sitemap.xml` | Site structure mapping | Search engines | URL listings |
| `llms.txt` | Content guidance for AI | Language models | Curated content |

### Current Adoption

**Early Adopters**: Anthropic, Mintlify, Cursor, Zapier, Hugging Face
**Tools Available**: 
- Markdowner (open-source converter)
- Website LLMs (WordPress plugin)
- FireCrawl (content extraction tool)
- LiveChatAI LLMs.txt Generator

## Implementation Strategy

### Current Problem Analysis

**Existing Tool Issues**:
- File system access problems outside tool directory
- Complex TypeScript setup with multiple dependencies
- Direct HTML parsing without proper rendering context
- Path resolution issues across different environments

### Proposed Solution: Playwright-Based Scraper

#### Architecture Benefits
1. **Web Navigation**: Uses actual browser rendering vs file system access
2. **JavaScript Execution**: Handles dynamic content properly
3. **Existing Integration**: Leverages current Playwright setup
4. **Consistent Environment**: Same browser context as screenshot tool

#### Content Processing Strategy

**Page Discovery Methods**:
1. **Sitemap Parsing**: Read existing sitemap.xml for comprehensive page list
2. **Site Navigation**: Crawl from homepage following internal links
3. **Build Directory Scan**: Fallback to scanning built site structure

**Content Extraction Logic**:
1. **Main Content Focus**: Target primary content areas, skip navigation/footer
2. **Hierarchy Preservation**: Maintain heading structure and content order
3. **Text Cleaning**: Remove excessive whitespace and formatting artifacts
4. **Link Processing**: Include relevant internal/external links with context

**llms.txt Generation**:
```markdown
# ARDA Astro Template
> Modern SAAS/startup website template built with Astro and TailwindCSS

## Homepage
[Extracted homepage content in order of appearance]
- Hero section content
- Feature descriptions
- Call-to-action information

## About
[About page content with company information]

## Blog
[Blog content and post summaries]
- Recent posts with descriptions
- Category information

## Products/Services
[Product or service descriptions]

## Contact
[Contact information and form details]
```

### Technical Implementation Plan

#### Directory Structure
```
/scripts/                   # Simplified script directory (matches screenshot tool pattern)
  ├── generate-screenshot.js # Screenshot generation script
  └── generate-llms.js       # Content scraper script (consolidated)

/tools_output/              # Unified output directory
  ├── screenshots/          # Screenshot tool outputs
  ├── llms.txt             # Detailed scraper output
  └── logs/                # Tool execution logs

/docs/                     # Documentation
  └── content-scraper-research.md  # This document
```

#### Core Components (Consolidated into Single Script)

1. **Site Discovery Module**: Identify all pages to process via sitemap.xml and crawling
2. **Content Extractor**: Extract meaningful content from each page using Playwright
3. **Markdown Generator**: Format content following llms.txt standard
4. **Output Manager**: Handle file writing to both tools_output/ and public/ directories
5. **CLI Interface**: Built-in command-line options and argument parsing
6. **Logging System**: Comprehensive execution tracking and error handling

All components are consolidated into `/scripts/generate-llms.js` following the same simple pattern as the screenshot tool.

#### Integration Points

**Package.json Scripts**:
- `tools:scrape` - Generate llms.txt from built site (`node scripts/generate-llms.js`)
- `tools:scrape:preview` - Preview output without writing files (`node scripts/generate-llms.js --preview`)
- `tools:scrape:verbose` - Detailed logging (`node scripts/generate-llms.js --verbose`)
- `build:with-llms` - Complete build cycle with llms.txt generation

**Output Strategy**:
- **Development**: Detailed output to `/tools_output/llms.txt`
- **Production**: Optimized copy to `/public/llms.txt` for web serving
- **Logging**: Execution logs to `/tools_output/logs/scraper.log`

### Quality Assurance Plan

#### Content Quality Controls
1. **Content Filtering**: Skip irrelevant elements (nav, ads, footers)
2. **Text Normalization**: Consistent spacing and formatting
3. **Link Validation**: Verify internal links and include relevant external links
4. **Structure Validation**: Ensure proper llms.txt format compliance

#### Testing Strategy
1. **Page Coverage**: Verify all site pages are discovered and processed
2. **Content Accuracy**: Validate extracted content matches source pages
3. **Format Compliance**: Test against llms.txt standard requirements
4. **Output Verification**: Check both development and production outputs
5. **Error Handling**: Test with various site conditions and edge cases

## Success Metrics

1. **Complete Page Coverage**: All site pages included in output
2. **Content Fidelity**: Extracted content accurately represents source
3. **Format Compliance**: Generated file follows llms.txt standard
4. **File System Reliability**: No path or access issues
5. **AI Readability**: Content optimized for language model processing

## Future Considerations

1. **Incremental Updates**: Track page changes for selective regeneration
2. **Content Prioritization**: Weight important pages higher in output
3. **Multi-format Support**: Generate additional AI-optimized formats
4. **Performance Optimization**: Parallel page processing for large sites
5. **Content Analysis**: Quality metrics and content coverage reporting

## Implementation Results

### ✅ **Successfully Completed - September 1, 2025**

**Refactor Achievement**: Successfully consolidated complex 3-file structure into single script following screenshot tool pattern.

**Final Architecture**:
- **Single file**: `/scripts/generate-llms.js` (393 lines, fully consolidated)
- **Same pattern**: Matches existing `/scripts/generate-screenshot.js` structure
- **Zero complexity**: No separate directories, no module dependencies
- **100% functionality**: All original features preserved and working

**Test Results**:
- ✅ **10/10 pages processed** successfully
- ✅ **20.4 KB llms.txt** generated with proper format
- ✅ **Dual output** to both `tools_output/` and `public/` directories
- ✅ **All CLI options** working (preview, verbose, help, custom URL)
- ✅ **Logging system** operational and writing to `tools_output/logs/`

**Performance**:
- No file access issues (original problem solved)
- Fast execution via Playwright browser automation
- Reliable sitemap discovery + fallback crawling
- Clean llms.txt format compliance

This refactor successfully simplified the architecture while maintaining all functionality and following established project patterns.

---

*Document created: 2025-08-31*
*Last updated: 2025-09-01*
*Project: ARDA Astro Template Content Scraper*