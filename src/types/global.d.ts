/**
 * Déclarations TypeScript globales
 */

// Meta Pixel (Facebook Pixel)
interface Window {
  fbq: (
    command: "track" | "trackCustom" | "init",
    eventName: string,
    parameters?: Record<string, unknown>
  ) => void;
  _fbq: unknown;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __ibuGaConfigured?: boolean;
}

