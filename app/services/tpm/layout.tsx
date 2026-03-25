import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Third-Party Maintenance (TPM) | Extend Hardware Lifespan',
  description: 'Cost-effective third-party hardware maintenance. 24/7 helpdesk, multi-vendor expertise, extended warranty, hardware sparing. Dell, IBM, HPE, Oracle, NetApp, Cisco.',
  keywords: 'third-party maintenance, TPM, server maintenance, storage maintenance, hardware sparing, multi-vendor support, Dell, HPE, IBM',
};

export default function TPMLayout({ children }: { children: React.ReactNode }) {
  return children;
}
