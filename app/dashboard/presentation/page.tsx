'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Presentation, BarChart3, Users, TrendingUp } from 'lucide-react';
import { canUseTop5Presentation, type DashboardRole } from '@/lib/dashboard-roles';
import { useDashboardPresentation } from '../DashboardPresentationContext';

type PipelineOpportunity = {
  id: string;
  name: string;
  customer: string;
  amount: number;
  currency: string;
  stage: string;
};

const STAGE_PROBABILITY: Array<{ includes: string; weight: number }> = [
  { includes: 'won', weight: 1 },
  { includes: 'closed', weight: 0.95 },
  { includes: 'negotiation', weight: 0.7 },
  { includes: 'proposal', weight: 0.55 },
  { includes: 'qualified', weight: 0.4 },
  { includes: 'discovery', weight: 0.3 },
];

function formatAmount(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

function getStageWeight(stage: string): number {
  const s = stage.toLowerCase();
  const match = STAGE_PROBABILITY.find((item) => s.includes(item.includes));
  return match?.weight ?? 0.35;
}

export default function DashboardPresentationPage() {
  const {
    presentationMode,
    setPresentationMode,
    selectedTop5OpportunityIds,
    setSelectedTop5OpportunityIds,
    clearPresentationSelection,
    setPresentationSessionOpenedAt,
  } = useDashboardPresentation();
  const [role, setRole] = useState<DashboardRole>('other');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PipelineOpportunity[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!presentationMode && selectedTop5OpportunityIds.length > 0) {
      setPresentationMode(true);
    }
  }, [presentationMode, selectedTop5OpportunityIds, setPresentationMode]);

  useEffect(() => {
    fetch('/api/dashboard/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.role) setRole(data.role as DashboardRole);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/connector/pipeline')
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data.pipeline ?? [])
          .map((item: Record<string, unknown>) => ({
            id: String(item.zohoQuoteId ?? ''),
            name: String(item.quoteName ?? 'Unnamed'),
            customer: String(item.customer ?? '-'),
            amount: Number(item.amount ?? 0),
            currency: String(item.currency ?? 'USD'),
            stage: String(item.stage ?? '-'),
          }))
          .filter((item: PipelineOpportunity) => item.id);
        setItems(mapped);
      })
      .catch(() => {
        setError('Failed to load opportunities');
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedItems = useMemo(() => {
    if (!selectedTop5OpportunityIds.length) return [];
    const idSet = new Set(selectedTop5OpportunityIds);
    return items.filter((item) => idSet.has(item.id));
  }, [items, selectedTop5OpportunityIds]);

  const selectedCount = selectedItems.length;

  const topCustomers = useMemo(() => {
    const map = new Map<string, number>();
    selectedItems.forEach((item) => {
      map.set(item.customer, (map.get(item.customer) ?? 0) + item.amount);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [selectedItems]);

  const stageDistribution = useMemo(() => {
    const map = new Map<string, number>();
    selectedItems.forEach((item) => {
      map.set(item.stage || '-', (map.get(item.stage || '-') ?? 0) + 1);
    });
    return Array.from(map.entries());
  }, [selectedItems]);

  const eligibleForTop5 = canUseTop5Presentation(role);

  const exitPresentation = () => {
    setPresentationMode(false);
    clearPresentationSelection();
    setPresentationSessionOpenedAt(null);
    window.location.assign('/dashboard');
  };

  if (!presentationMode) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
        <Card className="border-rta-border bg-white shadow-card max-w-lg">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-rta-text">Presentation mode is not enabled.</p>
            <p className="text-body-sm text-rta-text-secondary mt-1">
              Enable presentation mode from the dashboard header to use this screen.
            </p>
            <Button asChild variant="outline" className="mt-4 border-rta-border text-rta-text">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-rta-text-secondary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-body-sm">Loading presentation data…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
        <Card className="border-rta-border bg-white shadow-card max-w-lg">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-red-600">{error}</p>
            <Button asChild variant="outline" className="mt-4 border-rta-border text-rta-text">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (eligibleForTop5 && selectedCount === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
        <Card className="border-rta-border bg-white shadow-card max-w-lg">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-rta-text">No top opportunities selected.</p>
            <p className="text-body-sm text-rta-text-secondary mt-1">
              Toggle presentation mode off and on again to pick your Top 5 opportunities.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="border-rta-border text-rta-text" onClick={exitPresentation}>
                Exit presentation mode
              </Button>
              <Button
                className="bg-rta-blue hover:bg-rta-blue-hover text-white"
                onClick={() => {
                  const fallback = items.slice(0, 5).map((item) => item.id);
                  setSelectedTop5OpportunityIds(fallback);
                }}
              >
                Auto-select top 5
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const shownItems = eligibleForTop5 ? selectedItems : items.slice(0, 5);
  const shownTotal = shownItems.reduce((sum, item) => sum + item.amount, 0);
  const shownWeighted = shownItems.reduce((sum, item) => sum + item.amount * getStageWeight(item.stage), 0);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-h3 font-bold text-rta-blue flex items-center gap-2">
              <Presentation className="w-6 h-6 text-rta-blue" />
              Presentation Mode
            </h1>
            <p className="text-body-sm text-rta-text-secondary mt-1">
              {eligibleForTop5
                ? 'Top 5 opportunities selected for this presentation session'
                : 'Presentation summary view'}
            </p>
          </div>
          <Button variant="outline" className="border-rta-border text-rta-text" onClick={exitPresentation}>
            Exit presentation mode
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <p className="text-body-sm text-rta-text-secondary">Selected opportunities</p>
              <p className="text-2xl font-bold text-rta-text mt-1">{shownItems.length}</p>
            </CardContent>
          </Card>
          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <p className="text-body-sm text-rta-text-secondary">Total pipeline value</p>
              <p className="text-2xl font-bold text-rta-text mt-1">{formatAmount(shownTotal)}</p>
            </CardContent>
          </Card>
          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <p className="text-body-sm text-rta-text-secondary">Weighted close estimate</p>
              <p className="text-2xl font-bold text-rta-text mt-1">{formatAmount(shownWeighted)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <p className="text-base font-semibold text-rta-text flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rta-blue" />
                Stage distribution
              </p>
              <div className="mt-4 space-y-2">
                {(eligibleForTop5 ? stageDistribution : Array.from(new Map(shownItems.map((i) => [i.stage, 1])).entries())).map(
                  ([stage, count]) => (
                    <div key={stage} className="flex items-center justify-between text-body-sm">
                      <span className="text-rta-text-secondary">{stage || '-'}</span>
                      <Badge variant="outline" className="border-rta-border text-rta-text">
                        {count}
                      </Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-rta-border bg-white shadow-card">
            <CardContent className="pt-6">
              <p className="text-base font-semibold text-rta-text flex items-center gap-2">
                <Users className="w-4 h-4 text-rta-blue" />
                Top customers represented
              </p>
              <div className="mt-4 space-y-2">
                {(eligibleForTop5
                  ? topCustomers
                  : Array.from(
                      shownItems.reduce<Map<string, number>>((map, item) => {
                        map.set(item.customer, (map.get(item.customer) ?? 0) + item.amount);
                        return map;
                      }, new Map()).entries()
                    ).sort((a, b) => b[1] - a[1]).slice(0, 5)
                ).map(([name, value]) => (
                  <div key={name} className="flex items-center justify-between text-body-sm">
                    <span className="text-rta-text-secondary">{name}</span>
                    <span className="font-semibold text-rta-text">{formatAmount(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-rta-border bg-white shadow-card">
          <CardContent className="pt-6">
            <p className="text-base font-semibold text-rta-text flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rta-blue" />
              Opportunity speaking points
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {shownItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-rta-border p-4 bg-rta-bg-light/40">
                  <p className="text-body-sm font-semibold text-rta-text">{item.name}</p>
                  <p className="text-xs text-rta-text-secondary mt-1">{item.customer}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="outline" className="border-rta-border text-rta-text">
                      {item.stage || '-'}
                    </Badge>
                    <p className="text-body-sm font-semibold text-rta-text">
                      {formatAmount(item.amount, item.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
