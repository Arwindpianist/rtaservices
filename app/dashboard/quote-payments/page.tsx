'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardTableSkeleton } from '@/components/dashboard/DashboardSkeleton';

type Item = {
  zohoQuoteId: string;
  xeroInvoiceId: string;
  xeroInvoiceNumber: string | null;
  paidAt: string | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string;
};

export default function QuotePaymentsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [xeroConnected, setXeroConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await fetch('/api/dashboard/quote-payments');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to load payment tracking');
        setLoading(false);
        return;
      }
      setXeroConnected(Boolean(data.xeroConnected));
      setItems(data.items ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-h3 font-bold text-rta-blue">Quote Payment Tracking</h1>
        <p className="mt-1 text-body-sm text-rta-text-secondary">
          Track Zoho quote to Xero invoice payment status links.
        </p>
        <Card className="mt-6 border-rta-border bg-white shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-rta-text">Tracking Status</CardTitle>
          </CardHeader>
          <CardContent className="text-body-sm text-rta-text-secondary">
            Xero Connection: {xeroConnected ? 'Connected' : 'Not connected'}
          </CardContent>
        </Card>
        <Card className="mt-4 border-rta-border bg-white shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-rta-text">Linked Quotes and Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <DashboardTableSkeleton rows={6} />
            ) : error ? (
              <p className="text-body-sm text-rta-red">{error}</p>
            ) : items.length === 0 ? (
              <p className="text-body-sm text-rta-text-secondary">No linked quote/invoice records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-rta-border">
                      <th className="py-2 text-left">Zoho Quote</th>
                      <th className="py-2 text-left">Xero Invoice</th>
                      <th className="py-2 text-left">Status</th>
                      <th className="py-2 text-left">Paid At</th>
                      <th className="py-2 text-left">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={`${item.zohoQuoteId}:${item.xeroInvoiceId}`} className="border-b border-rta-border">
                        <td className="py-2">{item.zohoQuoteId}</td>
                        <td className="py-2">{item.xeroInvoiceNumber || item.xeroInvoiceId}</td>
                        <td className="py-2">{item.paidAt ? 'Paid' : item.status || 'Unpaid'}</td>
                        <td className="py-2">{item.paidAt ? new Date(item.paidAt).toLocaleString() : '-'}</td>
                        <td className="py-2">{new Date(item.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

