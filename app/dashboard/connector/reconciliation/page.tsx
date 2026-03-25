'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Link2 } from 'lucide-react';

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

type XeroInv = { id: string; number: string; entity: string; amount: number; currency: string; status: string };
type ZohoQuote = { id: string; name: string };
type LinkEntry = { zohoQuoteId: string; xeroInvoiceId: string; xeroInvoiceNumber?: string };

export default function ReconciliationPage() {
  const [invoices, setInvoices] = useState<XeroInv[]>([]);
  const [quotes, setQuotes] = useState<ZohoQuote[]>([]);
  const [links, setLinks] = useState<LinkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/xero/invoices?type=ACCREC').then((r) => r.json()),
      fetch('/api/connector/pipeline').then((r) => r.json()),
    ])
      .then(([xeroRes, pipelineRes]) => {
        setInvoices(xeroRes.invoices || []);
        const pipeline = pipelineRes.pipeline || [];
        setQuotes(pipeline.map((p: { zohoQuoteId: string; quoteName: string }) => ({ id: p.zohoQuoteId, name: p.quoteName })));
        setLinks(pipelineRes.links || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const linkByXeroId = new Map(links.map((l) => [l.xeroInvoiceId, l]));

  const handleLink = async (xeroInvoiceId: string, xeroNumber: string) => {
    const zohoQuoteId = selectedQuote[xeroInvoiceId];
    if (!zohoQuoteId) return;
    setLinking(xeroInvoiceId);
    try {
      const res = await fetch('/api/connector/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xeroInvoiceId, zohoQuoteId, xeroInvoiceNumber: xeroNumber }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Link failed');
        return;
      }
      const newLink = { zohoQuoteId, xeroInvoiceId, xeroInvoiceNumber: xeroNumber };
      setLinks((prev) => prev.filter((l) => l.xeroInvoiceId !== xeroInvoiceId).concat([newLink]));
      setSelectedQuote((prev) => ({ ...prev, [xeroInvoiceId]: '' }));
    } catch {
      alert('Request failed');
    } finally {
      setLinking(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="text-rta-text-secondary">
            <Link href="/dashboard/quote-to-cash" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Quote-to-cash
            </Link>
          </Button>
        </div>
        <h1 className="text-h3 font-bold text-rta-blue">Reconciliation</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Manually link Xero invoices to Zoho quotes (for invoices created outside RTA or before the connector)
        </p>

        <Card className="border-rta-border bg-white shadow-card mt-6">
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center gap-2 py-12 justify-center text-rta-text-secondary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-body-sm">Loading…</span>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-rta-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-rta-bg-light border-b border-rta-border">
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Xero #</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Contact</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Status</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Linked to quote</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => {
                      const existing = linkByXeroId.get(inv.id);
                      return (
                        <tr key={inv.id} className="border-b border-rta-border last:border-0">
                          <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{inv.number}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text">{inv.entity}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">
                            {formatAmount(inv.amount, inv.currency)}
                          </td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{inv.status.replace(/_/g, ' ')}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">
                            {existing ? existing.zohoQuoteId : '-'}
                          </td>
                          <td className="px-4 py-3">
                            {existing ? (
                              <span className="text-body-sm text-rta-text-secondary">Linked</span>
                            ) : (
                              <div className="flex items-center gap-2 flex-wrap">
                                <select
                                  value={selectedQuote[inv.id] ?? ''}
                                  onChange={(e) => setSelectedQuote((s) => ({ ...s, [inv.id]: e.target.value }))}
                                  className="h-9 rounded-md border border-rta-border bg-white px-2 text-body-sm text-rta-text min-w-[140px]"
                                >
                                  <option value="">Select quote</option>
                                  {quotes.map((q) => (
                                    <option key={q.id} value={q.id}>
                                      {q.name}
                                    </option>
                                  ))}
                                </select>
                                <Button
                                  size="sm"
                                  className="bg-rta-blue hover:bg-rta-blue-hover text-white"
                                  disabled={!selectedQuote[inv.id] || linking === inv.id}
                                  onClick={() => handleLink(inv.id, inv.number)}
                                >
                                  {linking === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                                  Link
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && invoices.length === 0 && (
              <p className="py-8 text-center text-body-sm text-rta-text-secondary">No Xero invoices (ACCREC) found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
