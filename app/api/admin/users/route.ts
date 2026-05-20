import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { createUserInvite, listInvites, listUsers, logAuditEvent } from '@/lib/users';

export async function GET() {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const users = await listUsers();
  await logAuditEvent({
    eventType: 'admin.users.viewed',
    actorUserId: current.id,
  });
  return NextResponse.json({
    users: users.map((u) => ({
      ...u,
      email: u.role === 'superadmin' && u.id !== current.id ? '' : u.email,
      name: u.role === 'superadmin' && u.id !== current.id ? 'Hidden' : u.name,
    })),
    invites: await listInvites(),
  });
}

export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const email = String(body?.email || '').trim().toLowerCase();
  const name = String(body?.name || '').trim();
  const emails = Array.isArray(body?.emails) ? body.emails : null;
  const role = body?.role;
  const expiresHours = Number(body?.expiresHours || 0) || undefined;
  if (emails) {
    const result: Array<{ email: string; inviteLink?: string; error?: string }> = [];
    for (const raw of emails) {
      const e = String(raw || '').trim().toLowerCase();
      if (!e) continue;
      try {
        const created = await createUserInvite({
          email: e,
          role,
          invitedByUserId: current.id,
          expiresHours,
        });
        result.push({ email: e, inviteLink: created.inviteLink });
      } catch {
        result.push({ email: e, error: 'Invite failed' });
      }
    }
    return NextResponse.json({ ok: true, invites: result });
  }
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const created = await createUserInvite({
    email,
    name: name || undefined,
    role,
    invitedByUserId: current.id,
    expiresHours,
  });
  return NextResponse.json({ ok: true, invite: created.invite, inviteLink: created.inviteLink });
}
