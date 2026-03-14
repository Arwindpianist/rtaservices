import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | Contact us',
  description: 'Contact RTA Services support. Submit your enquiry via our form.',
  robots: 'noindex, nofollow', // temporary; remove when going live
};

export default function SupportContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
