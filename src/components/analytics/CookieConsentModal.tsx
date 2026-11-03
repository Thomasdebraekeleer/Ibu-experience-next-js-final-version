"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./cookie-consent.module.scss";

type Props = {
  open: boolean;
  initialAnalytics: boolean;
  initialMarketing: boolean;
  onClose: () => void;
  onSave: (analytics: boolean, marketing: boolean) => void;
};

export default function CookieConsentModal({
  open,
  initialAnalytics,
  initialMarketing,
  onClose,
  onSave,
}: Props) {
  const t = useTranslations("cookies");
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [marketing, setMarketing] = useState(initialMarketing);

  useEffect(() => {
    if (open) {
      setAnalytics(initialAnalytics);
      setMarketing(initialMarketing);
    }
  }, [open, initialAnalytics, initialMarketing]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-labelledby="cookie-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cookie-modal-title" className={styles.modalTitle}>
          {t("modal.title")}
        </h2>
        <p className={styles.modalDescription}>{t("modal.description")}</p>

        <div className={styles.preferenceRow}>
          <div>
            <p className={styles.preferenceTitle}>{t("categories.essential.title")}</p>
            <p className={styles.preferenceDesc}>{t("categories.essential.description")}</p>
          </div>
          <span className={styles.alwaysOn}>{t("categories.alwaysOn")}</span>
        </div>

        <div className={styles.preferenceRow}>
          <div>
            <p className={styles.preferenceTitle}>{t("categories.analytics.title")}</p>
            <p className={styles.preferenceDesc}>{t("categories.analytics.description")}</p>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <span className={styles.slider} />
          </label>
        </div>

        <div className={styles.preferenceRow}>
          <div>
            <p className={styles.preferenceTitle}>{t("categories.marketing.title")}</p>
            <p className={styles.preferenceDesc}>{t("categories.marketing.description")}</p>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            <span className={styles.slider} />
          </label>
        </div>

        <div className={styles.modalActions}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            {t("modal.cancel")}
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => onSave(analytics, marketing)}
          >
            {t("modal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
