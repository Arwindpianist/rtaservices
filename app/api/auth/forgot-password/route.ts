import { NextResponse } from 'next/server';
import { requestPasswordResetByEmail } from '@/lib/users';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body?.email || '').trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  await requestPasswordResetByEmail(email);
  // Deliberately generic to avoid user enumeration.
  return NextResponse.json({ ok: true });
}
