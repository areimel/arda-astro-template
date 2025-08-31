import { PageContent } from './content-extractor.js';

export interface LlmsGeneratorOptions {
  siteName: string;
  siteDescription: string;
  baseUrl: string;
  maxContentLength: number;
  includeSections: boolean;
}

export interface ContentCategory {
  title: string;
  pages: PageContent[];
  priority: number;
}

export class LlmsGenerator {
  private options: LlmsGeneratorOptions;

  constructor(options: Partial<LlmsGeneratorOptions> = {}) {
    this.options = {
      siteName: 'ARDA Astro Template',
      siteDescription: 'A modern, feature-rich website template built by the Advanced Research & Development Agency (ARDA) using Astro 5 and TailwindCSS 4. Perfect for SAAS platforms, startups, marketing websites, landing pages, and blogs. ARDA is dedicated to bringing high-tech products to the average person through innovative web solutions.',
      baseUrl: 'https://astroship.web3templates.com',
      maxContentLength: 500,
      includeSections: true,
      ...options
    };
  }

  generateLlmsTxt(pages: PageContent[]): string {
    const categorizedContent = this.categorizeContent(pages);
    const sections: string[] = [];

    // Header
    sections.push(this.generateHeader());
    sections.push('');

    // Core template features
    const corePages = categorizedContent.get('core') || [];
    if (corePages.length > 0) {
      sections.push('## Core Template Features');
      sections.push('');
      sections.push(this.generatePageLinks(corePages));
      sections.push('');
    }

    // Design system
    const designPages = categorizedContent.get('design') || [];
    if (designPages.length > 0) {
      sections.push('## Design System');
      sections.push('');
      sections.push(this.generatePageLinks(designPages));
      sections.push('');
    }

    // Content collections
    const contentPages = categorizedContent.get('content') || [];
    if (contentPages.length > 0) {
      sections.push('## Content Collections');
      sections.push('');
      sections.push(this.generatePageLinks(contentPages));
      sections.push('');
    }

    // Sample content sections
    this.generateSampleContentSections(categorizedContent, sections);

    // Landing pages
    const landingPages = categorizedContent.get('landing') || [];
    if (landingPages.length > 0) {
      sections.push('## Landing Pages');
      sections.push('');
      sections.push(this.generatePageLinks(landingPages));
      sections.push('');
    }

    // Additional sections
    const additionalPages = categorizedContent.get('additional') || [];
    if (additionalPages.length > 0) {
      sections.push('## Additional Features');
      sections.push('');
      sections.push(this.generatePageLinks(additionalPages));
      sections.push('');
    }

    // Technical implementation details
    sections.push(this.generateTechnicalSection());

    return sections.join('\n');
  }

  private generateHeader(): string {
    return `# ${this.options.siteName}\n\n> ${this.options.siteDescription}`;
  }

  private categorizeContent(pages: PageContent[]): Map<string, PageContent[]> {
    const categories = new Map<string, PageContent[]>();
    
    // Initialize categories
    const categoryNames = ['core', 'design', 'content', 'blog', 'case-studies', 'products', 'careers', 'team', 'landing', 'additional'];
    categoryNames.forEach(name => categories.set(name, []));

    for (const page of pages) {
      const category = this.determineCategory(page);
      const existing = categories.get(category) || [];
      existing.push(page);
      categories.set(category, existing);
    }

    return categories;
  }

  private determineCategory(page: PageContent): string {
    const url = page.url.toLowerCase();
    const title = page.title.toLowerCase();

    // Core pages
    if (url === '/' || url === '/about' || url === '/contact' || url === '/pricing') {
      return 'core';
    }

    // Design system
    if (url.includes('/styleguide')) {
      return 'design';
    }

    // Content collections
    if (url.startsWith('/blog/') && url !== '/blog') {
      return 'blog';
    }
    if (url.startsWith('/case-studies/') && url !== '/case-studies') {
      return 'case-studies';
    }
    if (url.startsWith('/products/') && url !== '/products') {
      return 'products';
    }
    if (url.startsWith('/careers/') && url !== '/careers') {
      return 'careers';
    }
    if (url.startsWith('/team/') && url !== '/team') {
      return 'team';
    }

    // Collection directory pages
    if (['/blog', '/case-studies', '/products', '/careers', '/team'].includes(url)) {
      return 'content';
    }

    // Landing pages
    if (url.includes('landing-page') || title.includes('landing')) {
      return 'landing';
    }

    return 'additional';
  }

