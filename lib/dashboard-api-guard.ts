import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getRoleCapabilities } from '@/lib/rbac';

/**
 * Server-side guard: only roles with canSeeMasterFinancials can access master-financial API data.
 * This protects against reading finance endpoints directly via URL/API calls.
 */
export function requireMasterFinancials(request: NextRequest): NextResponse | null {
  void request;
  return NextResponse.json({ error: 'Use async guard' }, { status: 500 });
}

export async function requireMasterFinancialsAsync(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const capabilities = getRoleCapabilities(session.user.role);
  if (!capabilities.canSeeMasterFinancials) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

