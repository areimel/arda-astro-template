# VideoHero Component

A responsive hero section component designed for demo-focused landing pages. Features embedded video support for YouTube, Vimeo, and local video files with compelling headlines and call-to-action buttons.

## Features

- **Multiple Video Platforms**: Supports YouTube, Vimeo, and local video files
- **Responsive Design**: Mobile-first responsive layout with proper aspect ratios
- **Theme Integration**: Fully integrated with the 17-palette theme system
- **Interactive Thumbnails**: Optional thumbnail with play button overlay
- **Split Layout**: Content and video side-by-side on desktop, stacked on mobile
- **Accessibility**: Proper focus management and keyboard navigation
- **Smooth Animations**: CSS transitions for loading states and hover effects

## Usage

```astro
---
import VideoHero from "@/components/landing/VideoHero.astro";
---

<VideoHero 
  headline="See Our Product in Action"
  subheadline="Watch this 2-minute demo to discover how our solution can transform your workflow."
  videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  videoType="youtube"
  ctaText="Start Free Trial"
  ctaHref="#pricing"
  ctaStyle="primary"
  showPlayButton={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headline` | `string` | Required | Main heading text |
| `subheadline` | `string?` | - | Optional subheading/description |
| `videoUrl` | `string` | Required | Video URL or path |
| `videoType` | `"youtube" \| "vimeo" \| "local"` | `"youtube"` | Video platform type |
| `ctaText` | `string?` | `"Get Started"` | Call-to-action button text |
| `ctaHref` | `string?` | `"#"` | Call-to-action button link |
| `ctaStyle` | `"primary" \| "outline"` | `"primary"` | CTA button style |
| `thumbnailUrl` | `string?` | Auto-generated for YouTube | Custom thumbnail image URL |
| `showPlayButton` | `boolean` | `true` | Show play button overlay on thumbnail |
| `class` | `string?` | - | Additional CSS classes |

## Video Types

### YouTube
```astro
<VideoHero 
  videoUrl="https://www.youtube.com/watch?v=VIDEO_ID"
  videoType="youtube"
/>
```
- Automatically extracts video ID from URL
- Generates thumbnail from YouTube
- Uses YouTube's embed player

### Vimeo
```astro
<VideoHero 
  videoUrl="https://vimeo.com/VIDEO_ID"
  videoType="vimeo"
  thumbnailUrl="/path/to/thumbnail.jpg"
/>
```
- Extracts video ID from Vimeo URL
- Requires manual thumbnail URL
- Uses Vimeo's embed player

### Local Video
```astro
<VideoHero 
  videoUrl="/videos/demo.mp4"
  videoType="local"
  thumbnailUrl="/images/video-poster.jpg"
/>
```
- Uses HTML5 video element
- Supports standard video formats
- Includes video controls

## Layout

The component uses a responsive grid layout:
- **Desktop (lg+)**: Side-by-side layout with video left, content right
- **Mobile**: Stacked layout with content first, then video

## Theme Integration

The component follows the project's theme system:
- Uses `theme-headline` for main heading
- Uses `theme-paragraph` for subheading
- Integrates with `theme-button-primary` and `theme-button-outline`
- All theme colors work with the ColorPaletteSelector

## Performance Features

- **Lazy Loading**: Embedded videos only load when thumbnail is clicked
- **Aspect Ratio**: Maintains 16:9 aspect ratio on all devices
- **Optimized Thumbnails**: Uses maxresdefault for YouTube thumbnails
- **Progressive Enhancement**: Falls back gracefully if JavaScript is disabled

## Accessibility

- Proper focus management for interactive elements
- Keyboard navigation support
- Semantic HTML structure
- ARIA labels for screen readers
- High contrast support through theme system

## Examples

### Basic YouTube Demo
```astro
<VideoHero 
  headline="Product Demo"
  videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  ctaText="Try Now"
  ctaHref="/signup"
/>
```

### Vimeo with Custom Styling
```astro
<VideoHero 
  headline="Company Overview"
  subheadline="Learn about our mission and values"
  videoUrl="https://vimeo.com/123456789"
  videoType="vimeo"
  thumbnailUrl="/images/company-video-thumb.jpg"
  ctaText="Learn More"
  ctaStyle="outline"
  class="bg-gray-50"
/>
```

### Local Video with No CTA
```astro
<VideoHero 
  headline="Technical Walkthrough"
  videoUrl="/videos/technical-demo.mp4"
  videoType="local"
  thumbnailUrl="/images/tech-demo-poster.jpg"
  ctaText=""
  ctaHref=""
/>
```

## Customization

The component is designed to work with the existing theme system. For advanced customization:

1. **Colors**: Use CSS custom properties from the theme system
2. **Spacing**: Modify the `py-16 md:py-24` classes in the component
3. **Typography**: Adjust font sizes in the `theme-headline` and `theme-paragraph` classes
4. **Layout**: Modify the grid system for different breakpoints

## Dependencies

- `astro-icon/components` for icons
- `@/components/ui/link.astro` for CTA buttons
- `@/components/container.astro` for layout container
- Theme system CSS custom properties