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

## Component Development Guidelines

### 🎨 ALWAYS Reference the Styleguide First

**CRITICAL: Before building any new components, ALWAYS review the relevant styleguide pages to maintain consistency:**

- **📋 Main Styleguide Hub**: `/styleguide` - Overview and navigation to all sections
- **🎨 Colors**: `/styleguide/colors` - 17-palette theme system, CSS variables, and theme classes
- **📝 Typography**: `/styleguide/typography` - Font hierarchy, text styles, and theme text classes
- **🔘 Buttons**: `/styleguide/buttons` - Button variants, sizes, styles, and interactive states
- **📄 Cards**: `/styleguide/cards` - Card patterns, layouts, pricing cards, and image cards
- **✨ Icons**: `/styleguide/icons` - Available icon libraries (bx, uil, simple-icons) and usage patterns
- **📏 Spacing**: `/styleguide/spacing` - Tailwind spacing system and layout consistency

### Component Development Workflow

**1. Check Existing Patterns First**
- Review `/styleguide` pages to see if similar components already exist
- Look at existing components in `/src/components/` for established patterns
- Check theme integration and responsive behavior examples

**2. Follow Established Design Patterns**
- Use theme classes from colors styleguide (`theme-headline`, `theme-paragraph`, etc.)
- Apply consistent button styles from buttons styleguide
- Follow card layout patterns from cards styleguide
- Use approved icons from icons styleguide (prefer `bx:` icons)
- Maintain spacing consistency using spacing styleguide examples

**3. Theme System Integration**
- NEVER use hard-coded colors - always use theme classes or CSS custom properties
- Test components with different color palettes using the ColorPaletteSelector
- Ensure components work across all 17 available themes

**4. Component Quality Checklist**
- ✅ Uses theme classes instead of hard-coded colors
- ✅ Follows established spacing patterns
- ✅ Uses approved icon libraries and patterns
- ✅ Responsive design that matches existing components
- ✅ Consistent typography hierarchy
- ✅ Tested across multiple color themes

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

**CRITICAL: Icon Component Usage Rules**
- ✅ ALWAYS use static Icon components: `<Icon name="bx:bx-star" class="w-6 h-6" />`
- ❌ NEVER use Icon components inside `.map()` calls: `{items.map(item => <Icon name={item.icon} />)}`
- ❌ NEVER render Icons via function calls or dynamic rendering
- ✅ Convert any dynamic icon rendering to static individual Icon components
- ✅ Always put `name` attribute first, then `class` attribute: `<Icon name="..." class="..." />`
- ❌ Wrong attribute order will cause build failures: `<Icon class="..." name="..." />`

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

## Modal System

This project includes a comprehensive reusable modal system located in `/src/components/PopupComponents/`.

### Modal System Architecture

**Core Components:**
- **`ModalWrapper.astro`** - Main container with backdrop and content slots
- **`ModalBackdrop.astro`** - Theme-aware backdrop overlay with click-to-close
- **`ModalContent.astro`** - Responsive content container with multiple size options
- **`ModalCloseButton.astro`** - Reusable close button with theme integration
- **`functions.js`** - Centralized JavaScript for modal management (available but currently unused)

### Data-Attribute System

**Opening Modals:**
```html
<!-- Add to any button or element to open a modal -->
<button data-modal-open="ModalName">Open Modal</button>
```

**Closing Modals:**
```html
<!-- Close specific modal -->
<button data-modal-close="ModalName">Close This Modal</button>

<!-- Close any modal (used by ModalCloseButton) -->
<button data-modal-close>Close Modal</button>
```

**Modal Identification:**
```astro
<!-- Modal must have data-modal-id to be targeted -->
<ModalWrapper modalId="ModalName">
  <!-- Modal content -->
</ModalWrapper>
```

### Creating New Modals

