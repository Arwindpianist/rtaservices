import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open-Source Software (OSS) Support | Enterprise OSS Solutions',
  description: 'Enterprise-grade open-source software support with guaranteed SLAs. 400+ technologies, 24/7 global support, LTS for CentOS, AngularJS, Kafka. Elite Sponsor of open source initiative.',
  keywords: 'open source software support, OSS support, CentOS support, AngularJS support, Kubernetes support, enterprise open source, LTS support',
};

export default function OSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
