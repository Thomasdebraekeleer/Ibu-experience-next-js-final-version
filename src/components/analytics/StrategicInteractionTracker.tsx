"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { GIFT_CARD_CATALOG } from "@/config/gift-cards/catalog";
import { DOMAIN_PAGES } from "@/lib/analytics/accommodations";
import {
  trackClickEmail,
  trackClickPhone,
  trackCtaClick,
  trackGiftCardClick,
  trackSelectItem,
} from "@/lib/analytics/events";
import {
  getPageType,
  normalizeAppPathname,
  normalizeInternalHref,
} from "@/lib/analytics/page-context";
import type { Locale } from "@/i18n/routing";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";

type Props = {
  analyticsConsent: boolean;
};

const STRIPE_LINKS = new Set(GIFT_CARD_CATALOG.map((o) => o.paymentLinkUrl));

const DOMAIN_PATH = "/domaine-de-mehaignoul";

function isPlainHeaderNav(anchor: HTMLAnchorElement): boolean {
  const header = anchor.closest("header");
  if (!header) return false;
  const isBtn =
    anchor.classList.contains("tp-btn-white") ||
    anchor.classList.contains("tp-btn-black-md") ||
    anchor.classList.contains("tp-btn-circle");
  return !isBtn;
}

function isFooterSitemapLink(anchor: HTMLAnchorElement): boolean {
  if (!anchor.closest(".tp-footer-4-widget")) return false;
  return (
    anchor.classList.contains("tp-btn-white-lg") === false &&
    !anchor.classList.contains("tp-btn-circle")
  );
}

function isStrategicButton(anchor: HTMLAnchorElement): boolean {
  return (
    anchor.classList.contains("tp-btn-circle") ||
    anchor.classList.contains("tp-btn-white-lg") ||
    anchor.classList.contains("tp-btn-black-md") ||
    Boolean(anchor.dataset.analyticsCta)
  );
}

function resolveCtaId(sourcePath: string, destPath: string): string | null {
  const source = getPageType(sourcePath);

  if (destPath === "/reservations") {
    return `${source}_view_reservations`;
  }
  if (destPath === "/contact") {
    return `${source}_contact`;
  }
  if (destPath === "/gift-card") {
    return `${source}_gift_card`;
  }
  if (destPath === "/domaine-de-mehaignoul") {
    return `${source}_discover_domaine_mehaignoul`;
  }
  if (destPath.startsWith("/experiences")) {
    return `${source}_discover_experience`;
  }
  return null;
}

function resolveButtonLocation(anchor: HTMLAnchorElement): string {
  if (anchor.dataset.analyticsLocation) return anchor.dataset.analyticsLocation;
  if (anchor.closest("footer")) return "footer";
  if (anchor.closest(".tm-hero-area, .showcase-details-2-area")) return "hero";
  return "main_content";
}

export default function StrategicInteractionTracker({ analyticsConsent }: Props) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const siteLanguage = toAnalyticsSiteLanguage(locale);

  useEffect(() => {
    if (!analyticsConsent) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor?.href) return;

      const href = anchor.getAttribute("href") ?? "";

      if (href.startsWith("mailto:")) {
        trackClickEmail(siteLanguage, pathname);
        return;
      }

      if (href.startsWith("tel:")) {
        trackClickPhone(siteLanguage, pathname);
        return;
      }

      if (STRIPE_LINKS.has(href)) {
        const offer = GIFT_CARD_CATALOG.find((o) => o.paymentLinkUrl === href);
        trackGiftCardClick({
          siteLanguage,
          pathname,
          ctaId: "gift_card_checkout",
          giftCardType: offer?.offerId,
          buttonLocation: resolveButtonLocation(anchor),
        });
        return;
      }

      const internalPath = normalizeInternalHref(href);
      if (!internalPath) return;

      if (internalPath === DOMAIN_PATH) {
        const fromReservationsGrid = anchor.closest(".tp-project-5-2-thumb");
        if (fromReservationsGrid || anchor.dataset.analyticsSelectItem === "true") {
          const domain = DOMAIN_PAGES[DOMAIN_PATH];
          trackSelectItem({
            siteLanguage,
            pathname,
            itemId: domain.place_id,
            itemName: domain.place_name,
            buttonLocation: fromReservationsGrid
              ? "reservations_grid"
              : resolveButtonLocation(anchor),
          });
        }
      }

      if (isPlainHeaderNav(anchor) || isFooterSitemapLink(anchor)) {
        return;
      }

      if (!isStrategicButton(anchor) && !anchor.dataset.analyticsCta) {
        return;
      }

      const ctaId =
        anchor.dataset.analyticsCta ??
        resolveCtaId(normalizeAppPathname(pathname), internalPath);
      if (!ctaId) return;

      trackCtaClick({
        siteLanguage,
        pathname,
        ctaId,
        buttonLocation: resolveButtonLocation(anchor),
        destinationType: "internal",
        destinationPath: internalPath,
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [analyticsConsent, pathname, siteLanguage]);

  return null;
}