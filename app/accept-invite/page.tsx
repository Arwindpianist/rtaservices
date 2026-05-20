'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function AcceptInviteFallback() {
  return (
    <div className="min-h-screen bg-rta-bg-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-rta-border bg-white">
        <CardHeader>
          <CardTitle>Accept invitation</CardTitle>
          <CardDescription>Loading invite…</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function AcceptInviteContent() {
  const params = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/auth/accept-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Failed to accept invite');
    } else {
      setMessage('Account setup complete. You can now sign in.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-rta-bg-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-rta-border bg-white">
        <CardHeader>
          <CardTitle>Accept invitation</CardTitle>
          <CardDescription>Set your name and password</CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <p className="text-sm text-rta-red">Invite token is missing.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="password" placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              {error && <p className="text-sm text-rta-red">{error}</p>}
              {message && <p className="text-sm text-green-700">{message}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Setting up...' : 'Complete setup'}
              </Button>
            </form>
          )}
          <p className="text-sm text-rta-text-secondary mt-4">
            Back to <Link href="/login" className="text-rta-blue hover:underline">login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<AcceptInviteFallback />}>
      <AcceptInviteContent />
    </Suspense>
  );
}
