# BenefitsGrid Component Usage Example

```astro
---
import BenefitsGrid from "@/components/landing/BenefitsGrid.astro";

const benefits = [
  {
    icon: "bx:bx-check-circle",
    title: "100% Secure",
    description: "Your data is protected with enterprise-grade security measures and encryption protocols.",
    accentColor: "#10B981" // Optional: Custom accent color
  },
  {
    icon: "bx:bx-rocket", 
    title: "Lightning Fast",
    description: "Experience blazing fast performance with our optimized infrastructure and global CDN.",
  },
  {
    icon: "bx:bx-support",
    title: "24/7 Support",
    description: "Get help whenever you need it with our dedicated support team available around the clock.",
  },
  {
    icon: "bx:bx-dollar-circle",
    title: "Money-Back Guarantee", 
    description: "Try risk-free with our 30-day money-back guarantee. No questions asked.",
  },
  {
    icon: "bx:bx-mobile-alt",
    title: "Mobile Optimized",
    description: "Perfectly responsive design that works seamlessly across all devices and screen sizes.",
  },
  {
    icon: "bx:bx-infinite",
    title: "Unlimited Usage",
    description: "No limits on usage, storage, or bandwidth. Scale as much as you need without restrictions.",
  }
];
---

<BenefitsGrid 
  benefits={benefits}
  title="Why Choose Our Platform"
  description="Discover the key advantages that make us the preferred choice for thousands of customers."
  columns={3}
  class="py-16"
/>
```

## Props Documentation

### Required Props
- `benefits`: Array of benefit objects with `icon`, `title`, `description`, and optional `accentColor`

### Optional Props  
- `title`: Section heading (default: "Key Benefits")
- `description`: Section description (default: "Discover the advantages that set us apart.")
- `columns`: Number of columns for desktop layout - 2, 3, or 4 (default: 3)
- `class`: Additional CSS classes to apply to the section

## Benefit Object Structure
```typescript
{
  icon: string;        // Box Icon name (e.g., "bx:bx-check-circle")
  title: string;       // Benefit headline
  description: string; // Benefit description
  accentColor?: string; // Optional custom accent color (hex/rgb/css color)
}
```

## Responsive Behavior
- **Mobile**: Single column layout with optimized spacing
- **Tablet**: 2-column layout for better readability  
- **Desktop**: Full column count (2, 3, or 4 based on props)

## Theme Integration
- Uses theme classes: `theme-headline`, `theme-paragraph`, `theme-card-bg`
- Integrates with CSS custom properties for consistent theming
- Icons automatically use theme button color unless custom accentColor provided
- Hover effects and transitions respect theme colors
- Borders use `--color-theme-stroke` CSS custom property
- Focus styles use `--color-theme-button` for accessibility

## Features
- ✅ Fully responsive grid layout (mobile-first design)
- ✅ Hover effects with smooth transitions and scaling
- ✅ Theme-aware colors and styling
- ✅ Accessible with proper focus management
- ✅ Flexible icon system using Box Icons (bx:)
- ✅ Optional custom accent colors per benefit
- ✅ Optimized spacing and typography hierarchy
- ✅ Card-based layout with subtle shadows and borders

## Use Cases
Perfect for showcasing:
- **Product Features** - Key functionality and capabilities
- **Service Benefits** - Why customers should choose your offering  
- **Process Outcomes** - Results and guarantees
- **Value Propositions** - Competitive advantages
- **Trust Signals** - Security, support, reliability factors