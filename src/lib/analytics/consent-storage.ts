import { CONSENT_STORAGE_KEY } from "./constants";

export type ConsentPreferences = {
  /** Mesure d'audience (Google Analytics). */
  analytics: boolean;
  /** Publicité / Meta Pixel. */
  marketing: boolean;
  /** Horodatage ISO de la dernière mise à jour. */
  updatedAt: string;
};

export type StoredConsent = ConsentPreferences & { version: 1 };

const DEFAULT_DENIED: ConsentPreferences = {
  analytics: false,
  marketing: false,
  updatedAt: "",
};

function isStoredConsent(value: unknown): value is StoredConsent {
  if (!value || typeof value !== "object") return false;
  const v = value as StoredConsent;
  return (
    v.version === 1 &&
    typeof v.analytics === "boolean" &&
    typeof v.marketing === "boolean" &&
    typeof v.updatedAt === "string"
  );
}

export function getDefaultDeniedConsent(): ConsentPreferences {
  return { ...DEFAULT_DENIED, updatedAt: new Date().toISOString() };
}

export function readStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredConsent(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredConsent(preferences: ConsentPreferences): StoredConsent {
  const stored: StoredConsent = {
    version: 1,
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    updatedAt: preferences.updatedAt || new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
  }

  return stored;
}

export function hasConsentChoice(stored: StoredConsent | null): boolean {
  return stored !== null && Boolean(stored.updatedAt);
}
