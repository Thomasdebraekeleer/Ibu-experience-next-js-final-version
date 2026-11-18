"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { trackBookingClick } from "@/lib/analytics/events";
import { getPageType } from "@/lib/analytics/page-context";
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

function resolveButtonLocation(anchor: HTMLAnchorElement, pathname: string): string {
  if (anchor.dataset.analyticsLocation) {
    return anchor.dataset.analyticsLocation;
  }
  if (anchor.closest(".tp-projct-5-2-btn-box")) {
    return "reservations_cta";
  }
  if (anchor.closest(".lodgify-hero-container, .availability-search-hero-wrapper")) {
    return "hero";
  }
  return pathname;
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

      trackBookingClick({
        href: anchor.href,
        siteLanguage,
        buttonLocation: resolveButtonLocation(anchor, pathname),
        pathname,
        pageType: getPageType(pathname),
        ctaId: anchor.dataset.analyticsCta,
        coconId: anchor.dataset.analyticsCocon,
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [analyticsConsent, pathname, siteLanguage]);

  return null;
}