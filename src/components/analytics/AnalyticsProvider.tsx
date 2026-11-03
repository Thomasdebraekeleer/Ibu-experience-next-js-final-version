"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Suspense } from "react";
import { CONSENT_UPDATED_EVENT } from "@/lib/analytics/constants";
import {
  getDefaultDeniedConsent,
  hasConsentChoice,
  readStoredConsent,
  writeStoredConsent,
  type ConsentPreferences,
  type StoredConsent,
} from "@/lib/analytics/consent-storage";
import {
  applyConsentMode,
  clearGoogleAnalyticsCookies,
} from "@/lib/analytics/gtag";
import { isGoogleAnalyticsAllowedInBrowser } from "@/lib/analytics/env";
import GoogleAnalytics from "./GoogleAnalytics";
import AnalyticsRouteTracker from "./AnalyticsRouteTracker";
import AccommodationViewTracker from "./AccommodationViewTracker";
import BookingClickTracker from "./BookingClickTracker";
import CookieConsentBanner from "./CookieConsentBanner";
import CookieConsentModal from "./CookieConsentModal";

type AnalyticsContextValue = {
  preferences: ConsentPreferences;
  hasChoice: boolean;
  openConsentSettings: () => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function useAnalyticsConsent(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error("useAnalyticsConsent must be used within AnalyticsProvider");
  }
  return ctx;
}

function AnalyticsProviderInner({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredConsent | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setStored(readStoredConsent());
    setHydrated(true);
  }, []);

  const preferences = useMemo<ConsentPreferences>(() => {
    if (stored) {
      return {
        analytics: stored.analytics,
        marketing: stored.marketing,
        updatedAt: stored.updatedAt,
      };
    }
    return getDefaultDeniedConsent();
  }, [stored]);

  const hasChoice = hydrated && hasConsentChoice(stored);
  const showBanner = hydrated && isGoogleAnalyticsAllowedInBrowser() && !hasChoice;

  const persistPreferences = useCallback(
    (analytics: boolean, marketing: boolean) => {
      const previous = readStoredConsent();
      const next = writeStoredConsent({
        analytics,
        marketing,
        updatedAt: new Date().toISOString(),
      });

      setStored(next);
      setModalOpen(false);

      if (isGoogleAnalyticsAllowedInBrowser()) {
        applyConsentMode(next);
      }

      if (previous?.analytics && !next.analytics) {
        clearGoogleAnalyticsCookies();
      }

      window.dispatchEvent(
        new CustomEvent(CONSENT_UPDATED_EVENT, { detail: next })
      );
    },
    []
  );

  const handleAcceptAll = useCallback(() => {
    persistPreferences(true, true);
  }, [persistPreferences]);

  const handleRejectAll = useCallback(() => {
    persistPreferences(false, false);
  }, [persistPreferences]);

  const handleSaveCustom = useCallback(
    (analytics: boolean, marketing: boolean) => {
      persistPreferences(analytics, marketing);
    },
    [persistPreferences]
  );

  const openConsentSettings = useCallback(() => {
    setModalOpen(true);
  }, []);

  const contextValue = useMemo(
    () => ({
      preferences,
      hasChoice,
      openConsentSettings,
    }),
    [preferences, hasChoice, openConsentSettings]
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
      <GoogleAnalytics
        analyticsConsent={preferences.analytics}
        preferences={preferences}
      />
      <Suspense fallback={null}>
        <AnalyticsRouteTracker analyticsConsent={preferences.analytics} />
      </Suspense>
      <AccommodationViewTracker analyticsConsent={preferences.analytics} />
      <BookingClickTracker analyticsConsent={preferences.analytics} />
      {showBanner && (
        <CookieConsentBanner
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onCustomize={() => setModalOpen(true)}
        />
      )}
      <CookieConsentModal
        open={modalOpen}
        initialAnalytics={preferences.analytics}
        initialMarketing={preferences.marketing}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCustom}
      />
    </AnalyticsContext.Provider>
  );
}

export default function AnalyticsProvider({ children }: { children: ReactNode }) {
  return <AnalyticsProviderInner>{children}</AnalyticsProviderInner>;
}