**1. Basic Modal Structure:**
```astro
---
import ModalWrapper from "@/components/PopupComponents/ModalWrapper.astro";
---

<ModalWrapper 
  modalId="YourModalName"
  size="lg"
  showCloseButton={true}
>
  <h2 id="YourModalName-title" class="theme-headline text-xl mb-4">
    Modal Title
  </h2>
  <p id="YourModalName-description" class="theme-paragraph mb-6">
    Modal content goes here.
  </p>
  <div class="flex gap-3 justify-end">
    <button class="theme-button-outline px-4 py-2 rounded-lg" data-modal-close>
      Cancel
    </button>
    <button class="theme-button-primary px-4 py-2 rounded-lg">
      Confirm
    </button>
  </div>
</ModalWrapper>
```

**2. ModalWrapper Props:**
- `modalId` (required) - Unique identifier for the modal
- `size` - "sm", "md", "lg", "xl", "full" (default: "md")  
- `padding` - "sm", "md", "lg" (default: "md")
- `showCloseButton` - boolean (default: true)
- `closeButtonSize` - "sm", "md", "lg" (default: "md")
- `class` - Additional CSS classes

### Modal JavaScript Integration

The modal system uses inline JavaScript within `ColorPaletteSelector.astro` that provides:

**Available Functions:**
- `openModal(modalId)` - Opens specific modal
- `closeModal(modalId)` - Closes specific modal  
- `closeAllModals()` - Closes all open modals

**Automatic Event Handling:**
- **Escape Key** - Closes all modals
- **Backdrop Clicks** - Closes modal when clicking outside content
- **Data Attributes** - Automatically handles `data-modal-open` and `data-modal-close`

**Features:**
- **Body Scroll Locking** - Prevents background scrolling when modal is open
- **Focus Management** - Auto-focuses first interactive element
- **CSS Animations** - Smooth open/close transitions via `modal-open` class
- **Accessibility** - Proper ARIA attributes and keyboard navigation

### Theme Integration

**Always use theme classes in modals:**
```astro
<h2 class="theme-headline">Modal Title</h2>
<p class="theme-paragraph">Modal content</p>
<button class="theme-button-primary">Action</button>
<button class="theme-button-outline" data-modal-close>Cancel</button>
```

**For borders and accents:**
```astro
<div style="border-color: var(--color-theme-stroke);">
  <span style="color: var(--color-theme-button);">Accent text</span>
</div>
```

### Example Modals

**Reference Examples:**
- **`ExampleModal.astro`** - Complete demo modal with headline, body, and buttons
- **`ThemeControlModal.astro`** - Theme selector modal (replaces old PalettePanel)

**Usage Pattern:**
```astro
<!-- In your page/component -->
---
import YourModal from "@/components/PopupComponents/YourModal.astro";
---

<!-- Modal trigger -->
<button data-modal-open="YourModal" class="theme-button-primary">
  Open Modal
</button>

<!-- Modal (can be anywhere in the page) -->
<YourModal />
```

### Best Practices

1. **Modal IDs** - Use PascalCase and descriptive names (e.g., "ContactFormModal", "DeleteConfirmModal")
2. **Content Structure** - Always include proper heading and description elements with IDs
3. **Button Placement** - Use consistent button layouts (Cancel on left, Primary action on right)
4. **Responsive Design** - Test modals on mobile devices and adjust size accordingly
5. **Accessibility** - Include proper ARIA labels and ensure keyboard navigation works
6. **Theme Compliance** - Always use theme classes and CSS custom properties
7. **Auto-closing** - For action modals, close automatically after successful operations

The modal system integrates seamlessly with the existing theme system and provides a solid foundation for any modal implementations throughout the project.

## Color System Instructions for Claude Code

When working with this project, ALWAYS:
- Use theme classes (`theme-headline`, `theme-paragraph`, etc.) instead of hard-coded colors
- Apply CSS custom properties for dynamic elements: `style="color: var(--color-theme-button);"`
- Test any new components with multiple color palettes via the ColorPaletteSelector
- Reference the `/styleguide` page for design system examples and patterns
- Use bx (Box Icons) for consistency with existing icon system