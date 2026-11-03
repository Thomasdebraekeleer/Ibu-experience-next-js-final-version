"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/constants";
import { isGoogleAnalyticsAllowedInBrowser } from "@/lib/analytics/env";
import {
  applyConsentMode,
  configureGoogleAnalytics,
  sendGaPageView,
} from "@/lib/analytics/gtag";
import type { ConsentPreferences } from "@/lib/analytics/consent-storage";
import type { Locale } from "@/i18n/routing";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";

type Props = {
  analyticsConsent: boolean;
  preferences: ConsentPreferences;
};

export default function GoogleAnalytics({
  analyticsConsent,
  preferences,
}: Props) {
  const locale = useLocale() as Locale;
  const siteLanguage = toAnalyticsSiteLanguage(locale);
  const [loadScript, setLoadScript] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!isGoogleAnalyticsAllowedInBrowser()) return;
    setLoadScript(analyticsConsent);
    if (!analyticsConsent) {
      setScriptReady(false);
    }
  }, [analyticsConsent]);

  useEffect(() => {
    if (!scriptReady || !analyticsConsent) return;
    if (!isGoogleAnalyticsAllowedInBrowser()) return;

    applyConsentMode(preferences);
    configureGoogleAnalytics(siteLanguage);

    sendGaPageView({
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
      page_location: window.location.href,
      site_language: siteLanguage,
    });
  }, [scriptReady, analyticsConsent, preferences, siteLanguage]);

  if (!isGoogleAnalyticsAllowedInBrowser() || !loadScript) {
    return null;
  }

  return (
    <Script
      id="google-analytics-gtag"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
      onLoad={() => setScriptReady(true)}
    />
  );
}
