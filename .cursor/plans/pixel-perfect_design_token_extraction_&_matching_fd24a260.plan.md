---
name: Pixel-Perfect Design Token Extraction & Matching
overview: Extract exact design tokens from rtaservices.net and update all components to achieve visual 1:1 parity. This is a design accuracy task, not a redesign.
todos:
  - id: extract-colors
    content: Extract exact color values (hex/RGBA) from the live site using browser dev tools
    status: completed
  - id: extract-typography
    content: Extract exact font-family, sizes, weights, and line-heights from the live site
    status: completed
  - id: extract-spacing
    content: Extract exact padding, margin, and spacing values in pixels from all sections
    status: completed
  - id: extract-components
    content: Extract exact styling for buttons, cards, inputs (height, radius, shadows, borders)
    status: completed
  - id: update-tailwind-config
    content: Update tailwind.config.ts with all extracted design tokens as custom values
    status: completed
    dependencies:
      - extract-colors
      - extract-typography
      - extract-spacing
      - extract-components
  - id: update-globals-css
    content: Update globals.css with exact font imports and base styles matching the original
    status: completed
    dependencies:
      - extract-typography
  - id: match-navbar
    content: Update Navbar component to match exact styling, spacing, and colors
    status: completed
    dependencies:
      - update-tailwind-config
  - id: match-hero
    content: Update Hero component to match exact typography, spacing, and layout
    status: completed
    dependencies:
      - update-tailwind-config
  - id: match-services
    content: Update Services component to match exact card styling and spacing
    status: completed
    dependencies:
      - update-tailwind-config
  - id: match-why-choose
    content: Update WhyChooseUs component to match exact styling
    status: completed
    dependencies:
      - update-tailwind-config
  - id: match-partner
    content: Update PartnerSection component to match exact background and styling
    status: completed
    dependencies:
      - update-tailwind-config
  - id: match-brands
    content: Update BrandLogos component to match exact grid and styling
    status: completed
    dependencies:
      - update-tailwind-config
  - id: match-footer
    content: Update Footer component to match exact colors, typography, and spacing
    status: completed
    dependencies:
      - update-tailwind-config
  - id: match-forms
    content: Update ContactForm and QuoteForm to match exact input and button styling
    status: completed
    dependencies:
      - update-tailwind-config
  - id: verify-all
    content: Side-by-side comparison of all sections and final verification of visual parity
    status: completed
    dependencies:
      - match-navbar
      - match-hero
      - match-services
      - match-why-choose
      - match-partner
      - match-brands
      - match-footer
      - match-forms
---

# Pixel-Perfect Design Token Extraction & Matching Plan

## Objective

Achieve visual 1:1 parity with https://www.rtaservices.net/ by extracting exact design tokens and applying them precisely.

## Phase 1: Design Token Extraction

### 1.1 Color Palette Extraction

- Inspect the live site using browser dev tools
- Extract exact hex/RGBA values for:
- Primary brand color (buttons, links, accents)
- Background colors (white, gray variants, section backgrounds)
- Text colors (headings, body, muted text)
- Border colors
- Hover states
- Document all color values in a design tokens file

### 1.2 Typography Extraction

- Extract exact font-family stack (including fallbacks)
- Document font weights for:
- H1, H2, H3, H4, H5, H6
- Body text
- Button text
- Navigation links
- Extract exact font sizes (in px, not rem/em)
- Extract line-height values
- Extract letter-spacing if specified

### 1.3 Spacing & Layout Extraction

- Extract exact padding values for:
- Sections (top/bottom)
- Containers (left/right)
- Cards/components
- Extract exact margin values
- Extract container max-width values
- Extract grid gap values
- Document all spacing in pixels

### 1.4 Component Styling Extraction

- Buttons:
- Exact height, padding, border-radius
- Box-shadow values
- Hover state changes
- Cards:
- Border-radius
- Box-shadow
- Padding values
- Inputs/Forms:
- Border styles, colors, radius
- Focus states
- Error states

### 1.5 Visual Effects Extraction

- Box-shadow values (all variations)
- Border-radius values
- Border widths and styles
- Transition durations and easing functions

## Phase 2: Configuration Updates

### 2.1 Tailwind Config Update

Update `tailwind.config.ts` with:

- Custom color palette (exact hex values)
- Custom fontFamily (exact stack)
- Custom spacing scale (based on extracted px values)
- Custom borderRadius values
- Custom boxShadow values
- Custom font sizes matching the site

### 2.2 Global CSS Update

Update `app/globals.css` with:

- Exact font imports (Google Fonts or system fonts)
- CSS custom properties if the site uses them
- Base styles matching the original

## Phase 3: Component-by-Component Matching

### 3.1 Navbar

- Match exact height, padding, background
- Match navigation link styles (font, size, spacing)
- Match "Ask for Quote" button exactly
- Match mobile menu styling

### 3.2 Hero Section

- Match exact heading sizes and weights
- Match paragraph text styling
- Match button styling
- Match spacing between elements
- Match background colors/gradients

### 3.3 Services Section

- Match card styling exactly
- Match image dimensions and aspect ratios
- Match text hierarchy
- Match spacing between cards

### 3.4 Why Choose Us Section

- Match icon/emoji sizes
- Match card styling
- Match text alignment and spacing

### 3.5 Partner Section

- Match background color
- Match text styling
- Match logo container styling

### 3.6 Brand Logos Section

- Match grid layout exactly
- Match logo container styling
- Match hover effects (if any)

### 3.7 Footer

- Match background color exactly
- Match text colors and sizes
- Match link styling
- Match newsletter form styling
- Match social media icon sizes

### 3.8 Forms (Contact & Quote)

- Match input field styling exactly
- Match label styling
- Match button styling
- Match error message styling
- Match spacing between form elements

## Phase 4: Verification & Refinement

### 4.1 Side-by-Side Comparison

- Open original site and clone in separate windows
- Compare each section pixel-by-pixel
- Document discrepancies

### 4.2 Iterative Adjustments

- Adjust spacing values to match exactly
- Adjust colors to match exactly
- Adjust typography to match exactly
- Adjust component styling to match exactly

### 4.3 Final Verification

- Verify at normal viewing distance
- Verify on different screen sizes (if responsive matching is needed)
- Ensure no visual differences are noticeable

## Deliverables

1. **Design Tokens Document** - Complete list of extracted values
2. **Updated tailwind.config.ts** - All custom values applied
3. **Updated globals.css** - Font imports and base styles
4. **Updated Components** - All components matching exactly
5. **Verification Report** - Confirmation of visual parity

## Critical Rules

- NO approximations - use exact values only
- NO "improvements" - match the original exactly
- NO default Tailwind values - use custom values
- NO relative units where px is used - match unit types
- Verify each change against the live site