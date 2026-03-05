import { NextRequest, NextResponse } from 'next/server';
import { getRoleForUser, getRoleCapabilities, isValidUserId } from '@/lib/dashboard-roles';

const COOKIE_NAME = 'rta_dashboard_session';
const GATE_VALUE = 'gate';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: MAX_AGE,
  path: '/',
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const secret = body?.secret ?? '';
  const userId = typeof body?.userId === 'string' ? body.userId.trim().toLowerCase() : '';
  const expectedSecret = process.env.DASHBOARD_SECRET;

  // Step 1: Access code gate (when DASHBOARD_SECRET is set), or just "continue" to show user list
  if (!userId) {
    if (expectedSecret) {
      if (secret !== expectedSecret) {
        return NextResponse.json(
          { error: secret ? 'Invalid access code' : 'Access code required' },
          { status: 401 }
        );
      }
    }
    const res = NextResponse.json({ ok: true, needUser: true });
    res.cookies.set(COOKIE_NAME, GATE_VALUE, cookieOptions);
    return res;
  }

  // Step 2: Login as user (userId required)
  if (!userId || !isValidUserId(userId)) {
    return NextResponse.json(
      { error: 'Invalid user. Use chris, arnaud, craig, or other.' },
      { status: 400 }
    );
  }

  const currentCookie = request.cookies.get(COOKIE_NAME)?.value;
  const gatePassed = currentCookie === GATE_VALUE;
  const alreadyLoggedIn = currentCookie && isValidUserId(currentCookie);
  const secretOk = !expectedSecret || secret === expectedSecret;

  if (expectedSecret && !gatePassed && !alreadyLoggedIn && !secretOk) {
    return NextResponse.json(
      { error: 'Access code required or session expired' },
      { status: 401 }
    );
  }

  const role = getRoleForUser(userId);
  const capabilities = getRoleCapabilities(role);

  const res = NextResponse.json({
    ok: true,
    userId,
    role,
    capabilities,
  });
  res.cookies.set(COOKIE_NAME, userId, cookieOptions);
  return res;
}

export async function GET(request: NextRequest) {
  const value = request.cookies.get(COOKIE_NAME)?.value ?? '';
  const expectedSecret = process.env.DASHBOARD_SECRET;

  if (value === GATE_VALUE) {
    return NextResponse.json({
      authenticated: true,
      needUser: true,
    });
  }

  if (value && isValidUserId(value)) {
    const role = getRoleForUser(value);
    const capabilities = getRoleCapabilities(role);
    return NextResponse.json({
      authenticated: true,
      userId: value,
      role,
      capabilities,
    });
  }

  // Legacy: cookie was "1" (old secret-only auth)
  if (value === '1') {
    return NextResponse.json({
      authenticated: true,
      needUser: true,
    });
  }

  return NextResponse.json({ authenticated: false });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return res;
}
