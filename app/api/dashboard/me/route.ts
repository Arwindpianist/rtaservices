import { NextRequest, NextResponse } from 'next/server';
import { getRoleForUser, getRoleCapabilities, isValidUserId } from '@/lib/dashboard-roles';

const COOKIE_NAME = 'rta_dashboard_session';
const GATE_VALUE = 'gate';

export async function GET(request: NextRequest) {
  const value = request.cookies.get(COOKIE_NAME)?.value ?? '';

  if (value === GATE_VALUE || value === '1') {
    return NextResponse.json({ error: 'User not selected' }, { status: 401 });
  }

  if (!value || !isValidUserId(value)) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const role = getRoleForUser(value);
  const capabilities = getRoleCapabilities(role);

  return NextResponse.json({
    userId: value,
    role,
    capabilities,
  });
}
