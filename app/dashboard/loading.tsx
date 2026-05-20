import { Card, CardContent, CardHeader } from '@/components/ui/card';

/** Route transition shell: mirrors real dashboard layout without a full blank skeleton wall */
export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-2">
          <div className="h-8 w-48 max-w-full animate-pulse rounded-md bg-rta-card-bg border border-rta-border" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-rta-card-bg border border-rta-border" />
        </div>
        <p className="text-body-sm text-rta-text-secondary mb-4">Loading your dashboard…</p>
        <Card className="mb-6 border-rta-border bg-white shadow-card">
          <CardHeader className="pb-2">
            <div className="h-5 w-32 animate-pulse rounded bg-rta-bg-light" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-28 animate-pulse rounded-md bg-rta-bg-light" />
            ))}
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl border border-rta-border bg-rta-card-bg animate-pulse"
            />
          ))}
        </div>
        <Card className="border-rta-border bg-white shadow-card">
          <CardHeader className="pb-2">
            <div className="h-6 w-44 animate-pulse rounded bg-rta-bg-light" />
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <div className="h-9 w-full animate-pulse rounded-md bg-rta-bg-light" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded-md bg-rta-bg-light" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
