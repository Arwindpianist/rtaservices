'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/dashboard',
    });
    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rta-bg-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-rta-border bg-white">
        <CardHeader>
          <CardTitle>Dashboard login</CardTitle>
          <CardDescription>Sign in with your staff credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-rta-red">{error}</p>}
            <Button type="submit" className="w-full bg-rta-gold-cta hover:bg-rta-gold-cta-hover text-white" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="text-sm text-rta-text-secondary mt-4">
            Need access? Ask admin for an invite link.
          </p>
          <p className="text-sm text-rta-text-secondary mt-1">
            Forgot password? <Link href="/forgot-password" className="text-rta-blue hover:underline">Reset it</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
