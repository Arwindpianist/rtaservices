import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About RTA Services | Enterprise IT Solutions Partner | Singapore',
  description: 'RTA Services provides enterprise IT solutions across Asia-Pacific. Partnered with ACA Pacific, we deliver cost-effective maintenance, asset management & professional services with 99.9% uptime guarantee.',
  openGraph: {
    title: 'About RTA Services | Enterprise IT Solutions Partner | Singapore',
    description: 'RTA Services provides enterprise IT solutions across Asia-Pacific. Partnered with ACA Pacific, we deliver cost-effective maintenance, asset management & professional services.',
    url: 'https://rta.arwindpianist.com/about',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

