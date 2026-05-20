export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />;
}

export function SuperadminPageSkeleton() {
  return (
    <div className="rta-neu-theme sa-theme min-h-[calc(100vh-3.5rem)] sa-bg p-4 sm:p-6">
      <div className="sa-shell space-y-4">
        <div className="space-y-2">
          <SkeletonLine className="h-8 w-64" />
          <SkeletonLine className="h-4 w-96 max-w-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonLine className="h-20 w-full" />
          <SkeletonLine className="h-20 w-full" />
          <SkeletonLine className="h-20 w-full" />
          <SkeletonLine className="h-20 w-full" />
        </div>
        <SkeletonLine className="h-16 w-full" />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <SkeletonLine className="h-40 w-full" />
          <SkeletonLine className="h-40 w-full" />
          <SkeletonLine className="h-40 w-full" />
          <SkeletonLine className="h-40 w-full" />
        </div>
        <SkeletonLine className="h-48 w-full" />
      </div>
    </div>
  );
}

export function SuperadminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <SkeletonLine className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

