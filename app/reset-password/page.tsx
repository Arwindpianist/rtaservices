'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function ResetPasswordFallback() {
  return (
    <div className="min-h-screen bg-rta-bg-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-rta-border bg-white">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Loading…</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Reset failed');
    } else {
      setMessage('Password updated. You can sign in now.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-rta-bg-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-rta-border bg-white">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <p className="text-sm text-rta-red">Reset token is missing.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input type="password" placeholder="New password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              {error && <p className="text-sm text-rta-red">{error}</p>}
              {message && <p className="text-sm text-green-700">{message}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update password'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
