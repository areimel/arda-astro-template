import { promises as fs } from 'fs';
import path from 'path';

// Unified pages configuration with both path and title
export const pages = [
	{ path: '/', title: 'Home' },
	{ path: '/about', title: 'About' },
	{ path: '/blog', title: 'Blog' },
	{ path: '/contact', title: 'Contact' },
	{ path: '/pricing', title: 'Pricing' }
];

// Viewport configurations
export const viewports = [
	{ name: 'desktop', width: 1920, height: 1080 },
	{ name: 'laptop', width: 1366, height: 768 },
	{ name: 'mobile', width: 375, height: 667 }
];

// Session timestamp for unified test result organization
let sessionTimestamp: string | null = null;

// Initialize session timestamp (call once at the start of test session)
export function initializeSessionTimestamp(): string {
	if (!sessionTimestamp) {
		sessionTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
	}
	return sessionTimestamp;
}

// Get the current session timestamp
export function getSessionTimestamp(): string {
	if (!sessionTimestamp) {
		return initializeSessionTimestamp();
	}
	return sessionTimestamp;
}

// Generate consistent timestamp format for all test outputs
export function generateTimestamp(): string {
	return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

// Create output directory for test results with session-based folder structure
export async function createOutputDirectory(type: 'screenshots' | 'accessibility' | 'seo'): Promise<string> {
	const sessionTs = getSessionTimestamp();
	const outputDir = path.join('test-results', sessionTs, type);
	await fs.mkdir(outputDir, { recursive: true });
	return outputDir;
} 