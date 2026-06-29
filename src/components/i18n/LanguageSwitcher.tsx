"use client";

import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type LanguageSwitcherProps = {
  variant?: "homepage" | "default";
  className?: string;
};

const LOCALES: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "nl-BE", label: "NL" },
];

function LanguageSwitcherInner({
  variant = "default",
  className = "",
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("language");

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    router.replace(href, { locale: newLocale });
  };

  const variantClass =
    variant === "homepage"
      ? "language-switcher--homepage"
      : "language-switcher--default";

  return (
    <>
      <style jsx>{`
        .language-switcher {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          line-height: 1;
          white-space: nowrap;
        }
        .language-switcher--homepage {
          color: #fcf8e3;
        }
        .language-switcher--homepage .language-switcher__btn.is-active {
          color: #ffffff;
        }
        .language-switcher--homepage
          .language-switcher__btn:not(.is-active):hover {
          color: #ffffff;
          opacity: 0.85;
        }
        .language-switcher--default {
          color: #053725;
        }
        .language-switcher--default .language-switcher__btn.is-active {
          color: #031c13;
        }
        .language-switcher--default
          .language-switcher__btn:not(.is-active):hover {
          color: #031c13;
          opacity: 0.75;
        }
        .language-switcher__btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font: inherit;
          color: inherit;
          opacity: 0.65;
          transition: opacity 0.2s ease, color 0.2s ease;
        }
        .language-switcher__btn.is-active {
          opacity: 1;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .language-switcher__sep {
          opacity: 0.5;
          user-select: none;
        }
      `}</style>
      <nav
        className={`language-switcher ${variantClass} ${className}`.trim()}
        aria-label="Language"
      >
        {LOCALES.map((item, index) => (
          <span key={item.code} className="d-inline-flex align-items-center">
            {index > 0 && (
              <span className="language-switcher__sep" aria-hidden="true">
                |
              </span>
            )}
            <button
              type="button"
              className={`language-switcher__btn${
                locale === item.code ? " is-active" : ""
              }`}
              onClick={() => switchLocale(item.code)}
              aria-label={
                item.code === "fr"
                  ? t("switchToFrench")
                  : t("switchToDutch")
              }
              aria-current={locale === item.code ? "true" : undefined}
            >
              {item.label}
            </button>
          </span>
        ))}
      </nav>
    </>
  );
}

export default function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense fallback={null}>
      <LanguageSwitcherInner {...props} />
    </Suspense>
  );
}
