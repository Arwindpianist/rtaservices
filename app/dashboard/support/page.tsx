'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardSupportPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setSubmitting(true);
    const res = await fetch('/api/dashboard/private-support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Failed to submit request');
      setSubmitting(false);
      return;
    }
    setStatus('Request sent privately. You will receive updates from your dashboard team.');
    setSubject('');
    setMessage('');
    setSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <Button asChild variant="ghost" size="sm" className="mb-6 text-rta-text-secondary">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <h1 className="text-h3 font-bold text-rta-blue">Private Help Request</h1>
        <p className="mt-1 text-body-sm text-rta-text-secondary">
          Send a private request for account or system support.
        </p>

        <Card className="mt-6 border-rta-border bg-white shadow-card">
          <CardContent className="pt-6">
            {error ? <p className="mb-3 text-sm text-rta-red">{error}</p> : null}
            {status ? <p className="mb-3 text-sm text-green-700">{status}</p> : null}
            <form className="space-y-3" onSubmit={submit}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-rta-text-secondary">Subject</label>
                <input
                  className="mt-1 h-10 w-full rounded-md border border-rta-border px-3 text-sm"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-rta-text-secondary">Message</label>
                <textarea
                  className="mt-1 min-h-[140px] w-full rounded-md border border-rta-border p-3 text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Sending...</span> : 'Send Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

