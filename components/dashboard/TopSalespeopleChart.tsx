'use client';

type DataPoint = { name: string; quoted: number; closed: number };

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

type TopSalespeopleChartProps = {
  data: DataPoint[];
  formatValue?: (n: number) => string;
};

export function TopSalespeopleChart({
  data,
  formatValue = (n) => n.toLocaleString(),
}: TopSalespeopleChartProps) {
  return (
    <ul className="space-y-0">
      <li className="flex items-center gap-2 py-2 px-2 border-b border-rta-border text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">
        <span className="w-7 shrink-0" />
        <span className="flex-1 min-w-0">Salesperson</span>
        <span className="w-20 text-right shrink-0">Quoted</span>
        <span className="w-20 text-right shrink-0">Closed</span>
      </li>
      {data.map((item, i) => {
        const rank = i + 1;
        const isMedal = rank <= 3;
        return (
        <li
          key={item.name}
          className={`flex items-center gap-2 py-2.5 px-2 -mx-2 border-b border-rta-border last:border-0 rounded-md transition-all duration-200 hover:bg-rta-bg-light ${isMedal ? getMedalRowClass(rank) : ''}`}
        >
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-body-sm font-semibold border ${getMedalBadgeClass(rank)}`}>
            {rank}
          </span>
          <span className="flex-1 min-w-0 text-body-sm font-medium text-rta-text truncate" title={item.name}>
            {item.name}
          </span>
          <span className="w-20 text-right text-body-sm font-semibold text-rta-text tabular-nums shrink-0">
            {formatValue(item.quoted)}
          </span>
          <span className="w-20 text-right text-body-sm font-semibold text-emerald-700 tabular-nums shrink-0">
            {formatValue(item.closed)}
          </span>
        </li>
      );})}
    </ul>
  );
}
