import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search for OSS support | RTA Services',
  description:
    'Search supported open-source and enterprise software and request OSS support. Aligned with OpenLogic supported technologies.',
};

export default function SupportRequestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
