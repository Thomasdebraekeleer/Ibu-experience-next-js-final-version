const MAX_NAME_LENGTH = 120;

export function sanitizeBuyerName(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length > MAX_NAME_LENGTH) {
    return normalized.slice(0, MAX_NAME_LENGTH);
  }
  return normalized;
}

export type EmailGreeting = {
  /** Prénom ou nom complet pour « Bonjour X » — jamais deviné depuis un nom complet. */
  salutationName: string | null;
  usesPersonalGreeting: boolean;
};

export function resolveEmailGreeting(input: {
  buyerFirstName: string | null;
  buyerFullName: string | null;
  documentLocale: "fr" | "en";
}): EmailGreeting {
  const first = sanitizeBuyerName(input.buyerFirstName);
  const full = sanitizeBuyerName(input.buyerFullName);

  if (first) {
    return { salutationName: first, usesPersonalGreeting: true };
  }
  if (full) {
    return { salutationName: full, usesPersonalGreeting: true };
  }
  return { salutationName: null, usesPersonalGreeting: false };
}

export function formatEmailHelloLine(
  greeting: EmailGreeting,
  documentLocale: "fr" | "en"
): string {
  if (!greeting.usesPersonalGreeting || !greeting.salutationName) {
    return documentLocale === "en" ? "Hello," : "Bonjour,";
  }
  return documentLocale === "en"
    ? `Hello ${greeting.salutationName},`
    : `Bonjour ${greeting.salutationName},`;
}
