'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SuperadminTableSkeleton } from '@/components/dashboard/SuperadminSkeleton';

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isActive: boolean;
};

type InviteRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  inviteToken: string;
  expiresAt: string;
  usedAt: string | null;
  revokedAt?: string | null;
  createdAt: string;
};

const roles = ['staff', 'chris', 'craig', 'arnaud', 'superadmin'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [role, setRole] = useState('staff');
  const [expiresHours, setExpiresHours] = useState(72);
  const [draftRoles, setDraftRoles] = useState<Record<string, string>>({});
  const [savingRoleFor, setSavingRoleFor] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Failed to load users');
      setLoading(false);
      return;
    }
    setUsers(data.users ?? []);
    setInvites(data.invites ?? []);
    setDraftRoles(
      Object.fromEntries(
        (data.users ?? []).map((u: UserRow) => [u.id, u.role]),
      ),
    );
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard');
    setTimeout(() => setSuccess(''), 1500);
  };

  const createInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, expiresHours }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Failed to create user');
      return;
    }
    if (data.inviteLink) {
      await copy(data.inviteLink);
    }
    setName('');
    setEmail('');
    setRole('staff');
    await load();
  };

  const createBulkInvites = async () => {
    setError('');
    const emails = bulkEmails
      .split(/[\n,;]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (emails.length === 0) {
      setError('Add at least one email');
      return;
    }
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails, role, expiresHours }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Bulk invite failed');
      return;
    }
    const links = (data.invites ?? [])
      .filter((i: { inviteLink?: string }) => i.inviteLink)
      .map((i: { email: string; inviteLink: string }) => `${i.email},${i.inviteLink}`)
      .join('\n');
    if (links) {
      await copy(links);
    }
    setBulkEmails('');
    await load();
  };

  const toggle = async (user: UserRow) => {
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    await load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    await load();
  };

  const copyResetLink = async (id: string) => {
    setError('');
    const res = await fetch(`/api/admin/users/${id}/reset-link`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.resetLink) {
      setError(data.error || 'Failed to generate reset link');
      return;
    }
    await copy(data.resetLink);
  };

  const updateInvite = async (id: string, action: 'revoke' | 'resend') => {
    setError('');
    const res = await fetch(`/api/admin/invites/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || 'Invite action failed');
      return;
    }
    if (action === 'resend' && data.inviteLink) {
      await copy(data.inviteLink);
    }
    await load();
  };

  const saveRole = async (user: UserRow) => {
    const nextRole = draftRoles[user.id] ?? user.role;
    if (nextRole === user.role) return;
    setError('');
    setSavingRoleFor(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: nextRole }),
    });
    const data = await res.json().catch(() => ({}));
    setSavingRoleFor(null);
    if (!res.ok) {
      setError(data.error || 'Failed to update role');
      return;
    }
    setSuccess('Role updated');
    setTimeout(() => setSuccess(''), 1500);
    await load();
  };

  return (
    <div className="rta-neu-theme sa-theme min-h-[calc(100vh-3.5rem)] sa-bg p-4 sm:p-6">
      <div className="sa-shell space-y-4">
        <div className="sa-animate-up flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="sa-title text-2xl font-bold">User Management</h1>
            <p className="mt-1 text-body-sm sa-muted">Invites, roles, and account recovery.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/superadmin/audit" className="rounded-full sa-secondary px-3 py-1 text-xs font-semibold sa-text">
              Audit Log
            </Link>
            <span className="rounded-full sa-accent px-3 py-1 text-xs font-medium sa-text">Tenant Admin</span>
          </div>
        </div>
        {error && <p className="text-sm text-rta-red">{error}</p>}
        {success && <p className="text-sm text-green-700">{success}</p>}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="sa-card sa-animate-up sa-anim-delay-1">
            <CardContent className="pt-6">
            <p className="text-sm font-medium text-rta-text mb-3">Single Invite</p>
            <form onSubmit={createInvite} className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <select value={role} onChange={(e) => setRole(e.target.value)} className="h-10 rounded-md border border-rta-border px-3 text-sm">
                {roles.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <Button type="submit" className="sa-cta">Send invite</Button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label className="text-xs text-rta-text-secondary" htmlFor="expiresHours">Invite Expiry (hours)</label>
              <Input
                id="expiresHours"
                type="number"
                min={1}
                max={720}
                value={expiresHours}
                onChange={(e) => setExpiresHours(Number(e.target.value || 72))}
                className="h-9 w-28"
              />
            </div>
            </CardContent>
          </Card>
          <Card className="sa-card sa-animate-up sa-anim-delay-2">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-rta-text mb-2">Bulk Invite</p>
              <textarea
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                placeholder="Paste emails separated by newline, comma, or semicolon"
                className="w-full min-h-[120px] rounded-md border border-rta-border p-3 text-sm"
              />
              <div className="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <Button type="button" className="sa-cta" onClick={createBulkInvites}>Send Bulk Invites</Button>
                <p className="text-xs text-rta-text-secondary">Invite links are copied as CSV: `email,link`</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="sa-card sa-animate-up sa-anim-delay-3">
          <CardContent className="pt-6">
            {loading ? (
              <SuperadminTableSkeleton rows={7} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-rta-border">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Role</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-rta-border">
                        <td className="py-2">{u.name || '-'}</td>
                        <td className="py-2">{u.email || '-'}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={draftRoles[u.id] ?? u.role}
                              onChange={(e) => setDraftRoles((prev) => ({ ...prev, [u.id]: e.target.value }))}
                              className="h-8 rounded-md border border-rta-border px-2 text-xs sm:text-sm"
                            >
                              {roles.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={(draftRoles[u.id] ?? u.role) === u.role || savingRoleFor === u.id}
                              className="sa-cta"
                              onClick={() => saveRole(u)}
                            >
                              {savingRoleFor === u.id ? 'Saving...' : 'Save'}
                            </Button>
                          </div>
                        </td>
                        <td className="py-2">{u.isActive ? 'Active' : 'Disabled'}</td>
                        <td className="py-2 text-right space-x-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => toggle(u)}>
                            {u.isActive ? 'Disable' : 'Enable'}
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => copyResetLink(u.id)}>
                            Reset Link
                          </Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => remove(u.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="sa-card sa-animate-up sa-anim-delay-4">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-rta-text mb-3">Invitations</p>
            {loading ? (
              <SuperadminTableSkeleton rows={6} />
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-rta-border">
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Expires</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((inv) => {
                    const active = !inv.usedAt && !inv.revokedAt && new Date(inv.expiresAt).getTime() > Date.now();
                    return (
                      <tr key={inv.id} className="border-b border-rta-border">
                        <td className="py-2">{inv.email}</td>
                        <td className="py-2">{inv.role}</td>
                        <td className="py-2">{new Date(inv.expiresAt).toLocaleString()}</td>
                        <td className="py-2">
                          {inv.usedAt ? 'Used' : inv.revokedAt ? 'Revoked' : active ? 'Pending' : 'Expired'}
                        </td>
                        <td className="py-2 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={!active}
                              onClick={() => copy(`${window.location.origin}/accept-invite?token=${inv.inviteToken}`)}
                            >
                              Copy Invite Link
                            </Button>
                            <Button type="button" variant="outline" size="sm" disabled={!!inv.usedAt} onClick={() => updateInvite(inv.id, 'resend')}>
                              Resend
                            </Button>
                            <Button type="button" variant="destructive" size="sm" disabled={!active} onClick={() => updateInvite(inv.id, 'revoke')}>
                              Revoke
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
