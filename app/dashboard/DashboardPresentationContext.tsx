'use client';

import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type DashboardPresentationContextValue = {
  presentationMode: boolean;
  setPresentationMode: (value: boolean) => void;
};

const DashboardPresentationContext = createContext<DashboardPresentationContextValue | null>(null);

export function useDashboardPresentation(): DashboardPresentationContextValue {
  const ctx = useContext(DashboardPresentationContext);
  if (!ctx) {
    return {
      presentationMode: false,
      setPresentationMode: () => {},
    };
  }
  return ctx;
}

export function DashboardPresentationProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const presentationFromUrl = searchParams.get('presentation') === 'true';
  const [override, setOverride] = useState<boolean | null>(null);

  const presentationMode = override !== null ? override : presentationFromUrl;

  const setPresentationMode = useCallback((value: boolean) => {
    setOverride(value);
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('presentation', 'true');
    } else {
      url.searchParams.delete('presentation');
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  const value = useMemo(
    () => ({ presentationMode, setPresentationMode }),
    [presentationMode, setPresentationMode]
  );

  return (
    <DashboardPresentationContext.Provider value={value}>
      {children}
    </DashboardPresentationContext.Provider>
  );
}
