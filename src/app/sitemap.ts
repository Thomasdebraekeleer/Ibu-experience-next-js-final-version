import type { MetadataRoute } from "next";
import {
  buildAlternateLanguages,
  getAbsoluteUrl,
  PUBLIC_PATHS,
  type PublicPath,
} from "@/lib/seo";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: getAbsoluteUrl(path, locale),
      lastModified,
      changeFrequency: path === "/accueil" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/accueil" ? 1 : path.startsWith("/experiences") ? 0.8 : 0.7,
      alternates: {
        languages: buildAlternateLanguages(path as PublicPath),
      },
    }))
  );
}
