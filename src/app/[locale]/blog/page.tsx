import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternateLanguages, buildCanonicalPath } from "@/lib/seo";

type Props = {
  params: { locale: string };
};

const PATH = "/blog" as const;

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.blog" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      locale: locale === "fr" ? "fr_BE" : "nl_BE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
    alternates: {
      canonical: buildCanonicalPath(PATH, locale),
      languages: buildAlternateLanguages(PATH),
    },
  };
}

export default async function BlogPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  return (
    <div className="tp-hero-area p-relative fix tp-gx-6">
      <div className="tp-hero-wrapper p-relative">
        <div className="tp-hero-shape">
          <div className="tp-hero-shape-1"></div>
          <div className="tp-hero-shape-2"></div>
          <div className="tp-hero-shape-3"></div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tp-hero-title-box text-center">
                <h1 className="tp-hero-title">{t("title")}</h1>
                <p className="tp-hero-subtitle">{t("underConstruction")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
