import type { PageType } from "./taxonomy";

const LOCALE_PREFIX = /^\/nl-BE(?=\/|$)/;

/** Retire le préfixe locale next-intl du pathname App Router. */
export function normalizeAppPathname(pathname: string): string {
  const raw = pathname.split("?")[0] || "/";
  const stripped = raw.replace(LOCALE_PREFIX, "") || "/";
  if (stripped !== "/" && stripped.endsWith("/")) {
    return stripped.slice(0, -1);
  }
  return stripped === "" ? "/" : stripped;
}

export function getPageType(pathname: string): PageType {
  const path = normalizeAppPathname(pathname);

  if (path === "/" || path === "/accueil") return "home";
  if (path === "/reservations") return "reservations";
  if (path === "/domaine-de-mehaignoul") return "domain";
  if (path === "/experiences") return "experiences";
  if (path.startsWith("/experiences/")) return "experience_detail";
  if (path === "/a-propos") return "about";
  if (path === "/contact") return "contact";
  if (path === "/gift-card") return "gift_card";
  if (path === "/devenir-partenaire") return "partner";
  if (path === "/blog") return "blog";
  if (path === "/faq") return "faq";

  return "other";
}

/** Normalise une URL interne (pathname seul). */
export function normalizeInternalHref(href: string): string | null {
  try {
    const url = new URL(href, "https://ibu-experience.be");
    if (url.hostname !== "ibu-experience.be" && !href.startsWith("/")) {
      return null;
    }
    if (href.startsWith("/")) {
      return normalizeAppPathname(href);
    }
    if (url.hostname.includes("ibu-experience.be")) {
      return normalizeAppPathname(url.pathname);
    }
    return null;
  } catch {
    if (href.startsWith("/")) {
      return normalizeAppPathname(href);
    }
    return null;
  }
}