"use client";

import { useTranslations } from "next-intl";
import { useAnalyticsConsent } from "./AnalyticsProvider";
import styles from "./cookie-consent.module.scss";

export default function CookieSettingsLink() {
  const t = useTranslations("cookies");
  const { openConsentSettings } = useAnalyticsConsent();

  return (
    <button
      type="button"
      className={styles.manageLink}
      onClick={openConsentSettings}
    >
      {t("manage")}
    </button>
  );
}
