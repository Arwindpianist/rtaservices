'use client';

type DataPoint = { name: string; value: number };

const getMedalBadgeClass = (rank: number): string => {
  if (rank === 1) return 'bg-rta-gold/15 text-rta-gold border border-rta-gold/40 font-bold';
  if (rank === 2) return 'bg-rta-red/15 text-rta-red border border-rta-red/45 font-bold';
  if (rank === 3) return 'bg-rta-blue/15 text-rta-blue border border-rta-blue/45 font-semibold';
  return 'bg-rta-bg-light text-rta-text-secondary border border-transparent';
};

const getMedalRowClass = (rank: number): string => {
  if (rank === 1) return 'bg-rta-gold/10';
  if (rank === 2) return 'bg-rta-red/10';
  if (rank === 3) return 'bg-rta-blue/10';
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
