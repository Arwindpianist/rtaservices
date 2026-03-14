'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, X, DollarSign } from 'lucide-react';
import { MOCK_PAYROLL, getPayrollTaxSummary, type PayrollEntry } from '@/lib/mock-data/payroll';
import { useDashboardPresentation } from '../DashboardPresentationContext';
import { RequirePayroll } from '@/lib/dashboard-capability-guard';

function formatAmount(amount: number, currency = 'SGD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

function PayrollContent() {
  const [country, setCountry] = useState<string>('all');
  const [department, setDepartment] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  let entries: PayrollEntry[] = MOCK_PAYROLL;
  if (country !== 'all') entries = entries.filter((e) => e.country === country);
  if (department !== 'all') entries = entries.filter((e) => e.department === department);
  if (status !== 'all') entries = entries.filter((e) => e.payStatus === status);

  const taxSummary = getPayrollTaxSummary();
  const countries = [...new Set(MOCK_PAYROLL.map((e) => e.country))];
  const departments = [...new Set(MOCK_PAYROLL.map((e) => e.department))];
  const statuses = [...new Set(MOCK_PAYROLL.map((e) => e.payStatus))];

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
        <h1 className="text-h3 font-bold text-rta-blue">Payroll</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Starts with SG — by country, department, role, employee, pay period/date/amount/method/status/type/frequency, taxes</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 mb-6">
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Total gross</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">{formatAmount(taxSummary.totalGross)}</p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Total taxes</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">{formatAmount(taxSummary.totalTaxes)}</p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Total net pay</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">{formatAmount(taxSummary.totalNet)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-body-sm font-medium text-rta-text-secondary self-center">Country:</span>
            <Button
              variant={country === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCountry('all')}
              className={country === 'all' ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
            >
              All
            </Button>
            {countries.map((c) => (
              <Button
                key={c}
                variant={country === c ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCountry(c)}
                className={country === c ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-body-sm font-medium text-rta-text-secondary self-center">Department:</span>
            <Button
              variant={department === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDepartment('all')}
              className={department === 'all' ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
            >
              All
            </Button>
            {departments.map((d) => (
              <Button
                key={d}
                variant={department === d ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDepartment(d)}
                className={department === d ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
              >
                {d}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-body-sm font-medium text-rta-text-secondary self-center">Pay status:</span>
            <Button
              variant={status === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus('all')}
              className={status === 'all' ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
            >
              All
            </Button>
            {statuses.map((s) => (
              <Button
                key={s}
                variant={status === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus(s)}
                className={status === s ? 'bg-rta-blue hover:bg-rta-blue-hover text-white' : 'border-rta-border text-rta-text'}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
          <CardHeader className="relative">
            <CardTitle className="text-base font-semibold text-rta-blue">Payroll entries</CardTitle>
            <p className="text-body-sm text-rta-text-secondary">Click a row to view details</p>
          </CardHeader>
          <CardContent className="relative">
            <div className="overflow-x-auto rounded-md border border-rta-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Country</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Department</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Role</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Employee</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Pay period</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Pay date</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Method</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Status</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Type</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Frequency</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Taxes</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr
                      key={e.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedEntry(e);
                        setDetailOpen(true);
                      }}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                          ev.preventDefault();
                          setSelectedEntry(e);
                          setDetailOpen(true);
                        }
                      }}
                      className="group/row border-b border-rta-border last:border-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rta-blue focus:ring-inset hover:bg-rta-bg-light"
                    >
                      <td className="px-4 py-3 text-body-sm text-rta-text">{e.country}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text">{e.department}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text">{e.role}</td>
                      <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{e.employee}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{e.payPeriod}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{new Date(e.payDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">{formatAmount(e.payAmount, e.currency)}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{e.payMethod}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-body-sm border-rta-border text-rta-text">{e.payStatus}</Badge>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{e.payType}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{e.payFrequency}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">{formatAmount(e.taxes, e.currency)}</td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-rta-text-light group-hover/row:text-rta-text-secondary transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {entries.length === 0 && (
              <p className="py-8 text-center text-body-sm text-rta-text-secondary">No entries match the filters.</p>
            )}
          </CardContent>
        </Card>

        {detailOpen && selectedEntry && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
            onClick={() => setDetailOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payroll-detail-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-rta-border flex flex-col"
              onClick={(ev) => ev.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-rta-bg-light via-white to-rta-bg-blue/30 pt-6 pb-6 px-6 border-b border-rta-border">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rta-blue/5 rounded-bl-full" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h2 id="payroll-detail-title" className="text-lg font-bold text-rta-text mb-1">
                      {selectedEntry.employee}
                    </h2>
                    <p className="text-body-sm text-rta-text-secondary">{selectedEntry.role} · {selectedEntry.department}</p>
                    <Badge variant="outline" className="mt-2 border-rta-border text-rta-text">{selectedEntry.payStatus}</Badge>
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
                  <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider mb-1">Net pay</p>
                  <p className="text-2xl font-bold text-rta-text tabular-nums">
                    {formatAmount(selectedEntry.payAmount, selectedEntry.currency)}
                  </p>
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Pay details</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-body-sm">
                    <div><dt className="text-rta-text-secondary">Country</dt><dd className="text-rta-text font-medium">{selectedEntry.country}</dd></div>
                    <div><dt className="text-rta-text-secondary">Pay period</dt><dd className="text-rta-text">{selectedEntry.payPeriod}</dd></div>
                    <div><dt className="text-rta-text-secondary">Pay date</dt><dd className="text-rta-text">{new Date(selectedEntry.payDate).toLocaleDateString()}</dd></div>
                    <div><dt className="text-rta-text-secondary">Method</dt><dd className="text-rta-text">{selectedEntry.payMethod}</dd></div>
                    <div><dt className="text-rta-text-secondary">Type</dt><dd className="text-rta-text">{selectedEntry.payType}</dd></div>
                    <div><dt className="text-rta-text-secondary">Frequency</dt><dd className="text-rta-text">{selectedEntry.payFrequency}</dd></div>
                    <div><dt className="text-rta-text-secondary">Gross</dt><dd className="text-rta-text tabular-nums">{formatAmount(selectedEntry.grossAmount, selectedEntry.currency)}</dd></div>
                    <div><dt className="text-rta-text-secondary">Taxes</dt><dd className="text-rta-text tabular-nums">{formatAmount(selectedEntry.taxes, selectedEntry.currency)}</dd></div>
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

export default function PayrollPage() {
  const { presentationMode } = useDashboardPresentation();

  if (presentationMode) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
        <Card className="border-rta-border bg-white shadow-card max-w-md">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-rta-text">Payroll is hidden in presentation mode.</p>
            <p className="text-body-sm text-rta-text-secondary mt-1">Turn off presentation mode in the header to view payroll.</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RequirePayroll>
      <PayrollContent />
    </RequirePayroll>
  );
}
