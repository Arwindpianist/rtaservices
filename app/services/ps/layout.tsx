import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Services (PS) | Strategic Consulting & Make IT Happen',
  description: 'RTA Professional Services – End-to-end IT excellence. L1–L3 engineering, IMAC, OS deployment, project management, migrations, ITAD. Comprehensive infrastructure solutions.',
  keywords: 'IT professional services, IMAC services, ITAD, OS deployment, project management, infrastructure consulting',
};

export default function PSLayout({ children }: { children: React.ReactNode }) {
  return children;
}
