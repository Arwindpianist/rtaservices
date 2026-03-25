'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import {
  MOCK_FORECAST_12_MONTHS,
  MOCK_DEAL_FORECASTS,
  MOCK_CLOSING_STAGES,
  getCurrentQuarterForecast,
  type DealForecast,
} from '@/lib/mock-data/sales-forecast';

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export default function SalesForecastPage() {
  const [selectedDeal, setSelectedDeal] = useState<DealForecast | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const quarterForecast = getCurrentQuarterForecast();
  const quarterTotal = quarterForecast.reduce((s, m) => s + m.forecastedValue, 0);

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
        <h1 className="text-h3 font-bold text-rta-blue">Sales forecast</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Forecasted sales for the next 12 months, deal closing %, target closing month, current quarter, closing stages</p>

        <Card className="mt-6 mb-8 relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
          <CardHeader className="relative">
            <CardTitle className="text-base font-semibold text-rta-blue">Forecasted sales - next 12 months</CardTitle>
            <p className="text-body-sm text-rta-text-secondary">Monthly forecast (mock data)</p>
          </CardHeader>
          <CardContent className="relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Month</th>
                    {MOCK_FORECAST_12_MONTHS.map((m) => (
                      <th key={`${m.year}-${m.month}`} className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">
                        {m.month} {m.year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-rta-border">
                    <td className="px-4 py-3 text-body-sm font-medium text-rta-text">Forecast</td>
                    {MOCK_FORECAST_12_MONTHS.map((m) => (
                      <td key={`${m.year}-${m.month}`} className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">
                        {formatAmount(m.forecastedValue, m.currency)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardHeader className="relative">
              <CardTitle className="text-base font-semibold text-rta-blue">Current quarter summary</CardTitle>
              <p className="text-body-sm text-rta-text-secondary">Total forecasted: {formatAmount(quarterTotal)}</p>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-2">
                {quarterForecast.map((m) => (
                  <li key={`${m.year}-${m.month}`} className="flex justify-between text-body-sm">
                    <span className="text-rta-text-secondary">{m.month} {m.year}</span>
                    <span className="font-medium text-rta-text tabular-nums">{formatAmount(m.forecastedValue, m.currency)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardHeader className="relative">
              <CardTitle className="text-base font-semibold text-rta-blue">Deals - closing possibility & target month</CardTitle>
              <p className="text-body-sm text-rta-text-secondary">Click a row to view details</p>
            </CardHeader>
            <CardContent className="relative">
              <div className="overflow-x-auto rounded-md border border-rta-border">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-rta-bg-light border-b border-rta-border">
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Deal</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Amount</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Closing %</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Target month</th>
                      <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Stage</th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DEAL_FORECASTS.map((d) => (
                      <tr
                        key={d.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => { setSelectedDeal(d); setDetailOpen(true); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDeal(d); setDetailOpen(true); } }}
                        className="group/row border-b border-rta-border last:border-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rta-blue focus:ring-inset hover:bg-rta-bg-light"
                      >
                        <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{d.name}</td>
                        <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">{formatAmount(d.amount, d.currency)}</td>
                        <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">{d.closingPercentage}%</td>
                        <td className="px-4 py-3 text-body-sm text-rta-text-secondary">{d.targetClosingMonth}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-body-sm border-rta-border text-rta-text">{d.closingStage}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight className="w-4 h-4 text-rta-text-light group-hover/row:text-rta-text-secondary transition-colors" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
          <CardHeader className="relative">
            <CardTitle className="text-base font-semibold text-rta-blue">Closing stages</CardTitle>
            <p className="text-body-sm text-rta-text-secondary">Used in closing stages; determines if project can be considered closed in Zoho</p>
          </CardHeader>
          <CardContent className="relative">
            <div className="overflow-x-auto rounded-md border border-rta-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Stage</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Count</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CLOSING_STAGES.map((s) => (
                    <tr key={s.stage} className="border-b border-rta-border last:border-0">
                      <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{s.stage}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">{s.count}</td>
                      <td className="px-4 py-3 text-body-sm text-rta-text tabular-nums text-right">{formatAmount(s.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Deal detail modal */}
        {detailOpen && selectedDeal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
            onClick={() => setDetailOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="deal-detail-title"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-rta-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-rta-bg-light via-white to-rta-bg-blue/30 pt-6 pb-6 px-6 border-b border-rta-border">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rta-blue/5 rounded-bl-full" />
                <div className="relative flex items-start justify-between gap-4">
                  <h2 id="deal-detail-title" className="text-lg font-bold text-rta-text">
                    {selectedDeal.name}
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
                  <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider mb-1">Value</p>
                  <p className="text-2xl font-bold text-rta-text tabular-nums">
                    {formatAmount(selectedDeal.amount, selectedDeal.currency)}
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-2 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-rta-text-secondary">Closing possibility</span>
                  <span className="text-rta-text font-medium">{selectedDeal.closingPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rta-text-secondary">Target closing month</span>
                  <span className="text-rta-text">{selectedDeal.targetClosingMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rta-text-secondary">Stage</span>
                  <Badge variant="outline" className="border-rta-border text-rta-text">{selectedDeal.closingStage}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
