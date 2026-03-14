'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { RoleCapabilities } from '@/lib/dashboard-roles';

type MeResponse = { capabilities?: RoleCapabilities } | null;

/**
 * Fetch dashboard capabilities once. Default deny until loaded and flag is true.
 */
export function useDashboardCapabilities(): {
  loading: boolean;
  capabilities: RoleCapabilities | null;
} {
  const [loading, setLoading] = useState(true);
  const [capabilities, setCapabilities] = useState<RoleCapabilities | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: MeResponse) => {
        setCapabilities(data?.capabilities ?? null);
      })
      .catch(() => setCapabilities(null))
      .finally(() => setLoading(false));
  }, []);

  return { loading, capabilities };
}

function AccessDenied({ message, backHref = '/dashboard' }: { message: string; backHref?: string }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
      <Card className="border-rta-border bg-white shadow-card max-w-md">
        <CardContent className="pt-6">
          <p className="text-body-sm font-medium text-rta-text">{message}</p>
          <p className="text-body-sm text-rta-text-secondary mt-1">This area is restricted to certain roles.</p>
          <Button asChild variant="outline" size="sm" className="mt-4 border-rta-border text-rta-text">
            <Link href={backHref}>Back</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingGuard() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
      <div className="flex items-center gap-2 text-rta-text-secondary">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-body-sm">Checking access…</span>
      </div>
    </div>
  );
}

/** Require canSeePayroll === true (default deny). */
export function RequirePayroll({ children }: { children: React.ReactNode }) {
  const { loading, capabilities } = useDashboardCapabilities();
  if (loading) return <LoadingGuard />;
  if (capabilities?.canSeePayroll !== true) {
    return <AccessDenied message="You don’t have access to payroll." />;
  }
  return <>{children}</>;
}

/** Require canSeeHrm === true (default deny). */
export function RequireHrm({ children }: { children: React.ReactNode }) {
  const { loading, capabilities } = useDashboardCapabilities();
  if (loading) return <LoadingGuard />;
  if (capabilities?.canSeeHrm !== true) {
    return <AccessDenied message="You don’t have access to HRM." />;
  }
  return <>{children}</>;
}

/** Require canSeeMasterFinancials === true (default deny). */
export function RequireMasterFinancials({ children, backHref }: { children: React.ReactNode; backHref?: string }) {
  const { loading, capabilities } = useDashboardCapabilities();
  if (loading) return <LoadingGuard />;
  if (capabilities?.canSeeMasterFinancials !== true) {
    return (
      <AccessDenied
        message="You don’t have access to master financial data (full account statements)."
        backHref={backHref ?? '/dashboard/finances'}
      />
    );
  }
  return <>{children}</>;
}
