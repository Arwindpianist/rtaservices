'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardPresentation } from '../DashboardPresentationContext';

export default function HrmPage() {
  const { presentationMode } = useDashboardPresentation();

  if (presentationMode) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light flex items-center justify-center p-4">
        <Card className="border-rta-border bg-white shadow-card max-w-md">
          <CardContent className="pt-6">
            <p className="text-body-sm font-medium text-rta-text">HRM is hidden in presentation mode.</p>
            <p className="text-body-sm text-rta-text-secondary mt-1">Turn off presentation mode in the header to view HRM.</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <h1 className="text-h3 font-bold text-rta-blue">HRM System</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">Salary, leave system, HRM</p>
        <Card className="mt-6 relative max-w-2xl border-rta-border bg-white shadow-card overflow-hidden group hover:shadow-card-hover transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rta-blue/5 rounded-bl-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rta-blue/10 transition-colors" />
          <CardContent className="relative pt-6 pb-6">
            <p className="text-body-sm text-rta-text">Content coming soon.</p>
            <p className="text-body-sm text-rta-text-secondary mt-1">Salary, leave, and HRM features will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
