/**
 * Détermine si les tags Google Analytics doivent être actifs sur l'hôte courant.
 * Localhost, previews Vercel et dev sont exclus sauf mode debug explicite.
 */
export function isGoogleAnalyticsHostAllowed(hostname: string): boolean {
  if (process.env.NEXT_PUBLIC_GA_DEBUG === "true") {
    return true;
  }

  const normalized = hostname.toLowerCase();

  if (normalized === "localhost" || normalized === "127.0.0.1") {
    return false;
  }

  if (normalized.endsWith(".vercel.app")) {
    return false;
  }

  return (
    normalized === "ibu-experience.be" ||
    normalized.endsWith(".ibu-experience.be")
  );
}

/** Vérification côté serveur (build / SSR) pour ne pas injecter les scripts hors prod. */
export function shouldInjectGoogleAnalyticsOnServer(): boolean {
  if (process.env.NEXT_PUBLIC_GA_DEBUG === "true") {
    return true;
  }

  if (process.env.NODE_ENV === "development") {
    return false;
  }

  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return false;
  }

  return true;
}

export function isGoogleAnalyticsAllowedInBrowser(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (!shouldInjectGoogleAnalyticsOnServer()) {
    return process.env.NEXT_PUBLIC_GA_DEBUG === "true";
  }

  return isGoogleAnalyticsHostAllowed(window.location.hostname);
}
