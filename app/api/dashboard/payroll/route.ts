import { NextResponse } from 'next/server';
import { MOCK_PAYROLL, getPayrollTaxSummary } from '@/lib/mock-data/payroll';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function GET() {
  const denied = await requireModuleAccessAsync('dashboard.payroll', 'view');
  if (denied) return denied;
  return NextResponse.json({
    source: 'mock',
    entries: MOCK_PAYROLL,
    summary: getPayrollTaxSummary(),
  });
}
