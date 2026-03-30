import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getRoleForUser, getRoleCapabilities, isValidUserId } from '@/lib/dashboard-roles';

const COOKIE_NAME = 'rta_dashboard_session';
const GATE_VALUE = 'gate';

/**
 * Server-side guard: only roles with canSeeMasterFinancials can access master-financial API data.
 * This protects against reading finance endpoints directly via URL/API calls.
 */
export function requireMasterFinancials(request: NextRequest): NextResponse | null {
  const value = request.cookies.get(COOKIE_NAME)?.value ?? '';

  if (value === GATE_VALUE || value === '1') {
    return NextResponse.json({ error: 'User not selected' }, { status: 401 });
  }

  if (!value || !isValidUserId(value)) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const role = getRoleForUser(value);
  const capabilities = getRoleCapabilities(role);

  if (capabilities.canSeeMasterFinancials !== true) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}

