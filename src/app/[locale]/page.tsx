import { redirect } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

type Props = {
  params: { locale: string };
};

export default function LocaleIndexPage({ params: { locale } }: Props) {
  setRequestLocale(locale);

  redirect({
    href: "/accueil",
    locale: locale as Locale,
  });
}
