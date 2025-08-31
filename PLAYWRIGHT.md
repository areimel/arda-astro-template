# Playwright Testing & Screenshot Generation

This project includes Playwright for automated testing and OpenGraph thumbnail generation.

## Setup

After cloning, install Playwright browsers:

```bash
pnpm exec playwright install chromium
```

## Screenshot Generation

### Generate OpenGraph Thumbnail

To create a screenshot of your homepage for use as an OpenGraph image:

```bash
# Method 1: Using Playwright test (recommended)
pnpm screenshot

# Method 2: Using standalone script (requires running server manually)
pnpm build && pnpm preview  # In one terminal
pnpm screenshot:simple      # In another terminal
```

This generates `screenshot-thumbnail.jpg` (1200x630px) that you can manually copy to replace `/public/opengraph.jpg`.

### Available Commands

- `pnpm test` - Run all Playwright tests
- `pnpm screenshot` - Generate homepage screenshot for OpenGraph
- `pnpm screenshot:simple` - Alternative screenshot generation (requires manual server)
- `pnpm test:ui` - Run Playwright in UI mode

## Test Structure

### Screenshot Tests (`tests/screenshot.spec.js`)
- **OpenGraph Screenshot**: Captures 1200x630 homepage screenshot
- **Basic Functionality**: Verifies page loads and key elements exist
- **SEO Meta Tags**: Checks for essential meta tags

### Accessibility Tests (`tests/accessibility.spec.js`)
- **Heading Hierarchy**: Ensures proper h1 usage
- **Image Alt Text**: Verifies all images have alt attributes
- **Landmarks**: Checks for proper semantic elements
- **Focus Management**: Tests keyboard navigation
- **Theme Accessibility**: Tests color palette selector if present

## Configuration

### Playwright Config (`playwright.config.js`)
- **Auto Server**: Builds and starts preview server automatically
- **Multi-Browser**: Configured for Chrome, Firefox, Safari, and mobile
- **OpenGraph Viewport**: Default 1200x630 for screenshot generation
- **Base URL**: http://localhost:4321

### Screenshot Settings
- **Format**: JPEG (90% quality)
- **Dimensions**: 1200x630 (OpenGraph standard)
- **Viewport Only**: Captures visible area, not full page
- **Output**: `screenshot-thumbnail.jpg` in project root

## Workflow

1. **Development**: Make changes to your site
2. **Build**: `pnpm build` to create production build
3. **Screenshot**: `pnpm screenshot` to generate new thumbnail
4. **Replace**: Manually copy `screenshot-thumbnail.jpg` to `/public/opengraph.jpg`
5. **Commit**: Include updated OpenGraph image in your changes

## Browser Support

- **Chromium** (primary for screenshots)
- **Firefox**
- **WebKit/Safari**
- **Mobile Chrome**
- **Mobile Safari**

## Troubleshooting

### Server Issues
If screenshot generation fails:
1. Ensure no other process is using port 4321
2. Try running `pnpm build && pnpm preview` manually first
3. Use `pnpm screenshot:simple` after manual server start

### Screenshot Quality
- Screenshots are captured after `networkidle` state
- 2-second delay ensures animations complete
- 90% JPEG quality balances size and clarity

### Test Failures
- Update title expectations in tests to match your site
- SEO tests check for standard meta tags (customize as needed)
- Accessibility tests ensure basic compliance