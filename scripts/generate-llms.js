import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

class ContentScraper {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:4321';
    this.siteName = options.siteName || 'ARDA Astro Template';
    this.siteDescription = options.siteDescription || 'Modern SAAS/startup website template built with Astro and TailwindCSS';
    this.browser = null;
    this.page = null;
    this.verbose = options.verbose || false;
  }

  async initialize() {
    if (this.verbose) console.log('🚀 Initializing Playwright browser...');
    this.browser = await chromium.launch();
    this.page = await this.browser.newPage();
    
    // Set user agent to avoid blocking
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async discoverPages() {
    if (this.verbose) console.log('🔍 Discovering site pages...');
    
    const pages = new Set();
    
    try {
      // Try to get sitemap first
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`;
      if (this.verbose) console.log(`📄 Checking sitemap at: ${sitemapUrl}`);
      
      try {
        await this.page.goto(sitemapUrl, { waitUntil: 'networkidle' });
        const sitemapContent = await this.page.content();
        
        // Extract URLs from sitemap
        const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
        if (urlMatches) {
          urlMatches.forEach(match => {
            const url = match.replace(/<\/?loc>/g, '');
            // Convert absolute URLs to relative paths for our local server
            const relativePath = url.replace(/https?:\/\/[^/]+/, '');
            pages.add(relativePath || '/');
          });
          if (this.verbose) console.log(`✅ Found ${pages.size} pages in sitemap`);
        }
      } catch (sitemapError) {
        if (this.verbose) console.log('⚠️  Sitemap not found, using manual discovery');
      }

      // Fallback: discover pages by crawling
      if (pages.size === 0) {
        await this.crawlForPages(pages);
      }

    } catch (error) {
      console.error('❌ Error discovering pages:', error);
      // Fallback to common pages
      pages.add('/');
      pages.add('/about');
      pages.add('/blog');
      pages.add('/contact');
      pages.add('/pricing');
    }

    return Array.from(pages).sort();
  }

  async crawlForPages(pages, startUrl = '/', visited = new Set()) {
    if (visited.has(startUrl) || visited.size > 50) return; // Prevent infinite loops
    
    visited.add(startUrl);
    
    try {
      const fullUrl = `${this.baseUrl}${startUrl}`;
      if (this.verbose) console.log(`🔗 Crawling: ${fullUrl}`);
      
      await this.page.goto(fullUrl, { waitUntil: 'networkidle' });
      pages.add(startUrl);

      // Find internal links
      const links = await this.page.$$eval('a[href]', links => 
        links
          .map(link => link.getAttribute('href'))
          .filter(href => 
            href && 
            !href.startsWith('http') && 
            !href.startsWith('#') && 
            !href.includes('mailto:') &&
            !href.endsWith('.pdf') &&
            !href.endsWith('.jpg') &&
            !href.endsWith('.png')
          )
          .map(href => href.split('#')[0]) // Remove anchors
          .filter((href, index, arr) => arr.indexOf(href) === index) // Deduplicate
      );

      // Recursively crawl found links
      for (const link of links.slice(0, 10)) { // Limit to prevent too many requests
        await this.crawlForPages(pages, link, visited);
      }

    } catch (error) {
      if (this.verbose) console.log(`⚠️  Could not crawl ${startUrl}: ${error.message}`);
    }
  }

  async extractPageContent(pagePath) {
    const fullUrl = `${this.baseUrl}${pagePath}`;
    
    try {
      if (this.verbose) console.log(`📄 Processing: ${fullUrl}`);
      
      await this.page.goto(fullUrl, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(1000); // Give content time to render

      // Extract page data
      const pageData = await this.page.evaluate(() => {
        // Helper function to clean text
        const cleanText = (text) => {
          return text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim();
        };

        // Get page title
        const title = document.querySelector('title')?.textContent || 
                     document.querySelector('h1')?.textContent || 
                     'Untitled Page';

        // Get meta description
        const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

        // Extract main content, avoiding navigation and footer
        const contentSelectors = [
          'main',
          'article', 
          '.content',
          '.main-content',
          '[role="main"]'
        ];
        
        let mainContentElement = null;
        for (const selector of contentSelectors) {
          mainContentElement = document.querySelector(selector);
          if (mainContentElement) break;
        }

        // Fallback to body if no main content found
        if (!mainContentElement) {
          mainContentElement = document.body;
        }

        // Remove unwanted elements
        const elementsToRemove = mainContentElement.querySelectorAll(
          'nav, header, footer, aside, .navbar, .nav, .navigation, .sidebar, .menu, script, style, noscript, [class*="cookie"], [class*="banner"]'
        );
        elementsToRemove.forEach(el => el.remove());

        // Extract structured content
        const content = {
          headings: [],
          paragraphs: [],
          lists: [],
          links: []
        };

        // Get headings in order
        const headings = mainContentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          const level = parseInt(heading.tagName.charAt(1));
          const text = cleanText(heading.textContent);
          if (text) {
            content.headings.push({ level, text });
          }
        });

        // Get paragraphs
        const paragraphs = mainContentElement.querySelectorAll('p');
        paragraphs.forEach(p => {
          const text = cleanText(p.textContent);
          if (text && text.length > 20) { // Filter out very short paragraphs
            content.paragraphs.push(text);
          }
        });

        // Get lists
        const lists = mainContentElement.querySelectorAll('ul, ol');
        lists.forEach(list => {
          const items = Array.from(list.querySelectorAll('li')).map(li => cleanText(li.textContent));
          if (items.length > 0) {
            content.lists.push({
              type: list.tagName.toLowerCase(),
              items: items.filter(item => item.length > 0)
            });
          }
        });

        // Get important links
        const links = mainContentElement.querySelectorAll('a[href]');
        const linkData = [];
        links.forEach(link => {
          const href = link.getAttribute('href');
          const text = cleanText(link.textContent);
          if (text && href && !href.startsWith('#')) {
            linkData.push({ text, href });
          }
        });
        content.links = linkData.slice(0, 10); // Limit to most important links

        return {
          title: cleanText(title),
          description: metaDescription,
          content
        };
      });

      return {
        path: pagePath,
        url: fullUrl,
        ...pageData
      };

    } catch (error) {
      if (this.verbose) console.error(`❌ Error extracting content from ${pagePath}:`, error);
      return null;
    }
  }

  formatAsLlmsTxt(pages) {
    if (this.verbose) console.log('📝 Formatting content as llms.txt...');
    
    let output = `# ${this.siteName}\n`;
    output += `> ${this.siteDescription}\n\n`;

    pages.forEach(pageData => {
      if (!pageData) return;

      // Create section for each page
      const sectionTitle = this.formatSectionTitle(pageData.path, pageData.title);
      output += `## ${sectionTitle}\n\n`;

      // Add page description if available
      if (pageData.description) {
        output += `${pageData.description}\n\n`;
      }

      // Add content in order: headings with context
      const content = pageData.content;

      // Process content by headings and associated content
      content.headings.forEach((heading) => {
        if (heading.level <= 2) {
          output += `### ${heading.text}\n\n`;
        } else {
          output += `**${heading.text}**\n\n`;
        }
      });

      // Add paragraphs
      content.paragraphs.forEach(paragraph => {
        output += `${paragraph}\n\n`;
      });

      // Add lists
      content.lists.forEach(list => {
        list.items.forEach(item => {
          const bullet = list.type === 'ol' ? '1.' : '-';
          output += `${bullet} ${item}\n`;
        });
        output += '\n';
      });

      // Add important links
      if (content.links.length > 0) {
        output += '**Key Links:**\n\n';
        content.links.forEach(link => {
          output += `- [${link.text}](${link.href})\n`;
        });
        output += '\n';
      }

      output += '---\n\n';
    });

    return output;
  }

  formatSectionTitle(path, title) {
    if (path === '/') return 'Homepage';
    
    // Create readable section names
    const pathName = path.replace(/^\//, '').replace(/\/$/, '');
    if (!pathName) return 'Homepage';
    
    // Use title if available, otherwise format path
    if (title && title !== 'Untitled Page' && !title.includes('ARDA Astro Template')) {
      return title;
    }
    
    return pathName
      .split('/')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' / ');
  }

  async scrapeAllContent() {
    try {
      await this.initialize();
      
      const pages = await this.discoverPages();
      if (this.verbose) console.log(`📊 Found ${pages.length} pages to process`);

      const pageContents = [];
      let processed = 0;

      for (const pagePath of pages) {
        const content = await this.extractPageContent(pagePath);
        if (content) {
          pageContents.push(content);
          processed++;
          if (this.verbose) console.log(`✅ Processed ${processed}/${pages.length}: ${content.title}`);
        }
      }

      const llmsTxt = this.formatAsLlmsTxt(pageContents);
      
      return {
        content: llmsTxt,
        stats: {
          totalPages: pages.length,
          processedPages: processed,
          contentLength: llmsTxt.length
        }
      };

    } finally {
      await this.close();
    }
  }
}

async function generateLlmsTxt() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let baseUrl = 'http://localhost:4322';
  let preview = false;
  let verbose = false;
  let help = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--preview':
      case '-p':
        preview = true;
        break;
      case '--verbose':
      case '-v':
        verbose = true;
        break;
      case '--help':
      case '-h':
        help = true;
        break;
      case '--base-url':
      case '-u':
        if (nextArg && !nextArg.startsWith('-')) {
          baseUrl = nextArg;
          i++;
        }
        break;
    }
  }

  if (help) {
    console.log(`
🤖 ARDA Content Scraper - Generate llms.txt files using Playwright

USAGE:
  node scripts/generate-llms.js [OPTIONS]

OPTIONS:
  -p, --preview              Preview mode - show output without writing files
  -v, --verbose              Enable verbose logging
  -h, --help                Show this help message
  -u, --base-url <url>       Base URL to scrape (default: http://localhost:4322)

EXAMPLES:
  node scripts/generate-llms.js                    # Basic scraping
  node scripts/generate-llms.js --preview          # Preview without saving
  node scripts/generate-llms.js --verbose          # Detailed logging
  node scripts/generate-llms.js --base-url http://localhost:4322  # Custom URL

NOTES:
  • Make sure your development server is running before scraping
  • Run 'pnpm build && pnpm preview' to start the preview server
  • Files are saved to both tools_output/ and public/ directories
  • Use --preview to test without writing files
`);
    return;
  }

  console.log('🚀 Starting ARDA Content Scraper...');
  console.log(`📡 Target URL: ${baseUrl}`);

  if (verbose) {
    console.log(`⚙️  Configuration:`);
    console.log(`   • Preview Mode: ${preview ? 'enabled' : 'disabled'}`);
    console.log(`   • Verbose Logging: enabled`);
  }

  try {
    const scraper = new ContentScraper({
      baseUrl,
      verbose
    });

    console.log('\n🔍 Discovering and processing pages...');
    const result = await scraper.scrapeAllContent();

    if (preview) {
      console.log('\n📄 PREVIEW - Generated llms.txt content:\n');
      console.log('='.repeat(80));
      console.log(result.content.substring(0, 2000) + (result.content.length > 2000 ? '\n... (truncated for preview)' : ''));
      console.log('='.repeat(80));
      console.log(`\n📊 Content Stats:`);
      console.log(`   • Total pages: ${result.stats.totalPages}`);
      console.log(`   • Processed pages: ${result.stats.processedPages}`);
      console.log(`   • Content length: ${result.stats.contentLength.toLocaleString()} characters`);
      console.log(`   • Estimated size: ${(result.stats.contentLength / 1024).toFixed(1)} KB`);
      console.log(`\n💡 Files would be written to:`);
      console.log(`   • tools_output/llms.txt`);
      console.log(`   • public/llms.txt`);
    } else {
      // Ensure output directories exist
      await fs.mkdir('tools_output', { recursive: true });
      await fs.mkdir('tools_output/logs', { recursive: true });

      // Write to tools_output directory
      await fs.writeFile('tools_output/llms.txt', result.content, 'utf-8');
      console.log('✅ Detailed llms.txt saved to: tools_output/llms.txt');

      // Write to public directory
      await fs.writeFile('public/llms.txt', result.content, 'utf-8');
      console.log('✅ Public llms.txt saved to: public/llms.txt');

      console.log(`\n📊 Generation Complete:`);
      console.log(`   • Pages processed: ${result.stats.processedPages}/${result.stats.totalPages}`);
      console.log(`   • File size: ${(result.stats.contentLength / 1024).toFixed(1)} KB`);
      console.log(`   • Characters: ${result.stats.contentLength.toLocaleString()}`);
      
      if (result.stats.processedPages < result.stats.totalPages) {
        console.log(`\n⚠️  Note: ${result.stats.totalPages - result.stats.processedPages} pages could not be processed`);
      }

      // Write log file
      const logEntry = {
        timestamp: new Date().toISOString(),
        baseUrl,
        preview,
        verbose,
        stats: result.stats,
        success: true
      };
      
      await fs.appendFile('tools_output/logs/content-scraper.log', JSON.stringify(logEntry) + '\n', 'utf-8');
      
      if (verbose) {
        console.log(`📝 Log entry written to: tools_output/logs/content-scraper.log`);
      }

      console.log(`\n💡 Next steps:`);
      console.log(`   • Review the generated content in tools_output/llms.txt`);
      console.log(`   • The file is automatically available at /llms.txt on your site`);
      console.log(`   • Run 'pnpm build' to include the updated llms.txt in your distribution`);
    }

    console.log('\n🎉 Content scraping completed successfully!');

  } catch (error) {
    console.error('\n❌ Error during content scraping:', error.message);
    
    if (verbose) {
      console.error('Stack trace:', error.stack);
    }

    // Write error log
    try {
      await fs.mkdir('tools_output/logs', { recursive: true });
      const errorLogEntry = {
        timestamp: new Date().toISOString(),
        baseUrl,
        preview,
        verbose,
        error: error.message,
        success: false
      };
      await fs.appendFile('tools_output/logs/content-scraper.log', JSON.stringify(errorLogEntry) + '\n', 'utf-8');
    } catch (logError) {
      console.warn('⚠️  Could not write error log:', logError.message);
    }

    console.log('\n💡 Troubleshooting tips:');
    console.log('   • Make sure your development server is running');
    console.log('   • Try: pnpm build && pnpm preview');
    console.log('   • Check that the base URL is correct');
    console.log('   • Use --verbose for more detailed error information');
    
    process.exit(1);
  }
}

generateLlmsTxt();