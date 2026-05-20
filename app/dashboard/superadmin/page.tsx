import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShieldCheck, KeyRound, Activity, Layers, CreditCard } from 'lucide-react';
import { listAuditEvents, listInvites, listUsers } from '@/lib/users';
import { listAccessModules } from '@/lib/module-access';
import { getOverallHealthStatus, getSystemHealth } from '@/lib/system-health';

const tenantName = process.env.NEXT_PUBLIC_TENANT_NAME || 'RTA Services';

export default async function SuperadminConsolePage() {
  const [events, users, invites, modules, serviceHealth] = await Promise.all([
    listAuditEvents({ limit: 3 }),
    listUsers(),
    listInvites(),
    listAccessModules(),
    getSystemHealth(),
  ]);
  const activeUsers = users.filter((u) => u.isActive).length;
  const pendingInvites = invites.filter((i) => !i.usedAt && !i.revokedAt && new Date(i.expiresAt).getTime() > Date.now()).length;
  const enabledModules = modules.filter((m) => m.enabled).length;
  const overallHealth = getOverallHealthStatus(serviceHealth);
  const overallHealthLabel =
    overallHealth === 'up' ? 'All systems operational' : overallHealth === 'degraded' ? 'Partial degradation' : 'Service outage detected';
  return (
    <div className="rta-neu-theme sa-theme min-h-[calc(100vh-3.5rem)] sa-bg">
      <div className="sa-shell py-5 sm:py-6">
        <div className="sa-animate-up sa-enter mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <h1 className="sa-title text-2xl font-bold">Superadmin Dashboard</h1>
            <p className="mt-1 text-body-sm sa-muted">System operations only.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/superadmin/audit"
              className="inline-flex items-center gap-2 rounded-full sa-accent px-3 py-1 text-body-sm font-semibold sa-text transition hover:opacity-90"
            >
              <Activity className="h-4 w-4" />
              Audit Log
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full sa-secondary sa-bounce-soft px-3 py-1 text-body-sm font-medium sa-text">
              <ShieldCheck className="h-4 w-4" />
              Secure Mode
            </span>
          </div>
        </div>

        <div className="sa-animate-up sa-anim-delay-1 sa-enter mb-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="rounded-full sa-card px-3 py-1 sa-text">Tenant: {tenantName}</span>
          <span className="rounded-full sa-secondary px-3 py-1 sa-text">Primary: <span className="sa-key">User Lifecycle</span></span>
          <span className="rounded-full sa-accent px-3 py-1 sa-text">Policy: Invite-only Accounts</span>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="sa-card sa-enter-soft">
            <CardContent className="pt-5">
              <p className="text-body-sm sa-muted">Active Users</p>
              <p className="mt-1 text-xl font-semibold sa-title">{activeUsers}</p>
            </CardContent>
          </Card>
          <Card className="sa-card sa-enter-soft">
            <CardContent className="pt-5">
              <p className="text-body-sm sa-muted">Pending Invites</p>
              <p className="mt-1 text-xl font-semibold sa-title">{pendingInvites}</p>
            </CardContent>
          </Card>
          <Card className="sa-card sa-enter-soft">
            <CardContent className="pt-5">
              <p className="text-body-sm sa-muted">Enabled Modules</p>
              <p className="mt-1 text-xl font-semibold sa-title">{enabledModules}</p>
            </CardContent>
          </Card>
          <Card className="sa-card sa-enter-soft">
            <CardContent className="pt-5">
              <p className="text-body-sm sa-muted">Service Health</p>
              <p className="mt-1 text-body-sm font-semibold sa-key">{overallHealthLabel}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="sa-card sa-enter mb-4">
          <CardContent className="pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold sa-title">Service Status</span>
              {serviceHealth.map((svc) => {
                const badgeClass =
                  svc.status === 'up'
                    ? 'sa-status-up'
                    : svc.status === 'degraded'
                      ? 'sa-status-degraded'
                      : 'sa-status-down';
                const pulseClass = svc.status === 'up' ? '' : 'animate-pulse';
                return (
                  <span key={svc.key} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${badgeClass}`}>
                    <span className={`inline-block h-1.5 w-1.5 rounded-full bg-current ${pulseClass}`} />
                    {svc.label}: {svc.status.toUpperCase()}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card className="sa-card sa-animate-up sa-anim-delay-2 sa-enter transition-all duration-300 hover:-translate-y-0.5">
            <Link href="/dashboard/superadmin/users" className="block">
              <CardHeader className="pb-3">
                <CardTitle className="sa-title flex items-center gap-2 text-base font-semibold">
                  <Users className="h-4 w-4 sa-text" />
                  User Management
                </CardTitle>
                <CardDescription>Invites, role assignments, and activation controls</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="sa-link text-body-sm font-semibold">Open User Management -&gt;</span>
              </CardContent>
            </Link>
          </Card>

          <Card className="sa-card sa-animate-up sa-anim-delay-3 sa-enter transition-all duration-300 hover:-translate-y-0.5">
            <Link href="/dashboard/superadmin/module-access" className="block">
              <CardHeader className="pb-3">
                <CardTitle className="sa-title flex items-center gap-2 text-base font-semibold">
                  <Layers className="h-4 w-4 sa-text" />
                  Module Access
                </CardTitle>
                <CardDescription>Role matrix, overrides, and module toggles</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="sa-link text-body-sm font-semibold">Open Module Access -&gt;</span>
              </CardContent>
            </Link>
          </Card>

          <Card className="sa-card sa-animate-up sa-anim-delay-3 sa-enter transition-all duration-300 hover:-translate-y-0.5">
            <CardHeader className="pb-3">
              <CardTitle className="sa-title flex items-center gap-2 text-base font-semibold">
                <KeyRound className="h-4 w-4 sa-text" />
                Account Recovery
              </CardTitle>
              <CardDescription>Password reset and account unlock tooling</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-body-sm text-rta-text-secondary">
              Reset links are available from User Management.
            </CardContent>
          </Card>

          <Card className="sa-card sa-animate-up sa-anim-delay-3 sa-enter transition-all duration-300 hover:-translate-y-0.5">
            <Link href="/dashboard/quote-payments" className="block">
              <CardHeader className="pb-3">
                <CardTitle className="sa-title flex items-center gap-2 text-base font-semibold">
                  <CreditCard className="h-4 w-4 sa-text" />
                  Quote Payments
                </CardTitle>
                <CardDescription>Zoho quotes linked to Xero payments</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="sa-link text-body-sm font-semibold">Open Quote Payments -&gt;</span>
              </CardContent>
            </Link>
          </Card>

        </div>

        <div className="sa-animate-up sa-anim-delay-4 sa-enter mt-5">
          <Card className="sa-card">
            <CardHeader className="pb-2">
              <CardTitle className="sa-title flex items-center gap-2 text-base font-semibold">
                <Activity className="h-4 w-4 sa-text" />
                Recent Security Events
              </CardTitle>
              <CardDescription>Most recent events for quick verification</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-body-sm text-rta-text-secondary">No audit events found yet.</p>
              ) : (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div key={String(event.id)} className="sa-item px-3 py-2">
                      <p className="text-body-sm font-medium text-rta-text">{String(event.eventType || 'event')}</p>
                      <p className="text-xs text-rta-text-secondary">
                        {new Date(String(event.createdAt || '')).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="pt-1">
                    <Link href="/dashboard/superadmin/audit" className="sa-link text-xs font-semibold">
                      View full audit log -&gt;
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
