'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDashboardPresentation } from '../DashboardPresentationContext';
import { RequireHrm } from '@/lib/dashboard-capability-guard';

function HrmContent() {
  const pendingLeaves = [
    { id: 'lv-001', employee: 'Alice Tan', type: 'Annual leave', from: '2026-04-08', to: '2026-04-10', status: 'Pending' },
    { id: 'lv-002', employee: 'Bob Lee', type: 'Medical leave', from: '2026-04-03', to: '2026-04-03', status: 'Approved' },
  ];
  const staffingSnapshot = [
    { label: 'Headcount', value: '42' },
    { label: 'Open positions', value: '4' },
    { label: 'On leave today', value: '3' },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-rta-bg-light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <h1 className="text-h3 font-bold text-rta-blue">HRM System</h1>
        <p className="text-body-sm text-rta-text-secondary mt-1">
          Salary, leave system, HRM
          <span className="ml-2 text-rta-blue font-medium">· Preview data</span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {staffingSnapshot.map((item) => (
            <Card key={item.label} className="border-rta-border bg-white shadow-card">
              <CardContent className="pt-6">
                <p className="text-body-sm text-rta-text-secondary">{item.label}</p>
                <p className="text-2xl font-bold text-rta-text mt-1">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-6 border-rta-border bg-white shadow-card">
          <CardContent className="pt-6">
            <p className="text-base font-semibold text-rta-text mb-2">Leave requests</p>
            <p className="text-body-sm text-rta-text-secondary mb-3">Recent leave requests and approval status</p>
            <div className="overflow-x-auto rounded-md border border-rta-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rta-bg-light border-b border-rta-border">
                    <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Employee</th>
                    <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Type</th>
                    <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Period</th>
                    <th className="px-4 py-2 text-body-sm font-semibold text-rta-text">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.map((row) => (
                    <tr key={row.id} className="border-b border-rta-border last:border-0">
                      <td className="px-4 py-2 text-body-sm text-rta-text font-medium">{row.employee}</td>
                      <td className="px-4 py-2 text-body-sm text-rta-text-secondary">{row.type}</td>
                      <td className="px-4 py-2 text-body-sm text-rta-text-secondary">{row.from} to {row.to}</td>
                      <td className="px-4 py-2 text-body-sm text-rta-text">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
    <RequireHrm>
      <HrmContent />
    </RequireHrm>
  );
}
