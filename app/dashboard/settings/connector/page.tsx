'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

type UserSettingsPayload = {
  user: { id: string; email: string; name: string; role: string };
  settings: {
    displayName: string | null;
    defaultPeriod: 'this_week' | 'this_month' | 'this_quarter' | 'ytd';
    tableDensity: 'comfortable' | 'compact';
  };
};

const PERIODS = [
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'ytd', label: 'Year to Date' },
] as const;

export default function SettingsPage() {
  const [data, setData] = useState<UserSettingsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [defaultPeriod, setDefaultPeriod] = useState<UserSettingsPayload['settings']['defaultPeriod']>('ytd');
  const [tableDensity, setTableDensity] = useState<UserSettingsPayload['settings']['tableDensity']>('comfortable');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    const res = await fetch('/api/dashboard/settings');
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(payload.error || 'Failed to load settings');
      setLoading(false);
      return;
    }
    const parsed = payload as UserSettingsPayload;
    setData(parsed);
    setNameDraft(parsed.settings.displayName || parsed.user.name || '');
    setDefaultPeriod(parsed.settings.defaultPeriod);
    setTableDensity(parsed.settings.tableDensity);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/dashboard/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: nameDraft,
        defaultPeriod,
        tableDensity,
      }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(payload.error || 'Failed to save settings');
      setSaving(false);
      return;
    }
    setMessage('Settings saved');
    await load();
    setSaving(false);
  };

  const requestSessionReset = async () => {
    setError('');
    setMessage('');
    const res = await fetch('/api/dashboard/settings/session-reset', { method: 'POST' });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(payload.error || 'Failed to send reset link');
      return;
    }
    setMessage('A password reset link has been sent to your email.');
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="text-rta-text-secondary">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>
        <h1 className="text-h3 font-bold text-rta-blue">Settings</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Manage your profile/session and dashboard preferences.
        </p>

        {loading ? (
          <div className="flex items-center gap-2 py-12 justify-center text-rta-text-secondary">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-body-sm">Loading…</span>
          </div>
        ) : data ? (
          <Card className="border-rta-border bg-white shadow-card mt-6">
            <CardContent className="pt-6">
              {error ? <p className="mb-3 text-sm text-rta-red">{error}</p> : null}
              {message ? <p className="mb-3 text-sm text-green-700">{message}</p> : null}
              <h2 className="text-body font-semibold text-rta-text">Profile & Session</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Display Name</label>
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-rta-border px-3 text-sm"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Account</p>
                  <p className="mt-1 text-body-sm font-medium text-rta-text">{data.user.email}</p>
                  <p className="text-xs text-rta-text-secondary mt-0.5">Role: {data.user.role}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" onClick={requestSessionReset}>Send Password Reset Link</Button>
                <Button type="button" variant="outline" onClick={save} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>

              <h2 className="mt-8 text-body font-semibold text-rta-text">Dashboard Preferences</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Default Period</label>
                  <select
                    value={defaultPeriod}
                    onChange={(e) => setDefaultPeriod(e.target.value as UserSettingsPayload['settings']['defaultPeriod'])}
                    className="mt-1 h-10 w-full rounded-md border border-rta-border px-3 text-sm"
                  >
                    {PERIODS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Table Density</label>
                  <select
                    value={tableDensity}
                    onChange={(e) => setTableDensity(e.target.value as UserSettingsPayload['settings']['tableDensity'])}
                    className="mt-1 h-10 w-full rounded-md border border-rta-border px-3 text-sm"
                  >
                    <option value="comfortable">Comfortable</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <Button type="button" variant="outline" onClick={save} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="mt-6 text-body-sm text-rta-text-secondary">Failed to load settings.</p>
        )}
      </div>
    </div>
  );
}
