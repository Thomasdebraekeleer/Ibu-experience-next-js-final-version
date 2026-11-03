"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { trackBookingClick } from "@/lib/analytics/events";
import type { Locale } from "@/i18n/routing";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";

type Props = {
  analyticsConsent: boolean;
};

function isLodgifyBookingLink(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    return url.hostname.includes("lodgify.com");
  } catch {
    return href.includes("lodgify.com");
  }
}

export default function BookingClickTracker({ analyticsConsent }: Props) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const siteLanguage = toAnalyticsSiteLanguage(locale);

  useEffect(() => {
    if (!analyticsConsent) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor?.href || !isLodgifyBookingLink(anchor.href)) return;

      const dataLocation = anchor.getAttribute("data-analytics-location");
      trackBookingClick({
        href: anchor.href,
        siteLanguage,
        buttonLocation: dataLocation ?? pathname,
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [analyticsConsent, pathname, siteLanguage]);

  return null;
}
