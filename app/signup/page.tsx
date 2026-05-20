'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const [inviteLink, setInviteLink] = useState('');

  return (
    <div className="min-h-screen bg-rta-bg-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-rta-border bg-white">
        <CardHeader>
          <CardTitle>Invite-only signup</CardTitle>
          <CardDescription>Accounts are provisioned by superadmin</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-rta-text-secondary mb-4">
            Use your invitation link from admin to activate your account.
          </p>
          <Input placeholder="Paste invite link here" value={inviteLink} onChange={(e) => setInviteLink(e.target.value)} />
          <Button type="button" className="w-full mt-3" disabled={!inviteLink.trim()} onClick={() => window.location.assign(inviteLink.trim())}>
            Open invite link
          </Button>
          <p className="text-sm text-rta-text-secondary mt-4">
            Already have an account? <Link href="/login" className="text-rta-blue hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
