# TestimonialSlider Component

A fully-featured testimonial carousel component built for the ARDA Astro Template. This component provides a professional way to showcase customer testimonials with smooth animations, navigation controls, and full theme integration.

## Features

- 🎠 **Smooth Carousel**: CSS transitions with easing for professional feel
- 🔄 **Auto-Rotate**: Optional automatic slide progression with progress indicator
- 📱 **Touch Support**: Swipe gestures for mobile devices
- ⌨️ **Keyboard Navigation**: Arrow key support for accessibility
- 🎯 **Navigation Controls**: Arrow buttons and dot indicators
- ⭐ **Star Ratings**: Visual rating display using Box Icons
- 👤 **Avatar Support**: Customer photos or initials fallback
- 🎨 **Theme Integration**: Full compatibility with 17-palette color system
- 🔍 **Responsive Design**: Mobile-first approach with breakpoint optimizations
- ♿ **Accessibility**: ARIA labels, focus states, and semantic HTML

## Usage

### Basic Implementation

```astro
---
import TestimonialSlider from "@/components/landing/TestimonialSlider.astro";
import testimonialsData from "@/data/testimonials.json";
---

<TestimonialSlider testimonials={testimonialsData.testimonials} />
```

### Full Configuration

```astro
<TestimonialSlider 
  testimonials={testimonials}
  autoRotate={true}
  rotateInterval={6000}
  showDots={true}
  showArrows={true}
  class="my-custom-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `testimonials` | `Testimonial[]` | `[]` | Array of testimonial objects |
| `autoRotate` | `boolean` | `true` | Enable automatic slide progression |
| `rotateInterval` | `number` | `5000` | Auto-rotate interval in milliseconds |
| `showDots` | `boolean` | `true` | Show dot navigation indicators |
| `showArrows` | `boolean` | `true` | Show previous/next arrow buttons |
| `class` | `string` | `""` | Additional CSS classes |

## Testimonial Object Structure

```typescript
interface Testimonial {
  quote: string;        // Customer testimonial text
  name: string;         // Customer full name
  title: string;        // Customer job title
  company: string;      // Customer company name
  avatar?: string;      // Optional avatar image path
  rating: number;       // Star rating (1-5)
}
```

## Sample Data Structure

Create a JSON file with your testimonials:

```json
{
  "testimonials": [
    {
      "quote": "This platform has completely transformed how we manage our customer relationships. The intuitive interface and powerful features have increased our team's productivity by 40%.",
      "name": "Sarah Chen",
      "title": "CEO",
      "company": "TechStart Solutions",
      "avatar": "/images/testimonials/sarah-chen.jpg",
      "rating": 5
    },
    {
      "quote": "The support team is absolutely phenomenal. Every question gets answered within minutes, and they've helped us customize the platform perfectly.",
      "name": "Marcus Rodriguez",
      "title": "Operations Manager", 
      "company": "Digital Dynamics",
      "rating": 5
    }
  ]
}
```

## Theme Integration

The component automatically adapts to all 17 color themes using theme classes:

- **Backgrounds**: `theme-card-bg` for testimonial cards
- **Typography**: `theme-paragraph` for quotes, `theme-sub-headline` for names
- **Colors**: CSS custom properties for buttons and accents
- **Borders**: `var(--color-theme-stroke)` for subtle borders

### Theme Classes Used

```astro
<!-- Main testimonial text -->
<blockquote class="theme-paragraph">

<!-- Customer name -->
<div class="theme-sub-headline">

<!-- Card background -->
<div class="theme-card-bg">

<!-- Accent colors via CSS custom properties -->
<div style="background-color: var(--color-theme-button);">
```

## Navigation Features

### Arrow Navigation
- Circular prev/next buttons with hover effects
- Positioned on left/right sides of testimonial
- Responsive positioning and sizing
- Keyboard focus support

### Dot Navigation
- Visual indicators showing current slide
- Click to jump to specific testimonial
- Active state styling with theme colors
- Hover effects for better UX

### Touch/Swipe Support
- Native touch gestures on mobile devices
- Minimum swipe distance threshold (50px)
- Works alongside other navigation methods

### Keyboard Controls
- Left Arrow: Previous testimonial
- Right Arrow: Next testimonial
- Focus management for accessibility

## Auto-Rotate Behavior

When enabled, testimonials automatically progress:

1. **Progress Bar**: Visual indicator of time remaining
2. **Pause on Hover**: Auto-rotation stops when user hovers
3. **Reset on Interaction**: Timer resets when user navigates manually
4. **Configurable Interval**: Customize timing via `rotateInterval` prop

## Responsive Design

The component adapts to different screen sizes:

### Mobile (< 640px)
- Smaller padding and button sizes
- Adjusted font sizes for quotes
- Condensed avatar sizes
- Touch-optimized navigation

### Tablet (640px - 768px) 
- Medium padding and elements
- Balanced text sizes
- Standard avatar sizes

### Desktop (> 768px)
- Full padding and large elements
- Maximum text sizes
- Full-size avatars and buttons

## Accessibility Features

- **ARIA Labels**: Descriptive labels for all interactive elements
- **Semantic HTML**: Proper use of `<blockquote>` and heading structure
- **Focus Management**: Visible focus states and logical tab order
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader Support**: Proper announcement of slide changes
- **Color Contrast**: Theme system ensures accessible contrast ratios

## Styling Customization

### CSS Custom Properties
The component respects all theme CSS variables:

```css
--color-theme-button      /* Navigation buttons */
--color-theme-card-bg     /* Testimonial background */
--color-theme-paragraph   /* Quote text */
--color-theme-sub-headline /* Customer name */
--color-theme-stroke      /* Borders and dots */
```

### Custom Classes
Add your own styling by passing classes:

```astro
<TestimonialSlider 
  testimonials={testimonials}
  class="my-testimonials shadow-lg"
/>
```

## Browser Support

- Modern browsers with CSS Grid and Flexbox
- Touch events for mobile devices
- CSS custom properties support
- ES6+ JavaScript features

## Performance Considerations

- **Lazy Loading**: Images use responsive loading attributes
- **Efficient Animations**: CSS transforms for smooth performance
- **Event Delegation**: Optimized event handling
- **Memory Management**: Automatic cleanup on page unload
- **Minimal JavaScript**: Core functionality with small footprint

## Integration Examples

### With Section Heading

```astro
<section class="py-16 md:py-20">
  <div class="text-center mb-16">
    <h2 class="text-3xl lg:text-4xl font-bold theme-headline mb-4">
      What Our Customers Say
    </h2>
    <p class="text-xl theme-paragraph max-w-3xl mx-auto">
      Join thousands of satisfied customers who have transformed their business
    </p>
  </div>
  
  <TestimonialSlider 
    testimonials={testimonialsData.testimonials}
    autoRotate={true}
    rotateInterval={6000}
  />
</section>
```

### In Container Component

```astro
<Container>
  <TestimonialSlider testimonials={testimonials} />
</Container>
```

## Troubleshooting

### Common Issues

1. **Testimonials Not Showing**: Verify testimonials array is properly imported and passed
2. **Theme Colors Not Applied**: Ensure theme system is properly initialized on the page
3. **Auto-rotate Not Working**: Check that `autoRotate={true}` and testimonials length > 1
4. **Touch Swipe Issues**: Verify touch events aren't being intercepted by parent elements

### Debug Mode
Add logging to check component state:

```javascript
console.log('Testimonials:', testimonials);
console.log('Current slide:', currentSlide);
```

The TestimonialSlider component provides a robust, accessible, and visually appealing way to showcase customer testimonials while maintaining consistency with the ARDA template's design system.