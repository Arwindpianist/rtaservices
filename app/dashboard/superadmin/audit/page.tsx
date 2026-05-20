'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SuperadminTableSkeleton } from '@/components/dashboard/SuperadminSkeleton';

type AuditEvent = {
  id: string;
  eventType: string;
  actorUserId: string | null;
  actorName?: string | null;
  targetUserId: string | null;
  targetName?: string | null;
  createdAt: string;
  metadata: Record<string, unknown> | null;
};

function formatDDMMYYYY(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}${mm}${yyyy}`;
}

function getEventUser(event: AuditEvent): string {
  if (event.actorName) return event.actorName;
  if (event.actorUserId) return event.actorUserId;
  if (event.targetName) return event.targetName;
  if (event.targetUserId) return event.targetUserId;
  const email = typeof event.metadata?.email === 'string' ? event.metadata.email : null;
  return email || 'System';
}

export default function SuperadminAuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const apiQuery = useMemo(() => {
    const params = new URLSearchParams();
    params.set('limit', '250');
    if (eventType) params.set('eventType', eventType);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    return params.toString();
  }, [eventType, from, to]);

  const filteredEvents = useMemo(() => {
    const term = userQuery.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) => getEventUser(event).toLowerCase().includes(term));
  }, [events, userQuery]);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/audit?${apiQuery}`);
    const data = await res.json().catch(() => ({}));
    setEvents(data.events ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [apiQuery]);

  return (
    <div className="rta-neu-theme sa-theme min-h-[calc(100vh-3.5rem)] sa-bg p-4 sm:p-6">
      <div className="sa-shell space-y-4">
        <div className="sa-animate-up sa-enter flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="sa-title text-2xl font-bold">Audit Log</h1>
            <p className="mt-1 text-body-sm sa-muted">Filter, review, and export admin events.</p>
          </div>
          <span className="rounded-full sa-secondary px-3 py-1 text-xs font-medium sa-text">Searchable + Exportable</span>
        </div>

        <div className="sa-card sa-animate-up sa-anim-delay-1 sa-enter rounded-lg p-4">
          <div className="grid gap-3 lg:grid-cols-5">
            <Input placeholder="Activity Type" value={eventType} onChange={(e) => setEventType(e.target.value)} />
            <Input placeholder="User" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button type="button" onClick={load}>Apply</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(`/api/admin/audit?${apiQuery}&format=csv`, '_blank')}
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        <div className="sa-card sa-animate-up sa-anim-delay-2 sa-enter rounded-lg p-4">
          {loading ? (
            <SuperadminTableSkeleton rows={8} />
          ) : filteredEvents.length === 0 ? (
            <p className="text-sm text-rta-text-secondary">No events loaded. Apply filters to query audit events.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-rta-border">
                    <th className="py-2 text-left">User</th>
                    <th className="py-2 text-left">Activity Type</th>
                    <th className="py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((e) => (
                    <tr key={e.id} className="border-b border-rta-border">
                      <td className="py-2 text-rta-text">{getEventUser(e)}</td>
                      <td className="py-2 text-rta-text-secondary">{e.eventType}</td>
                      <td className="py-2 font-medium text-rta-text">{formatDDMMYYYY(e.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
