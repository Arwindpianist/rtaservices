'use client';

import { getStageBadgeClass, getStageDotClass } from '@/lib/stage-colors';

type DataPoint = { stage: string; count: number; value: number };

type StageChartProps = {
  data: DataPoint[];
  formatValue?: (n: number) => string;
};

export function StageChart({ data, formatValue = (n) => n.toLocaleString() }: StageChartProps) {
  return (
    <ul className="space-y-3">
      {data.map((item, i) => (
        <li
          key={item.stage}
          className="flex items-center justify-between gap-4 py-2.5 px-2 -mx-2 border-b border-rta-border last:border-0 rounded-md transition-all duration-200 hover:bg-rta-bg-light"
        >
          <span className="flex items-center gap-3 min-w-0">
            <span className={`flex h-2.5 w-2.5 shrink-0 rounded-full ${getStageDotClass(item.stage)}`} title={item.stage} />
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rta-bg-light text-body-sm font-semibold text-rta-text-secondary">
              {i + 1}
            </span>
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-body-sm font-medium ${getStageBadgeClass(item.stage)}`}>
              {item.stage}
            </span>
            <span className="text-body-sm text-rta-text-light shrink-0">({item.count})</span>
          </span>
          <span className="text-body-sm font-semibold text-rta-text tabular-nums shrink-0">
            {formatValue(item.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}
