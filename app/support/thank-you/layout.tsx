import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank you | Support',
  description: 'Your support request has been submitted.',
  robots: 'noindex, nofollow',
};

export default function SupportThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
