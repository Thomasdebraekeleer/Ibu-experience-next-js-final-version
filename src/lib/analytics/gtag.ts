import { GA_MEASUREMENT_ID } from "./constants";
import type { ConsentPreferences } from "./consent-storage";
import type { AnalyticsSiteLanguage } from "./site-language";

export function gtagCommand(...args: unknown[]): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag(...args);
}

export function applyConsentMode(preferences: ConsentPreferences): void {
  gtagCommand("consent", "update", {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.marketing ? "granted" : "denied",
    ad_user_data: preferences.marketing ? "granted" : "denied",
    ad_personalization: preferences.marketing ? "granted" : "denied",
  });
}

export function configureGoogleAnalytics(siteLanguage: AnalyticsSiteLanguage): void {
  if (typeof window === "undefined" || window.__ibuGaConfigured) {
    return;
  }

  gtagCommand("js", new Date());
  gtagCommand("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    language: siteLanguage,
  });

  gtagCommand("set", "user_properties", {
    site_language: siteLanguage,
  });

  window.__ibuGaConfigured = true;
}

export function sendGaPageView(params: {
  page_path: string;
  page_title: string;
  page_location: string;
  site_language: AnalyticsSiteLanguage;
}): void {
  gtagCommand("event", "page_view", {
    page_path: params.page_path,
    page_title: params.page_title,
    page_location: params.page_location,
    site_language: params.site_language,
  });
}

export function trackGaEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
): void {
  const cleaned: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        cleaned[key] = value;
      }
    }
  }
  gtagCommand("event", eventName, cleaned);
}

/** Supprime les cookies GA first-party connus après retrait du consentement. */
export function clearGoogleAnalyticsCookies(): void {
  if (typeof document === "undefined") return;

  const hostname = window.location.hostname;
  const cookiePrefixes = ["_ga", "_ga_", "_gid", "_gat"];

  document.cookie.split(";").forEach((part) => {
    const name = part.split("=")[0]?.trim();
    if (!name) return;
    const shouldClear = cookiePrefixes.some(
      (prefix) => name === prefix || name.startsWith("_ga_")
    );
    if (!shouldClear) return;

    const domains = [undefined, hostname, `.${hostname}`];
    domains.forEach((domain) => {
      const domainPart = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; Max-Age=0; path=/${domainPart}`;
    });
  });

  window.__ibuGaConfigured = false;
}

export function isGaConfigured(): boolean {
  return typeof window !== "undefined" && Boolean(window.__ibuGaConfigured);
}
