#!/usr/bin/env node

import { Command } from 'commander';
import { FileScanner } from './file-scanner.js';
import { ContentExtractor, PageContent } from './content-extractor.js';
import { LlmsGenerator } from './llms-generator.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import kleur from 'kleur';

interface CliOptions {
  output?: string;
  preview?: boolean;
  verbose?: boolean;
  distPath?: string;
  baseUrl?: string;
  siteName?: string;
  siteDescription?: string;
}

class DistScraperCli {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('dist-scraper')
      .description('CLI tool for scraping Astro dist folder content to generate llms.txt file')
      .version('1.0.0');

    this.program
      .command('generate')
      .alias('gen')
      .description('Generate llms.txt from dist folder content')
      .option('-o, --output <path>', 'Output file path', './public/llms.txt')
      .option('-p, --preview', 'Preview mode - show output without writing file', false)
      .option('-v, --verbose', 'Verbose output', false)
      .option('-d, --dist-path <path>', 'Path to dist folder')
      .option('-u, --base-url <url>', 'Base URL for the site', 'https://astroship.web3templates.com')
      .option('-n, --site-name <name>', 'Site name', 'ARDA Astro Template')
      .option('-s, --site-description <desc>', 'Site description')
      .action(async (options: CliOptions) => {
        await this.handleGenerate(options);
      });

