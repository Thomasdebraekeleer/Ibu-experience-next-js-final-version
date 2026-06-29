import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import {
  Syne,
  Aladin,
  Big_Shoulders_Display,
  Marcellus,
} from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import MetaPixel from "@/components/MetaPixel";
import MetaPixelRouteChange from "@/components/MetaPixelRouteChange";
import { routing, type Locale } from "@/i18n/routing";
import { LODGIFY_SCRIPTS } from "@/config/lodgify";
import { metadataBase } from "@/config/site";
import "../globals.scss";
import "../../../public/assets/css/animation-fallbacks.css";
import "../../../public/assets/css/hero-mobile-optimizations.css";
import "../ibu-bien-etre-mobile-fix.css";
import "../domaine-mehaignoul-mobile-fix.css";
import "../about-mobile-fix.css";

const gellery = localFont({
  src: [
    {
      path: "../../../public/assets/fonts/gallerymodern-webfont.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/gallerymodern-webfont.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/assets/fonts/gallerymodern-webfont.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--tp-ff-gallery",
});

const aladin = Aladin({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--tp-ff-aladin",
});
const syne_body = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-body",
});
const syne_heading = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-heading",
});
const syne_p = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-p",
});
const syne = Syne({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-syne",
});
const big_shoulders = Big_Shoulders_Display({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--tp-ff-shoulders",
});
const marcellus = Marcellus({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--tp-ff-marcellus",
});

export const metadata: Metadata = {
  metadataBase,
  title: "IBÙ Experience - Expériences uniques et immersives",
  description:
    "Découvrez des expériences de voyage authentiques et immersives avec IBÙ Experience. Des séjours uniques nichés dans des lieux d'exception en Belgique.",
  keywords:
    "IBÙ Experience, expériences de voyage, séjours uniques, Belgique, bien-être, gastronomie, nature",
  authors: [{ name: "IBÙ Experience" }],
  openGraph: {
    title: "IBÙ Experience - Expériences uniques et immersives",
    description:
      "Découvrez des expériences de voyage authentiques et immersives avec IBÙ Experience. Des séjours uniques nichés dans des lieux d'exception en Belgique.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/assets/img/inner-project/Photo%20lien/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IBÙ Experience - Expériences uniques",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IBÙ Experience - Expériences uniques et immersives",
    description:
      "Découvrez des expériences de voyage authentiques et immersives avec IBÙ Experience.",
    images: ["/assets/img/inner-project/Photo%20lien/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        id="body"
        suppressHydrationWarning
        className={`${gellery.variable} ${aladin.variable} ${syne_body.variable} ${syne_heading.variable} ${syne_p.variable} ${syne.variable} ${big_shoulders.variable} ${marcellus.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <MetaPixel />
          <Suspense fallback={null}>
            <MetaPixelRouteChange />
          </Suspense>

          <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        </NextIntlClientProvider>
        <Script
          id="lodgify-psb"
          src={LODGIFY_SCRIPTS.portableSearchBar}
          strategy="afterInteractive"
        />
        <Script
          id="lodgify-bnb"
          src={LODGIFY_SCRIPTS.bookNowBox}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
