'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, FileText, Wallet, Building2, ArrowRight, Loader2, TrendingUp } from 'lucide-react';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';

function formatAmount(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

type Summary = { source: string; toPay: number; toReceive: number; claimsTotal: number; paymentsDue: number };

export default function FinancesPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/finances/summary')
      .then((res) => res.json())
      .then((data) =>
        setSummary({
          source: data.source || 'mock',
          toPay: data.toPay ?? 0,
          toReceive: data.toReceive ?? 0,
          claimsTotal: data.claimsTotal ?? 0,
          paymentsDue: data.paymentsDue ?? 0,
        })
      )
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !summary) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center">
        <div className="flex items-center gap-2 text-rta-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-body-sm">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <h1 className="text-h3 font-bold text-rta-blue">Finances</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Claims, payments, invoices, and account statements
          {summary.source === 'xero' && (
            <span className="ml-2 text-rta-blue font-medium">· Live from Xero</span>
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Invoices in (to pay)</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">
                <AnimatedNumber value={summary.toPay} format={(n) => formatAmount(n)} duration={600} />
              </p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Invoices out (to receive)</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">
                <AnimatedNumber value={summary.toReceive} format={(n) => formatAmount(n)} duration={600} />
              </p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Open claims</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">
                <AnimatedNumber value={summary.claimsTotal} format={(n) => formatAmount(n)} duration={600} />
              </p>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6">
              <p className="text-body-sm text-rta-text-secondary font-medium">Payments due / overdue</p>
              <p className="text-2xl font-bold text-rta-text tabular-nums mt-1">
                <AnimatedNumber value={summary.paymentsDue} format={(n) => formatAmount(n)} duration={600} />
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-blue">
                <Receipt className="w-4 h-4 text-rta-blue" />
                Claims
              </CardTitle>
              <p className="text-body-sm text-rta-text-secondary">From clients, vendor, staff</p>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light transition-colors">
                <Link href="/dashboard/finances/claims" className="inline-flex items-center gap-2">
                  View claims
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-blue">
                <Wallet className="w-4 h-4 text-rta-blue" />
                Payments
              </CardTitle>
              <p className="text-body-sm text-rta-text-secondary">Due, overdue, late, on time, early</p>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light transition-colors">
                <Link href="/dashboard/finances/payments" className="inline-flex items-center gap-2">
                  View payments
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-blue">
                <FileText className="w-4 h-4 text-rta-blue" />
                Invoices
              </CardTitle>
              <p className="text-body-sm text-rta-text-secondary">In (to pay) vs out (to receive); aging</p>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light transition-colors">
                <Link href="/dashboard/finances/invoices" className="inline-flex items-center gap-2">
                  View invoices
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-blue">
                <FileText className="w-4 h-4 text-rta-blue" />
                Bills
              </CardTitle>
              <p className="text-body-sm text-rta-text-secondary">Supplier bills (ACCPAY); due date, ageing</p>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light transition-colors">
                <Link href="/dashboard/finances/bills" className="inline-flex items-center gap-2">
                  View bills
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-blue">
                <Building2 className="w-4 h-4 text-rta-blue" />
                Account statements
              </CardTitle>
              <p className="text-body-sm text-rta-text-secondary">Customer, supplier, staff</p>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light transition-colors">
                <Link href="/dashboard/finances/statements" className="inline-flex items-center gap-2">
                  View statements
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-blue">
                <TrendingUp className="w-4 h-4 text-rta-blue" />
                Aged receivables
              </CardTitle>
              <p className="text-body-sm text-rta-text-secondary">To be invoiced, outstanding, expected cash</p>
            </CardHeader>
            <CardContent className="relative">
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light transition-colors">
                <Link href="/dashboard/receivables" className="inline-flex items-center gap-2">
                  View receivables
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
