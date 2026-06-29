import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HomeMain from "@/views/homes/home-1";
import { buildAlternateLanguages, buildCanonicalPath } from "@/lib/seo";

type Props = {
  params: { locale: string };
};

const PATH = "/accueil" as const;

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.home" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      locale: locale === "fr" ? "fr_BE" : "nl_BE",
      type: "website",
      images: [
        {
          url: "/assets/img/inner-project/Photo%20lien/og-image.jpg",
          width: 1200,
          height: 630,
          alt: t("openGraphTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: ["/assets/img/inner-project/Photo%20lien/og-image.jpg"],
    },
    alternates: {
      canonical: buildCanonicalPath(PATH, locale),
      languages: buildAlternateLanguages(PATH),
    },
  };
}

export default function AccueilPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  return <HomeMain />;
}
