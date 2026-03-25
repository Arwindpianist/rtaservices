'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, X, Wallet } from 'lucide-react';
import { MOCK_PAYMENTS, getPaymentsByStatus, getPaymentsByEntityType, type PaymentRow } from '@/lib/mock-data/finances';

const STATUSES: { id: PaymentRow['status']; label: string }[] = [
  { id: 'due', label: 'Due' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'late', label: 'Late' },
  { id: 'on_time', label: 'On time' },
  { id: 'early', label: 'Early' },
];

const ENTITY_TYPES: { id: PaymentRow['entityType']; label: string }[] = [
  { id: 'customer', label: 'Customers' },
  { id: 'supplier', label: 'Suppliers' },
  { id: 'staff', label: 'Staff' },
];

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

export default function PaymentsPage() {
  const [status, setStatus] = useState<PaymentRow['status'] | 'all'>('all');
  const [entityType, setEntityType] = useState<PaymentRow['entityType'] | 'all'>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  let payments: PaymentRow[] = MOCK_PAYMENTS;
  if (status !== 'all') payments = getPaymentsByStatus(status);
  if (entityType !== 'all') payments = getPaymentsByEntityType(entityType);
  if (status !== 'all' && entityType !== 'all') {
    payments = MOCK_PAYMENTS.filter((p) => p.status === status && p.entityType === entityType);
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
        <h1 className="text-h3 font-bold text-rta-blue">Payments</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Due, overdue, late, on time, early. For customers, suppliers, staff</p>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-body-sm font-medium text-rta-text-secondary mb-2">By status</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={status === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('all')}
                className={status === 'all' ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
              >
                All
              </Button>
              {STATUSES.map((s) => (
                <Button
                  key={s.id}
                  variant={status === s.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatus(s.id)}
                  className={status === s.id ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-body-sm font-medium text-rta-text-secondary mb-2">By entity type</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={entityType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEntityType('all')}
                className={entityType === 'all' ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
              >
                All
              </Button>
              {ENTITY_TYPES.map((e) => (
                <Button
                  key={e.id}
                  variant={entityType === e.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEntityType(e.id)}
                  className={entityType === e.id ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
                >
                  {e.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Card className="mt-6 border-rta-border bg-white shadow-card">
          <CardContent className="pt-6">
            <p className="text-body-sm text-rta-text-secondary mb-3">Click a row to view details</p>
            <div className="overflow-x-auto rounded-md border border-rta-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Entity</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Type</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Due date</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Status</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedPayment(p);
                        setDetailOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedPayment(p);
                          setDetailOpen(true);
                        }
                      }}
                      className="group border-b border-rta-border last:border-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rta-blue focus:ring-inset hover:bg-rta-bg-light"
                    >
                      <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{p.entity}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary capitalize">{p.entityType}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">{formatAmount(p.amount, p.currency)}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{formatDate(p.dueDate)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-body-sm border-rta-border text-rta-text">{p.status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-rta-text-light group-hover:text-rta-text-secondary transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payments.length === 0 && (
              <p className="py-8 text-center text-body-sm text-rta-text-secondary">No payments match the filters.</p>
            )}
          </CardContent>
        </Card>

        {/* Payment detail modal */}
        {detailOpen && selectedPayment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
            onClick={() => setDetailOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-detail-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-rta-border flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-rta-bg-light via-white to-rta-bg-blue/30 pt-6 pb-6 px-6 border-b border-rta-border">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rta-blue/5 rounded-bl-full" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h2 id="payment-detail-title" className="text-lg font-bold text-rta-text mb-1">
                      Payment {selectedPayment.id}
                    </h2>
                    <p className="text-body-sm text-rta-text-secondary">{selectedPayment.entity}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="border-rta-border text-rta-text capitalize">
                        {selectedPayment.entityType}
                      </Badge>
                      <Badge variant="outline" className="border-rta-border text-rta-text">
                        {selectedPayment.status.replace('_', ' ')}
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
                    {formatAmount(selectedPayment.amount, selectedPayment.currency)}
                  </p>
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Details</p>
                  </div>
                  <dl className="grid grid-cols-1 gap-2 text-body-sm">
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Entity</dt>
                      <dd className="text-rta-text font-medium">{selectedPayment.entity}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Type</dt>
                      <dd className="text-rta-text capitalize">{selectedPayment.entityType}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Due date</dt>
                      <dd className="text-rta-text">{formatDate(selectedPayment.dueDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-rta-text-secondary font-medium">Status</dt>
                      <dd className="text-rta-text">{selectedPayment.status.replace('_', ' ')}</dd>
                    </div>
                    {selectedPayment.description && (
                      <div>
                        <dt className="text-rta-text-secondary font-medium">Description</dt>
                        <dd className="text-rta-text">{selectedPayment.description}</dd>
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
