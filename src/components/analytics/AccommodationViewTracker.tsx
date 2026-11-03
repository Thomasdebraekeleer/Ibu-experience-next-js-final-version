"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { trackViewItem } from "@/lib/analytics/events";
import type { Locale } from "@/i18n/routing";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";

type Props = {
  analyticsConsent: boolean;
};

export default function AccommodationViewTracker({ analyticsConsent }: Props) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const siteLanguage = toAnalyticsSiteLanguage(locale);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!analyticsConsent) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackViewItem(pathname, siteLanguage);
  }, [pathname, analyticsConsent, siteLanguage]);

  return null;
}
