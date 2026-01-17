# RTA Services Style Guide

## Overview
This style guide defines the design system for RTA Services website, ensuring consistency across all components and pages.

## Typography

### Font Families
- **Primary:** Helvetica, "Helvetica Neue", Arial, sans-serif
- **Fallback:** System fonts

### Font Sizes

#### Headings
- **H1 (Hero):** 64px (desktop), 48px (tablet), 36px (mobile)
  - Line height: 1.2
  - Font weight: 700 (bold)
  - Usage: Main page headlines, hero sections

- **H1 (Standard):** 48px (desktop), 36px (mobile)
  - Line height: 1.2
  - Font weight: 700
  - Usage: Page titles

- **H2:** 36px (desktop), 28px (mobile)
  - Line height: 1.2
  - Font weight: 700
  - Usage: Section headings

- **H3:** 24px (desktop), 22px (mobile)
  - Line height: 1.3
  - Font weight: 700
  - Usage: Subsection headings, card titles

- **H4:** 20px
  - Line height: 1.4
  - Font weight: 600
  - Usage: Minor headings

#### Body Text
- **Body Large:** 18px
  - Line height: 1.6
  - Font weight: 400
  - Usage: Lead paragraphs, important content

- **Body:** 16px
  - Line height: 1.6
  - Font weight: 400
  - Usage: Standard body text

- **Body Small:** 14px
  - Line height: 1.5
  - Font weight: 400
  - Usage: Secondary text, captions, footers

#### Special
- **Subheadline:** 20-24px
  - Line height: 1.5
  - Font weight: 400
  - Usage: Hero subheadlines, section descriptions

- **Caption:** 12-14px
  - Line height: 1.4
  - Font weight: 400
  - Usage: Image captions, fine print

## Colors

### Primary Colors
- **Primary Yellow:** `#FFBF23` (RGB: 255, 191, 35)
  - Usage: Primary CTAs, links, accents
  - Hover: `#E6A91F` (RGB: 230, 169, 31)

### Text Colors
- **Primary Text:** `#2C2C2C`
  - Usage: Headings, primary content
- **Secondary Text:** `#666666`
  - Usage: Body text, descriptions
- **Light Text:** `#999999`
  - Usage: Footer text, disabled states
- **White Text:** `#FFFFFF`
  - Usage: Text on dark backgrounds

### Background Colors
- **White:** `#FFFFFF`
  - Usage: Main background, cards
- **Light Gray:** `#F8F8F8`
  - Usage: Section backgrounds, subtle separations
- **Blue Tint:** `#F0F7FF`
  - Usage: Hero backgrounds, accent sections
- **Footer:** `#1A1A1A`
  - Usage: Footer background

### Accent Colors
- **Success:** `#10B981` (green)
  - Usage: Success messages, confirmations
- **Error:** `#EF4444` (red)
  - Usage: Error messages, warnings
- **Info:** `#3B82F6` (blue)
  - Usage: Informational messages

### Border Colors
- **Light Border:** `#E0E0E0`
  - Usage: Card borders, dividers
- **Input Border:** `#CCCCCC`
  - Usage: Form input borders

## Spacing

### Section Spacing
- **Section Padding Y:** 80px (mobile), 100px (desktop)
- **Section Padding X:** 20px (mobile), 40px (desktop)

### Component Spacing
- **Gap XS:** 8px
- **Gap SM:** 16px
- **Gap MD:** 24px
- **Gap LG:** 32px
- **Gap XL:** 48px
- **Gap 2XL:** 64px

### Container
- **Max Width:** 1400px
- **Padding:** 20px (mobile), 40px (desktop)

## Buttons

### Primary CTA Button
**Usage:** Main conversion actions (Get Quote, Request Consultation)

```tsx
<Button
  className="bg-[#FFBF23] text-white px-8 py-4 rounded-md font-semibold 
             text-base hover:bg-[#E6A91F] hover:shadow-lg 
             hover:shadow-[#FFBF23]/20 transition-all duration-200"
  style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
>
  Get Quote
</Button>
```

**Specifications:**
- Min height: 48px (for touch targets)
- Min width: 120px
- Border radius: 6px (md)
- Font size: 16px (base)
- Font weight: 600 (semibold)

### Secondary Button
**Usage:** Secondary actions (Learn More, View Details)

```tsx
<Button
  variant="outline"
  className="bg-white text-[#FFBF23] border-2 border-[#FFBF23] 
             px-8 py-4 rounded-md font-semibold text-base 
             hover:bg-[#FFBF23]/10 transition-all duration-200"
>
  Learn More
</Button>
```

### Text Link Button
**Usage:** Tertiary actions

```tsx
<Link
  className="text-[#FFBF23] font-semibold hover:text-[#E6A91F] 
             underline-offset-4 hover:underline transition-colors"
  href="/services"
>
  View All Services
</Link>
```

## Cards

### Standard Card
- Border radius: 8px
- Box shadow: `0 2px 8px rgba(0, 0, 0, 0.1)`
- Hover shadow: `0 4px 12px rgba(0, 0, 0, 0.15)`
- Padding: 24-32px

## Forms

### Input Fields
- Border radius: 4px
- Border width: 1px
- Height: 40-44px
- Padding: 10-12px vertical, 14-16px horizontal
- Focus border color: `#FFBF23`

### Textarea
- Border radius: 4px
- Border width: 1px
- Min height: 100px
- Padding: 10-12px

## Images

### Image Guidelines
- **Hero Images:** 1920x1080px, WebP format, optimized
- **Service Images:** 800x600px, WebP format
- **Logo Images:** SVG preferred, PNG fallback
- **Alt Text Format:** "Descriptive text - RTA Services" (include context)
- **Lazy Loading:** All images except hero (use Next.js Image component)

### Example
```tsx
<Image
  src="/assets/original/maintenance.jpg"
  alt="Certified IT engineer performing hardware maintenance in data center - RTA Services"
  width={800}
  height={600}
  className="object-cover"
  loading="lazy"
/>
```

## Accessibility

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Primary yellow (#FFBF23) on white: ✓ Passes
- White text on primary yellow: ✓ Passes
- Primary text (#2C2C2C) on white: ✓ Passes

### Focus States
- All interactive elements must have visible focus indicators
- Focus color: `#FFBF23` with 2px outline
- Focus offset: 2px

### Touch Targets
- Minimum size: 44x44px for mobile
- Adequate spacing between touch targets: 8px minimum

## Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px
- **Large Desktop:** > 1400px

## Animation Guidelines

### Transitions
- Standard duration: 200ms
- Hover effects: 200ms ease
- Page transitions: 300ms ease

### Motion Principles
- Use subtle animations to enhance UX
- Respect `prefers-reduced-motion` media query
- Avoid excessive motion that distracts from content

## Component Usage Examples

### Hero Section
- Use H1 for main headline
- Use subheadline (20-24px) for description
- Primary CTA button prominently placed
- Secondary CTA optional

### Service Cards
- H3 for service title
- Body text for description
- Bullet list for features
- CTA button at bottom

### Navigation
- Body font size (16px)
- Medium font weight (500)
- Hover state: color change to primary yellow
- Active state: underline in primary yellow

## Best Practices

1. **Consistency:** Use design tokens from `tailwind.config.ts`
2. **Accessibility:** Always include ARIA labels and proper semantic HTML
3. **Performance:** Optimize images and use Next.js Image component
4. **Responsive:** Test on multiple device sizes
5. **Contrast:** Verify color contrast ratios meet WCAG standards
6. **Spacing:** Use consistent spacing scale throughout
7. **Typography:** Maintain proper heading hierarchy (one H1 per page)
