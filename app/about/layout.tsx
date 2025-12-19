import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - RTA Services',
  description: 'Learn about RTA Services and our partnership with ACA Pacific to deliver reliable, specialized IT solutions.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

