'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, ChevronRight, TrendingUp } from 'lucide-react';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString();
}

type ReceivablesData = {
  toBeInvoiced: { id: string; name: string; customer: string; amount: number; currency: string }[];
  outstanding: { id: string; number: string; entity: string; amount: number; currency: string; dueDate: string; ageBucket: string }[];
  ageing: Record<string, number>;
  expectedCash30: number;
  expectedCash60: number;
  expectedCash90: number;
};

const AGE_LABELS: Record<string, string> = {
  '0-30': '0–30 days',
  '30-60': '30–60 days',
  '60-90': '60–90 days',
  '90+': '90+ days',
};

export default function ReceivablesPage() {
  const [data, setData] = useState<ReceivablesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/connector/receivables')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center">
        <div className="flex items-center gap-2 text-rta-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-body-sm">Loading receivables…</span>
        </div>
      </div>
    );
  }

  const toBeInvoicedTotal = data.toBeInvoiced.reduce((s, i) => s + i.amount, 0);
  const outstandingTotal = data.outstanding.reduce((s, i) => s + i.amount, 0);

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
        <h1 className="text-h3 font-bold text-rta-blue">Aged receivables</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          To be invoiced (Zoho Won, not yet in Xero) and outstanding Xero receivables by age
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-6">
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">To be invoiced</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">
                <AnimatedNumber value={toBeInvoicedTotal} format={(n) => formatAmount(n)} duration={600} />
              </p>
              <p className="text-xs text-rta-text-secondary mt-1">{data.toBeInvoiced.length} quote(s)</p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Outstanding</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">
                <AnimatedNumber value={outstandingTotal} format={(n) => formatAmount(n)} duration={600} />
              </p>
              <p className="text-xs text-rta-text-secondary mt-1">{data.outstanding.length} invoice(s)</p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Expected cash (30 days)</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">
                <AnimatedNumber value={data.expectedCash30} format={(n) => formatAmount(n)} duration={600} />
              </p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Expected cash (60 / 90 days)</p>
              <p className="text-xl font-bold text-rta-text tabular-nums mt-1">
                {formatAmount(data.expectedCash60)} / {formatAmount(data.expectedCash90)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <h2 className="text-base font-semibold text-rta-text mb-3">To be invoiced</h2>
              <p className="text-body-sm text-rta-text-secondary mb-3">Zoho quotes Won but not yet linked to Xero</p>
              <div className="overflow-x-auto rounded-md border border-rta-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-rta-bg-light border-b border-rta-border">
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Quote</th>
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Customer</th>
                      <th className="px-4 py-2 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.toBeInvoiced.map((row) => (
                      <tr key={row.id} className="border-b border-rta-border last:border-0">
                        <td className="px-4 py-2 text-body-sm text-rta-text">{row.name}</td>
                        <td className="px-4 py-2 text-body-sm text-rta-text">{row.customer}</td>
                        <td className="px-4 py-2 text-body-sm text-rta-text tabular-nums text-right">
                          {formatAmount(row.amount, row.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {data.toBeInvoiced.length === 0 && (
                <p className="py-4 text-center text-body-sm text-rta-text-secondary">None</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <h2 className="text-base font-semibold text-rta-text mb-3">Outstanding by age</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                {(['0-30', '30-60', '60-90', '90+'] as const).map((bucket) => (
                  <div key={bucket} className="rounded-lg bg-rta-bg-light px-4 py-2">
                    <p className="text-xs font-medium text-rta-text-secondary">{AGE_LABELS[bucket]}</p>
                    <p className="text-lg font-bold text-rta-text tabular-nums">
                      {formatAmount(data.ageing[bucket] ?? 0)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-rta-border bg-white shadow-card">
          <CardContent className="pt-6">
            <h2 className="text-base font-semibold text-rta-text mb-3">Outstanding invoices</h2>
            <div className="overflow-x-auto rounded-md border border-rta-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">#</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Entity</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Due date</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Age</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {data.outstanding.map((row) => (
                    <tr
                      key={row.id}
                      className="group border-b border-rta-border last:border-0 hover:bg-rta-bg-light cursor-pointer"
                      onClick={() => window.open(`/dashboard/finances/invoices`, '_self')}
                    >
                      <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{row.number}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text">{row.entity}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">
                        {formatAmount(row.amount, row.currency)}
                      </td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{formatDate(row.dueDate)}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{AGE_LABELS[row.ageBucket] ?? row.ageBucket}</td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-rta-text-light group-hover:text-rta-text-secondary" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.outstanding.length === 0 && (
              <p className="py-8 text-center text-body-sm text-rta-text-secondary">No outstanding invoices</p>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text">
            <Link href="/dashboard/quote-to-cash" className="inline-flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Quote-to-cash pipeline
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="ml-2 text-rta-text-secondary">
            <Link href="/dashboard/connector/reconciliation">Reconciliation</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
