export function DashboardTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="h-8 w-full animate-pulse rounded-md bg-rta-bg-light" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 w-full animate-pulse rounded-md bg-rta-bg-light" />
      ))}
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <div className="h-8 w-56 animate-pulse rounded-md bg-white" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded-md bg-white" />
        </div>
        <div className="mt-6 rounded-xl border border-rta-border bg-white p-4 shadow-card">
          <DashboardTableSkeleton rows={7} />
        </div>
      </div>
    </div>
  );
}

