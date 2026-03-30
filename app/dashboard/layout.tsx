'use client';

import { use, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, User, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TopFiveOpportunityPicker, { type PickerOpportunity } from '@/components/dashboard/TopFiveOpportunityPicker';
import {
  DASHBOARD_USER_IDS,
  DASHBOARD_USER_LABELS,
  canUseTop5Presentation,
  type DashboardUserId,
  type DashboardRole,
  type RoleCapabilities,
} from '@/lib/dashboard-roles';
import { useDashboardPresentation, DashboardPresentationProvider } from './DashboardPresentationContext';

type AuthState = {
  authenticated: boolean;
  needUser?: boolean;
  userId?: string;
  role?: string;
  capabilities?: RoleCapabilities;
};

function DashboardBar({
  currentUserId,
  currentRole,
  currentLabel,
  onSwitchAccount,
}: {
  currentUserId: string;
  currentRole: DashboardRole;
  currentLabel: string;
  onSwitchAccount: (userId: DashboardUserId) => void;
}) {
  const {
    presentationMode,
    setPresentationMode,
    selectedTop5OpportunityIds,
    setSelectedTop5OpportunityIds,
    clearPresentationSelection,
    setPresentationSessionOpenedAt,
  } = useDashboardPresentation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState('');
  const [pickerItems, setPickerItems] = useState<PickerOpportunity[]>([]);
  const isStaff = currentUserId === 'other';
  const canUseTop5Flow = canUseTop5Presentation(currentRole);

  const loadPickerItems = async () => {
    setPickerLoading(true);
    setPickerError('');
    try {
      const res = await fetch('/api/connector/pipeline');
      const data = (await res.json()) as { pipeline?: Array<Record<string, unknown>>; error?: string };
      if (!res.ok) {
        setPickerError(data.error || 'Failed to load opportunities');
        return;
      }
      const mapped = (data.pipeline ?? [])
        .map((item) => ({
          id: String(item.zohoQuoteId ?? ''),
          name: String(item.quoteName ?? 'Unnamed'),
          customer: String(item.customer ?? '-'),
          amount: Number(item.amount ?? 0),
          currency: String(item.currency ?? 'USD'),
          stage: String(item.stage ?? '-'),
        }))
        .filter((item) => item.id)
        .sort((a, b) => b.amount - a.amount);
      setPickerItems(mapped);
      if (mapped.length === 0) {
        setPickerError('No opportunities available for selection.');
      }
    } catch {
      setPickerError('Failed to load opportunities');
    } finally {
      setPickerLoading(false);
    }
  };

  const openPicker = async () => {
    setPickerOpen(true);
    await loadPickerItems();
  };

  const handlePresentationToggle = async () => {
    if (presentationMode) {
      setPresentationMode(false);
      clearPresentationSelection();
      setPresentationSessionOpenedAt(null);
      if (window.location.pathname.startsWith('/dashboard/presentation')) {
        window.location.assign('/dashboard');
      }
      return;
    }

    if (!canUseTop5Flow) {
      setPresentationMode(true);
      return;
    }

    await openPicker();
  };

  const handleConfirmTop5 = (ids: string[]) => {
    setSelectedTop5OpportunityIds(ids);
    setPresentationSessionOpenedAt(Date.now());
    setPresentationMode(true);
    setPickerOpen(false);
    window.location.assign('/dashboard/presentation?presentation=true');
  };

  const handleLogout = async () => {
    await fetch('/api/dashboard/auth', { method: 'DELETE' });
    window.location.reload();
  };
  return (
    <header className="bg-rta-blue text-white border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Left: branding + dashboard home link */}
          <div className="flex items-center gap-6 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold text-white hover:text-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-rta-blue rounded"
            >
              Dashboard
            </Link>
            <span className="hidden sm:inline text-white/70 text-body-sm truncate">Staff & leadership</span>
          </div>

          {/* Right: presentation toggle + profile */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePresentationToggle}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-body-sm font-medium transition-colors ${
                presentationMode
                  ? 'bg-rta-gold/20 text-rta-gold'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title={presentationMode ? 'Exit presentation mode' : 'Presentation mode'}
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">{presentationMode ? 'On' : 'Presentation'}</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 p-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-rta-blue"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white font-medium text-sm">
                  {currentLabel.charAt(0).toUpperCase()}
                </span>
              </button>
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden="true"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 py-1 bg-white rounded-lg shadow-lg border border-rta-border z-20 min-w-[12rem] text-left">
                    <div className="px-3 py-2 border-b border-rta-border">
                      <p className="text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">Signed in as</p>
                      <p className="text-body-sm font-medium text-rta-text truncate">{currentLabel}</p>
                    </div>
                    <div className="py-1">
                      <p className="px-3 py-1.5 text-xs font-semibold text-rta-text-secondary uppercase tracking-wider">
                        Switch account
                      </p>
                      {DASHBOARD_USER_IDS.map((id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            onSwitchAccount(id);
                            setProfileOpen(false);
                          }}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-body-sm transition-colors ${
                            id === currentUserId
                              ? 'bg-rta-bg-light text-rta-text font-medium'
                              : 'text-rta-text hover:bg-rta-bg-light'
                          }`}
                        >
                          {DASHBOARD_USER_LABELS[id]}
                        </button>
                      ))}
                    </div>
                    {!isStaff && (
                      <div className="border-t border-rta-border py-1">
                        <Link
                          href="/"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-body-sm text-rta-text hover:bg-rta-bg-light transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to site
                        </Link>
                      </div>
                    )}
                    <div className="border-t border-rta-border py-1">
                      <button
                        type="button"
                        onClick={() => { handleLogout(); setProfileOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-body-sm text-rta-text hover:bg-rta-bg-light transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <TopFiveOpportunityPicker
        open={pickerOpen}
        loading={pickerLoading}
        opportunities={pickerItems}
        selectedIds={selectedTop5OpportunityIds}
        error={pickerError}
        onRetry={loadPickerItems}
        onClose={() => setPickerOpen(false)}
        onConfirm={handleConfirmTop5}
      />
    </header>
  );
}

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<Record<string, string | string[]>>;
}) {
  use(params ?? Promise.resolve({}));

  const [auth, setAuth] = useState<AuthState | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/auth')
      .then((res) => res.json())
      .then((data) => {
        setAuth({
          authenticated: data.authenticated === true,
          needUser: data.needUser === true,
          userId: data.userId,
          role: data.role,
          capabilities: data.capabilities,
        });
      })
      .catch(() => setAuth({ authenticated: false }));
  }, []);

  const handleAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: accessCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid access code');
        return;
      }
      setAuth({ authenticated: true, needUser: true });
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAs = async (userId: DashboardUserId) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, secret: accessCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      setAuth({
        authenticated: true,
        userId: data.userId,
        role: data.role,
        capabilities: data.capabilities,
      });
    } catch {
      setError('Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async (userId: DashboardUserId) => {
    setError('');
    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Switch failed');
        return;
      }
      setAuth((prev) =>
        prev
          ? {
              ...prev,
              userId: data.userId,
              role: data.role,
              capabilities: data.capabilities,
            }
          : null
      );
      window.location.reload();
    } catch {
      setError('Request failed');
    }
  };

  if (auth === null) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-rta-text-secondary">Loading...</div>
      </div>
    );
  }

  if (auth.authenticated && auth.needUser && !auth.userId) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-rta-bg-light">
        <div className="w-full max-w-md space-y-6 bg-white rounded-lg border border-rta-border shadow-card p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rta-blue text-white">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-rta-text">Sign in as</h1>
              <p className="text-body-sm text-rta-text-secondary">Choose your account</p>
            </div>
          </div>
          {error && <p className="text-body-sm text-rta-red">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            {DASHBOARD_USER_IDS.map((id) => (
              <Button
                key={id}
                type="button"
                variant="outline"
                className="h-auto py-4 border-rta-border hover:bg-rta-bg-light text-rta-text"
                disabled={loading}
                onClick={() => handleLoginAs(id)}
              >
                {DASHBOARD_USER_LABELS[id]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!auth.authenticated || !auth.userId) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-rta-bg-light">
        <div className="w-full max-w-md space-y-6 bg-white rounded-lg border border-rta-border shadow-card p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rta-blue text-white">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-rta-text">Sign in</h1>
              <p className="text-body-sm text-rta-text-secondary">Staff dashboard access</p>
            </div>
          </div>
          <form onSubmit={handleAccessCode} className="space-y-4">
            <div>
              <Label htmlFor="accessCode" className="text-rta-text">
                Access code (optional)
              </Label>
              <Input
                id="accessCode"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter access code if required"
                className="mt-2 border-rta-border focus:ring-rta-blue"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-rta-gold-cta hover:bg-rta-gold-cta-hover text-white"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Continue'}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-rta-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-rta-text-secondary">Or sign in as</span>
            </div>
          </div>
          {error && <p className="text-body-sm text-rta-red">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            {DASHBOARD_USER_IDS.map((id) => (
              <Button
                key={id}
                type="button"
                variant="outline"
                className="h-auto py-4 border-rta-border hover:bg-rta-bg-light text-rta-text"
                disabled={loading}
                onClick={() => handleLoginAs(id)}
              >
                {DASHBOARD_USER_LABELS[id]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentLabel = DASHBOARD_USER_LABELS[auth.userId as DashboardUserId] ?? auth.userId;
  const currentRole = (auth.role as DashboardRole) ?? 'other';

  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center"><div className="animate-pulse text-rta-text-secondary">Loading...</div></div>}>
      <DashboardPresentationProvider>
        <DashboardBar
          currentUserId={auth.userId}
          currentRole={currentRole}
          currentLabel={currentLabel}
          onSwitchAccount={handleSwitchAccount}
        />
        {children}
      </DashboardPresentationProvider>
    </Suspense>
  );
}
