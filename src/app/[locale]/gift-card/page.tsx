import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import GiftCardMain from "@/views/gift-card/gift-card-main";
import { buildAlternateLanguages, buildCanonicalPath } from "@/lib/seo";

type Props = {
  params: { locale: string };
};

const PATH = "/gift-card" as const;

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo.giftCard" });

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

export default function GiftCardPage({ params: { locale } }: Props) {
  setRequestLocale(locale);
  return <GiftCardMain />;
}
