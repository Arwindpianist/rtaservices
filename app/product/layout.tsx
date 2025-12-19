import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Range - RTA Services',
  description: 'RTA Services supports all major brands in the IT space, offering comprehensive solutions for enterprise hardware.',
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

