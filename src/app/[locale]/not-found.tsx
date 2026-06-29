import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NotFoundMain from "@/views/error/not-found-main";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("seo.notFound");
  return {
    title: t("title"),
    robots: { index: false, follow: true },
  };
}

export default function NotFound() {
  return <NotFoundMain />;
}
