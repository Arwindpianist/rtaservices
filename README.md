# RTA Services Website Clone

A pixel-perfect Next.js + TailwindCSS clone of the RTA Services marketing website.

## 🚀 Features

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, sitemap, and robots.txt
- **Form Validation** - Client-side validation for contact and quote forms
- **API Routes** - Backend endpoints for form submissions
- **Vaul Drawer** - Modern mobile menu with glass background
- **Framer Motion** - Smooth animations and micro-interactions
- **shadcn/ui** - Accessible UI components

## 📁 Project Structure

```
rtaservices/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx             # Homepage
│   ├── about/               # About Us page
│   ├── services/            # Services page
│   ├── product/             # Product/Brands page
│   ├── contact/             # Contact page
│   ├── api/                 # API routes
│   ├── globals.css          # Global styles
│   ├── sitemap.ts           # Sitemap generation
│   └── robots.ts            # Robots.txt generation
├── components/              # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── WhyChooseUs.tsx
│   ├── PartnerSection.tsx
│   ├── BrandLogos.tsx
│   ├── Footer.tsx
│   ├── ContactForm.tsx
│   └── QuoteForm.tsx
└── public/
    └── images/              # Image assets
```

## 🛠️ Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add images:**
   - Download images from the original website (https://www.rtaservices.net/)
   - Place them in the `public/images/` directory
   - See `public/images/README.md` for required images list

3. **Configure environment variables:**
   Create a `.env.local` file:
   ```env
   # For email sending (optional - currently forms log to console)
   # RESEND_API_KEY=your_resend_api_key
   # Or use other email services like SendGrid, AWS SES, etc.
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Start production server:**
   ```bash
   npm start
   ```

## 📧 Form Submission Setup

Currently, the contact and quote forms log submissions to the console. To enable actual email sending:

1. **Option 1: Use Resend (Recommended for Vercel)**
   - Sign up at https://resend.com
   - Get your API key
   - Add `RESEND_API_KEY` to `.env.local`
   - Uncomment and update the email sending code in:
     - `app/api/contact/route.ts`
     - `app/api/quote/route.ts`

2. **Option 2: Use other email services**
   - SendGrid, AWS SES, Nodemailer, etc.
   - Update the API routes accordingly

## 🚢 Deployment to Vercel

### Quick Deploy

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Add environment variables if using email services (optional)
   - Click "Deploy"

3. **Vercel will automatically:**
   - Build your Next.js app (`npm run build`)
   - Deploy to production
   - Provide a live URL (e.g., `your-project.vercel.app`)
   - Set up automatic deployments on every push

### Build Status
✅ **Build passes successfully** - All pages compile without errors
- Static pages: Home, About, Services, Product, Contact
- Dynamic API routes: `/api/contact`, `/api/quote`
- SEO: Sitemap and robots.txt generated automatically

### Environment Variables (Optional)
If you want to enable email sending from forms, add these in Vercel dashboard:
- `RESEND_API_KEY` (if using Resend)
- Or configure your preferred email service

## 📝 Pages

- **Home** (`/`) - Hero, services, why choose us, partner section, brand logos
- **About Us** (`/about`) - Company information and mission
- **Services** (`/services`) - Detailed service offerings
- **Product** (`/product`) - Brand logos and support information
- **Contact** (`/contact`) - Contact form and company details
- **Quote Request** (`/contact?form=quote`) - Quote request form

## 🎨 Styling

- **TailwindCSS** is configured with custom colors
- **Responsive breakpoints**: Mobile-first design
- **Custom components**: Button styles defined in `globals.css`

## 🔍 SEO

- Meta tags configured in `app/layout.tsx`
- Dynamic metadata for each page
- Sitemap automatically generated at `/sitemap.xml`
- Robots.txt at `/robots.txt`

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- Mobile: Default (< 768px)
- Tablet: md (≥ 768px)
- Desktop: lg (≥ 1024px)

## 🐛 Troubleshooting

- **Images not loading**: Ensure images are in `public/images/` directory
- **Forms not submitting**: Check API routes and email service configuration
- **Build errors**: Run `npm install` to ensure all dependencies are installed

## 📄 License

This is a clone project for educational/demonstration purposes.

## 🙏 Credits

Original website: https://www.rtaservices.net/

