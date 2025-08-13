# LeadMagnetHero Component Usage

## Overview
A conversion-optimized hero component designed for lead generation landing pages. Features above-the-fold design with compelling headline, value proposition, and email capture form.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `headline` | string | Yes | - | Main compelling headline |
| `subheadline` | string | Yes | - | Supporting value proposition |
| `leadMagnetTitle` | string | Yes | - | Title of the lead magnet/download |
| `benefits` | string[] | Yes | - | Array of 3-5 key benefits |
| `formAction` | string | No | `"https://api.web3forms.com/submit"` | Form submission endpoint |
| `ctaText` | string | No | `"Get Free Access"` | Call-to-action button text |

## Example Usage

```astro
---
import LeadMagnetHero from "@/components/landing/LeadMagnetHero.astro";
---

<LeadMagnetHero 
  headline="Master Modern Web Development"
  subheadline="Get our comprehensive guide and transform your coding skills in just 30 days"
  leadMagnetTitle="The Complete Web Dev Roadmap 2024"
  benefits={[
    "Learn the most in-demand technologies and frameworks",
    "Step-by-step roadmap from beginner to professional",
    "Access to exclusive templates and code examples", 
    "Join a community of 10,000+ developers",
    "Regular updates with latest industry trends"
  ]}
  ctaText="Download Free Guide"
/>
```

## Features

✅ **Theme System Integration**
- Uses all theme classes (theme-headline, theme-paragraph, theme-button-primary)
- Works across all 17 color palettes
- CSS custom properties for dynamic theming

✅ **Web3Forms Integration** 
- Built-in form validation and submission
- Uses existing WEB3FORMS_KEY environment variable
- Proper error handling and success feedback

✅ **Mobile-First Responsive Design**
- Grid layout that adapts to all screen sizes
- Optimized for conversion on mobile devices
- Touch-friendly form interactions

✅ **Lead Magnet Preview**
- PDF icon with themed styling
- Clear value proposition display
- Trust indicators (secure, no spam, instant access)

✅ **Conversion Optimization**
- Benefits list with checkmark icons
- Social proof avatars
- Above-the-fold positioning
- Clear call-to-action

✅ **Accessibility**
- Proper form labels and validation
- Keyboard navigation support
- Screen reader friendly

## Icons Used
- `bx:bx-check-circle` - Benefit checkmarks
- `bx:bx-user` - Social proof avatars
- `bx:bxs-file-pdf` - Lead magnet preview
- `bx:bx-download` - CTA button icon
- `bx:bx-lock-alt` - Security indicator
- `bx:bx-envelope` - No spam indicator
- `bx:bx-time` - Instant access indicator

## Form Behavior
- Real-time validation feedback
- Success message with visual confirmation
- Automatic form reset after submission
- Anti-spam honeypot protection
- Email subject line customization

## Testing
Visit `/lead-magnet-demo` to see the component in action and test with different color themes using the ColorPaletteSelector.