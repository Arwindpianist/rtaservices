import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/xero-store';
import { getXeroTokens } from '@/lib/xero-store';

export async function GET(request: NextRequest) {
  const accessToken = await getValidAccessToken();
  const tokens = getXeroTokens();
  const tenantId = tokens?.tenant_id;
  const typeFilter = request.nextUrl.searchParams.get('type'); // 'ACCREC' | 'ACCPAY' | null for all

  if (!accessToken || !tenantId) {
    return NextResponse.json(
      { source: 'xero', error: 'Xero not connected', invoices: [] },
      { status: 200 }
    );
  }
  try {
    const res = await fetch('https://api.xero.com/api.xro/2.0/Invoices?pageSize=100&order=DueDate%20DESC', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Xero-tenant-id': tenantId,
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { source: 'xero', error: `Xero API error: ${res.status}`, invoices: [] },
        { status: 200 }
      );
    }
    const data = await res.json();
    let rawInvoices = data.Invoices || [];
    if (typeFilter === 'ACCREC' || typeFilter === 'ACCPAY') {
      rawInvoices = rawInvoices.filter((inv: { Type?: string }) => (inv.Type || '').toUpperCase() === typeFilter);
    }
    const invoices = rawInvoices.map((inv: {
      InvoiceID?: string;
      InvoiceNumber?: string;
      Type?: string;
      Contact?: { Name?: string };
      Total?: number;
      Status?: string;
      DueDate?: string;
      Date?: string;
      CurrencyCode?: string;
      Payments?: { Amount?: number; Date?: string }[];
    }) => {
      const type = (inv.Type || 'ACCREC').toUpperCase();
      const payments = inv.Payments || [];
      const paidAmount = payments.reduce((s, p) => s + (p.Amount ?? 0), 0);
      const paidDate = payments[0]?.Date;
      return {
        id: inv.InvoiceID || inv.InvoiceNumber,
        number: inv.InvoiceNumber,
        type: type === 'ACCPAY' ? 'in' as const : 'out' as const,
        entity: inv.Contact?.Name || '—',
        amount: inv.Total ?? 0,
        currency: inv.CurrencyCode || 'USD',
        dueDate: inv.DueDate || inv.Date || '',
        status: (inv.Status || '').toLowerCase().replace(' ', '_'),
        date: inv.Date,
        paidAmount: paidAmount > 0 ? paidAmount : undefined,
        paidDate: paidDate || undefined,
      };
    });
    return NextResponse.json({ source: 'xero', invoices });
  } catch {
    return NextResponse.json(
      { source: 'xero', error: 'Failed to fetch invoices', invoices: [] },
      { status: 200 }
    );
  }
}
