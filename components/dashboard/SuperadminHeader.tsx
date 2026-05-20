'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function SuperadminHeader({ email }: { email: string }) {
  const pathname = usePathname();
  const navClass = (href: string) =>
    `sa-nav-link ${pathname === href || pathname.startsWith(`${href}/`) ? 'sa-nav-link-active' : ''}`;

  return (
    <header className="rta-neu-theme sa-theme sa-hero">
      <div className="sa-shell flex flex-col gap-2 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6">
          <Link href="/dashboard/superadmin" className="text-sm font-semibold tracking-wide sa-title">
            Superadmin Console
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/dashboard/superadmin" className={navClass('/dashboard/superadmin')}>
              Overview
            </Link>
            <Link href="/dashboard/superadmin/users" className={navClass('/dashboard/superadmin/users')}>
              User Management
            </Link>
            <Link href="/dashboard/superadmin/module-access" className={navClass('/dashboard/superadmin/module-access')}>
              Module Access
            </Link>
            <Link href="/dashboard/superadmin/audit" className={navClass('/dashboard/superadmin/audit')}>
              Audit Log
            </Link>
            <Link href="/dashboard/superadmin/support" className={navClass('/dashboard/superadmin/support')}>
              Support Queue
            </Link>
            <Link href="/dashboard/quote-payments" className={navClass('/dashboard/quote-payments')}>
              Quote Payments
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <span className="min-w-0 max-w-[52vw] truncate text-xs sa-muted lg:max-w-[240px]" title={email}>
            {email}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="sa-nav-chip"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
