/**
 * Hardcoded mock sales forecast: 12-month forecast, deal closing %, target closing month, current quarter, closing stages.
 */

export interface ForecastMonth {
  month: string;
  year: number;
  forecastedValue: number;
  currency: string;
}

export interface DealForecast {
  id: string;
  name: string;
  amount: number;
  currency: string;
  closingPercentage: number;
  targetClosingMonth: string;
  currentQuarter: boolean;
  closingStage: string;
}

export const MOCK_FORECAST_12_MONTHS: ForecastMonth[] = [
  { month: 'Mar', year: 2025, forecastedValue: 85000, currency: 'USD' },
  { month: 'Apr', year: 2025, forecastedValue: 92000, currency: 'USD' },
  { month: 'May', year: 2025, forecastedValue: 78000, currency: 'USD' },
  { month: 'Jun', year: 2025, forecastedValue: 95000, currency: 'USD' },
  { month: 'Jul', year: 2025, forecastedValue: 88000, currency: 'USD' },
  { month: 'Aug', year: 2025, forecastedValue: 102000, currency: 'USD' },
  { month: 'Sep', year: 2025, forecastedValue: 91000, currency: 'USD' },
  { month: 'Oct', year: 2025, forecastedValue: 98000, currency: 'USD' },
  { month: 'Nov', year: 2025, forecastedValue: 105000, currency: 'USD' },
  { month: 'Dec', year: 2025, forecastedValue: 112000, currency: 'USD' },
  { month: 'Jan', year: 2026, forecastedValue: 87000, currency: 'USD' },
  { month: 'Feb', year: 2026, forecastedValue: 94000, currency: 'USD' },
];

export const MOCK_DEAL_FORECASTS: DealForecast[] = [
  { id: 'df1', name: 'Enterprise deal A', amount: 45000, currency: 'USD', closingPercentage: 80, targetClosingMonth: '2025-03', currentQuarter: true, closingStage: 'Negotiation' },
  { id: 'df2', name: 'SMB deal B', amount: 12000, currency: 'USD', closingPercentage: 60, targetClosingMonth: '2025-04', currentQuarter: true, closingStage: 'Proposal' },
  { id: 'df3', name: 'Enterprise deal C', amount: 68000, currency: 'USD', closingPercentage: 40, targetClosingMonth: '2025-06', currentQuarter: false, closingStage: 'Qualification' },
];

export const MOCK_CLOSING_STAGES = [
  { stage: 'Qualification', count: 5, value: 120000 },
  { stage: 'Proposal', count: 3, value: 85000 },
  { stage: 'Negotiation', count: 2, value: 57000 },
  { stage: 'Closed Won', count: 8, value: 210000 },
  { stage: 'Closed Lost', count: 4, value: 0 },
];

export function getCurrentQuarterForecast(): ForecastMonth[] {
  return MOCK_FORECAST_12_MONTHS.slice(0, 3);
}

export function getDealsForCurrentQuarter(): DealForecast[] {
  return MOCK_DEAL_FORECASTS.filter((d) => d.currentQuarter);
}
