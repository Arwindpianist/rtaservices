'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { CircleHelp, Settings, UserRound, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function DashboardHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const firstName = name.trim().split(/\s+/)[0] || 'User';
  const initial = firstName.slice(0, 1).toUpperCase();

  const labelBySegment: Record<string, string> = {
    dashboard: 'Dashboard',
    finances: 'Finances',
    customers: 'Customers',
    'quote-to-cash': 'Quote-to-cash',
    'quote-payments': 'Quote Payments',
    receivables: 'Receivables',
    payroll: 'Payroll',
    hrm: 'HRM',
    'sales-forecast': 'Sales Forecast',
    'sales-leaderboard': 'Sales Leaderboard',
    settings: 'Settings',
    connector: 'Connector',
    support: 'Help Requests',
    reconciliation: 'Reconciliation',
    presentation: 'Presentation',
  };
  const segments = pathname.split('/').filter(Boolean);
  const dashboardSegments = segments[0] === 'dashboard' ? segments.slice(1) : [];

  const breadcrumbs = [
    { href: '/dashboard', label: 'Dashboard' },
    ...dashboardSegments.map((seg, idx) => ({
      href: `/dashboard/${dashboardSegments.slice(0, idx + 1).join('/')}`,
      label: labelBySegment[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()),
    })),
  ];

  return (
    <header className="bg-rta-gold text-rta-black border-b border-rta-red/35">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-14 py-2 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <span key={crumb.href} className="inline-flex items-center gap-1.5 min-w-0">
                  {idx > 0 ? <ChevronRight className="h-3.5 w-3.5 text-rta-black/55 shrink-0" /> : null}
                  {isLast ? (
                    <span className="font-semibold text-rta-black truncate">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-rta-black/80 hover:text-rta-black truncate">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
          <p className="text-xs text-rta-black/70 truncate">Hi, {firstName}</p>
        </div>
        <div className="flex items-center gap-2">
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-rta-black/25 bg-rta-black/10 pl-1 pr-2.5 py-1 text-sm hover:bg-rta-black/15">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rta-black/15 text-rta-black font-semibold">
                {initial}
              </span>
              <span className="hidden sm:inline">Profile</span>
              <UserRound className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-rta-border bg-rta-bg-light p-1 shadow-card z-50">
              <div className="px-2 py-1.5 text-xs text-rta-text-secondary">Signed in as {name}</div>
              <Link href="/dashboard/settings/connector" className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-rta-text hover:bg-white">
                <Settings className="h-4 w-4" />
                Manage Session & Settings
              </Link>
              <Link href="/dashboard/support" className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-rta-text hover:bg-white">
                <CircleHelp className="h-4 w-4" />
                Request Help
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-rta-red hover:bg-white"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Log out
              </button>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
