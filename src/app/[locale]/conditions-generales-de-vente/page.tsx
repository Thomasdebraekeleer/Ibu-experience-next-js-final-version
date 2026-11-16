import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CgvMain from "@/views/cgv/cgv-main";
import { buildAlternateLanguages, buildCanonicalPath } from "@/lib/seo";

type Props = {
  params: { locale: string };
};

const PATH = "/conditions-generales-de-vente" as const;

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.cgv" });

  return {
    title: t("title"),
    description: t("description"),
    robots: { index: true, follow: true },
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      locale: locale === "fr" ? "fr_BE" : "nl_BE",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
    alternates: {
      canonical: buildCanonicalPath(PATH, locale),
      languages: buildAlternateLanguages(PATH),
    },
  };
}

export default function ConditionsGeneralesPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return <CgvMain />;
}