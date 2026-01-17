import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Analytics from "@/components/Analytics";
import SkipToContent from "@/components/SkipToContent";
import StickyCTA from "@/components/StickyCTA";

export const metadata: Metadata = {
  title: {
    default: "Enterprise IT Support Services Singapore | RTA Services - 40% Cost Savings",
    template: "%s | RTA Services"
  },
  description: "Multi-vendor IT maintenance, asset management & professional services for enterprise systems. 24/7 support, guaranteed uptime SLAs. Serving Asia-Pacific. Request free consultation.",
  keywords: "IT services Singapore, enterprise IT support, server maintenance, storage solutions, networking equipment, L1 L2 L3 support, asset management, data center services, Asia-Pacific IT services, multi-vendor support, IT maintenance contracts, enterprise hardware support",
  authors: [{ name: "RTA Services" }],
  creator: "RTA Services",
  publisher: "RTA Services",
  metadataBase: new URL("https://rta.arwindpianist.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Enterprise IT Support Services Singapore | RTA Services - 40% Cost Savings",
    description: "Multi-vendor IT maintenance, asset management & professional services for enterprise systems. 24/7 support, guaranteed uptime SLAs. Serving Asia-Pacific.",
    url: "https://rta.arwindpianist.com",
    siteName: "RTA Services",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RTA Services - Enterprise IT Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Enterprise IT Support Services Singapore | RTA Services",
    description: "Multi-vendor IT maintenance, asset management & professional services. 24/7 support, guaranteed uptime SLAs.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "verification_token_here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <Analytics />
        <SkipToContent />
        <Navbar />
        <Breadcrumbs />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  );
}

