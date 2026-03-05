'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, ChevronRight, X, FileText, Send } from 'lucide-react';
import { getStageBadgeClass } from '@/lib/stage-colors';

type PipelineRow = {
  zohoQuoteId: string;
  quoteName: string;
  customer: string;
  amount: number;
  currency: string;
  stage: string;
  createdBy?: string;
  endCustomer?: string;
  dealName?: string;
  xeroInvoiceId?: string;
  xeroInvoiceNumber?: string;
  xeroStatus?: string;
  paidAt?: string;
  paidAmount?: number;
};

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString();
}

const WON_STAGE = 'won'; // Server uses ZOHO_QUOTE_WON_STAGE; client shows Create in Xero for stage containing "won"

export default function QuoteToCashPage() {
  const [data, setData] = useState<{ pipeline: PipelineRow[]; links?: unknown[]; error?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerSearch, setCustomerSearch] = useState('');
  const [salespersonFilter, setSalespersonFilter] = useState('');
  const [selectedRow, setSelectedRow] = useState<PipelineRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const fetchPipeline = () => {
    setLoading(true);
    fetch('/api/connector/pipeline')
      .then((res) => res.json())
      .then((d) => setData({ pipeline: d.pipeline ?? [], links: d.links, error: d.error }))
      .catch(() => setData({ pipeline: [], error: 'Failed to load pipeline' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const pipeline = data?.pipeline ?? [];
  const salespeople = useMemo(() => {
    const set = new Set<string>();
    pipeline.forEach((r) => {
      if (r.createdBy?.trim()) set.add(r.createdBy.trim());
    });
    return Array.from(set).sort();
  }, [pipeline]);

  const filtered = useMemo(() => {
    let list = pipeline;
    if (customerSearch.trim()) {
      const q = customerSearch.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.customer?.toLowerCase().includes(q) ||
          r.quoteName?.toLowerCase().includes(q) ||
          r.endCustomer?.toLowerCase().includes(q)
      );
    }
    if (salespersonFilter) {
      list = list.filter((r) => (r.createdBy || '').trim() === salespersonFilter);
    }
    return list;
  }, [pipeline, customerSearch, salespersonFilter]);

  const handleCreateInXero = async (zohoQuoteId: string) => {
    setCreatingId(zohoQuoteId);
    try {
      const res = await fetch('/api/connector/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zohoQuoteId }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || 'Failed to create invoice');
        return;
      }
      fetchPipeline();
      setDetailOpen(false);
      setSelectedRow(null);
    } catch {
      alert('Request failed');
    } finally {
      setCreatingId(null);
    }
  };

  const isWon = (stage: string) => (stage || '').toLowerCase().includes(WON_STAGE.toLowerCase());
  const showCreateButton = (row: PipelineRow) => isWon(row.stage) && !row.xeroInvoiceId;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="ghost" size="sm" className="text-rta-text-secondary">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
        </div>
        <h1 className="text-h3 font-bold text-rta-blue">Quote-to-cash pipeline</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Zoho quotes with Xero invoice links. Create in Xero for won quotes with no link.
        </p>
        <p className="text-body-sm mt-1">
          <Link href="/dashboard/settings/connector" className="text-rta-blue hover:underline">Connector settings</Link>
          {' · '}
          <Link href="/dashboard/connector/reconciliation" className="text-rta-blue hover:underline">Reconciliation</Link>
        </p>
        {data?.error && (
          <p className="mt-2 text-body-sm text-rta-red">{data.error}</p>
        )}

        <div className="space-y-4 mt-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-body-sm font-medium text-rta-text-secondary mb-1">Customer / quote search</p>
              <Input
                placeholder="Search customer or quote…"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="max-w-xs border-rta-border"
              />
            </div>
            <div>
              <p className="text-body-sm font-medium text-rta-text-secondary mb-1">Salesperson</p>
              <select
                value={salespersonFilter}
                onChange={(e) => setSalespersonFilter(e.target.value)}
                className="h-9 rounded-md border border-rta-border bg-white px-3 text-body-sm text-rta-text max-w-[200px]"
              >
                <option value="">All</option>
                {salespeople.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Card className="border-rta-border bg-white shadow-card">
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center gap-2 py-12 justify-center text-rta-text-secondary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-body-sm">Loading pipeline…</span>
              </div>
            ) : (
              <>
                <p className="text-body-sm text-rta-text-secondary mb-3">Click a row to view details</p>
                <div className="overflow-x-auto rounded-md border border-rta-border">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-rta-bg-light border-b border-rta-border">
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Quote #</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Customer</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Stage</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Deal</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">End customer</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Xero invoice #</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Invoice status</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Paid amount</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Paid date</th>
                        <th className="px-4 py-3 w-24">Action</th>
                        <th className="px-4 py-3 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row) => (
                        <tr
                          key={row.zohoQuoteId}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedRow(row);
                            setDetailOpen(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedRow(row);
                              setDetailOpen(true);
                            }
                          }}
                          className="group border-b border-rta-border last:border-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rta-blue focus:ring-inset hover:bg-rta-bg-light"
                        >
                          <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{row.quoteName}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text">{row.customer}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">
                            {formatAmount(row.amount, row.currency)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={`text-body-sm border ${getStageBadgeClass(row.stage)}`}>
                              {row.stage || '—'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{row.dealName ?? '—'}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{row.endCustomer ?? '—'}</td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">
                            {row.xeroInvoiceNumber ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">
                            {(row.xeroStatus || '—').replace(/_/g, ' ')}
                          </td>
                          <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">
                            {row.paidAmount != null ? formatAmount(row.paidAmount, row.currency) : '—'}
                          </td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary">
                            {formatDate(row.paidAt || '')}
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            {showCreateButton(row) && (
                              <Button
                                size="sm"
                                className="bg-rta-blue hover:bg-rta-blue-hover text-white"
                                disabled={creatingId === row.zohoQuoteId}
                                onClick={() => handleCreateInXero(row.zohoQuoteId)}
                              >
                                {creatingId === row.zohoQuoteId ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5 mr-1" />
                                    Create in Xero
                                  </>
                                )}
                              </Button>
                            )}
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
                  <p className="py-8 text-center text-body-sm text-rta-text-secondary">
                    No quotes match the filters.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {detailOpen && selectedRow && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
            onClick={() => setDetailOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-detail-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-rta-border flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-rta-bg-light via-white to-rta-bg-blue/30 pt-6 pb-6 px-6 border-b border-rta-border">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rta-blue/5 rounded-bl-full" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h2 id="quote-detail-title" className="text-lg font-bold text-rta-text mb-1">
                      {selectedRow.quoteName}
                    </h2>
                    <p className="text-body-sm text-rta-text-secondary">{selectedRow.customer}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className={`border ${getStageBadgeClass(selectedRow.stage)}`}>
                        {selectedRow.stage || '—'}
                      </Badge>
                      {selectedRow.xeroInvoiceNumber && (
                        <Badge variant="outline" className="border-rta-border text-rta-text">
                          Xero #{selectedRow.xeroInvoiceNumber}
                        </Badge>
                      )}
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
                    {formatAmount(selectedRow.amount, selectedRow.currency)}
                  </p>
                </div>
                {showCreateButton(selectedRow) && (
                  <div className="mt-4">
                    <Button
                      className="w-full sm:w-auto bg-rta-blue hover:bg-rta-blue-hover text-white"
                      disabled={creatingId === selectedRow.zohoQuoteId}
                      onClick={() => handleCreateInXero(selectedRow.zohoQuoteId)}
                    >
                      {creatingId === selectedRow.zohoQuoteId ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Create in Xero
                    </Button>
                  </div>
                )}
              </div>
              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Details</p>
                  </div>
                  <dl className="grid grid-cols-1 gap-2 text-body-sm">
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Quote ID</dt>
                      <dd className="text-rta-text font-mono text-xs">{selectedRow.zohoQuoteId}</dd>
                    </div>
                    {selectedRow.createdBy && (
                      <div>
                        <dt className="text-rta-text-secondary font-medium">Created by</dt>
                        <dd className="text-rta-text">{selectedRow.createdBy}</dd>
                      </div>
                    )}
                    {selectedRow.endCustomer && (
                      <div>
                        <dt className="text-rta-text-secondary font-medium">End customer</dt>
                        <dd className="text-rta-text">{selectedRow.endCustomer}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Xero status</dt>
                      <dd className="text-rta-text">{(selectedRow.xeroStatus || '—').replace(/_/g, ' ')}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Paid date</dt>
                      <dd className="text-rta-text">{formatDate(selectedRow.paidAt || '')}</dd>
                    </div>
                    {selectedRow.paidAmount != null && (
                      <div>
                        <dt className="text-rta-text-secondary font-medium">Paid amount</dt>
                        <dd className="text-rta-text tabular-nums">
                          {formatAmount(selectedRow.paidAmount, selectedRow.currency)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
