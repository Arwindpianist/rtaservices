'use client';

import { useMemo, useState } from 'react';
import { Loader2, Search, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export type PickerOpportunity = {
  id: string;
  name: string;
  customer: string;
  amount: number;
  currency: string;
  stage: string;
};

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

export default function TopFiveOpportunityPicker({
  open,
  loading,
  opportunities,
  selectedIds,
  error,
  onClose,
  onRetry,
  onConfirm,
}: {
  open: boolean;
  loading: boolean;
  opportunities: PickerOpportunity[];
  selectedIds: string[];
  error?: string;
  onClose: () => void;
  onRetry: () => void;
  onConfirm: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState('');
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);
  const selectionCap = Math.min(5, opportunities.length);
  const needsExactFive = opportunities.length >= 5;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return opportunities;
    return opportunities.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.stage.toLowerCase().includes(q)
      );
    });
  }, [opportunities, query]);

  if (!open) return null;

  const toggle = (id: string) => {
    setLocalSelected((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      if (current.length >= selectionCap) return current;
      return [...current, id];
    });
  };

  const canConfirm = needsExactFive ? localSelected.length === 5 : localSelected.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rta-blue/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-rta-border shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-rta-border">
          <h2 className="text-lg font-bold text-rta-text">Pick top opportunities for presentation</h2>
          <p className="text-body-sm text-rta-text-secondary mt-1">
            {needsExactFive
              ? 'Select exactly 5 opportunities. These will power your presentation metrics.'
              : `Select up to ${selectionCap} opportunities (only ${selectionCap} available).`}
          </p>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-10 flex items-center justify-center gap-2 text-rta-text-secondary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-body-sm">Loading opportunities…</span>
            </div>
          ) : error ? (
            <div className="py-4">
              <p className="text-body-sm text-red-600">{error}</p>
              <Button onClick={onRetry} variant="outline" className="mt-3 border-rta-border text-rta-text">
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rta-text-secondary" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by opportunity, customer, or stage"
                  className="pl-10 border-rta-border"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.map((item) => {
                  const active = localSelected.includes(item.id);
                  const disabled = !active && localSelected.length >= selectionCap;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggle(item.id)}
                      className={`text-left rounded-lg border p-4 transition-colors ${
                        active
                          ? 'border-rta-blue bg-rta-blue/5'
                          : 'border-rta-border bg-white hover:bg-rta-bg-light'
                      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-body-sm font-semibold text-rta-text">{item.name}</p>
                          <p className="text-xs text-rta-text-secondary mt-1">{item.customer}</p>
                          <p className="text-xs text-rta-text-secondary mt-1">Stage: {item.stage || '-'}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span className="text-xs font-semibold text-rta-text">
                            {formatAmount(item.amount, item.currency)}
                          </span>
                          {active && <CheckCircle2 className="w-4 h-4 text-rta-blue" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <div className="px-6 py-4 border-t border-rta-border flex items-center justify-between gap-3">
          <p className="text-sm text-rta-text-secondary">
            Selected: <span className="font-semibold text-rta-text">{localSelected.length}</span>
            {needsExactFive ? ' / 5' : ` / ${selectionCap}`}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose} className="border-rta-border text-rta-text">
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(localSelected)}
              disabled={!canConfirm}
              className="bg-rta-gold-cta hover:bg-rta-gold-cta-hover text-white"
            >
              Start presentation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
