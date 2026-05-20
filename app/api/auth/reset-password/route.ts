import { NextResponse } from 'next/server';
import { resetPasswordWithToken } from '@/lib/users';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = String(body?.token || '');
  const password = String(body?.password || '');
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
  }
  const result = await resetPasswordWithToken({ token, password });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
