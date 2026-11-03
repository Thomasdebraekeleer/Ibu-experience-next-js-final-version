"use client";

import { useTranslations } from "next-intl";
import styles from "./cookie-consent.module.scss";

type Props = {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
};

export default function CookieConsentBanner({
  onAcceptAll,
  onRejectAll,
  onCustomize,
}: Props) {
  const t = useTranslations("cookies");

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className={styles.bannerInner}>
        <div className={styles.bannerText}>
          <p id="cookie-consent-title" className={styles.title}>
            {t("banner.title")}
          </p>
          <p id="cookie-consent-desc" className={styles.description}>
            {t("banner.description")}
          </p>
        </div>
        <div className={styles.bannerActions}>
          <button type="button" className={styles.btnSecondary} onClick={onRejectAll}>
            {t("banner.reject")}
          </button>
          <button type="button" className={styles.btnSecondary} onClick={onCustomize}>
            {t("banner.customize")}
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onAcceptAll}>
            {t("banner.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
