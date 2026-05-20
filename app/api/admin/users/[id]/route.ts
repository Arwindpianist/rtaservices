import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { deleteUser, logAuditEvent, updateUser } from '@/lib/users';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  await updateUser(id, {
    name: body?.name,
    role: body?.role,
    isActive: typeof body?.isActive === 'boolean' ? body.isActive : undefined,
    password: body?.password,
  });
  await logAuditEvent({
    eventType: 'admin.user.updated',
    actorUserId: current.id,
    targetUserId: id,
    metadata: { fields: Object.keys(body || {}) },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  if (id === current.id) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  }
  await deleteUser(id);
  await logAuditEvent({
    eventType: 'admin.user.deleted',
    actorUserId: current.id,
    targetUserId: id,
  });
  return NextResponse.json({ ok: true });
}
