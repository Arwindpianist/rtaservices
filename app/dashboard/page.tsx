'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Loader2, ExternalLink, BarChart3, Wallet, ChevronRight, X, Users, Package, Building2, FileText, Truck, Calendar, CreditCard, Trophy, LayoutGrid, Receipt, PieChart, UserCircle, Link2, Filter, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';
import { StageChart } from '@/components/dashboard/StageChart';
import { TopCustomersChart } from '@/components/dashboard/TopCustomersChart';
import { TopProductsChart } from '@/components/dashboard/TopProductsChart';
import { TopSalespeopleChart } from '@/components/dashboard/TopSalespeopleChart';
import { getStageBadgeClass } from '@/lib/stage-colors';
import type { RoleCapabilities } from '@/lib/dashboard-roles';
import { useDashboardPresentation } from './DashboardPresentationContext';
import { DashboardTableSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { cn } from '@/lib/utils';

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
  filterMeta?: {
    totalCount: number;
    filteredCount: number;
    stages: string[];
    currencies: string[];
    accounts: string[];
    owners: string[];
    creators: string[];
    billingCountries: string[];
    billingCities: string[];
  };
  error?: string;
};

const PERIODS = [
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'ytd', label: 'Year to Date' },
] as const;

type ZohoFilters = {
  search: string;
  stage: string;
  currency: string;
  account: string;
  createdBy: string;
  owner: string;
  billingCountry: string;
  billingCity: string;
  minAmount: string;
  maxAmount: string;
};

type XeroStatus = {
  connected: boolean;
  error?: string;
};

type XeroIssueCode = 'error' | 'config' | 'exchange' | 'preflight' | 'preflight_ok';
type ModulePermission = { level: 'none' | 'view' | 'edit' | 'admin'; enabled: boolean };
type ModulePermissions = Record<string, ModulePermission>;
type TableDensity = 'comfortable' | 'compact';

function getMedalRowClass(rank: number): string {
  if (rank === 1) return 'bg-rta-gold/10';
  if (rank === 2) return 'bg-rta-red/10';
  if (rank === 3) return 'bg-rta-blue/10';
  return '';
}

function getMedalBorderClass(rank: number): string {
  if (rank === 1) return 'border-l-2 border-l-rta-gold';
  if (rank === 2) return 'border-l-2 border-l-rta-red';
  if (rank === 3) return 'border-l-2 border-l-rta-blue';
  return '';
}

function getMedalBadgeClass(rank: number): string {
  if (rank === 1) return 'bg-rta-gold/15 text-rta-gold border-rta-gold/40 font-bold';
  if (rank === 2) return 'bg-rta-red/15 text-rta-red border-rta-red/45 font-bold';
  if (rank === 3) return 'bg-rta-blue/15 text-rta-blue border-rta-blue/45 font-semibold';
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

/** Blur + pulse live data during refetch so loading is obvious without replacing layout */
function DataRefreshVeil({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'transition-[filter,opacity] duration-300 ease-out',
          active &&
            'pointer-events-none select-none blur-[3px] opacity-[0.62] motion-safe:animate-pulse',
        )}
        aria-busy={active}
      >
        {children}
      </div>
      {active ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          <div className="absolute inset-0 bg-rta-card-bg/40 motion-safe:animate-pulse" />
          <div className="absolute left-4 right-4 top-4 h-2.5 rounded-md bg-rta-bg-light/85 opacity-80" />
          <div className="absolute left-4 top-10 h-2.5 w-3/5 max-w-md rounded-md bg-rta-bg-light/65 opacity-70" />
          <div className="absolute left-4 top-[4.5rem] h-2.5 w-2/5 max-w-sm rounded-md bg-rta-bg-light/50 opacity-60" />
        </div>
      ) : null}
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

/** Quote subject, or linked deal name, for table and summaries */
function getDealSubjectLine(opp: Opportunity): string {
  const sub = opp.subject?.trim();
  if (sub) return sub;
  const deal = opp.dealName?.trim();
  if (deal) return deal;
  return '—';
}

