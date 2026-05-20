import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { createPasswordResetToken } from '@/lib/users';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await context.params;
  const reset = await createPasswordResetToken({ userId: id, createdByUserId: current.id });
  return NextResponse.json({ ok: true, resetLink: reset.resetLink });
}
