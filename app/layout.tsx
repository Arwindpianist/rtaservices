import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "RTA Services - End-to-End IT Solutions for Enterprise Systems",
  description: "RTA Services provide end-to-end IT services for enterprise systems, including installation, upgrades, and OS deployment for servers, storage, and networking equipment, backed by L1 to L3 support for seamless operations.",
  keywords: "IT services, enterprise systems, server maintenance, storage solutions, networking equipment, L1 L2 L3 support, asset management, data center services",
  authors: [{ name: "RTA Services" }],
  openGraph: {
    title: "RTA Services - End-to-End IT Solutions for Enterprise Systems",
    description: "RTA Services provide end-to-end IT services for enterprise systems, including installation, upgrades, and OS deployment.",
    url: "https://www.rtaservices.net",
    siteName: "RTA Services",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RTA Services - End-to-End IT Solutions",
    description: "RTA Services provide end-to-end IT services for enterprise systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

