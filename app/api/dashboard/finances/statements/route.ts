import { NextRequest, NextResponse } from 'next/server';
import {
  MOCK_STATEMENT_CUSTOMER,
  MOCK_STATEMENT_SUPPLIER,
  MOCK_STATEMENT_STAFF,
} from '@/lib/mock-data/finances';
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
    statements: {
      customer: MOCK_STATEMENT_CUSTOMER,
      supplier: MOCK_STATEMENT_SUPPLIER,
      staff: MOCK_STATEMENT_STAFF,
    },
  });
}
