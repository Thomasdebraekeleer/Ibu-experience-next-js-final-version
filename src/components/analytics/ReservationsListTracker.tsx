"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { trackViewItemList } from "@/lib/analytics/events";
import { normalizeAppPathname } from "@/lib/analytics/page-context";
import type { Locale } from "@/i18n/routing";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";

type Props = {
  analyticsConsent: boolean;
};

export default function ReservationsListTracker({ analyticsConsent }: Props) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const siteLanguage = toAnalyticsSiteLanguage(locale);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!analyticsConsent) return;
    if (normalizeAppPathname(pathname) !== "/reservations") return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackViewItemList(pathname, siteLanguage, "reservations_places");
  }, [pathname, analyticsConsent, siteLanguage]);

  return null;
}