/** Account on the quote, or end customer when account is empty */
function getAccountLine(opp: Opportunity): string {
  const acct = opp.accountName?.trim();
  if (acct) return acct;
  const end = opp.endCustomer?.trim();
  if (end) return end;
  return '—';
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
  const [modulePermissions, setModulePermissions] = useState<ModulePermissions>({});
  /** In-flight Zoho request (initial or refresh) */
  const [zohoFetching, setZohoFetching] = useState(true);
  /** At least one fetch finished — enables stale-while-revalidate UX */
  const [zohoHasLoadedOnce, setZohoHasLoadedOnce] = useState(false);
  const [xeroLoading, setXeroLoading] = useState(true);
  const [period, setPeriod] = useState<string>('ytd');
  const [tableDensity, setTableDensity] = useState<TableDensity>('comfortable');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<ZohoFilters>({
    search: '',
    stage: '',
    currency: '',
    account: '',
    createdBy: '',
    owner: '',
    billingCountry: '',
    billingCity: '',
    minAmount: '',
    maxAmount: '',
  });
  const [debouncedFilters, setDebouncedFilters] = useState<ZohoFilters>(filters);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [xeroInstructionOpen, setXeroInstructionOpen] = useState(false);
  const [xeroIssueCode, setXeroIssueCode] = useState<XeroIssueCode | null>(null);
  const [xeroErrorDetail, setXeroErrorDetail] = useState('');
  const [xeroErrorDescription, setXeroErrorDescription] = useState('');
  const [xeroRedirectUri, setXeroRedirectUri] = useState('');
  const [xeroConnectLoading, setXeroConnectLoading] = useState(false);
  /** Network / refresh failure while keeping last good Zoho payload */
  const [zohoStaleWarning, setZohoStaleWarning] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedFilters(filters), 250);
    return () => window.clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    fetch('/api/dashboard/me')
      .then((res) => (res.ok ? res.json() : { capabilities: null }))
      .then((data) => {
        setCapabilities(data?.capabilities ?? null);
        setModulePermissions(data?.modulePermissions ?? {});
      })
      .catch(() => {
        setCapabilities(null);
        setModulePermissions({});
      });
  }, []);

  useEffect(() => {
    fetch('/api/dashboard/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const p = data?.settings?.defaultPeriod;
        const d = data?.settings?.tableDensity;
        if (p === 'this_week' || p === 'this_month' || p === 'this_quarter' || p === 'ytd') setPeriod(p);
        if (d === 'compact' || d === 'comfortable') setTableDensity(d);
      })
      .catch(() => {
        // keep defaults
      });
  }, []);

  useEffect(() => {
    setZohoFetching(true);
    const params = new URLSearchParams({ period });
    for (const [key, value] of Object.entries(debouncedFilters)) {
      if (value.trim()) {
        params.set(key, value.trim());
      }
    }
    const controller = new AbortController();
    fetch(`/api/zoho/opportunities?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setZohoStaleWarning(null);
        setZoho({
          opportunities: data.opportunities ?? [],
          winPercentage: data.winPercentage ?? null,
          topCustomers: data.topCustomers ?? [],
          topProducts: data.topProducts ?? [],
          topSalespeople: data.topSalespeople ?? [],
          stageDistribution: data.stageDistribution ?? [],
          filterMeta: data.filterMeta,
          error: data.error,
        });
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setZohoStaleWarning('Could not refresh data. Showing the last loaded results.');
      })
      .finally(() => {
        setZohoFetching(false);
        setZohoHasLoadedOnce(true);
      });
    return () => controller.abort();
  }, [period, debouncedFilters]);

  useEffect(() => {
    const xeroPerm = modulePermissions['dashboard.xero'];
    if (!xeroPerm || !xeroPerm.enabled || xeroPerm.level === 'none') {
      setXeroLoading(false);
      setXero({ connected: false });
      return;
    }
    fetch('/api/xero/status')
      .then((res) => res.json())
      .then((data) => {
        setXero({ connected: data.connected === true, error: data.error });
      })
      .catch(() => setXero({ connected: false, error: 'Failed to load' }))
      .finally(() => setXeroLoading(false));
  }, [modulePermissions]);

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
  const canUseModule = (key: string) => {
    const module = modulePermissions[key];
    if (!module) return false;
    return module.enabled && module.level !== 'none';
  };
  const rowPaddingClass = tableDensity === 'compact' ? 'py-2' : 'py-3';
  const displayedOpportunities = zoho.opportunities.slice(0, 10);
  const showInitialZohoPlaceholder = zohoFetching && !zohoHasLoadedOnce;
  const showZohoRefreshRow = zohoFetching && zohoHasLoadedOnce;
  const hasZohoTableRows = zoho.opportunities.length > 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-h3 font-bold text-rta-blue">Dashboard</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Pipeline and finance overview from Zoho CRM and Xero</p>
      </div>

      {zohoStaleWarning ? (
        <div
          className="mb-4 flex items-start gap-2 rounded-lg border border-rta-border bg-rta-card-bg px-3 py-2.5 text-body-sm text-rta-text-secondary"
          role="status"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rta-gold mt-0.5" aria-hidden />
          <span>{zohoStaleWarning}</span>
        </div>
      ) : null}
      {showZohoRefreshRow ? (
        <div
          className="mb-4 flex items-center gap-2 rounded-lg border border-rta-border bg-rta-card-bg px-3 py-2 text-body-sm text-rta-text-secondary shadow-sm motion-safe:animate-pulse"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 animate-spin shrink-0 text-rta-blue" aria-hidden />
          <span className="font-medium text-rta-text">Refreshing data…</span>
          <span className="hidden sm:inline text-rta-text-secondary">Details below are blurred until the update finishes.</span>
        </div>
      ) : null}

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
            {canUseModule('dashboard.finances') && (
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
            {canUseModule('dashboard.receivables') && (
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
            {canUseModule('tracking.quote_payments') && (
              <Button asChild variant="outline" size="sm" className="border-rta-border text-rta-text hover:bg-rta-bg-light">
                <Link href="/dashboard/quote-payments" className="inline-flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Quote Payments
                </Link>
              </Button>
            )}
            {canUseModule('dashboard.payroll') && !presentationMode && (
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
            {canUseModule('dashboard.hrm') && !presentationMode && (
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
      {!zoho.error && zoho.opportunities.length > 0 && (
        <DataRefreshVeil active={showZohoRefreshRow} className="mb-6 lg:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {zoho.winPercentage != null && (
            <Card className="border-rta-border bg-white shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300">
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
          <Card className="border-rta-border bg-white shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300">
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
          <Card className="border-rta-border bg-white shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300">
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
        </DataRefreshVeil>
      )}

      {/* KPI placeholders — only before first successful payload */}
      {showInitialZohoPlaceholder && !zoho.error && zoho.opportunities.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 lg:mb-8" aria-hidden>
          {[0, 1, 2].map((i) => (
            <Card key={i} className="border-rta-border bg-white shadow-card overflow-hidden">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-rta-bg-light animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-rta-bg-light animate-pulse" />
                    <div className="h-8 w-32 max-w-full rounded bg-rta-bg-light animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Top opportunities - primary focus */}
      <Card className="mb-6 lg:mb-8 border-rta-border bg-white shadow-card overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-rta-text">
                <TrendingUp className="w-5 h-5 text-rta-blue" />
                Top opportunities
              </CardTitle>
              <p className="text-body-sm text-rta-text-secondary mt-1">From Zoho CRM. Click a row for details</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdvancedOpen((prev) => !prev)}
                className={advancedOpen ? 'bg-rta-blue text-white border-rta-blue hover:bg-rta-blue-hover' : 'border-rta-border text-rta-text-secondary hover:bg-rta-bg-light'}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Filter className="w-4 h-4" />
                  Filters
                </span>
              </Button>
            </div>
          </div>
          {advancedOpen && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              <input
                className="h-9 rounded-md border border-rta-border px-3 text-sm"
                placeholder="Search all fields"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
              <select
                className="h-9 rounded-md border border-rta-border px-2 text-sm"
                value={filters.stage}
                onChange={(e) => setFilters((prev) => ({ ...prev, stage: e.target.value }))}
              >
                <option value="">All stages</option>
                {(zoho.filterMeta?.stages ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                className="h-9 rounded-md border border-rta-border px-2 text-sm"
                value={filters.currency}
                onChange={(e) => setFilters((prev) => ({ ...prev, currency: e.target.value }))}
              >
                <option value="">All currencies</option>
                {(zoho.filterMeta?.currencies ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                className="h-9 rounded-md border border-rta-border px-2 text-sm"
                value={filters.account}
                onChange={(e) => setFilters((prev) => ({ ...prev, account: e.target.value }))}
              >
                <option value="">All accounts</option>
                {(zoho.filterMeta?.accounts ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                className="h-9 rounded-md border border-rta-border px-2 text-sm"
                value={filters.createdBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, createdBy: e.target.value }))}
              >
                <option value="">All creators</option>
                {(zoho.filterMeta?.creators ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                className="h-9 rounded-md border border-rta-border px-2 text-sm"
                value={filters.owner}
                onChange={(e) => setFilters((prev) => ({ ...prev, owner: e.target.value }))}
              >
                <option value="">All owners</option>
                {(zoho.filterMeta?.owners ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                className="h-9 rounded-md border border-rta-border px-2 text-sm"
                value={filters.billingCountry}
                onChange={(e) => setFilters((prev) => ({ ...prev, billingCountry: e.target.value }))}
              >
                <option value="">All countries</option>
                {(zoho.filterMeta?.billingCountries ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                className="h-9 rounded-md border border-rta-border px-2 text-sm"
                value={filters.billingCity}
                onChange={(e) => setFilters((prev) => ({ ...prev, billingCity: e.target.value }))}
              >
                <option value="">All cities</option>
                {(zoho.filterMeta?.billingCities ?? []).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                className="h-9 rounded-md border border-rta-border px-3 text-sm"
                type="number"
                placeholder="Min amount"
                value={filters.minAmount}
                onChange={(e) => setFilters((prev) => ({ ...prev, minAmount: e.target.value }))}
              />
              <input
                className="h-9 rounded-md border border-rta-border px-3 text-sm"
                type="number"
                placeholder="Max amount"
                value={filters.maxAmount}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxAmount: e.target.value }))}
              />
              <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-rta-border text-rta-text-secondary hover:bg-rta-bg-light"
                  onClick={() =>
                    setFilters({
                      search: '',
                      stage: '',
                      currency: '',
                      account: '',
                      createdBy: '',
                      owner: '',
                      billingCountry: '',
                      billingCity: '',
                      minAmount: '',
                      maxAmount: '',
                    })
                  }
                >
                  Clear filters
                </Button>
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-rta-text-secondary">
            Showing top {displayedOpportunities.length} of {zoho.filterMeta?.filteredCount ?? zoho.opportunities.length} records.
          </p>
        </CardHeader>
        <CardContent className="rounded-b-xl">
          <DataRefreshVeil active={showZohoRefreshRow}>
          {showInitialZohoPlaceholder && !zoho.error ? (
            <div className="py-2">
              <p className="text-body-sm text-rta-text-secondary mb-3">Loading opportunities…</p>
              <DashboardTableSkeleton rows={8} />
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
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Quote</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text min-w-[140px]">Deal / subject</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text min-w-[140px]">Account</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Stage</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Currency</th>
                    <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Value</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {displayedOpportunities.map((opp, i) => {
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
                      <td className={`px-4 ${rowPaddingClass} ${isMedal ? getMedalBorderClass(rank) : ''}`}>
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-body-sm font-semibold ${isMedal ? getMedalBadgeClass(rank) : 'bg-rta-bg-light text-rta-text-secondary'}`}>
                          {rank}
                        </span>
                      </td>
                      <td className={`px-4 ${rowPaddingClass} text-body-sm font-medium text-rta-text whitespace-nowrap`}>{opp.name}</td>
                      <td className={`px-4 ${rowPaddingClass} text-body-sm text-rta-text max-w-[220px]`}>
                        <span className="line-clamp-2" title={getDealSubjectLine(opp)}>{getDealSubjectLine(opp)}</span>
                      </td>
                      <td className={`px-4 ${rowPaddingClass} text-body-sm text-rta-text-secondary max-w-[200px]`}>
                        <span className="line-clamp-2" title={getAccountLine(opp)}>{getAccountLine(opp)}</span>
                      </td>
                      <td className={`px-4 ${rowPaddingClass}`}>
                        <Badge variant="outline" className={getStageBadgeClass(opp.stage)}>
                          {opp.stage}
                        </Badge>
                      </td>
                      <td className={`px-4 ${rowPaddingClass} text-body-sm text-rta-text-secondary font-medium`}>
                        {opp.currency || 'USD'}
                      </td>
                      <td className={`px-4 ${rowPaddingClass} text-body-sm font-semibold text-rta-text text-right tabular-nums`}>
                        {formatAmount(opp.amount, opp.currency)}
                      </td>
                      <td className={`px-4 ${rowPaddingClass}`}>
                        <ChevronRight className="w-4 h-4 text-rta-text-light group-hover:text-rta-text-secondary transition-colors" />
                      </td>
                    </tr>
                  );})}
                </tbody>
              </table>
            </div>
          )}
          </DataRefreshVeil>
        </CardContent>
      </Card>

      {/* Analytics: Top customers, products, stage distribution */}
      {!zoho.error && (zoho.topCustomers.length > 0 || zoho.topProducts.length > 0 || zoho.topSalespeople.length > 0 || zoho.stageDistribution.length > 0) && (
        <DataRefreshVeil active={showZohoRefreshRow} className="mb-6 lg:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
        </DataRefreshVeil>
      )}

      {/* Opportunity detail modal */}
      {detailOpen && selectedOpp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
          onClick={() => setDetailOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
        >
          <div
            className="bg-rta-card-bg rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-rta-border flex flex-col text-rta-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — tokenized surfaces only (no light gradients) */}
            <div className="relative border-b border-rta-border bg-rta-bg-light pt-6 pb-6 px-6">
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 id="detail-title" className="text-xl font-bold text-rta-text mb-1 pr-8 break-words">
                    {selectedOpp.name}
                  </h2>
                  {(getDealSubjectLine(selectedOpp) !== '—' || getAccountLine(selectedOpp) !== '—') && (
                    <p className="text-body-sm text-rta-text-secondary line-clamp-2 mt-1">
                      {[getDealSubjectLine(selectedOpp), getAccountLine(selectedOpp)].filter((s) => s !== '—').join(' · ')}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Badge variant="outline" className={`${getStageBadgeClass(selectedOpp.stage)} font-medium border-rta-border`}>
                      {selectedOpp.stage}
                    </Badge>
                    <span className="text-body-sm font-medium text-rta-text">{selectedOpp.currency}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDetailOpen(false)}
                  className="rounded-full shrink-0 text-rta-text hover:bg-rta-blue/15 hover:text-rta-text"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="relative mt-4 pt-4 border-t border-rta-border">
                <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider mb-1">Total value</p>
                <p className="text-2xl font-bold text-rta-text tabular-nums">
                  {formatAmount(selectedOpp.amount, selectedOpp.currency)}
                </p>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="opp-detail-scroll overflow-y-auto flex-1 p-6 space-y-5 min-h-0">
              {selectedOpp.subject && selectedOpp.subject !== selectedOpp.name && (
                <DetailRow label="Subject" value={selectedOpp.subject} />
              )}

              {/* Account & contacts card */}
              {(selectedOpp.accountName || selectedOpp.dealName || selectedOpp.contactName || selectedOpp.endCustomer) && (
                <div className="rounded-lg border border-rta-border bg-rta-bg-light p-4">
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
              <div className="rounded-lg border border-rta-border bg-rta-bg-light p-4">
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
                <div className="rounded-lg border border-rta-border bg-rta-bg-light p-4">
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
                <div className="rounded-lg border border-rta-border bg-rta-bg-light p-4">
                  <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider mb-2">Billing address</p>
                  <p className="text-body-sm text-rta-text">
                    {[selectedOpp.billingStreet, selectedOpp.billingCity, selectedOpp.billingCountry].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {/* Dates card */}
              {(selectedOpp.quoteDate || selectedOpp.validTill || selectedOpp.createdAt || selectedOpp.modifiedAt) && (
                <div className="rounded-lg border border-rta-border bg-rta-bg-light p-4">
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
                <div className="rounded-lg border border-rta-border bg-rta-bg-light p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-rta-blue" />
                    <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Description</p>
                  </div>
                  <p className="text-body-sm text-rta-text whitespace-pre-wrap leading-relaxed">{selectedOpp.description}</p>
                </div>
              )}
              {selectedOpp.termsAndConditions && (
                <div className="rounded-lg border border-rta-border bg-rta-bg-light p-4">
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
      {canUseModule('dashboard.xero') && (
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
            <div className="py-4 space-y-3" aria-busy aria-label="Checking Xero connection">
              <div className="flex items-center gap-2 text-body-sm text-rta-text-secondary">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Checking connection…</span>
              </div>
              <div className="h-14 rounded-lg border border-rta-border bg-rta-bg-light animate-pulse" />
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
