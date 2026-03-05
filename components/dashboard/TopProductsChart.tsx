'use client';

type DataPoint = { name: string; count: number };

type TopProductsChartProps = {
  data: DataPoint[];
};

export function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <ul className="space-y-3">
      {data.map((item, i) => (
        <li
          key={item.name}
          className="flex items-center justify-between gap-4 py-2.5 px-2 -mx-2 border-b border-rta-border last:border-0 rounded-md transition-all duration-200 hover:bg-rta-bg-light"
        >
          <span className="flex items-center gap-3 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rta-bg-light text-body-sm font-semibold text-rta-text-secondary">
              {i + 1}
            </span>
            <span className="text-body-sm font-medium text-rta-text truncate" title={item.name}>
              {item.name}
            </span>
          </span>
          <span className="text-body-sm font-semibold text-rta-text tabular-nums shrink-0">
            {item.count} qty
          </span>
        </li>
      ))}
    </ul>
  );
}
