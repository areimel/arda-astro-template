import * as fs from 'fs/promises';
import * as path from 'path';

export interface ScanOptions {
  distPath: string;
  excludePatterns: string[];
  includeOnlyHtml: boolean;
}

export interface FileInfo {
  filePath: string;
  relativePath: string;
  size: number;
  isDirectory: boolean;
}

export class FileScanner {
  private options: ScanOptions;

  constructor(options: Partial<ScanOptions> = {}) {
    this.options = {
      excludePatterns: [
        '**/404.html',
        '**/_*',
        '**/.*',
        '**/node_modules/**',
        '**/assets/**/*.html', // Avoid asset HTML files
        '**/chunks/**',
        '**/client/**'
      ],
      includeOnlyHtml: true,
      distPath: 'C:\\Users\\Alec\\Dev\\ARDA-projects\\arda-astro-template\\dist',
      ...options
    };
  }

  async scanDistFolder(): Promise<FileInfo[]> {
    const files: FileInfo[] = [];
    
    try {
      await this.scanDirectory(this.options.distPath, files);
      return this.filterFiles(files);
    } catch (error) {
      throw new Error(`Failed to scan dist folder: ${error}`);
    }
  }

  private async scanDirectory(dirPath: string, files: FileInfo[]): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const stats = await fs.stat(fullPath);
        
        const fileInfo: FileInfo = {
          filePath: fullPath,
          relativePath: path.relative(this.options.distPath, fullPath),
          size: stats.size,
          isDirectory: entry.isDirectory()
        };

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this.scanDirectory(fullPath, files);
        } else {
          files.push(fileInfo);
        }
      }
    } catch (error) {
      console.warn(`Failed to scan directory ${dirPath}:`, error);
    }
  }

  private filterFiles(files: FileInfo[]): FileInfo[] {
    return files.filter(file => {
      // Skip directories
      if (file.isDirectory) return false;
      
      // Only include HTML files if specified
      if (this.options.includeOnlyHtml && !file.filePath.endsWith('.html')) {
        return false;
      }

      // Check against exclude patterns
      const relativePath = file.relativePath.replace(/\\/g, '/');
      
      return !this.options.excludePatterns.some(pattern => 
        this.matchesPattern(relativePath, pattern)
      );
    });
  }

  private matchesPattern(filePath: string, pattern: string): boolean {
    // Simple glob pattern matching
    const regexPattern = pattern
      .replace(/\*\*/g, '.*') // ** matches any path
      .replace(/\*/g, '[^/]*') // * matches any filename
      .replace(/\?/g, '[^/]'); // ? matches any single character
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }

  async validateDistFolder(): Promise<boolean> {
    try {
      const stats = await fs.stat(this.options.distPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  getDistPath(): string {
    return this.options.distPath;
  }
}