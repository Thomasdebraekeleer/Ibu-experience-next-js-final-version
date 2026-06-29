import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "nl-BE"],
  defaultLocale: "fr",
  localePrefix: "as-needed",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
