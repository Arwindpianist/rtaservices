'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type SupportRequest = {
  id: string;
  requesterEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
};

const STATUSES: Array<SupportRequest['status']> = ['open', 'in_progress', 'resolved', 'closed'];

export default function SuperadminSupportQueuePage() {
  const [items, setItems] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/private-support${statusFilter ? `?status=${statusFilter}` : ''}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Failed to load requests');
      setLoading(false);
      return;
    }
    setError('');
    setItems(data.requests ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: SupportRequest['status']) => {
    const res = await fetch('/api/admin/private-support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) return;
    await load();
  };

  return (
    <div className="rta-neu-theme sa-theme min-h-[calc(100vh-3.5rem)] sa-bg p-4 sm:p-6">
      <div className="sa-shell space-y-4">
        <div className="sa-enter">
          <h1 className="sa-title text-2xl font-bold">Private Support Queue</h1>
          <p className="mt-1 text-body-sm sa-muted">Internal private requests submitted by dashboard users.</p>
        </div>
        <Card className="sa-card sa-enter">
          <CardHeader className="pb-2">
            <CardTitle className="sa-title text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 min-w-[220px] rounded-md border border-rta-border px-3 text-sm"
            >
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </CardContent>
        </Card>

        <Card className="sa-card sa-enter">
          <CardContent className="pt-5">
            {error ? <p className="text-sm text-rta-red">{error}</p> : null}
            {loading ? (
              <p className="text-sm sa-muted">Loading requests...</p>
            ) : items.length === 0 ? (
              <p className="text-sm sa-muted">No private requests found.</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="sa-item p-3">
                    <p className="text-sm font-semibold sa-text">{item.subject}</p>
                    <p className="text-xs sa-muted">{item.requesterEmail} · {new Date(item.createdAt).toLocaleString()}</p>
                    <p className="mt-2 text-sm sa-text whitespace-pre-wrap">{item.message}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {STATUSES.map((status) => (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={item.status === status ? 'default' : 'outline'}
                          className={item.status === status ? 'sa-cta' : ''}
                          onClick={() => updateStatus(item.id, status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

