'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setMessage('If that email exists, a reset process has been created.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-rta-bg-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-rta-border bg-white">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>Request a password reset</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {message && <p className="text-sm text-green-700">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Request reset'}
            </Button>
          </form>
          <p className="text-sm text-rta-text-secondary mt-4">
            Back to <Link href="/login" className="text-rta-blue hover:underline">login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
