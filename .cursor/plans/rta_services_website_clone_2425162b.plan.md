---
name: RTA Services Website Clone
overview: Build a pixel-perfect Next.js + TailwindCSS clone of the RTA Services website using App Router, including all pages, components, forms with API routes, and proper SEO configuration for Vercel deployment.
todos:
  - id: setup-project
    content: Initialize Next.js project with TypeScript, App Router, and install TailwindCSS dependencies
    status: completed
  - id: configure-tailwind
    content: Configure TailwindCSS with custom theme, PostCSS, and global styles
    status: completed
    dependencies:
      - setup-project
  - id: create-layout
    content: Create root layout.tsx with SEO metadata, fonts, and global structure
    status: completed
    dependencies:
      - setup-project
  - id: build-navbar
    content: Build responsive Navbar component with navigation links, logo, and mobile menu
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-hero
    content: Create Hero component with title, subtitle, and CTA button
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-services
    content: Create Services component with three service cards (TPM, Asset Management, Professional Services)
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-why-choose
    content: Create WhyChooseUs component with three USP blocks (Cost Saving, Multi Vendor, Guaranteed Uptime)
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-partner
    content: Create PartnerSection component highlighting ACA Pacific collaboration
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-brands
    content: Create BrandLogos component with grid of brand logos
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-footer
    content: Create Footer component with contact info, links, social media, and newsletter form
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-forms
    content: Create ContactForm and QuoteForm components with client-side validation
    status: completed
    dependencies:
      - configure-tailwind
  - id: create-api-routes
    content: Create API routes for contact and quote form submissions
    status: completed
    dependencies:
      - create-forms
  - id: create-pages
    content: Create About, Services, Product, and Contact pages
    status: completed
    dependencies:
      - build-navbar
      - create-footer
  - id: build-homepage
    content: Assemble homepage with all components (Hero, Services, WhyChooseUs, Partner, Brands)
    status: completed
    dependencies:
      - create-hero
      - create-services
      - create-why-choose
      - create-partner
      - create-brands
  - id: download-images
    content: Download and optimize images from original site, add to public/images/
    status: completed
    dependencies:
      - setup-project
  - id: seo-config
    content: Add SEO metadata, sitemap.xml, and robots.txt
    status: completed
    dependencies:
      - create-layout
  - id: responsive-testing
    content: Test and refine responsive behavior across all breakpoints
    status: completed
    dependencies:
      - build-homepage
      - create-pages
  - id: deployment-prep
    content: Configure next.config.js, add environment variables documentation, and prepare for Vercel deployment
    status: completed
    dependencies:
      - create-api-routes
      - seo-config
isProject: false
---

# RTA Services Website Clone - Implementation Plan

## Project Structure

The project will use Next.js 14+ with App Router, TailwindCSS, and TypeScript. All pages will be created in the `app/` directory with proper layout hierarchy.

## File Structure

```
rtaservices/
├── app/
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                    # Homepage
│   ├── about/
│   │   └── page.tsx               # About Us page
│   ├── services/
│   │   └── page.tsx               # Services page
│   ├── product/
│   │   └── page.tsx               # Product/Brands page
│   ├── contact/
│   │   └── page.tsx               # Contact page
│   └── api/
│       ├── contact/
│       │   └── route.ts           # Contact form API endpoint
│       └── quote/
│           └── route.ts           # Quote form API endpoint
├── components/
│   ├── Navbar.tsx                 # Navigation component
│   ├── Hero.tsx                   # Hero section
│   ├── Services.tsx               # Services section
│   ├── WhyChooseUs.tsx            # Why Choose Us section
│   ├── BrandLogos.tsx             # Brand logos grid
│   ├── PartnerSection.tsx         # ACA Pacific partner section
│   ├── Footer.tsx                 # Footer component
│   ├── ContactForm.tsx            # Contact form with validation
│   └── QuoteForm.tsx              # Quote request form
├── public/
│   └── images/                    # Downloaded images from site
├── styles/
│   └── globals.css                # Global styles + Tailwind imports
├── tailwind.config.ts             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── README.md                      # Project documentation
```

## Implementation Steps

### 1. Project Setup

