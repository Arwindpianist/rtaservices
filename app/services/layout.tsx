import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - RTA Services',
  description: 'Comprehensive IT services including maintenance, asset management, and professional services for enterprise systems.',
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

