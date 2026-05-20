import { NextResponse } from 'next/server';
import { consumeInvite } from '@/lib/users';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = String(body?.token || '');
  const password = String(body?.password || '');
  const name = String(body?.name || '').trim();
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
  }
  const result = await consumeInvite({ token, password, name: name || undefined });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
