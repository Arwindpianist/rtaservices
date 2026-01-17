import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise IT Services | Maintenance, Asset Management & Professional Services',
  description: 'Comprehensive IT services: hardware maintenance (TPM), asset lifecycle management, IMAC services, OS deployment & L1-L3 support. Multi-vendor expertise. Custom SLAs. Get quote.',
  openGraph: {
    title: 'Enterprise IT Services | Maintenance, Asset Management & Professional Services',
    description: 'Comprehensive IT services: hardware maintenance (TPM), asset lifecycle management, IMAC services, OS deployment & L1-L3 support. Multi-vendor expertise.',
    url: 'https://rta.arwindpianist.com/services',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

