import { NextRequest, NextResponse } from 'next/server';
import {
  MOCK_STATEMENT_CUSTOMER,
  MOCK_STATEMENT_SUPPLIER,
  MOCK_STATEMENT_STAFF,
} from '@/lib/mock-data/finances';
import { requireMasterFinancials } from '@/lib/dashboard-api-guard';

export async function GET(request: NextRequest) {
  const denied = requireMasterFinancials(request);
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
