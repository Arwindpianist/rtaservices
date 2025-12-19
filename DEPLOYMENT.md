# Deployment Guide - RTA Services Website

## ✅ Pre-Deployment Checklist

- [x] Build passes successfully (`npm run build`)
- [x] All pages compile without errors
- [x] TypeScript type checking passes
- [x] All dependencies installed
- [x] Images are in `/public/assets/original/`
- [x] Environment variables documented (if needed)

## 🚀 Vercel Deployment Steps

### 1. Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Vercel auto-detects Next.js settings
6. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

### 3. Build Configuration

Vercel automatically detects:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 4. Environment Variables (Optional)

If you want to enable email sending, add in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add `RESEND_API_KEY` (or your email service key)

### 5. Domain Configuration

After deployment:
1. Go to Project Settings → Domains
2. Add your custom domain (if you have one)
3. Vercel provides SSL automatically

## 📊 Build Output

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ƒ /api/contact
├ ƒ /api/quote
├ ○ /contact
├ ○ /product
├ ○ /robots.txt
├ ○ /services
└ ○ /sitemap.xml

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

## 🔍 Post-Deployment Verification

1. **Check all pages load:**
   - Homepage: `/`
   - About: `/about`
   - Services: `/services`
   - Product: `/product`
   - Contact: `/contact`

2. **Test mobile menu:**
   - Open on mobile device or resize browser
   - Click hamburger menu
   - Verify drawer slides up from bottom

3. **Test forms:**
   - Contact form: `/contact`
   - Quote form: `/contact?form=quote`
   - Verify submissions work

4. **Check SEO:**
   - Sitemap: `https://your-domain.vercel.app/sitemap.xml`
   - Robots: `https://your-domain.vercel.app/robots.txt`

## 🐛 Troubleshooting

**Build fails:**
- Check Node.js version (Vercel uses Node 18+ by default)
- Verify all dependencies in `package.json`
- Check for TypeScript errors

**Images not loading:**
- Verify images are in `/public/assets/original/`
- Check image paths in components

**Forms not working:**
- Check API routes are deployed
- Verify environment variables if using email service

## 📝 Notes

- Vercel automatically handles:
  - Next.js optimizations
  - Image optimization
  - Edge functions for API routes
  - Automatic HTTPS
  - Global CDN distribution

- No additional configuration needed - Next.js works out of the box with Vercel!

