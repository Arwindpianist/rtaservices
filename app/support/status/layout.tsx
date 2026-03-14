import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ticket status | Support',
  description: 'Check the status of your RTA support ticket.',
  robots: 'noindex, nofollow',
};

export default function TicketStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
