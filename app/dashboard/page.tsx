'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Loader2, ExternalLink, BarChart3, Wallet, ChevronRight, X, Users, Package, Building2, FileText, Truck, Calendar, CreditCard, Trophy, LayoutGrid, Receipt, PieChart, UserCircle, Link2 } from 'lucide-react';
import Link from 'next/link';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';
import { StageChart } from '@/components/dashboard/StageChart';
import { TopCustomersChart } from '@/components/dashboard/TopCustomersChart';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { TopSalespeopleChart } from '@/components/dashboard/TopSalespeopleChart';
import { getStageBadgeClass } from '@/lib/stage-colors';
import type { RoleCapabilities } from '@/lib/dashboard-roles';
import { useDashboardPresentation } from './DashboardPresentationContext';

type Opportunity = {
  id?: string;
  name: string;
  amount: number;
  currency: string;
  stage: string;
  subject?: string;
  accountName?: string;
  dealName?: string;
  contactName?: string;
  validTill?: string;
  quoteDate?: string;
  description?: string;
  paymentTerms?: string;
  deliveryTerms?: string;
  deliveryTime?: string;
  carrier?: string;
  billingCountry?: string;
  billingCity?: string;
  billingStreet?: string;
  subTotal?: number;
  tax?: number;
  discount?: number;
  adjustment?: number;
  exchangeRate?: number;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: string;
  modifiedBy?: string;
  termsAndConditions?: string;
  endCustomer?: string;
};

type TopCustomer = { name: string; value: number };
type TopProduct = { name: string; count: number };
type TopSalesperson = { name: string; quoted: number; closed: number };
type StageData = { stage: string; count: number; value: number };

type ZohoData = {
  opportunities: Opportunity[];
  winPercentage: number | null;
  topCustomers: TopCustomer[];
  topProducts: TopProduct[];
  topSalespeople: TopSalesperson[];
  stageDistribution: StageData[];
  error?: string;
};

const PERIODS = [
  { value: 'week', label: 'Past week' },
  { value: 'month', label: 'Past month' },
  { value: 'quarter', label: 'Past quarter' },
  { value: 'year', label: 'Past year' },
  { value: 'all', label: 'All time' },
] as const;

type XeroStatus = {
  connected: boolean;
  error?: string;
};

type XeroIssueCode = 'error' | 'config' | 'exchange' | 'preflight' | 'preflight_ok';

function getMedalRowClass(rank: number): string {
  if (rank === 1) return 'bg-amber-50/60';
  if (rank === 2) return 'bg-rta-bg-light/60';
  if (rank === 3) return 'bg-amber-100/50';
  return '';
}

function getMedalBorderClass(rank: number): string {
  if (rank === 1) return 'border-l-4 border-l-amber-500';
  if (rank === 2) return 'border-l-4 border-l-rta-border';
  if (rank === 3) return 'border-l-4 border-l-amber-700';
  return '';
}

function getMedalBadgeClass(rank: number): string {
  if (rank === 1) return 'bg-amber-500/15 text-amber-800 border-amber-300 font-bold';
  if (rank === 2) return 'bg-rta-bg-light text-rta-text-secondary border-rta-border font-bold';
  if (rank === 3) return 'bg-amber-700/15 text-amber-900 border-amber-600 font-semibold';
  return 'bg-rta-bg-light text-rta-text-secondary';
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (value == null || value === '') return null;
  return (
    <div>
      <p className="text-rta-text-secondary text-xs font-medium">{label}</p>
      <p className="text-rta-text font-medium truncate text-body-sm" title={value}>{value}</p>
    </div>
  );
}

