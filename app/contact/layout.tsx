import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact RTA Services | Your Strategic IT Maintenance Partner in Asia',
  description: 'Contact RTA Services for enterprise IT support. Singapore office: +65 9644 4147. Regional presence: Indonesia, Malaysia, Singapore, Thailand. Request free consultation.',
  openGraph: {
    title: 'Contact RTA Services | Your Strategic IT Maintenance Partner in Asia',
    description: 'Contact RTA Services. Singapore office: +65 9644 4147. Regional presence across Asia.',
    url: 'https://rta.arwindpianist.com/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

