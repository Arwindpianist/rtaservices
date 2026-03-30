import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/xero-store';
import { getXeroTokens } from '@/lib/xero-store';
import { requireMasterFinancials } from '@/lib/dashboard-api-guard';
import {
  getInvoicesIn,
  getInvoicesOut,
  MOCK_CLAIMS,
  MOCK_PAYMENTS,
} from '@/lib/mock-data/finances';

async function fetchXeroInvoices(accessToken: string, tenantId: string): Promise<{ type: string; amount: number }[]> {
  const res = await fetch(
    'https://api.xero.com/api.xro/2.0/Invoices?pageSize=100&order=DueDate%20DESC',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Xero-tenant-id': tenantId,
      },
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const raw = data.Invoices || [];
  return raw.map((inv: { Type?: string; Total?: number }) => {
    const type = (inv.Type || 'ACCREC').toUpperCase();
    return {
      type: type === 'ACCPAY' ? 'in' : 'out',
      amount: inv.Total ?? 0,
    };
  });
}

export async function GET(request: NextRequest) {
  const denied = requireMasterFinancials(request);
  if (denied) return denied;

  const accessToken = await getValidAccessToken();
  const tokens = getXeroTokens();
  const tenantId = tokens?.tenant_id;

  if (accessToken && tenantId) {
    try {
      const invoices = await fetchXeroInvoices(accessToken, tenantId);
      if (invoices.length > 0) {
        const inList = invoices.filter((i) => i.type === 'in');
        const outList = invoices.filter((i) => i.type === 'out');
        const toPay = inList.reduce((s, i) => s + i.amount, 0);
        const toReceive = outList.reduce((s, i) => s + i.amount, 0);
        const claimsTotal = MOCK_CLAIMS.filter((c) => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0);
        const paymentsDue = MOCK_PAYMENTS.filter(
          (p) => p.status === 'due' || p.status === 'overdue'
        ).reduce((s, p) => s + p.amount, 0);
        return NextResponse.json({
          source: 'xero',
          toPay,
          toReceive,
          claimsTotal,
          paymentsDue,
        });
      }
    } catch {
      // fall through to mock
    }
  }

  const invoicesIn = getInvoicesIn();
  const invoicesOut = getInvoicesOut();
  const toPay = invoicesIn.reduce((s, i) => s + i.amount, 0);
  const toReceive = invoicesOut.reduce((s, i) => s + i.amount, 0);
  const claimsTotal = MOCK_CLAIMS.filter((c) => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0);
  const paymentsDue = MOCK_PAYMENTS.filter(
    (p) => p.status === 'due' || p.status === 'overdue'
  ).reduce((s, p) => s + p.amount, 0);

  return NextResponse.json({
    source: 'mock',
    toPay,
    toReceive,
    claimsTotal,
    paymentsDue,
  });
}
