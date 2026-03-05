import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RTA TPM Product Range | Server, Storage & Network',
  description: 'RTA Services supports all major brands: Dell EMC, IBM, HPE, Cisco, NetApp, and more. Server, storage & network—enterprise SLA grade maintenance and support.',
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

