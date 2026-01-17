import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact RTA Services | Get IT Support Quote | Singapore Office',
  description: 'Contact RTA Services for enterprise IT support inquiries. Singapore office: +65 9644 4147. Sales, support & general inquiries. Request free consultation.',
  openGraph: {
    title: 'Contact RTA Services | Get IT Support Quote | Singapore Office',
    description: 'Contact RTA Services for enterprise IT support inquiries. Singapore office: +65 9644 4147. Sales, support & general inquiries.',
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

