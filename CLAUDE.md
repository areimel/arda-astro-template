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
Four collections are configured:
- **blog**: Blog posts with schema for title, snippet, image, date, author, category, tags
- **case-studies**: Case studies with schema for title, snippet, image, date, author, client, industry, tags
- **products**: Products with schema for title, snippet, image, date, author, category, price, features, tags
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
- Case Studies with individual pages at `/case-studies/[slug]`
- Products with individual pages at `/products/[slug]`
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

## New Content Section Workflow

Use this standardized workflow when creating new content sections (like Case Studies, Products, etc.) that follow the directory + slug page pattern:

### Step 1: Content Collection Setup
1. **Update `src/content/config.ts`**:
   - Add new collection schema with `defineCollection()`
   - Define Zod schema with appropriate fields for your content type
   - Add collection to exports object: `'section-name': collectionName`

2. **Create metadata file**: `src/data/section-name.json`
   - Include `title` and `description` fields for section header

### Step 2: Page Structure Creation
1. **Create directory page**: `src/pages/section-name.astro`
   - Clone structure from existing sections (blog.astro or case-studies.astro)
   - Update collection name in `getCollection("section-name")`
   - Apply theme classes (`theme-headline`, `theme-paragraph`, etc.)
   - Customize display fields based on your schema

2. **Create slug page**: `src/pages/section-name/[slug].astro`
   - Clone structure from existing slug pages
   - Update `getStaticPaths()` to use your collection
   - Customize metadata display based on schema fields
   - Update "Back to Section" link

### Step 3: Navigation Integration
**Update `src/data/navigation.json`**:
- Add new menu item to `header.menuitems` array
- Add link to footer `sections.Product.links` array

### Step 4: Content & Assets
1. **Create content directory**: `src/content/section-name/`
2. **Write sample content**: Create 3-4 sample `.md` files following schema
3. **Create image directory**: `public/images/section-name/`
4. **Add images**: Download/add relevant images for each content piece

### Required Schema Fields
**Standard fields for all content collections:**
- `draft: z.boolean()`
- `title: z.string()`
- `snippet: z.string()`
- `image: z.object({ src: z.string(), alt: z.string() })`
- `publishDate: z.string().transform(str => new Date(str))`
- `author: z.string().default('Astroship')`
- `tags: z.array(z.string())`

**Add custom fields** based on content type (e.g., `client`, `industry`, `price`, `features`)

### Theme Integration Checklist
- ✅ Use `theme-headline` for main headings
- ✅ Use `theme-paragraph` for body text
- ✅ Use `theme-button-outline` for back navigation
- ✅ Apply `style="color: var(--color-theme-button);"` for accent elements
- ✅ Test with multiple color palettes via ColorPaletteSelector

### File Organization Pattern
```
src/
├── content/
│   ├── config.ts (add new collection)
│   └── section-name/
│       ├── item-1.md
│       └── item-2.md
├── data/
│   ├── navigation.json (add links)
│   └── section-name.json (metadata)
└── pages/
    ├── section-name.astro (directory)
    └── section-name/
        └── [slug].astro (individual pages)

public/
└── images/
    └── section-name/
        ├── item-1-image.jpg
        └── item-2-image.jpg
```

This workflow ensures consistency with existing sections and maintains the design system patterns established in the project.

## Color System Instructions for Claude Code

When working with this project, ALWAYS:
- Use theme classes (`theme-headline`, `theme-paragraph`, etc.) instead of hard-coded colors
- Apply CSS custom properties for dynamic elements: `style="color: var(--color-theme-button);"`
- Test any new components with multiple color palettes via the ColorPaletteSelector
- Reference the `/styleguide` page for design system examples and patterns
- Use bx (Box Icons) for consistency with existing icon system