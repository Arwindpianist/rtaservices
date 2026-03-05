'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Users, ChevronRight } from 'lucide-react';

type Customer = { id: string; name: string; quoteCount: number };

export default function CustomersPage() {
  const [data, setData] = useState<{ customers: Customer[]; error?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/connector/customers')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ customers: [] }))
      .finally(() => setLoading(false));
  }, []);

  const customers = data?.customers ?? [];
  const filtered = search.trim()
    ? customers.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()))
    : customers;

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
        <h1 className="text-h3 font-bold text-rta-blue">Customers</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Unified view of customers from Zoho (quotes & deals) and Xero
        </p>
        {data?.error && <p className="mt-2 text-body-sm text-rta-red">{data.error}</p>}

        <div className="mt-6 mb-4">
          <Input
            placeholder="Search customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm border-rta-border"
          />
        </div>

        <Card className="border-rta-border bg-white shadow-card">
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center gap-2 py-12 justify-center text-rta-text-secondary">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-body-sm">Loading customers…</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-md border border-rta-border">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-rta-bg-light border-b border-rta-border">
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text">Customer</th>
                        <th className="px-4 py-3 text-body-sm font-semibold text-rta-text text-right">Quotes / deals</th>
                        <th className="px-4 py-3 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((c) => (
                        <tr
                          key={c.id}
                          className="group border-b border-rta-border last:border-0 hover:bg-rta-bg-light cursor-pointer transition-colors"
                          onClick={() => window.location.href = `/dashboard/customers/${c.id}`}
                        >
                          <td className="px-4 py-3 text-body-sm font-medium text-rta-text">
                            <Link href={`/dashboard/customers/${c.id}`} className="block text-inherit hover:underline focus:outline-none focus:ring-2 focus:ring-rta-blue">
                              {c.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-body-sm text-rta-text-secondary text-right">{c.quoteCount}</td>
                          <td className="px-4 py-3">
                            <ChevronRight className="w-4 h-4 text-rta-text-light group-hover:text-rta-text-secondary" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filtered.length === 0 && (
                  <p className="py-8 text-center text-body-sm text-rta-text-secondary">
                    {customers.length === 0 ? 'No customers found.' : 'No customers match the search.'}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
