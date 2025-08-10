# ARDA Astro Website Template

A modern, feature-rich website template built by the **Advanced Research & Development Agency (ARDA)** using Astro 5 and TailwindCSS 4. Perfect for SAAS platforms, startups, marketing websites, landing pages, and blogs.

**Mission**: ARDA is dedicated to bringing high-tech products to the average person through innovative web solutions.

## 🚀 Features

<!-- prettier-ignore -->
| Feature | Status |
| --- | ------ |
| **Astro 5.x** | ✅ |
| **TailwindCSS 4.x** | ✅ |
| **17 Dynamic Color Themes** | ✅ |
| **Content Collections** | ✅ |
| **MDX Support** | ✅ |
| **TypeScript** | ✅ |
| **Mobile Responsive** | ✅ |
| **Working Contact Form** | ✅ |
| **Blog with Pagination** | ✅ |
| **Case Studies Section** | ✅ |
| **Products Showcase** | ✅ |
| **Team Profiles** | ✅ |
| **SEO Optimized** | ✅ |
| **Comprehensive Design System** | ✅ |
| **Modal System** | ✅ |
| **Icon Library (3,000+ icons)** | ✅ |

## 🎨 Advanced Color System

This template features a **17-palette dynamic theming system** with:
- 17 unique color themes (light to dark modes)
- 15 CSS custom properties per theme
- Real-time theme switching via ColorPaletteSelector
- Theme-aware components throughout

## 📖 Comprehensive Documentation

Visit the built-in **Styleguide** (`/styleguide`) for complete design system documentation:
- Interactive color palettes
- Typography examples  
- Button variants
- Card patterns
- Icon library (3,000+ icons)
- Spacing guidelines

## 🏃‍♀️ Quick Start

### Deploy Instantly

Click to deploy on your preferred platform:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fareimel%2Farda-astro-template&project-name=arda-astro-template&repository-name=arda-astro-template)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/areimel/arda-astro-template)


## 🛠️ Local Development

### 1. Clone the Repository

```bash
# Use this template (recommended)
# Click "Use this template" button above on GitHub

# Or clone directly
git clone https://github.com/areimel/arda-astro-template.git myProjectName
cd myProjectName
```

### 2. Install Dependencies

This project uses **pnpm** (recommended for faster installs and disk space efficiency):

```bash
pnpm install
```

Alternative package managers:
```bash
# npm
npm install

# yarn
yarn install
```

### 3. Start Development Server

```bash
pnpm dev
```

Your site will be available at `http://localhost:4321`

### 4. Build & Preview

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Additional Commands

```bash
# Astro CLI commands
pnpm astro add
pnpm astro --help

# Add integrations
pnpm astro add tailwind
```

## 📁 Project Architecture

```
arda-astro-template/
├── public/                     # Static assets
│   ├── images/                # Image assets organized by section
│   └── hero-1.svg            # Hero illustration
├── src/
│   ├── components/            # Reusable Astro components
│   │   ├── navbar/           # Navigation with dropdown support
│   │   ├── ui/               # Base UI components (buttons, links, icons)
│   │   ├── styleguide/       # Design system components
│   │   └── PopupComponents/  # Modal system components
│   ├── content/              # Content Collections
│   │   ├── config.ts         # Collection schemas (Zod validation)
│   │   ├── blog/            # Blog posts (.md files)
│   │   ├── case-studies/    # Case study content
│   │   ├── products/        # Product showcases
│   │   └── team/           # Team member profiles
│   ├── data/               # JSON configuration files
│   │   ├── color-palettes.json  # 17-theme color system
│   │   ├── navigation.json     # Site navigation structure
│   │   └── links.json         # External links
│   ├── layouts/            # Page layouts
│   │   ├── Layout.astro    # Base layout with SEO
│   │   └── BlogLayout.astro # Blog post layout
│   ├── pages/              # File-based routing
│   │   ├── styleguide/     # Design system documentation
│   │   ├── blog/           # Blog section + [slug] pages
│   │   ├── case-studies/   # Case studies + [slug] pages  
│   │   ├── products/       # Products + [slug] pages
│   │   └── *.astro         # Static pages
│   ├── assets/            # Component-specific images
│   └── styles/           # Global CSS styles
├── CLAUDE.md             # AI development instructions
└── package.json
```

### Key Technologies

- **Astro 5.x** - Static site generator with component islands
- **TailwindCSS 4.x** - Utility-first CSS via Vite plugin  
- **TypeScript** - Type safety with Astro's base config
- **Content Collections** - Structured content with Zod schemas
- **MDX** - Markdown with JSX support
- **Icon System** - 3,000+ icons from Iconify collections

## 🎯 What Makes This Template Special

### Advanced Theme System
- **17 curated color palettes** ranging from light to dark modes
- **Theme persistence** via localStorage  
- **Real-time switching** with smooth transitions
- **Developer-friendly** CSS custom properties

### Comprehensive Content Management
- **Blog** with categories, tags, and author profiles
- **Case Studies** with client and industry tracking
- **Products** with pricing and feature lists
- **Team** member profiles with social links

### Developer Experience
- **Built-in Styleguide** - Complete design system documentation
- **Modal System** - Reusable popup components
- **CLAUDE.md** - AI development instructions for consistency
- **TypeScript** support throughout

### Performance Optimized
- **Astro's Islands Architecture** - Ship minimal JavaScript
- **Optimized images** with multiple formats (AVIF, WebP)
- **SEO ready** with meta tags and structured data
- **Lighthouse perfect scores** achievable out of the box

## 🤝 Contributing

This template is developed and maintained by **ARDA** (Advanced Research & Development Agency). 

### Development Guidelines
- Review `/styleguide` before building new components
- Always use theme classes instead of hard-coded colors  
- Test components with multiple color palettes
- Follow established patterns in existing components
- Reference `CLAUDE.md` for AI-assisted development

## 📝 License

This template is open source and available under the MIT License.

## 🔗 Links

- **Live Demo**: [arda-astro-template.netlify.app](https://arda-astro-template.netlify.app)
- **GitHub Repository**: [areimel/arda-astro-template](https://github.com/areimel/arda-astro-template)
- **Astro Documentation**: [docs.astro.build](https://docs.astro.build)
- **TailwindCSS Documentation**: [tailwindcss.com](https://tailwindcss.com)

## 💡 About ARDA

The **Advanced Research & Development Agency (ARDA)** is dedicated to bringing high-tech products to the average person. We build innovative web solutions that combine cutting-edge technology with user-friendly design.

---

[![Built with Astro](https://astro.badg.es/v1/built-with-astro.svg)](https://astro.build)

**Built by ARDA** • *Making high-tech accessible to everyone*
