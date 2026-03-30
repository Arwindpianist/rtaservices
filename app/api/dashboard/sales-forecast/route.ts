import { NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';
import {
  MOCK_CLOSING_STAGES,
  MOCK_DEAL_FORECASTS,
  MOCK_FORECAST_12_MONTHS,
  getCurrentQuarterForecast,
} from '@/lib/mock-data/sales-forecast';

type DealRecord = {
  id?: string;
  Deal_Name?: string;
  Amount?: number;
  Currency?: string;
  Stage?: string;
  Closing_Date?: string;
};

const MONTH_FMT = new Intl.DateTimeFormat('en-US', { month: 'short' });

function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function stageWeight(stage: string): number {
  const s = stage.toLowerCase();
  if (s.includes('won') || s.includes('closed won')) return 95;
  if (s.includes('negotiation')) return 75;
  if (s.includes('proposal')) return 60;
  if (s.includes('qualified')) return 45;
  if (s.includes('discovery')) return 30;
  return 35;
}

export async function GET() {
  const { token } = await getZohoAccessToken();
  if (!token) {
    return NextResponse.json({
      source: 'mock',
      months: MOCK_FORECAST_12_MONTHS,
      deals: MOCK_DEAL_FORECASTS,
      closingStages: MOCK_CLOSING_STAGES,
      quarter: getCurrentQuarterForecast(),
    });
  }

  try {
    const domain = getZohoCrmDomain();
    const fields = 'Deal_Name,Amount,Stage,Closing_Date,Currency,Created_Time';
    const res = await fetch(
      `${domain}/crm/v2/Deals?sort_by=Amount&sort_order=desc&per_page=200&fields=${fields}`,
      { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
    );
    if (!res.ok) {
      throw new Error(`Deals fetch failed: ${res.status}`);
    }
    const data = await res.json();
    const deals = (data.data ?? data.deals ?? []) as DealRecord[];

    const now = new Date();
    const monthBuckets = Array.from({ length: 12 }, (_, index) => {
      const d = new Date(now.getFullYear(), now.getMonth() + index, 1);
      return {
        month: MONTH_FMT.format(d),
        year: d.getFullYear(),
        forecastedValue: 0,
        currency: 'USD',
        _key: monthKey(d.getFullYear(), d.getMonth()),
      };
    });
    const monthIndexByKey = new Map(monthBuckets.map((b, i) => [b._key, i]));

    const stageCounts = new Map<string, { count: number; value: number }>();
    const dealForecasts = deals.slice(0, 20).map((deal, idx) => {
      const amount = Number(deal.Amount ?? 0);
      const stage = deal.Stage || '-';
      const target = deal.Closing_Date ? new Date(deal.Closing_Date) : null;
      const targetMonth = target
        ? `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`
        : monthKey(now.getFullYear(), now.getMonth());

      const bucketIndex = monthIndexByKey.get(targetMonth);
      if (bucketIndex != null) {
        monthBuckets[bucketIndex].forecastedValue += amount;
      }

      const existing = stageCounts.get(stage) || { count: 0, value: 0 };
      existing.count += 1;
      existing.value += amount;
      stageCounts.set(stage, existing);

      return {
        id: deal.id || `deal-${idx}`,
        name: deal.Deal_Name || `Deal ${idx + 1}`,
        amount,
        currency: (deal.Currency || 'USD').toUpperCase(),
        closingPercentage: stageWeight(stage),
        targetClosingMonth: targetMonth,
        currentQuarter:
          bucketIndex != null ? bucketIndex < 3 : false,
        closingStage: stage,
      };
    });

    const months = monthBuckets.map(({ _key, ...rest }) => rest);
    const quarter = months.slice(0, 3);
    const closingStages = Array.from(stageCounts.entries()).map(([stage, vals]) => ({
      stage,
      count: vals.count,
      value: vals.value,
    }));

    return NextResponse.json({
      source: 'zoho',
      months,
      deals: dealForecasts,
      closingStages,
      quarter,
    });
  } catch {
    return NextResponse.json({
      source: 'mock',
      months: MOCK_FORECAST_12_MONTHS,
      deals: MOCK_DEAL_FORECASTS,
      closingStages: MOCK_CLOSING_STAGES,
      quarter: getCurrentQuarterForecast(),
    });
  }
}
