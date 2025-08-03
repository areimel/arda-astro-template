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
- Static pages: About, Contact, Pricing, 404
- Working contact form component included