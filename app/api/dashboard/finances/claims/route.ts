import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CLAIMS } from '@/lib/mock-data/finances';
import { requireMasterFinancials } from '@/lib/dashboard-api-guard';

export async function GET(request: NextRequest) {
  const denied = requireMasterFinancials(request);
  if (denied) return denied;

  return NextResponse.json({
    source: 'mock',
    claims: MOCK_CLAIMS,
  });
}
