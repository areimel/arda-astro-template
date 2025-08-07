# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses pnpm as the package manager (recommended over npm/yarn):

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run Astro CLI commands
pnpm astro ...
pnpm astro add
pnpm astro --help
```

## Project Architecture

This is an Astroship template - a SAAS/startup website template built with Astro and TailwindCSS.

### Key Technologies
- **Astro 5.x** - Static site generator with component islands architecture
- **TailwindCSS 4.x** - Utility-first CSS framework (configured via Vite plugin)
- **TypeScript** - Type safety with Astro's base tsconfig
- **Content Collections** - Structured content management for blog posts and team members
- **MDX** - Markdown with JSX support for blog content

### Project Structure
- `src/pages/` - File-based routing (`.astro`, `.md` files)
- `src/components/` - Reusable Astro components
  - `navbar/` - Navigation components with dropdown support
  - `ui/` - Base UI components (button, link, icons)
- `src/layouts/` - Page layouts (Layout.astro, BlogLayout.astro)
- `src/content/` - Content collections (blog posts, team members)
  - Defined in `config.ts` with Zod schemas
- `src/assets/` - Images and static assets for components
- `src/styles/global.css` - Global styles
- `public/` - Static assets served directly

### Content Collections
Two collections are configured:
- **blog**: Blog posts with schema for title, snippet, image, date, author, category, tags
- **team**: Team member profiles with name, title, avatar, publish date

### Component System
- Uses path aliases: `@/*` maps to `src/*`, `~/*` maps to project root
- Icon system via astro-icon with Iconify collections (@iconify-json/bx, @iconify-json/simple-icons, @iconify-json/uil)
- Responsive navigation with astro-navbar
- SEO optimization with astro-seo
- Typography support via @tailwindcss/typography

### Key Integrations
- MDX for enhanced markdown
- Sitemap generation
- Icon system with astro-icon
- Font loading with @fontsource-variable (Inter, Bricolage Grotesque)

### Page Structure
- Homepage with hero, features, logos, pricing, CTA sections
- Blog with individual post pages at `/blog/[slug]`
- Static pages: About, Contact, Pricing, Analytics, Accessibility, SEO, 404
- **Styleguide Page** (`/styleguide`) - Comprehensive design system documentation
- Working contact form component included

## Design System & Color Palette

This project implements a sophisticated **17-palette color system** with dynamic theme switching:

### Color Palette System
- **17 unique color themes** ranging from light to dark modes
- **15 CSS custom properties** per theme for consistent styling:
  - `--color-theme-bg` - Main background
  - `--color-theme-card-bg` - Card backgrounds  
  - `--color-theme-section-bg` - Section backgrounds
  - `--color-theme-headline` - Primary headings
  - `--color-theme-sub-headline` - Secondary headings
  - `--color-theme-paragraph` - Body text
  - `--color-theme-card-text` - Text within cards
  - `--color-theme-button` - Primary buttons/CTAs
  - `--color-theme-button-text` - Button text
  - `--color-theme-link` - Links and interactive elements
  - `--color-theme-stroke` - Borders and dividers
  - `--color-theme-highlight` - Accent/highlight colors
  - `--color-theme-secondary` - Secondary accent
  - `--color-theme-tertiary` - Tertiary accent
  - `--color-theme-quaternary` - Background variations

### Theme Classes
Use these predefined classes for consistent theming:

**Typography:**
- `theme-headline` - Primary headings
- `theme-sub-headline` - Secondary headings  
- `theme-paragraph` - Body text
- `theme-card-text` - Text within cards
- `theme-link` - Links

**Backgrounds:**
- `theme-bg` - Main background
- `theme-card-bg` - Card backgrounds
- `theme-section-bg` - Section backgrounds
- `theme-quaternary-bg` - Alternative backgrounds

**Interactive Elements:**
- `theme-button-primary` - Primary button styling
- `theme-button-outline` - Outline button styling
- `theme-link-primary` - Primary link styling
- `theme-link-outline` - Outline link styling

### Color Palette Data
- Located in `/src/data/color-palettes.json`
- Contains all 17 palettes with complete color definitions
- Used by the ColorPaletteSelector component for dynamic switching

### Interactive Color Selector
- **ColorPaletteSelector component** - Fixed position color picker
- **Local storage persistence** - Remembers user's theme choice
- **Real-time switching** - Instant theme updates across entire site
- **Accessible interface** - Keyboard navigation and screen reader support

## Styleguide Documentation

Visit `/styleguide` for comprehensive design system documentation including:

### Available Styleguide Components
- **ColorPaletteDisplay** - Interactive color swatches with copy functionality
- **TypographyShowcase** - Font hierarchy and text styling examples
- **ButtonShowcase** - All button variants and interactive states
- **CardShowcase** - Content card patterns and layouts
- **IconShowcase** - Available icons with search and copy features
- **SpacingScale** - Visual spacing guide using Tailwind scale
- **ComponentGrid** - Reusable layout component for styleguide sections

### Key Features
- **Live Examples** - Interactive components you can test
- **Code Snippets** - Copy-paste ready code examples
- **Theme Integration** - All examples work with color switching
- **Copy Functionality** - Click to copy colors, icons, and code
- **Responsive Design** - Mobile-friendly documentation
- **Developer-Focused** - Built for team consistency and onboarding

## Development Guidelines

### Working with the Color System

**ALWAYS use theme classes instead of hard-coded colors:**
```astro
<!-- ❌ DON'T: Hard-coded colors -->
<h1 class="text-gray-800">Title</h1>
<div class="bg-white border border-gray-200">Card</div>

<!-- ✅ DO: Theme-aware classes -->
<h1 class="theme-headline">Title</h1>
<div class="theme-card-bg border-2" style="border-color: var(--color-theme-stroke);">Card</div>
```

**For borders, use CSS custom properties:**
```astro
<!-- Use themed border colors -->
<div style="border-color: var(--color-theme-stroke);">Content</div>
```

**For icons, use consistent patterns:**
```astro
<!-- Use bx icons with theme colors -->
<Icon name="bx:bx-check" class="w-6 h-6" style="color: var(--color-theme-button);" />
```

### TailwindCSS v4 Compatibility

**Avoid `@apply` directives** - TailwindCSS v4 has different `@apply` behavior:
```css
/* ❌ DON'T: @apply in v4 can cause issues */
.my-class {
  @apply p-4 rounded-lg;
}

