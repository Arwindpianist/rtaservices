import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - RTA Services',
  description: 'Get in touch with RTA Services for inquiries, support, or to request a quote for our IT services.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

