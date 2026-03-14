'use client';

import { MessageCircle } from 'lucide-react';

/**
 * Temporary support endpoint for customers.
 * Embed your Zoho form here (SalesIQ-like) by replacing the placeholder
 * with an iframe or script from Zoho.
 *
 * Configure the Zoho form to redirect to: /support/thank-you (on submit)
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

        {/* Zoho form embed placeholder – replace with your Zoho form iframe/script */}
        <div className="rounded-xl border border-rta-border bg-white p-8 shadow-sm">
          <div className="aspect-[4/3] min-h-[320px] rounded-lg border-2 border-dashed border-rta-border bg-rta-bg-light flex items-center justify-center">
            <p className="text-body-sm text-rta-text-secondary text-center px-4">
              Zoho form embed will go here.
              <br />
              <span className="text-rta-blue font-medium">
                Configure your form to redirect to: /support/thank-you
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
