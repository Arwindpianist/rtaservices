'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { loadGA, pageview } from '@/lib/analytics';

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Load GA on mount
    loadGA();
  }, []);

  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}
