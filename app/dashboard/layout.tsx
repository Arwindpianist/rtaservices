import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { DashboardPresentationProvider } from './DashboardPresentationContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SuperadminHeader } from '@/components/dashboard/SuperadminHeader';
import { normalizeRole } from '@/lib/rbac';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }
  const role = normalizeRole(session.user.role);
  const email = session.user.email || '';

  if (role === 'superadmin') {
    return (
      <div className="min-h-screen bg-slate-50">
        <SuperadminHeader email={email} />
        {children}
      </div>
    );
  }

  return (
    <DashboardPresentationProvider>
      <div className="rta-staff-theme staff-theme min-h-screen rta-staff-bg staff-bg">
        <DashboardHeader name={session.user.name || email || 'User'} />
        {children}
      </div>
    </DashboardPresentationProvider>
  );
}
