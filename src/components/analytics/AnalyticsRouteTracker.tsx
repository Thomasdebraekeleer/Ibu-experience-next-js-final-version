"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { isGoogleAnalyticsAllowedInBrowser } from "@/lib/analytics/env";
import { isGaConfigured, sendGaPageView } from "@/lib/analytics/gtag";
import type { Locale } from "@/i18n/routing";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";

type Props = {
  analyticsConsent: boolean;
};

export default function AnalyticsRouteTracker({ analyticsConsent }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as Locale;
  const siteLanguage = toAnalyticsSiteLanguage(locale);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!analyticsConsent || !isGoogleAnalyticsAllowedInBrowser()) return;
    if (!isGaConfigured()) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    sendGaPageView({
      page_path: pagePath,
      page_title: document.title,
      page_location: window.location.href,
      site_language: siteLanguage,
    });
  }, [pathname, searchParams, analyticsConsent, siteLanguage]);

  return null;
}
