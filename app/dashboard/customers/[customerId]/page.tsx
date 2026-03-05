'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, FileText, Receipt } from 'lucide-react';

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString();
}

type ZohoQuote = { id: string; name: string; amount: number; currency: string; stage: string };
type ZohoDeal = { id: string; name: string; amount: number; stage: string };
type XeroInvoice = { id: string; number: string; total: number; status: string; dueDate: string };

type CustomerDetail = {
  customerName: string;
  zohoQuotes: ZohoQuote[];
  zohoDeals: ZohoDeal[];
  xeroInvoices: XeroInvoice[];
};

export default function CustomerDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setCustomerId(p.customerId));
  }, [params]);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    fetch(`/api/connector/customers/${encodeURIComponent(customerId)}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (!customerId || (loading && !data)) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center">
        <div className="flex items-center gap-2 text-rta-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-body-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center">
        <p className="text-body-sm text-rta-text-secondary">Customer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="text-rta-text-secondary">
            <Link href="/dashboard/customers" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Customers
            </Link>
          </Button>
        </div>
        <h1 className="text-h3 font-bold text-rta-blue">{data.customerName}</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Zoho quotes & deals · Xero invoices</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-rta-blue" />
                <h2 className="text-base font-semibold text-rta-text">Zoho — Quotes</h2>
              </div>
              <div className="overflow-x-auto rounded-md border border-rta-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-rta-bg-light border-b border-rta-border">
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Quote</th>
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.zohoQuotes.map((q) => (
                      <tr key={q.id} className="border-b border-rta-border last:border-0">
                        <td className="px-4 py-2 text-body-sm text-rta-text">{q.name}</td>
                        <td className="px-4 py-2 text-body-sm text-rta-text tabular-nums text-right">
                          {formatAmount(q.amount, q.currency)}
                        </td>
                        <td className="px-4 py-2 text-body-sm text-rta-text-secondary">{q.stage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.zohoQuotes.length === 0 && (
                <p className="py-4 text-center text-body-sm text-rta-text-secondary">No quotes</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-rta-blue" />
                <h2 className="text-base font-semibold text-rta-text">Zoho — Deals</h2>
              </div>
              <div className="overflow-x-auto rounded-md border border-rta-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-rta-bg-light border-b border-rta-border">
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Deal</th>
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.zohoDeals.map((d) => (
                      <tr key={d.id} className="border-b border-rta-border last:border-0">
                        <td className="px-4 py-2 text-body-sm text-rta-text">{d.name}</td>
                        <td className="px-4 py-2 text-body-sm text-rta-text tabular-nums text-right">
                          {formatAmount(d.amount)}
                        </td>
                        <td className="px-4 py-2 text-body-sm text-rta-text-secondary">{d.stage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.zohoDeals.length === 0 && (
                <p className="py-4 text-center text-body-sm text-rta-text-secondary">No deals</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-rta-border bg-white shadow-card mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-4 h-4 text-rta-blue" />
              <h2 className="text-base font-semibold text-rta-text">Xero — Invoices</h2>
            </div>
            <div className="overflow-x-auto rounded-md border border-rta-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">#</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Due date</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.xeroInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-rta-border last:border-0">
                      <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{inv.number}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">
                        {formatAmount(inv.total)}
                      </td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{inv.status.replace(/_/g, ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.xeroInvoices.length === 0 && (
              <p className="py-8 text-center text-body-sm text-rta-text-secondary">No Xero invoices for this contact</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
