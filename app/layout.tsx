import type { Metadata } from "next";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";
import Analytics from "@/components/Analytics";
import SkipToContent from "@/components/SkipToContent";

export const metadata: Metadata = {
  title: {
    default: "Enterprise SLA Grade Maintenance Services & Support Partner | RTA Services",
    template: "%s | RTA Services"
  },
  description: "We empower organizations to maintain, migrate and scale, cost effectively. RTA TPM, RTA OSS, RTA PS. Your strategic IT maintenance partner in Asia. 24/7 support, guaranteed SLAs.",
  keywords: "IT services Singapore, enterprise IT support, server maintenance, storage solutions, networking equipment, L1 L2 L3 support, asset management, data center services, Asia-Pacific IT services, multi-vendor support, IT maintenance contracts, enterprise hardware support, RTA TPM, RTA OSS, open source software support",
  authors: [{ name: "RTA Services" }],
  creator: "RTA Services",
  publisher: "RTA Services",
  metadataBase: new URL("https://rta.arwindpianist.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Enterprise SLA Grade Maintenance Services & Support Partner | RTA Services",
    description: "We empower organizations to maintain, migrate and scale, cost effectively. RTA TPM, RTA OSS, RTA PS. Your strategic IT maintenance partner in Asia.",
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
    title: "Enterprise SLA Grade Maintenance Services & Support Partner | RTA Services",
    description: "We empower organizations to maintain, migrate and scale, cost effectively. Your strategic IT maintenance partner in Asia.",
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
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}