    this.program
      .command('validate')
      .description('Validate that the dist folder exists and contains HTML files')
      .option('-d, --dist-path <path>', 'Path to dist folder')
      .option('-v, --verbose', 'Verbose output', false)
      .action(async (options: CliOptions) => {
        await this.handleValidate(options);
      });
  }

  private async handleGenerate(options: CliOptions): Promise<void> {
    try {
      console.log(kleur.blue('🚀 Starting ARDA Dist Scraper...'));
      
      const distPath = options.distPath || 'C:\\Users\\Alec\\Dev\\ARDA-projects\\arda-astro-template\\dist';
      const outputPath = options.output || 'C:\\Users\\Alec\\Dev\\ARDA-projects\\arda-astro-template\\public\\llms.txt';

      if (options.verbose) {
        console.log(kleur.gray(`• Dist path: ${distPath}`));
        console.log(kleur.gray(`• Output path: ${outputPath}`));
        console.log(kleur.gray(`• Preview mode: ${options.preview ? 'enabled' : 'disabled'}`));
      }

      // Initialize scanner and validate dist folder
      console.log(kleur.yellow('📂 Scanning dist folder...'));
      const scanner = new FileScanner({ distPath });
      
      const isValidDist = await scanner.validateDistFolder();
      if (!isValidDist) {
        throw new Error(`Dist folder not found at: ${distPath}. Run 'pnpm build' first.`);
      }

      const files = await scanner.scanDistFolder();
      console.log(kleur.green(`✅ Found ${files.length} HTML files to process`));

      if (options.verbose) {
        files.slice(0, 10).forEach(file => {
          console.log(kleur.gray(`   • ${file.relativePath} (${file.size} bytes)`));
        });
        if (files.length > 10) {
          console.log(kleur.gray(`   ... and ${files.length - 10} more files`));
        }
      }

      // Extract content from all files
      console.log(kleur.yellow('🔍 Extracting content from HTML files...'));
      const extractor = new ContentExtractor({
        baseUrl: options.baseUrl || 'https://astroship.web3templates.com'
      });

      const pages: PageContent[] = [];
      let processed = 0;

      for (const file of files) {
        try {
          const content = await extractor.extractFromFile(file.filePath);
          if (content) {
            pages.push(content);
            processed++;
            
            if (options.verbose) {
              console.log(kleur.gray(`   • Processed: ${content.title} (${content.url})`));
            }
          }
        } catch (error) {
          console.warn(kleur.red(`   ⚠️ Failed to process ${file.relativePath}: ${error}`));
        }
      }

      console.log(kleur.green(`✅ Successfully processed ${processed}/${files.length} files`));

      // Generate llms.txt content
      console.log(kleur.yellow('📝 Generating llms.txt content...'));
      const generator = new LlmsGenerator({
        siteName: options.siteName || 'ARDA Astro Template',
        siteDescription: options.siteDescription,
        baseUrl: options.baseUrl || 'https://astroship.web3templates.com'
      });

      const llmsContent = generator.generateLlmsTxt(pages);
      const contentSize = Buffer.byteLength(llmsContent, 'utf8');
      
      console.log(kleur.green(`✅ Generated llms.txt content (${contentSize.toLocaleString()} bytes)`));

      if (options.preview) {
        console.log(kleur.blue('\n📄 Preview of generated llms.txt:'));
        console.log(kleur.gray('─'.repeat(80)));
        console.log(llmsContent);
        console.log(kleur.gray('─'.repeat(80)));
        console.log(kleur.blue(`\nContent would be written to: ${outputPath}`));
      } else {
        // Write to file
        console.log(kleur.yellow('💾 Writing llms.txt file...'));
        
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        await fs.mkdir(outputDir, { recursive: true });
        
        await fs.writeFile(outputPath, llmsContent, 'utf-8');
        
        console.log(kleur.green(`✅ Successfully generated llms.txt at: ${outputPath}`));
        console.log(kleur.blue(`📊 File size: ${contentSize.toLocaleString()} bytes (${(contentSize/1024).toFixed(1)} KB)`));
        console.log(kleur.blue(`📄 Pages included: ${pages.length}`));
        
        console.log(kleur.yellow('\n⚠️  Important: Run "pnpm build" again to include the updated llms.txt in your dist folder.'));
      }

    } catch (error) {
      console.error(kleur.red(`❌ Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  }

  private async handleValidate(options: CliOptions): Promise<void> {
    try {
      console.log(kleur.blue('🔍 Validating dist folder...'));
      
      const distPath = options.distPath || 'C:\\Users\\Alec\\Dev\\ARDA-projects\\arda-astro-template\\dist';
      const scanner = new FileScanner({ distPath });

      // Check if dist folder exists
      const isValidDist = await scanner.validateDistFolder();
      if (!isValidDist) {
        console.error(kleur.red(`❌ Dist folder not found at: ${distPath}`));
        console.log(kleur.yellow('💡 Run "pnpm build" to generate the dist folder first.'));
        process.exit(1);
      }

      console.log(kleur.green(`✅ Dist folder exists at: ${distPath}`));

      // Scan for files
      const files = await scanner.scanDistFolder();
      
      if (files.length === 0) {
        console.log(kleur.red('❌ No HTML files found in dist folder'));
        console.log(kleur.yellow('💡 Make sure your build completed successfully.'));
        process.exit(1);
      }

      console.log(kleur.green(`✅ Found ${files.length} HTML files`));

      if (options.verbose) {
        console.log(kleur.blue('\n📁 Files found:'));
        files.forEach(file => {
          const sizeKB = (file.size / 1024).toFixed(1);
          console.log(kleur.gray(`   • ${file.relativePath} (${sizeKB} KB)`));
        });
      }

      // Check for key files
      const keyFiles = ['index.html', 'about/index.html', 'blog/index.html'];
      const foundKeyFiles = files.filter(f => 
        keyFiles.some(key => f.relativePath.replace(/\\/g, '/').endsWith(key))
      );

      console.log(kleur.green(`✅ Found ${foundKeyFiles.length}/${keyFiles.length} key template files`));
      
      console.log(kleur.green('\n🎉 Dist folder validation successful! Ready to generate llms.txt.'));

    } catch (error) {
      console.error(kleur.red(`❌ Validation error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  }

  run(): void {
    this.program.parse();
  }
}

// Run the CLI
const cli = new DistScraperCli();
cli.run();