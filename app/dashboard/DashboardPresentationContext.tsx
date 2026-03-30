'use client';

import { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const SESSION_TOP5_KEY = 'rta_dashboard_top5_opp_ids';
const SESSION_PRESENTATION_KEY = 'rta_dashboard_presentation_mode';

type DashboardPresentationContextValue = {
  presentationMode: boolean;
  setPresentationMode: (value: boolean) => void;
  selectedTop5OpportunityIds: string[];
  setSelectedTop5OpportunityIds: (ids: string[]) => void;
  clearPresentationSelection: () => void;
  presentationSessionOpenedAt: number | null;
  setPresentationSessionOpenedAt: (value: number | null) => void;
};

const DashboardPresentationContext = createContext<DashboardPresentationContextValue | null>(null);

export function useDashboardPresentation(): DashboardPresentationContextValue {
  const ctx = useContext(DashboardPresentationContext);
  if (!ctx) {
    return {
      presentationMode: false,
      setPresentationMode: () => {},
      selectedTop5OpportunityIds: [],
      setSelectedTop5OpportunityIds: () => {},
      clearPresentationSelection: () => {},
      presentationSessionOpenedAt: null,
      setPresentationSessionOpenedAt: () => {},
    };
  }
  return ctx;
}

export function DashboardPresentationProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const presentationFromUrl = searchParams.get('presentation') === 'true';
  const [override, setOverride] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem(SESSION_PRESENTATION_KEY) === 'true' ? true : null;
  });
  const [selectedTop5OpportunityIdsState, setSelectedTop5OpportunityIdsState] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.sessionStorage.getItem(SESSION_TOP5_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((id): id is string => typeof id === 'string');
    } catch {
      return [];
    }
  });
  const [presentationSessionOpenedAt, setPresentationSessionOpenedAt] = useState<number | null>(null);

  const presentationMode = override !== null ? override : presentationFromUrl;

  const setPresentationMode = useCallback((value: boolean) => {
    setOverride(value);
    if (typeof window !== 'undefined') {
      if (value) {
        window.sessionStorage.setItem(SESSION_PRESENTATION_KEY, 'true');
      } else {
        window.sessionStorage.removeItem(SESSION_PRESENTATION_KEY);
      }
    }
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('presentation', 'true');
    } else {
      url.searchParams.delete('presentation');
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  const setSelectedTop5OpportunityIds = useCallback((ids: string[]) => {
    const next = ids.slice(0, 5);
    setSelectedTop5OpportunityIdsState(next);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_TOP5_KEY, JSON.stringify(next));
    }
  }, []);

  const clearPresentationSelection = useCallback(() => {
    setSelectedTop5OpportunityIdsState([]);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(SESSION_TOP5_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      presentationMode,
      setPresentationMode,
      selectedTop5OpportunityIds: selectedTop5OpportunityIdsState,
      setSelectedTop5OpportunityIds,
      clearPresentationSelection,
      presentationSessionOpenedAt,
      setPresentationSessionOpenedAt,
    }),
    [
      presentationMode,
      setPresentationMode,
      selectedTop5OpportunityIdsState,
      setSelectedTop5OpportunityIds,
      clearPresentationSelection,
      presentationSessionOpenedAt,
      setPresentationSessionOpenedAt,
    ]
  );

  return (
    <DashboardPresentationContext.Provider value={value}>
      {children}
    </DashboardPresentationContext.Provider>
  );
}
