import Link from 'next/link';
import { MessageCircle, Ticket, Code2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Support',
  description: 'Contact RTA Services support, check ticket status, or request open-source software (OSS) support.',
};

const links = [
  {
    href: '/support/contact',
    title: 'Contact support',
    description: 'Submit an enquiry. Our team will get back to you via Zoho CRM.',
    icon: MessageCircle,
    cta: 'Submit enquiry',
  },
  {
    href: '/support/status',
    title: 'Ticket status',
    description: 'Check the status of your existing support ticket.',
    icon: Ticket,
    cta: 'Check status',
  },
  {
    href: '/support/request',
    title: 'OSS support request',
    description: 'Search for open-source software support and submit a request.',
    icon: Code2,
    cta: 'Search OSS support',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-[60vh] bg-rta-bg-light py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-h1-md md:text-h1 font-bold text-rta-blue">Support</h1>
          <p className="mt-3 text-body-lg text-rta-text-secondary max-w-2xl mx-auto">
            Get help, submit an enquiry, or check your ticket status. Choose an option below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col p-6 rounded-xl bg-white border border-rta-border shadow-sm hover:border-rta-gold hover:shadow-md transition-all duration-200"
              >
                <div className="p-3 rounded-lg bg-rta-gold/10 w-fit group-hover:bg-rta-gold/20 transition-colors">
                  <Icon className="h-6 w-6 text-rta-gold" aria-hidden />
                </div>
                <h2 className="mt-4 text-h3 font-bold text-rta-blue">{item.title}</h2>
                <p className="mt-2 text-body-sm text-rta-text-secondary flex-1">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-rta-blue group-hover:gap-2 transition-all">
                  {item.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-center text-body-sm text-rta-text-secondary">
          You can also use the chat widget (bottom right) when available for quick questions.
        </p>
      </div>
    </div>
  );
}
