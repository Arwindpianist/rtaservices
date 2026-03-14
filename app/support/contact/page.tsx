'use client';

import { MessageCircle } from 'lucide-react';

/**
 * Support contact page with embedded Zoho Web-to-Lead form.
 * Form posts to Zoho CRM and redirects to /support/thank-you on success.
 */
export default function SupportContactPage() {
  return (
    <div className="min-h-[60vh] bg-rta-bg-light py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="mb-8 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-rta-blue" aria-hidden />
          <h1 className="mt-4 text-h2 font-bold text-rta-blue">Support</h1>
          <p className="mt-2 text-body text-rta-text-secondary">
            Get in touch with our team. Use the form below.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden">
          <iframe
            src="/support-form.html"
            title="Support contact form"
            className="w-full min-h-[680px] border-0 bg-transparent"
            sandbox="allow-forms allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