function formatAmount(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const { presentationMode } = useDashboardPresentation();
  const [zoho, setZoho] = useState<ZohoData>({
    opportunities: [],
    winPercentage: null,
    topCustomers: [],
    topProducts: [],
    topSalespeople: [],
    stageDistribution: [],
  });
  const [xero, setXero] = useState<XeroStatus>({ connected: false });
  const [capabilities, setCapabilities] = useState<RoleCapabilities | null>(null);
  const [zohoLoading, setZohoLoading] = useState(true);
  const [xeroLoading, setXeroLoading] = useState(true);
  const [period, setPeriod] = useState<string>('all');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [xeroInstructionOpen, setXeroInstructionOpen] = useState(false);
  const [xeroIssueCode, setXeroIssueCode] = useState<XeroIssueCode | null>(null);
  const [xeroErrorDetail, setXeroErrorDetail] = useState('');
  const [xeroErrorDescription, setXeroErrorDescription] = useState('');
  const [xeroRedirectUri, setXeroRedirectUri] = useState('');
  const [xeroConnectLoading, setXeroConnectLoading] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/me')
      .then((res) => (res.ok ? res.json() : { capabilities: null }))
      .then((data) => setCapabilities(data?.capabilities ?? null))
      .catch(() => setCapabilities(null));
  }, []);

  useEffect(() => {
    setZohoLoading(true);
    fetch(`/api/zoho/opportunities?period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        setZoho({
          opportunities: data.opportunities ?? [],
          winPercentage: data.winPercentage ?? null,
          topCustomers: data.topCustomers ?? [],
          topProducts: data.topProducts ?? [],
          topSalespeople: data.topSalespeople ?? [],
          stageDistribution: data.stageDistribution ?? [],
          error: data.error,
        });
      })
      .catch(() =>
        setZoho({
          opportunities: [],
          winPercentage: null,
          topCustomers: [],
          topProducts: [],
          topSalespeople: [],
          stageDistribution: [],
          error: 'Failed to load',
        })
      )
      .finally(() => setZohoLoading(false));
  }, [period]);

  useEffect(() => {
    fetch('/api/xero/status')
      .then((res) => res.json())
      .then((data) => {
        setXero({ connected: data.connected === true, error: data.error });
      })
      .catch(() => setXero({ connected: false, error: 'Failed to load' }))
      .finally(() => setXeroLoading(false));
  }, []);

  useEffect(() => {
    const issue = searchParams.get('xero');
    const errorDetail = searchParams.get('xero_error') || '';
    const errorDescription = searchParams.get('xero_error_description') || '';
    if (!issue) return;
    if (issue === 'error' || issue === 'config' || issue === 'exchange') {
      setXeroIssueCode(issue);
      setXeroErrorDetail(errorDetail);
      setXeroErrorDescription(errorDescription);
      setXeroInstructionOpen(true);
      // Get the exact redirect URI that the server will use for OAuth.
      void (async () => {
        try {
          const preflight = await fetch('/api/xero/preflight');
          const data = (await preflight.json()) as { redirectUri?: string };
          setXeroRedirectUri(data.redirectUri || `${window.location.origin}/api/xero/callback`);
        } catch {
          setXeroRedirectUri(`${window.location.origin}/api/xero/callback`);
        }
      })();
    }
    const url = new URL(window.location.href);
    url.searchParams.delete('xero');
    url.searchParams.delete('xero_error');
    url.searchParams.delete('xero_error_description');
    window.history.replaceState({}, '', url.toString());
  }, [searchParams]);

  const proceedToXeroAuth = () => {
    setXeroInstructionOpen(false);
    window.location.assign('/api/xero/auth');
  };

  const connectToXero = async () => {
    setXeroConnectLoading(true);
    try {
      const preflight = await fetch('/api/xero/preflight');
      const data = (await preflight.json()) as {
        ok?: boolean;
        code?: string;
        redirectUri?: string;
      };
      if (!preflight.ok || data.ok !== true) {
        setXeroIssueCode('preflight');
        setXeroRedirectUri(data.redirectUri || `${window.location.origin}/api/xero/callback`);
        setXeroInstructionOpen(true);
        return;
      }
      setXeroIssueCode('preflight_ok');
      setXeroRedirectUri(data.redirectUri || `${window.location.origin}/api/xero/callback`);
      setXeroInstructionOpen(true);
    } catch {
      setXeroIssueCode('preflight');
      setXeroRedirectUri(`${window.location.origin}/api/xero/callback`);
      setXeroInstructionOpen(true);
    } finally {
      setXeroConnectLoading(false);
    }
  };

  const xeroIssueText: Record<XeroIssueCode, string> = {
    error: 'Xero returned an OAuth error before authorization completed.',
    config: 'Xero credentials are not configured on this deployment.',
    exchange: 'Authorization succeeded but token exchange failed (usually redirect URI mismatch).',
    preflight: 'Pre-check failed. Your customer likely needs to update the Xero app redirect URI for this domain.',
    preflight_ok: 'Confirm the redirect URI below matches your customer’s Xero app settings, then proceed.',
  };

  const isUsd = (o: { currency?: string }) => (o.currency || 'USD').toUpperCase() === 'USD';
  const activeOpps = zoho.opportunities.filter((o) => {
    const s = o.stage.toLowerCase();
    return !s.includes('lost') && !s.includes('won');
  });
  const activeUsdValue = activeOpps.filter(isUsd).reduce((sum, o) => sum + (o.amount || 0), 0);
  const pipelineUsdValue = zoho.opportunities.filter(isUsd).reduce((sum, o) => sum + (o.amount || 0), 0);
  const hasMultipleCurrencies =
    new Set(zoho.opportunities.map((o) => (o.currency || 'USD').toUpperCase())).size > 1;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-h3 font-bold text-rta-blue">Dashboard</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Pipeline and finance overview from Zoho CRM and Xero</p>
      </div>

      {/* Quick access */}
      <Card className="mb-6 lg:mb-8 border-rta-border bg-white shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-text">
            <LayoutGrid className="w-4 h-4 text-rta-blue" />
            Quick access
          </CardTitle>
          <p className="text-body-sm text-rta-text-secondary">Jump to the most important areas</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {capabilities?.canSeeMasterFinancials && (
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
                <Link href="/dashboard/finances" className="inline-flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Finances
                </Link>
              </Button>
            )}
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
                <Link href="/dashboard/quote-to-cash" className="inline-flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Quote-to-cash
                </Link>
              </Button>
            {capabilities?.canSeeMasterFinancials && (
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
                <Link href="/dashboard/receivables" className="inline-flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Receivables
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
              <Link href="/dashboard/customers" className="inline-flex items-center gap-2">
                <Users className="w-4 h-4" />
                Customers
              </Link>
            </Button>
            {capabilities?.canSeePayroll && !presentationMode && (
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
                <Link href="/dashboard/payroll" className="inline-flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Payroll
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
              <Link href="/dashboard/sales-forecast" className="inline-flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Sales forecast
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
              <Link href="/dashboard/sales-leaderboard" className="inline-flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Salesperson leaderboard
              </Link>
            </Button>
            {capabilities?.canSeeHrm && !presentationMode && (
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
                <Link href="/dashboard/hrm" className="inline-flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  HRM System
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPI cards - top spotlight */}
      {!zohoLoading && !zoho.error && zoho.opportunities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-8">
          {zoho.winPercentage != null && (
            <Card className="border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
              <CardContent className="relative pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rta-blue/90 to-rta-blue text-white shadow-sm">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-body-sm text-rta-text-secondary font-medium">Win rate</p>
                    <p className="text-2xl font-bold text-rta-text tabular-nums">
                      <AnimatedNumber value={zoho.winPercentage} format={(n) => `${n}%`} duration={600} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rta-text to-rta-text-secondary text-white shadow-sm">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-body-sm text-rta-text-secondary font-medium">Active pipeline</p>
                  <p className="text-2xl font-bold text-rta-text tabular-nums">
                    <AnimatedNumber
                      value={activeUsdValue}
                      format={(n) => formatAmount(n, 'USD')}
                      duration={800}
                    />
                  </p>
                  <p className="text-body-sm text-rta-text-light">
                    <AnimatedNumber value={activeOpps.length} duration={600} /> active
                    {hasMultipleCurrencies ? ' · mixed currencies' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
            <CardContent className="relative pt-6 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-sm">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-body-sm text-rta-text-secondary font-medium">Pipeline total</p>
                  <p className="text-2xl font-bold text-rta-text tabular-nums">
                    <AnimatedNumber
                      value={pipelineUsdValue}
                      format={(n) => formatAmount(n, 'USD')}
                      duration={800}
                    />
                  </p>
                  {hasMultipleCurrencies && (
                    <p className="text-body-sm text-rta-text-light">USD equivalent shown</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top opportunities - primary focus */}
      <Card className="mb-6 lg:mb-8 border-rta-border bg-white shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-rta-text">
                <TrendingUp className="w-5 h-5 text-rta-blue" />
                Top opportunities
              </CardTitle>
              <p className="text-body-sm text-rta-text-secondary mt-1">From Zoho CRM. Click a row for details</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PERIODS.map((p) => (
                <Button
                  key={p.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setPeriod(p.value)}
                  className={period === p.value ? 'bg-rta-blue text-white border-rta-blue hover:bg-rta-blue-hover' : 'border-rta-border text-rta-text-secondary hover:bg-rta-bg-light'}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {zohoLoading ? (
            <div className="flex items-center gap-2 py-16 text-rta-text-secondary justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-body-sm">Loading opportunities…</span>
            </div>
          ) : zoho.error ? (
            <div className="py-8 px-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-body-sm text-red-700 font-medium">{zoho.error}</p>
              <p className="text-body-sm text-rta-text-secondary mt-1">Check Zoho credentials in .env.local</p>
            </div>
          ) : zoho.opportunities.length === 0 ? (
            <div className="py-16 text-center text-rta-text-secondary">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-body-sm font-medium">No opportunities returned</p>
              <p className="text-body-sm mt-1">Configure Zoho CRM credentials and refresh</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-rta-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">#</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Opportunity</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Stage</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Currency</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Value</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {zoho.opportunities.map((opp, i) => {
                    const rank = i + 1;
                    const isMedal = rank <= 3;
                    return (
                    <tr
                      key={opp.id ?? i}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelectedOpp(opp);
                        setDetailOpen(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedOpp(opp);
                          setDetailOpen(true);
                        }
                      }}
                      className={`group border-b border-rta-border last:border-0 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rta-blue focus:ring-inset hover:bg-rta-bg-light ${isMedal ? getMedalRowClass(rank) : ''}`}
                    >
                      <td className={`px-4 py-3 ${isMedal ? getMedalBorderClass(rank) : ''}`}>
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-body-sm font-semibold ${isMedal ? getMedalBadgeClass(rank) : 'bg-rta-bg-light text-rta-text-secondary'}`}>
                          {rank}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-body-sm font-medium text-rta-text">{opp.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={getStageBadgeClass(opp.stage)}>
                          {opp.stage}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-rta-text-secondary font-medium">
                        {opp.currency || 'USD'}
                      </td>
                      <td className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right tabular-nums">
                        {formatAmount(opp.amount, opp.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="w-4 h-4 text-rta-text-light group-hover:text-rta-text-secondary transition-colors" />
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics: Top customers, products, stage distribution */}
      {!zohoLoading && !zoho.error && (zoho.topCustomers.length > 0 || zoho.topProducts.length > 0 || zoho.topSalespeople.length > 0 || zoho.stageDistribution.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6 lg:mb-8">
          {zoho.topCustomers.length > 0 && (
            <Card className="border-rta-border bg-white shadow-card">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-text">
                  <Users className="w-4 h-4 text-rta-blue" />
                  Top customers by value
                </CardTitle>
                <p className="text-body-sm text-rta-text-secondary">Total quote value per account</p>
              </CardHeader>
              <CardContent className="pt-2">
                <TopCustomersChart
                  data={zoho.topCustomers}
                  formatValue={(n) => formatAmount(n, 'USD')}
                />
              </CardContent>
            </Card>
          )}
          {zoho.stageDistribution.length > 0 && (
            <Card className="border-rta-border bg-white shadow-card">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-text">
                  <BarChart3 className="w-4 h-4 text-rta-blue" />
                  Pipeline by stage
                </CardTitle>
                <p className="text-body-sm text-rta-text-secondary">Value share per stage</p>
              </CardHeader>
              <CardContent className="pt-2">
                <StageChart
                  data={zoho.stageDistribution}
                  formatValue={(n) => formatAmount(n, 'USD')}
                />
              </CardContent>
            </Card>
          )}
          <Card className="border-rta-border bg-white shadow-card">
            <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-text">
                  <Trophy className="w-4 h-4 text-rta-blue" />
                  Top salespeople
                </CardTitle>
                <p className="text-body-sm text-rta-text-secondary">Ranked by closed value</p>
            </CardHeader>
            <CardContent className="pt-2">
              {zoho.topSalespeople.length > 0 ? (
                <TopSalespeopleChart
                  data={zoho.topSalespeople}
                  formatValue={(n) => formatAmount(n, 'USD')}
                />
              ) : (
                <div className="py-8 text-center">
                  <Trophy className="w-10 h-10 mx-auto mb-2 text-rta-text-light" />
                  <p className="text-body-sm text-rta-text-secondary">No data in this period</p>
                  <p className="text-body-sm text-rta-text-light mt-0.5">Uses Created By from each opportunity</p>
                </div>
              )}
            </CardContent>
          </Card>
          {zoho.topProducts.length > 0 && (
            <Card className="border-rta-border bg-white shadow-card">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-text">
                  <Package className="w-4 h-4 text-rta-blue" />
                  Top products
                </CardTitle>
                <p className="text-body-sm text-rta-text-secondary">By quoted quantity</p>
              </CardHeader>
              <CardContent className="pt-2">
                <TopProductsChart data={zoho.topProducts} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Opportunity detail modal */}
      {detailOpen && selectedOpp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
          onClick={() => setDetailOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-rta-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero header */}
            <div className="relative bg-gradient-to-br from-rta-bg-light via-white to-rta-bg-blue/30 pt-6 pb-6 px-6 border-b border-rta-border">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rta-blue/5 rounded-bl-full" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <h2 id="detail-title" className="text-xl font-bold text-rta-text mb-2 pr-8">
                    {selectedOpp.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={`${getStageBadgeClass(selectedOpp.stage)} font-medium`}>
                      {selectedOpp.stage}
                    </Badge>
                    <span className="text-body-sm text-rta-text-secondary">{selectedOpp.currency}</span>
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
                <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider mb-1">Total value</p>
                <p className="text-2xl font-bold text-rta-text tabular-nums">
                  {formatAmount(selectedOpp.amount, selectedOpp.currency)}
                </p>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5">
              {selectedOpp.subject && selectedOpp.subject !== selectedOpp.name && (
                <DetailRow label="Subject" value={selectedOpp.subject} />
              )}

              {/* Account & contacts card */}
              {(selectedOpp.accountName || selectedOpp.dealName || selectedOpp.contactName || selectedOpp.endCustomer) && (
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Account & contacts</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedOpp.accountName && <DetailRow label="Account" value={selectedOpp.accountName} />}
                    {selectedOpp.dealName && <DetailRow label="Deal" value={selectedOpp.dealName} />}
                    {selectedOpp.contactName && <DetailRow label="Contact" value={selectedOpp.contactName} />}
                    {selectedOpp.endCustomer && <DetailRow label="End customer" value={selectedOpp.endCustomer} />}
                  </div>
                </div>
              )}

              {/* Financial card */}
              <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-rta-blue" />
                  <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Financial</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {selectedOpp.amount != null && <DetailRow label="Grand total" value={formatAmount(selectedOpp.amount, selectedOpp.currency)} />}
                  {selectedOpp.subTotal != null && <DetailRow label="Sub total" value={formatAmount(selectedOpp.subTotal, selectedOpp.currency)} />}
                  {selectedOpp.tax != null && selectedOpp.tax !== 0 && <DetailRow label="Tax" value={formatAmount(selectedOpp.tax, selectedOpp.currency)} />}
                  {selectedOpp.discount != null && selectedOpp.discount !== 0 && <DetailRow label="Discount" value={formatAmount(selectedOpp.discount, selectedOpp.currency)} />}
                  {selectedOpp.adjustment != null && selectedOpp.adjustment !== 0 && <DetailRow label="Adjustment" value={formatAmount(selectedOpp.adjustment, selectedOpp.currency)} />}
                  {selectedOpp.exchangeRate != null && <DetailRow label="Exchange rate" value={String(selectedOpp.exchangeRate)} />}
                </div>
              </div>

              {/* Delivery & terms card */}
              {(selectedOpp.paymentTerms || selectedOpp.deliveryTerms || selectedOpp.deliveryTime || selectedOpp.carrier) && (
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Delivery & terms</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {selectedOpp.paymentTerms && <DetailRow label="Payment terms" value={selectedOpp.paymentTerms} />}
                    {selectedOpp.deliveryTerms && <DetailRow label="Delivery terms" value={selectedOpp.deliveryTerms} />}
                    {selectedOpp.deliveryTime && <DetailRow label="Delivery time" value={selectedOpp.deliveryTime} />}
                    {selectedOpp.carrier && <DetailRow label="Carrier" value={selectedOpp.carrier} />}
                  </div>
                </div>
              )}

              {(selectedOpp.billingStreet || selectedOpp.billingCity || selectedOpp.billingCountry) && (
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider mb-2">Billing address</p>
                  <p className="text-body-sm text-rta-text">
                    {[selectedOpp.billingStreet, selectedOpp.billingCity, selectedOpp.billingCountry].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {/* Dates card */}
              {(selectedOpp.quoteDate || selectedOpp.validTill || selectedOpp.createdAt || selectedOpp.modifiedAt) && (
                <div className="rounded-lg bg-rta-bg-light/80 border border-rta-border/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Dates</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {selectedOpp.quoteDate && <DetailRow label="Quote date" value={new Date(selectedOpp.quoteDate).toLocaleDateString()} />}
                    {selectedOpp.validTill && <DetailRow label="Valid until" value={new Date(selectedOpp.validTill).toLocaleDateString()} />}
                    {selectedOpp.createdAt && <DetailRow label="Created" value={new Date(selectedOpp.createdAt).toLocaleString()} />}
                    {selectedOpp.modifiedAt && <DetailRow label="Modified" value={new Date(selectedOpp.modifiedAt).toLocaleString()} />}
                  </div>
                </div>
              )}

              {(selectedOpp.createdBy || selectedOpp.modifiedBy) && (
                <div className="flex flex-wrap gap-4 text-body-sm">
                  {selectedOpp.createdBy && <DetailRow label="Created by" value={selectedOpp.createdBy} />}
                  {selectedOpp.modifiedBy && <DetailRow label="Modified by" value={selectedOpp.modifiedBy} />}
                </div>
              )}

              {selectedOpp.description && (
                <div className="rounded-lg bg-rta-bg-light/50 border border-rta-border/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Description</p>
                  </div>
                  <p className="text-body-sm text-rta-text whitespace-pre-wrap leading-relaxed">{selectedOpp.description}</p>
                </div>
              )}
              {selectedOpp.termsAndConditions && (
                <div className="rounded-lg bg-rta-bg-light/50 border border-rta-border/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Terms & conditions</p>
                  </div>
                  <p className="text-body-sm text-rta-text whitespace-pre-wrap leading-relaxed">{selectedOpp.termsAndConditions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {xeroInstructionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm"
          onClick={() => setXeroInstructionOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="xero-fix-title"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-rta-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-rta-bg-light border-b border-rta-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="xero-fix-title" className="text-lg font-bold text-rta-text">
                    Xero connection needs reconfiguration
                  </h2>
                  <p className="text-body-sm text-rta-text-secondary mt-1">
                    {xeroIssueCode ? xeroIssueText[xeroIssueCode] : 'Connection could not be completed.'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setXeroInstructionOpen(false)}
                  className="rounded-full shrink-0 hover:bg-black/5 text-rta-text-secondary"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {(xeroErrorDetail || xeroErrorDescription) && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                  <p className="text-body-sm font-semibold text-amber-900">Xero error details</p>
                  {xeroErrorDetail && (
                    <p className="text-body-sm text-amber-900 mt-1">
                      <span className="font-medium">Error:</span> {xeroErrorDetail}
                    </p>
                  )}
                  {xeroErrorDescription && (
                    <p className="text-body-sm text-amber-900 mt-1">
                      <span className="font-medium">Description:</span> {xeroErrorDescription}
                    </p>
                  )}
                </div>
              )}
              <p className="text-body-sm text-rta-text">
                {xeroIssueCode === 'preflight_ok'
                  ? 'If the redirect URI below matches, click proceed to start OAuth.'
                  : 'Ask your customer to update the Redirect URI in their Xero app, then try connecting again.'}
              </p>
              <div className="rounded-md border border-rta-border bg-white p-3">
                <p className="text-body-sm font-semibold text-rta-text mb-2">Use these exact Xero app settings</p>
                <ul className="space-y-1.5 text-body-sm text-rta-text">
                  <li>
                    <span className="font-medium">Integration type:</span> Web app
                  </li>
                  <li>
                    <span className="font-medium">Company or application URL:</span>{' '}
                    {typeof window !== 'undefined' ? window.location.origin : ''}
                  </li>
                  <li>
                    <span className="font-medium">OAuth 2.0 redirect URI:</span>
                  </li>
                </ul>
                <div className="mt-2 rounded-md border border-rta-border bg-rta-bg-light px-3 py-2 text-body-sm font-mono break-all text-rta-text">
                  {xeroRedirectUri || `${typeof window !== 'undefined' ? window.location.origin : ''}/api/xero/callback`}
                </div>
                <p className="mt-2 text-xs text-rta-text-secondary">
                  Must match exactly: protocol, domain, and path. No trailing slash.
                </p>
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-body-sm text-rta-text">
                <li>Open Xero Developer Portal and create/edit the app.</li>
                <li>Set Integration type to Web app.</li>
                <li>Set Company or application URL to your live domain.</li>
                <li>Set OAuth 2.0 redirect URI to the value shown above.</li>
              </ol>
              <ol className="list-decimal pl-5 space-y-2 text-body-sm text-rta-text" start={3}>
                {xeroIssueCode === 'preflight_ok' ? (
                  <>
                    <li>Verify the redirect URI in Xero matches exactly.</li>
                    <li>Click Proceed to Xero.</li>
                  </>
                ) : (
                  <>
                    <li>Save changes in Xero Developer Portal.</li>
                    <li>Return here and click Connect to Xero again.</li>
                  </>
                )}
              </ol>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  className="bg-rta-blue hover:bg-rta-blue-hover text-white"
                  onClick={() => {
                    if (xeroIssueCode === 'preflight_ok') {
                      proceedToXeroAuth();
                      return;
                    }
                    setXeroInstructionOpen(false);
                    void connectToXero();
                  }}
                  disabled={xeroConnectLoading}
                >
                  {xeroConnectLoading ? 'Checking…' : xeroIssueCode === 'preflight_ok' ? 'Proceed to Xero' : 'Try connect again'}
                </Button>
                <Button
                  variant="outline"
                  className="border-rta-border text-rta-text"
                  onClick={() => setXeroInstructionOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Xero */}
      {capabilities?.canSeeMasterFinancials && (
      <Card className="border-rta-border bg-white shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-rta-text">
            <DollarSign className="w-5 h-5 text-rta-blue" />
            Xero
          </CardTitle>
          <p className="text-body-sm text-rta-text-secondary mt-1">Connect to view invoices and finance data</p>
        </CardHeader>
        <CardContent>
          {xeroLoading ? (
            <div className="flex items-center gap-2 py-8 text-rta-text-secondary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-body-sm">Checking connection…</span>
            </div>
          ) : xero.error ? (
            <p className="text-body-sm text-red-600 mb-4">{xero.error}</p>
          ) : null}
          {!xeroLoading && (
            xero.connected ? (
              <div className="flex items-center gap-3 py-4 px-4 rounded-lg bg-rta-bg-blue/50 border border-rta-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rta-bg-blue">
                  <DollarSign className="h-5 w-5 text-rta-blue" />
                </div>
                <div>
                  <p className="font-semibold text-rta-text">Xero connected</p>
                  <p className="text-body-sm text-rta-text-secondary">Invoices and other data will appear here.</p>
                </div>
              </div>
            ) : (
              <Button
                className="bg-rta-blue hover:bg-rta-blue-hover text-white"
                onClick={() => {
                  void connectToXero();
                }}
                disabled={xeroConnectLoading}
              >
                <span className="inline-flex items-center gap-2">
                  Connect to Xero (Setup Guide)
                  <ExternalLink className="w-4 h-4" />
                </span>
              </Button>
            )
          )}
        </CardContent>
      </Card>
      )}
      </div>
    </div>
  );
}
