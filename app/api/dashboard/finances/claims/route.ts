import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CLAIMS } from '@/lib/mock-data/finances';
import { requireMasterFinancialsAsync } from '@/lib/dashboard-api-guard';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function GET(request: NextRequest) {
  void request;
  const moduleDenied = await requireModuleAccessAsync('dashboard.finances', 'view');
  if (moduleDenied) return moduleDenied;
  const denied = await requireMasterFinancialsAsync();
  if (denied) return denied;

  return NextResponse.json({
    source: 'mock',
    claims: MOCK_CLAIMS,
  });
}
