/** Hôtes Lodgify autorisés pour les redirects checkout (production). */
export const ALLOWED_LODGIFY_CHECKOUT_HOSTS = new Set<string>([
  "ibu-experience.lodgify.com",
]);

export function isAllowedCheckoutHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host.includes("npreview")) return false;
  if (process.env.NODE_ENV === "production") {
    return ALLOWED_LODGIFY_CHECKOUT_HOSTS.has(host);
  }
  return ALLOWED_LODGIFY_CHECKOUT_HOSTS.has(host);
}

export function isAllowedCheckoutUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return isAllowedCheckoutHostname(parsed.hostname);
  } catch {
    return false;
  }
}