  private generatePageLinks(pages: PageContent[]): string {
    return pages
      .sort((a, b) => this.getPagePriority(b) - this.getPagePriority(a))
      .map(page => {
        const description = this.extractDescription(page);
        return `- [${page.title}](${page.url}) - ${description}`;
      })
      .join('\n');
  }

  private generateSampleContentSections(categorizedContent: Map<string, PageContent[]>, sections: string[]): void {
    const sampleSections = [
      { key: 'blog', title: 'Blog Posts', limit: 5 },
      { key: 'case-studies', title: 'Case Studies', limit: 3 },
      { key: 'products', title: 'Products', limit: 4 },
      { key: 'careers', title: 'Career Opportunities', limit: 3 },
      { key: 'team', title: 'Team Members', limit: 3 }
    ];

    sampleSections.forEach(section => {
      const pages = categorizedContent.get(section.key) || [];
      if (pages.length > 0) {
        sections.push(`## Sample ${section.title}`);
        sections.push('');
        
        const limitedPages = pages.slice(0, section.limit);
        sections.push(this.generatePageLinks(limitedPages));
        sections.push('');
      }
    });
  }

  private generateTechnicalSection(): string {
    return `## Technical Implementation

### Architecture
- **Astro 5.x** - Static Site Generator with component islands architecture
- **TailwindCSS 4.x** - Utility-first CSS framework with Vite plugin integration
- **TypeScript** - Full type safety with Astro's base configuration
- **Content Collections** - Structured content management with Zod validation
- **MDX Support** - Enhanced markdown with JSX component integration

### Key Features
- **17 Dynamic Color Themes** - Complete theming system with CSS custom properties
- **Server-Side Rendering** - Optimized for performance and AI crawler accessibility  
- **Schema.org Markup** - Comprehensive JSON-LD structured data implementation
- **AI SEO Optimization** - LLMs.txt, AI.txt, and enhanced robots.txt for AI crawlers
- **Component System** - Reusable components with consistent design patterns
- **Performance Optimized** - Sub-1-second load times with image optimization

### Development
Built by the Advanced Research & Development Agency (ARDA) to demonstrate modern web development practices and provide a foundation for high-performance websites. The template showcases cutting-edge technologies while maintaining accessibility and developer experience.`;
  }

  private extractDescription(page: PageContent): string {
    // Try to extract a meaningful description from the content
    let description = '';
    
    // Look for description in meta or first paragraph
    const content = page.content;
    const firstParagraph = content.split('\n').find(line => 
      line.trim().length > 20 && 
      !line.startsWith('#') && 
      !line.startsWith('-') && 
      !line.startsWith('*')
    );
    
    if (firstParagraph) {
      description = firstParagraph.trim();
    } else if (page.sections.length > 0) {
      // Use first section content
      description = page.sections[0].content.split('\n')[0] || '';
    } else {
      // Fallback to page title context
      description = this.generateDescriptionFromTitle(page.title);
    }

    // Truncate and clean up
    description = description
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
      .replace(/[*_`]/g, '') // Remove markdown formatting
      .substring(0, this.options.maxContentLength)
      .trim();

    if (description.length === this.options.maxContentLength) {
      const lastSpace = description.lastIndexOf(' ');
      if (lastSpace > this.options.maxContentLength * 0.8) {
        description = description.substring(0, lastSpace) + '...';
      }
    }

    return description || 'Page content and information';
  }

  private generateDescriptionFromTitle(title: string): string {
    // Generate contextual description based on title
    if (title.toLowerCase().includes('guide')) return 'Comprehensive guide and tutorial';
    if (title.toLowerCase().includes('case study')) return 'Client project showcase and implementation details';
    if (title.toLowerCase().includes('product')) return 'Product information and features';
    if (title.toLowerCase().includes('blog')) return 'Technical article and development insights';
    if (title.toLowerCase().includes('styleguide')) return 'Design system documentation and examples';
    return 'Template feature and functionality showcase';
  }

  private getPagePriority(page: PageContent): number {
    const url = page.url.toLowerCase();
    
    // Higher priority for core pages
    if (url === '/') return 100;
    if (url === '/about') return 90;
    if (url === '/contact') return 85;
    if (url === '/pricing') return 80;
    
    // Styleguide pages
    if (url === '/styleguide') return 75;
    if (url.includes('/styleguide/')) return 70;
    
    // Collection index pages
    if (['/blog', '/case-studies', '/products', '/careers'].includes(url)) return 65;
    
    // Individual content pages
    if (url.startsWith('/blog/')) return 60;
    if (url.startsWith('/case-studies/')) return 55;
    if (url.startsWith('/products/')) return 50;
    
    // Landing pages
    if (url.includes('landing')) return 45;
    
    return 40; // Default priority
  }
}