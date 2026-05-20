import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { resendInvite, revokeInvite } from '@/lib/users';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const action = String(body?.action || '').toLowerCase();
  if (action === 'revoke') {
    await revokeInvite(id, current.id);
    return NextResponse.json({ ok: true });
  }
  if (action === 'resend') {
    const result = await resendInvite(id, current.id);
    return NextResponse.json({ ok: true, inviteLink: result.inviteLink });
  }
  return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
}
