'use client';

type DataPoint = { name: string; value: number };

const getMedalBadgeClass = (rank: number): string => {
  if (rank === 1) return 'bg-amber-500/15 text-amber-800 border border-amber-300 font-bold';
  if (rank === 2) return 'bg-slate-200/80 text-slate-700 border border-slate-400 font-bold';
  if (rank === 3) return 'bg-amber-700/15 text-amber-900 border border-amber-600 font-semibold';
  return 'bg-rta-bg-light text-rta-text-secondary border border-transparent';
};

const getMedalRowClass = (rank: number): string => {
  if (rank === 1) return 'bg-amber-50/70';
  if (rank === 2) return 'bg-slate-100/70';
  if (rank === 3) return 'bg-amber-100/60';
  return '';
};

type TopCustomersChartProps = {
  data: DataPoint[];
  formatValue?: (n: number) => string;
};

export function TopCustomersChart({
  data,
  formatValue = (n) => n.toLocaleString(),
}: TopCustomersChartProps) {
  return (
    <ul className="space-y-0">
      {data.map((item, i) => {
        const rank = i + 1;
        const isMedal = rank <= 3;
        return (
        <li
          key={item.name}
          className={`flex items-center justify-between gap-4 py-2.5 px-2 -mx-2 border-b border-rta-border last:border-0 rounded-md transition-all duration-200 hover:bg-rta-bg-light ${isMedal ? getMedalRowClass(rank) : ''}`}
        >
          <span className="flex items-center gap-3 min-w-0">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-body-sm font-semibold border ${getMedalBadgeClass(rank)}`}>
              {rank}
            </span>
            <span className="text-body-sm font-medium text-rta-text truncate" title={item.name}>
              {item.name}
            </span>
          </span>
          <span className="text-body-sm font-semibold text-rta-text tabular-nums shrink-0">
            {formatValue(item.value)}
          </span>
        </li>
      );})}
    </ul>
  );
}
