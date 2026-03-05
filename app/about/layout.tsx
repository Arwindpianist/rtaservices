import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About RTA Services | Your Strategic IT Maintenance Partner in Asia',
  description: 'RTA Services: Enterprise SLA grade maintenance services and support partner. Partnered with ACA Pacific. We empower organizations to maintain, migrate and scale, cost effectively. Regional presence: Indonesia, Malaysia, Singapore, Thailand.',
  openGraph: {
    title: 'About RTA Services | Your Strategic IT Maintenance Partner in Asia',
    description: 'RTA Services: Enterprise SLA grade maintenance and support partner. Partnered with ACA Pacific. Regional presence across Asia.',
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

