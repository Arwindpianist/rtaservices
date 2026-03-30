import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/xero-store';
import { getXeroTokens } from '@/lib/xero-store';
import { MOCK_INVOICES } from '@/lib/mock-data/finances';
import type { InvoiceItem } from '@/lib/dashboard-finances-types';
import { requireMasterFinancials } from '@/lib/dashboard-api-guard';

async function fetchXeroInvoices(
  accessToken: string,
  tenantId: string
): Promise<InvoiceItem[]> {
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
  const now = new Date();
  return raw.map((inv: {
    InvoiceID?: string;
    InvoiceNumber?: string;
    Type?: string;
    Contact?: { Name?: string };
    Total?: number;
    Status?: string;
    DueDate?: string;
    Date?: string;
    CurrencyCode?: string;
  }) => {
    const type = (inv.Type || 'ACCREC').toUpperCase();
    const dueDate = inv.DueDate || inv.Date || '';
    const due = dueDate ? new Date(dueDate) : null;
    let ageBucket: string = '0-30';
    if (due) {
      const days = Math.floor((now.getTime() - due.getTime()) / (24 * 60 * 60 * 1000));
      if (days > 90) ageBucket = '>90';
      else if (days > 60) ageBucket = '60-90';
      else if (days > 30) ageBucket = '30-60';
    }
    return {
      id: inv.InvoiceID || inv.InvoiceNumber || '',
      type: type === 'ACCPAY' ? ('in' as const) : ('out' as const),
      entity: inv.Contact?.Name || '-',
      amount: inv.Total ?? 0,
      currency: inv.CurrencyCode || 'USD',
      dueDate,
      status: (inv.Status || '').toLowerCase().replace(/\s/g, '_'),
      ageBucket,
    };
  });
}

function mockToItems(): InvoiceItem[] {
  return MOCK_INVOICES.map((m) => ({
    id: m.id,
    type: m.type,
    entity: m.entity,
    entityType: m.entityType,
    amount: m.amount,
    currency: m.currency,
    dueDate: m.dueDate,
    status: m.status,
    ageBucket: m.ageBucket,
  }));
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
        return NextResponse.json({ source: 'xero', invoices });
      }
    } catch {
      // fall through to mock
    }
  }

  return NextResponse.json({ source: 'mock', invoices: mockToItems() });
}
