'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, ChevronRight, X, FileText } from 'lucide-react';
import type { InvoiceItem } from '@/lib/dashboard-finances-types';
import { RequireMasterFinancials } from '@/lib/dashboard-capability-guard';

const AGE_BUCKETS = [
  { id: '0-30', label: '0–30 days' },
  { id: '30-60', label: '30–60 days' },
  { id: '60-90', label: '60–90 days' },
  { id: '>90', label: '>90 days' },
];

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString();
}

export default function InvoicesPage() {
  const [type, setType] = useState<'in' | 'out' | 'all'>('all');
  const [ageBucket, setAgeBucket] = useState<string>('all');
  const [data, setData] = useState<{ source: string; invoices: InvoiceItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/finances/invoices')
      .then((res) => res.json())
      .then((d) => setData({ source: d.source || 'mock', invoices: d.invoices || [] }))
      .catch(() => setData({ source: 'mock', invoices: [] }))
      .finally(() => setLoading(false));
  }, []);

  const invoices = data?.invoices ?? [];
  let filtered = type === 'all' ? invoices : invoices.filter((i) => i.type === type);
  if (ageBucket !== 'all') filtered = filtered.filter((i) => (i.ageBucket || '0-30') === ageBucket);

  const toPay = invoices.filter((i) => i.type === 'in').reduce((s, i) => s + i.amount, 0);
  const toReceive = invoices.filter((i) => i.type === 'out').reduce((s, i) => s + i.amount, 0);

  return (
    <RequireMasterFinancials backHref="/dashboard">
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="text-rta-text-secondary">
            <Link href="/dashboard/finances" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Finances
            </Link>
          </Button>
        </div>
        <h1 className="text-h3 font-bold text-rta-blue">Invoices</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Invoices in (to pay) vs out (to receive); aging 0–30, 30–60, 60–90, &gt;90 days
          {data?.source === 'xero' && (
            <span className="ml-2 text-rta-blue font-medium">· Live from Xero</span>
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-6">
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Invoices in (to pay)</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">{formatAmount(toPay)}</p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Invoices out (to receive)</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">{formatAmount(toReceive)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-body-sm font-medium text-rta-text-secondary mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={type === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setType('all')}
                className={type === 'all' ? 'bg-rta-blue hover:bg-rta-blue-hover' : 'border-rta-border text-rta-text'}
              >
                All
              </Button>
              <Button
                variant={type === 'in' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setType('in')}
                className={type === 'in' ? 'bg-rta-blue hover:bg-rta-blue-hover' : 'border-rta-border text-rta-text'}
              >
                In (to pay)
              </Button>
              <Button
                variant={type === 'out' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setType('out')}
                className={type === 'out' ? 'bg-rta-blue hover:bg-rta-blue-hover' : 'border-rta-border text-rta-text'}
              >
                Out (to receive)
              </Button>
            </div>
          </div>
          <div>
            <p className="text-body-sm font-medium text-rta-text-secondary mb-2">Aging bucket</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={ageBucket === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAgeBucket('all')}
                className={ageBucket === 'all' ? 'bg-rta-blue hover:bg-rta-blue-hover' : 'border-rta-border text-rta-text'}
              >
                All
              </Button>
              {AGE_BUCKETS.map((b) => (
                <Button
                  key={b.id}
                  variant={ageBucket === b.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAgeBucket(b.id)}
                  className={ageBucket === b.id ? 'bg-rta-blue hover:bg-rta-blue-hover' : 'border-rta-border text-rta-text'}
                >
                  {b.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Card className="border-rta-border bg-white shadow-card">
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center gap-2 py-12 justify-center text-rta-text-secondary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-body-sm">Loading invoices…</span>
              </div>
            ) : (
              <>
                <p className="text-body-sm text-rta-text-secondary mb-3">Click a row to view details</p>
                <div className="overflow-x-auto rounded-md border border-rta-border">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-rta-bg-light border-b border-rta-border">
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Type</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Entity</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Due date</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Aging</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Status</th>
                        <th className="px-4 py-3 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((i) => (
                        <tr
                          key={i.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedInvoice(i);
                            setDetailOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedInvoice(i);
                              setDetailOpen(true);
                            }
                          }}
                          className="group border-b border-rta-border last:border-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rta-blue focus:ring-inset hover:bg-rta-bg-light"
                        >
                          <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{i.type === 'in' ? 'In' : 'Out'}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text">{i.entity}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">{formatAmount(i.amount, i.currency)}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{formatDate(i.dueDate)}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{i.ageBucket || '-'}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-body-sm border-rta-border text-rta-text">
                              {(i.status || '').replace(/_/g, ' ')}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <ChevronRight className="w-4 h-4 text-rta-text-light group-hover:text-rta-text-secondary transition-colors" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && (
                  <p className="py-8 text-center text-body-sm text-rta-text-secondary">No invoices match the filters.</p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Invoice detail modal */}
        {detailOpen && selectedInvoice && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
            onClick={() => setDetailOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-detail-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-rta-border flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-rta-bg-light via-white to-rta-bg-blue/30 pt-6 pb-6 px-6 border-b border-rta-border">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rta-blue/5 rounded-bl-full" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h2 id="invoice-detail-title" className="text-lg font-bold text-rta-text mb-1">
                      Invoice {selectedInvoice.id}
                    </h2>
                    <p className="text-body-sm text-rta-text-secondary">{selectedInvoice.entity}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="border-rta-border text-rta-text">
                        {selectedInvoice.type === 'in' ? 'In (to pay)' : 'Out (to receive)'}
                      </Badge>
                      <Badge variant="outline" className="border-rta-border text-rta-text">
                        {(selectedInvoice.status || '').replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDetailOpen(false)}
                    className="rounded-full shrink-0 hover:bg-black/5 text-rta-text-secondary"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="relative mt-4 pt-4 border-t border-rta-border/60">
                  <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-2xl font-bold text-rta-text tabular-nums">
                    {formatAmount(selectedInvoice.amount, selectedInvoice.currency)}
                  </p>
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Details</p>
                  </div>
                  <dl className="grid grid-cols-1 gap-2 text-body-sm">
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Entity</dt>
                      <dd className="text-rta-text font-medium">{selectedInvoice.entity}</dd>
                    </div>
                    {selectedInvoice.entityType && (
                      <div>
                        <dt className="text-rta-text-secondary font-medium">Entity type</dt>
                        <dd className="text-rta-text capitalize">{selectedInvoice.entityType}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Due date</dt>
                      <dd className="text-rta-text">{formatDate(selectedInvoice.dueDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Aging</dt>
                      <dd className="text-rta-text">{selectedInvoice.ageBucket || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Status</dt>
                      <dd className="text-rta-text">{(selectedInvoice.status || '').replace(/_/g, ' ')}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </RequireMasterFinancials>
  );
}
