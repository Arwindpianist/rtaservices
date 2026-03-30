import { NextResponse } from 'next/server';
import { MOCK_PAYROLL, getPayrollTaxSummary } from '@/lib/mock-data/payroll';

export async function GET() {
  return NextResponse.json({
    source: 'mock',
    entries: MOCK_PAYROLL,
    summary: getPayrollTaxSummary(),
  });
}
