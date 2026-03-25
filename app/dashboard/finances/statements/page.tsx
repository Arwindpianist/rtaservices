'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import {
  MOCK_STATEMENT_CUSTOMER,
  MOCK_STATEMENT_SUPPLIER,
  MOCK_STATEMENT_STAFF,
  type AccountStatement,
  type StatementLine,
} from '@/lib/mock-data/finances';
import { useDashboardPresentation } from '../../DashboardPresentationContext';

const STATEMENTS: { id: string; label: string; data: AccountStatement }[] = [
  { id: 'customer', label: 'Main customer account statement', data: MOCK_STATEMENT_CUSTOMER },
  { id: 'supplier', label: 'Main supplier account statement', data: MOCK_STATEMENT_SUPPLIER },
  { id: 'staff', label: 'Main staff account statement', data: MOCK_STATEMENT_STAFF },
];

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

export default function StatementsPage() {
  const { presentationMode } = useDashboardPresentation();
  const [active, setActive] = useState(0);
  const [selectedLine, setSelectedLine] = useState<StatementLine | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [detailOpen, setDetailOpen] = useState(false);
  const st = STATEMENTS[active]?.data;

  if (presentationMode) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
        <Card className="border-rta-border bg-white shadow-card max-w-md">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-rta-text">Master financial data is hidden in presentation mode.</p>
            <p className="text-body-sm text-rta-text-secondary mt-1">Turn off presentation mode in the header to view statements.</p>
            <Button asChild variant="outline" size="sm" className="mt-4 border-rta-border text-rta-text">
              <Link href="/dashboard/finances">Back to finances</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
        <h1 className="text-h3 font-bold text-rta-blue">Account statements</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Main customer, supplier, and staff account statements</p>

        <div className="flex flex-wrap gap-2 mt-6 mb-4">
          {STATEMENTS.map((s, i) => (
            <Button
              key={s.id}
              variant={active === i ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActive(i)}
              className={active === i ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
            >
              {s.label}
            </Button>
          ))}
        </div>

        {st && (
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <CardHeader className="relative">
              <CardTitle className="text-base font-semibold text-rta-blue">{st.entity}</CardTitle>
              <p className="text-body-sm text-rta-text-secondary">
                {st.currency} · Balance: {formatAmount(st.balance, st.currency)}
              </p>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-body-sm text-rta-text-secondary mb-3">Click a row to view line details</p>
              <div className="overflow-x-auto rounded-md border border-rta-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-rta-bg-light border-b border-rta-border">
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Date</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Description</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Debit</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Credit</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Balance</th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {st.lines.map((line) => (
                      <tr
                        key={line.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSelectedLine(line);
                          setSelectedCurrency(st.currency);
                          setDetailOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedLine(line);
                            setSelectedCurrency(st.currency);
                            setDetailOpen(true);
                          }
                        }}
                        className="group/row border-b border-rta-border last:border-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rta-blue focus:ring-inset hover:bg-rta-bg-light"
                      >
                        <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{formatDate(line.date)}</td>
                        <td className="px-4 py-3 text-body-sm text-rta-text">{line.description}</td>
                        <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">
                          {line.debit ? formatAmount(line.debit, st.currency) : '-'}
                        </td>
                        <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">
                          {line.credit ? formatAmount(line.credit, st.currency) : '-'}
                        </td>
                        <td className="px-4 py-3 text-body-sm font-medium text-rta-text tabular-nums text-right">
                          {formatAmount(line.balance, st.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight className="w-4 h-4 text-rta-text-light group-hover/row:text-rta-text-secondary transition-colors" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-rta-border flex justify-end gap-6 text-body-sm">
                <span className="text-rta-text-secondary">Total debit: {formatAmount(st.totalDebit, st.currency)}</span>
                <span className="text-rta-text-secondary">Total credit: {formatAmount(st.totalCredit, st.currency)}</span>
                <span className="font-semibold text-rta-text">Balance: {formatAmount(st.balance, st.currency)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statement line detail modal */}
        {detailOpen && selectedLine && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
            onClick={() => setDetailOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="statement-line-detail-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-rta-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-rta-bg-light via-white to-rta-bg-blue/30 pt-6 pb-6 px-6 border-b border-rta-border">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rta-blue/5 rounded-bl-full" />
                <div className="relative flex items-start justify-between gap-4">
                  <h2 id="statement-line-detail-title" className="text-lg font-bold text-rta-text">
                    Transaction details
                  </h2>
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
                  <p className="text-body-sm text-rta-text-secondary">{selectedLine.description}</p>
                  <p className="text-xl font-bold text-rta-text tabular-nums mt-2">
                    Balance: {formatAmount(selectedLine.balance, selectedCurrency)}
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-2 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-rta-text-secondary">Date</span>
                  <span className="text-rta-text font-medium">{formatDate(selectedLine.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rta-text-secondary">Debit</span>
                  <span className="text-rta-text tabular-nums">{selectedLine.debit ? formatAmount(selectedLine.debit, selectedCurrency) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rta-text-secondary">Credit</span>
                  <span className="text-rta-text tabular-nums">{selectedLine.credit ? formatAmount(selectedLine.credit, selectedCurrency) : '-'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-rta-border">
                  <span className="text-rta-text-secondary font-medium">Running balance</span>
                  <span className="text-rta-text font-semibold tabular-nums">{formatAmount(selectedLine.balance, selectedCurrency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