- Initialize Next.js 14+ project with TypeScript and App Router
- Install TailwindCSS, PostCSS, and Autoprefixer
- Configure TailwindCSS with custom theme matching site colors
- Set up TypeScript configuration

### 2. Core Layout & Navigation

- Create root `app/layout.tsx` with SEO metadata, fonts, and global structure
- Build `components/Navbar.tsx` with:
  - Logo placement
  - Navigation links (Home, About Us, Services, Product, Contact)
  - "Ask for Quote" CTA button
  - Mobile hamburger menu with responsive behavior
- Implement smooth scrolling and active link states

### 3. Homepage Components

- **Hero Section** (`components/Hero.tsx`):
  - Title: "Discover the Power of Our IT Solutions"
  - Subtitle text matching original
  - "Learn More" CTA button
  - Background image handling
- **Services Section** (`components/Services.tsx`):
  - Three service cards:
    - IT Maintenance Services (TPM)
    - IT Assets Management Services
    - IT Professional Services
  - Each with icon/image, title, and bullet points
  - Responsive grid layout
- **Why Choose Us** (`components/WhyChooseUs.tsx`):
  - Three USP blocks:
    - Significant Cost Saving
    - Multi Vendor Support
    - Guaranteed Uptime
  - Icon/image for each benefit
- **Partner Section** (`components/PartnerSection.tsx`):
  - ACA Pacific collaboration highlight
  - Partner logo and description text
- **Brand Logos** (`components/BrandLogos.tsx`):
  - Grid of brand logos (Dell EMC, IBM, HPE, Sun Oracle, NetApp, Cisco, Huawei, Fujitsu, etc.)
  - Responsive grid that adapts to screen size

### 4. Footer Component

- Create `components/Footer.tsx` with:
  - Contact information (address, phone, emails)
  - Quick links (Terms & Conditions, Privacy Policy)
  - Social media links (LinkedIn, YouTube, Facebook)
  - Newsletter subscription form
  - Copyright notice

### 5. Form Components with Validation

- **ContactForm** (`components/ContactForm.tsx`):
  - Name, email, subject, message fields
  - Client-side validation (required fields, email format)
  - Error messages and success states
  - Submit handler calling `/api/contact`
- **QuoteForm** (`components/QuoteForm.tsx`):
  - Company name, contact person, email, phone, requirements
  - Client-side validation
  - Submit handler calling `/api/quote`

### 6. API Routes

- `**app/api/contact/route.ts`**:
  - POST endpoint for contact form
  - Validate input, send email (using Nodemailer or Resend)
  - Return appropriate responses
- `**app/api/quote/route.ts`**:
  - POST endpoint for quote requests
  - Validate input, send email
  - Return appropriate responses

### 7. Additional Pages

- **About Us** (`app/about/page.tsx`): Company mission and value propositions
- **Services** (`app/services/page.tsx`): Detailed service offerings
- **Product** (`app/product/page.tsx`): Brand logos and support information
- **Contact** (`app/contact/page.tsx`): Contact form and company details

### 8. Styling & Responsive Design

- Configure TailwindCSS with custom colors matching the site
- Ensure mobile-first responsive design
- Implement proper spacing, typography, and hover states
- Match original site's visual hierarchy and layout

### 9. Images & Assets

- Download images from the original site
- Optimize images for web
- Use Next.js Image component for performance
- Add proper alt text for accessibility

### 10. SEO & Metadata

- Add proper meta tags in `app/layout.tsx`
- Create dynamic metadata for each page
- Add Open Graph and Twitter Card tags
- Create `sitemap.xml` and `robots.txt`

### 11. Deployment Preparation

- Configure `next.config.js` for production
- Add environment variables documentation
- Create deployment instructions in README
- Ensure Vercel-ready configuration

## Technical Details

- **Framework**: Next.js 14+ with App Router
- **Styling**: TailwindCSS with custom configuration
- **Language**: TypeScript
- **Forms**: Client-side validation + Next.js API routes
- **Images**: Next.js Image component with optimized assets
- **Deployment**: Vercel with proper environment variables

## Key Features

1. Pixel-perfect replication of layout and content
2. Fully responsive design (mobile, tablet, desktop)
3. Form validation and API integration
4. SEO-optimized with proper metadata
5. Performance optimized with Next.js Image and code splitting
6. Accessible navigation and semantic HTML

