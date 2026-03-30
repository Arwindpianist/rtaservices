'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, X, Receipt, Loader2 } from 'lucide-react';
import type { Claim, ClaimSource } from '@/lib/mock-data/finances';
import { RequireMasterFinancials } from '@/lib/dashboard-capability-guard';

const SOURCES: { id: ClaimSource; label: string }[] = [
  { id: 'client', label: 'From clients' },
  { id: 'vendor', label: 'From vendor' },
  { id: 'staff', label: 'From staff' },
];

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

export default function ClaimsPage() {
  const [source, setSource] = useState<ClaimSource>('client');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claimsData, setClaimsData] = useState<Claim[]>([]);
  const [dataSource, setDataSource] = useState('mock');

  useEffect(() => {
    fetch('/api/dashboard/finances/claims')
      .then((res) => res.json())
      .then((data) => {
        setClaimsData((data.claims ?? []) as Claim[]);
        setDataSource(data.source || 'mock');
      })
      .catch(() => {
        setClaimsData([]);
        setDataSource('mock');
      })
      .finally(() => setLoading(false));
  }, []);

  const claims = claimsData.filter((c) => c.source === source);

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
        <h1 className="text-h3 font-bold text-rta-blue">Claims</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Claims from clients, vendor, and staff
          <span className="ml-2 text-rta-blue font-medium">
            · {dataSource === 'mock' ? 'Preview data' : 'Live data'}
          </span>
        </p>

        <div className="flex flex-wrap gap-2 mt-6 mb-4">
          {SOURCES.map((s) => (
            <Button
              key={s.id}
              variant={source === s.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSource(s.id)}
              className={source === s.id ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
            >
              {s.label}
            </Button>
          ))}
        </div>

        <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="relative">
            <CardTitle className="text-base font-semibold text-rta-blue">{SOURCES.find((s) => s.id === source)?.label}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 py-12 justify-center text-rta-text-secondary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-body-sm">Loading claims…</span>
              </div>
            ) : (
              <>
                <p className="text-body-sm text-rta-text-secondary mb-3">Click a row to view details</p>
                <div className="overflow-x-auto rounded-md border border-rta-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">From</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Amount</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Status</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Date</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c: Claim) => (
                    <tr
                      key={c.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedClaim(c);
                        setDetailOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedClaim(c);
                          setDetailOpen(true);
                        }
                      }}
                      className="group border-b border-rta-border last:border-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rta-blue focus:ring-inset hover:bg-rta-bg-light"
                    >
                      <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{c.from}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums">{formatAmount(c.amount, c.currency)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-body-sm border-rta-border text-rta-text">{c.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{formatDate(c.date)}</td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-rta-text-light group-hover:text-rta-text-secondary transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
                {claims.length === 0 && (
                  <p className="py-8 text-center text-body-sm text-rta-text-secondary">No claims in this category.</p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Claim detail modal */}
        {detailOpen && selectedClaim && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
            onClick={() => setDetailOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-detail-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-rta-border flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-rta-bg-light via-white to-rta-bg-blue/30 pt-6 pb-6 px-6 border-b border-rta-border">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rta-blue/5 rounded-bl-full" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h2 id="claim-detail-title" className="text-lg font-bold text-rta-text mb-1">
                      Claim {selectedClaim.id}
                    </h2>
                    <p className="text-body-sm text-rta-text-secondary">{selectedClaim.from}</p>
                    <Badge variant="outline" className="mt-2 border-rta-border text-rta-text">
                      {selectedClaim.status}
                    </Badge>
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
                    {formatAmount(selectedClaim.amount, selectedClaim.currency)}
                  </p>
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Receipt className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Details</p>
                  </div>
                  <dl className="grid grid-cols-1 gap-2 text-body-sm">
                    <div>
                      <dt className="text-rta-text-secondary font-medium">From</dt>
                      <dd className="text-rta-text font-medium">{selectedClaim.from}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Source</dt>
                      <dd className="text-rta-text capitalize">{selectedClaim.source}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Date</dt>
                      <dd className="text-rta-text">{formatDate(selectedClaim.date)}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Status</dt>
                      <dd className="text-rta-text">{selectedClaim.status}</dd>
                    </div>
                    {selectedClaim.description && (
                      <div>
                        <dt className="text-rta-text-secondary font-medium">Description</dt>
                        <dd className="text-rta-text">{selectedClaim.description}</dd>
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
    </RequireMasterFinancials>
  );
}
