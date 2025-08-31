import { load } from 'cheerio';
import TurndownService from 'turndown';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface PageContent {
  title: string;
  url: string;
  content: string;
  sections: ContentSection[];
}

export interface ContentSection {
  title: string;
  content: string;
  level: number;
}

export interface ExtractionOptions {
  excludeSelectors: string[];
  includeOnlyMain: boolean;
  preserveLinks: boolean;
  baseUrl: string;
}

export class ContentExtractor {
  private turndownService!: TurndownService;
  private options: ExtractionOptions;

  constructor(options: Partial<ExtractionOptions> = {}) {
    this.options = {
      excludeSelectors: [
        'nav', 'header', 'footer', '.navbar', '.footer', '.header',
        'script', 'style', 'meta', 'link[rel="stylesheet"]',
        '.color-palette-selector', '[data-modal]', '.modal',
        '.breadcrumb', '.pagination', '.social-links', '.share-buttons'
      ],
      includeOnlyMain: true,
      preserveLinks: true,
      baseUrl: 'https://astroship.web3templates.com',
      ...options
    };

    this.setupTurndownService();
  }

  private setupTurndownService(): void {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '_'
    });

    // Custom rules for better markdown output
    this.turndownService.addRule('removeEmpty', {
      filter: (node) => {
        return node.nodeType === 1 && 
               !node.textContent?.trim() && 
               !['IMG', 'BR', 'HR'].includes(node.nodeName);
      },
      replacement: () => ''
    });

    // Preserve internal links
    if (this.options.preserveLinks) {
      this.turndownService.addRule('internalLinks', {
        filter: 'a',
        replacement: (content, node) => {
          const element = node as any;
          const href = element.getAttribute('href');
          if (!href || href.startsWith('http') || href.startsWith('mailto:')) {
            return `[${content}](${href})`;
          }
          // Convert relative links to full URLs
          const fullUrl = href.startsWith('/') ? 
            `${this.options.baseUrl}${href}` : 
            `${this.options.baseUrl}/${href}`;
          return `[${content}](${fullUrl})`;
        }
      });
    }
  }

  async extractFromFile(filePath: string): Promise<PageContent | null> {
    try {
      const htmlContent = await fs.readFile(filePath, 'utf-8');
      const relativePath = this.getRelativePath(filePath);
      const url = this.convertToUrl(relativePath);
      
      return this.extractFromHtml(htmlContent, url);
    } catch (error) {
      console.warn(`Failed to extract content from ${filePath}:`, error);
      return null;
    }
  }

  extractFromHtml(htmlContent: string, url: string): PageContent {
    const $ = load(htmlContent);
    
    // Remove excluded elements
    this.options.excludeSelectors.forEach(selector => {
      $(selector).remove();
    });

    // Extract title
    const title = this.extractTitle($);
    
    // Focus on main content if specified
    let contentRoot = $;
    if (this.options.includeOnlyMain) {
      const mainContent = $('main, .main-content, #main, .content');
      if (mainContent.length > 0) {
        contentRoot = load(mainContent.html() || '');
      }
    }

    // Extract sections based on headings
    const sections = this.extractSections(contentRoot);
    
    // Get full content as markdown
    const fullContent = this.turndownService.turndown(contentRoot.html() || '');
    const cleanedContent = this.cleanMarkdown(fullContent);

    return {
      title,
      url,
      content: cleanedContent,
      sections
    };
  }

  private extractTitle($: ReturnType<typeof load>): string {
    // Try various title sources in order of preference
    const titleSources = [
      'h1',
      'title',
      '.page-title',
      '.hero-title',
      '[data-title]'
    ];

    for (const source of titleSources) {
      const element = $(source).first();
      if (element.length > 0) {
        const text = element.text().trim();
        if (text) return text;
      }
    }

    return 'Untitled Page';
  }

  private extractSections($: ReturnType<typeof load>): ContentSection[] {
    const sections: ContentSection[] = [];
    const headings = $('h1, h2, h3, h4, h5, h6');

    headings.each((_, element) => {
      const $heading = $(element);
      const level = parseInt(element.tagName.replace('h', ''));
      const title = $heading.text().trim();
      
      if (!title) return;

      // Get content following this heading until the next heading of same or higher level
      let content = '';
      let $current = $heading.next();
      
      while ($current.length > 0) {
        const tagName = $current.get(0)?.tagName?.toLowerCase();
        
        // Stop if we hit another heading of same or higher level
        if (tagName && tagName.match(/^h[1-6]$/)) {
          const currentLevel = parseInt(tagName.replace('h', ''));
          if (currentLevel <= level) break;
        }
        
        const elementHtml = $current.toString();
        const markdownContent = this.turndownService.turndown(elementHtml);
        content += markdownContent + '\n';
        
        $current = $current.next();
      }

      sections.push({
        title,
        content: this.cleanMarkdown(content),
        level
      });
    });

    return sections;
  }

  private cleanMarkdown(markdown: string): string {
    return markdown
      // Remove excessive whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove empty lines at the beginning and end
      .trim()
      // Clean up list formatting
      .replace(/^\s*[-*+]\s*$/gm, '')
      // Remove standalone links that are just URLs
      .replace(/^\[([^\]]+)\]\(\1\)$/gm, '$1')
      // Clean up excessive spaces
      .replace(/ +/g, ' ');
  }

  private getRelativePath(filePath: string): string {
    const distIndex = filePath.indexOf('dist');
    if (distIndex === -1) return filePath;
    return filePath.substring(distIndex + 4); // Remove 'dist' part
  }

  private convertToUrl(relativePath: string): string {
    // Convert file system path to URL
    let url = relativePath.replace(/\\/g, '/');
    
    // Handle index.html files
    if (url.endsWith('/index.html')) {
      url = url.replace('/index.html', '/');
    } else if (url.endsWith('.html')) {
      url = url.replace('.html', '');
    }
    
    // Ensure it starts with /
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    
    return url;
  }
}