'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <div className="min-h-screen bg-rta-bg-light text-rta-text">
        {children}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