/* ✅ DO: Use standard CSS or utility classes in HTML */
.my-class {
  padding: 1rem;
  border-radius: 0.5rem;
}
```

### Icon System Guidelines

**Prefer bx (Box Icons) for consistency:**
- Use `bx:bx-*` for regular icons
- Use `bx:bxs-*` for solid variants  
- Use `bx:bxl-*` for brand/logo icons
- Always apply theme colors via CSS custom properties

### Component Development

**Follow existing patterns:**
1. Check `/styleguide` for component examples
2. Use existing `ui/` components when possible
3. Apply theme classes consistently
4. Test with multiple color palettes
5. Ensure responsive design

**File Organization:**
- Components: `/src/components/`
- Styleguide components: `/src/components/styleguide/`
- UI primitives: `/src/components/ui/`
- Color data: `/src/data/color-palettes.json`

## Color System Instructions for Claude Code

When working with this project, ALWAYS:
- Use theme classes (`theme-headline`, `theme-paragraph`, etc.) instead of hard-coded colors
- Apply CSS custom properties for dynamic elements: `style="color: var(--color-theme-button);"`
- Test any new components with multiple color palettes via the ColorPaletteSelector
- Reference the `/styleguide` page for design system examples and patterns
- Use bx (Box Icons) for consistency with existing icon system