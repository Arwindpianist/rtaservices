'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

/**
 * Shown after Zoho form submission (redirect target).
 * When loaded in an iframe (e.g. after form submit), break out so the user sees this full page.
 */
export default function SupportThankYouPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      window.top!.location.href = window.location.href;
    }
  }, []);

  return (
    <div className="min-h-[60vh] bg-rta-bg-light flex items-center justify-center py-12 lg:py-16">
      <div className="mx-auto max-w-md px-5 sm:px-6 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" aria-hidden />
        <h1 className="mt-6 text-h2 font-bold text-rta-blue">Thank you</h1>
        <p className="mt-3 text-body text-rta-text-secondary">
          Your message has been received. We will get back to you shortly.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
