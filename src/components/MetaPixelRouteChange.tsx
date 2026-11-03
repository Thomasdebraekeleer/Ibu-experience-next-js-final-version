"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/metaPixel";
import { useAnalyticsConsent } from "@/components/analytics/AnalyticsProvider";
import { isGoogleAnalyticsAllowedInBrowser } from "@/lib/analytics/env";

/**
 * PageView Meta Pixel lors des navigations client (SPA).
 */
export default function MetaPixelRouteChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { preferences } = useAnalyticsConsent();

  useEffect(() => {
    if (!isGoogleAnalyticsAllowedInBrowser() || !preferences.marketing) {
      return;
    }
    pageview();
  }, [pathname, searchParams, preferences.marketing]);

  return null;
}
