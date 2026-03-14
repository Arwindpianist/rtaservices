'use client';

import Link from 'next/link';
import { Ticket, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Ticket status page – final goal: customer enters ticket reference (+ email)
 * and sees status from Zoho CRM Support Tickets (custom module).
 * Backend: Zoho CRM API or Zoho Creator portal; staff manage in Zoho CRM.
 */
export default function TicketStatusPage() {
  return (
    <div className="min-h-[60vh] bg-rta-bg-light py-12 lg:py-16">
      <div className="mx-auto max-w-md px-5 sm:px-6 text-center">
        <Ticket className="mx-auto h-14 w-14 text-rta-blue" aria-hidden />
        <h1 className="mt-6 text-h2 font-bold text-rta-blue">Ticket status</h1>
        <p className="mt-3 text-body text-rta-text-secondary">
          Check the status of your support ticket. This page will be connected to Zoho CRM so you can look up your ticket by reference number and email.
        </p>
        <div className="mt-8 p-4 rounded-xl bg-white border border-rta-border text-left">
          <p className="text-body-sm text-rta-text-secondary">
            <strong>Coming soon:</strong> Enter your ticket ID and email to see status (Open, In progress, Resolved). Data will come from Zoho CRM Support Tickets; staff handle everything in Zoho CRM.
          </p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="border-rta-border">
            <Link href="/support/contact">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Contact support
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
