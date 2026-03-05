import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RTA TPM, RTA OSS, RTA PS | Enterprise SLA Grade Maintenance & Support',
  description: 'RTA TPM (Extend Hardware Lifespan), RTA OSS (Open-Source Software under SLA), RTA PS (Strategic Consulting & Make IT Happen). 24x7 support levels, guaranteed SLAs. Get a quote.',
  openGraph: {
    title: 'RTA TPM, RTA OSS, RTA PS | Enterprise SLA Grade Maintenance & Support',
    description: 'RTA TPM, RTA OSS, RTA PS. 24x7 support levels, guaranteed SLAs. Your strategic IT maintenance partner in Asia.',
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

