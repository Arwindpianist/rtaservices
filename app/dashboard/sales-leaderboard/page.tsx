'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Trophy } from 'lucide-react';
import { TopSalespeopleChart } from '@/components/dashboard/TopSalespeopleChart';

type TopSalesperson = { name: string; quoted: number; closed: number };

function formatAmount(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function SalesLeaderboardPage() {
  const [data, setData] = useState<TopSalesperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/zoho/opportunities?period=all')
      .then((res) => res.json())
      .then((json) => {
        const list = json.topSalespeople ?? [];
        setData(Array.isArray(list) ? list : []);
        setError(json.error ?? null);
      })
      .catch(() => {
        setData([]);
        setError('Failed to load');
      })
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="text-h3 font-bold text-rta-blue">Salesperson leaderboard</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Top 10 salespeople by closed value (from Zoho CRM)</p>

        <Card className="mt-6 relative border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-rta-blue">
              <Trophy className="w-4 h-4 text-rta-blue" />
              Top 10 by closed value
            </CardTitle>
            <p className="text-body-sm text-rta-text-secondary">Ranked by closed deal value</p>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className="flex items-center gap-2 py-12 text-rta-text-secondary justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-body-sm">Loading leaderboard…</span>
              </div>
            ) : error ? (
              <div className="py-8 px-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-body-sm text-red-700 font-medium">{error}</p>
                <p className="text-body-sm text-rta-text-secondary mt-1">Check Zoho credentials in .env.local</p>
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center text-rta-text-secondary">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-body-sm font-medium">No data</p>
                <p className="text-body-sm mt-1">Configure Zoho CRM and ensure opportunities have stages and owners.</p>
              </div>
            ) : (
              <TopSalespeopleChart data={data} formatValue={formatAmount} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
