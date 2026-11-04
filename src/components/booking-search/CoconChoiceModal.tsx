"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import styles from "./CoconChoiceModal.module.scss";
import { PUBLIC_COCONS, type PublicCoconId } from "@/config/booking/public-places";
import { useCoconGalleries } from "@/lib/booking/use-cocon-galleries";
import CoconMediaCarousel from "./CoconMediaCarousel";

type Props = {
  open: boolean;
  placeId: string | null;
  urls: Record<string, string>;
  indicativeByCocon?: Partial<Record<PublicCoconId, number>>;
  stayNights?: number;
  onClose: () => void;
  onChoose: (coconId: PublicCoconId, url: string) => void;
};

export default function CoconChoiceModal({
  open,
  placeId,
  urls,
  indicativeByCocon,
  stayNights,
  onClose,
  onChoose,
}: Props) {
  const t = useTranslations("bookingSearch.coconChoice");
  const tBooking = useTranslations("bookingSearch");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [galleryResetKey, setGalleryResetKey] = useState(0);

  const entries = useMemo(
    () => PUBLIC_COCONS.filter((c) => urls[c.id]),
    [urls]
  );

  const coconIds = useMemo(
    () => entries.map((c) => c.id),
    [entries]
  );

  const { loading: galleriesLoading, galleries, error: galleriesError, retry } =
    useCoconGalleries(placeId, coconIds, open && entries.length > 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setGalleryResetKey((k) => k + 1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const first = dialogRef.current?.querySelector<HTMLElement>("button[data-primary]");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const firstEl = focusable[0]!;
        const lastEl = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;
  if (entries.length === 0) return null;

  const formatPrice = (coconId: PublicCoconId) => {
    const raw = indicativeByCocon?.[coconId];
    if (raw == null) return null;
    const amount = Math.round(raw);
    if (stayNights != null && stayNights > 0) {
      return t("stayIndicative", { amount, nights: stayNights });
    }
    return t("indicativeFrom", { amount });
  };

  return createPortal(
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cocon-choice-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="cocon-choice-title" className={styles.title}>
            {t("title")}
          </h2>
          <button
            type="button"
            className={styles.dismiss}
            onClick={onClose}
            aria-label={t("close")}
          >
            ×
          </button>
        </div>
        <p className={styles.intro}>{t("intro")}</p>
        <div className={styles.grid}>
          {entries.map((cocon) => {
            const priceLabel = formatPrice(cocon.id);
            const coconName = tBooking(`cocoons.${cocon.nameKey}.name`);
            const remoteImages = galleries[cocon.id]?.images ?? [];
            return (
              <article key={cocon.id} className={styles.card}>
                <CoconMediaCarousel
                  coconName={coconName}
                  fallbackSrc={cocon.image}
                  remoteImages={remoteImages}
                  loadingRemote={galleriesLoading}
                  mediaError={galleriesError}
                  onRetryPhotos={galleriesError ? retry : undefined}
                  resetKey={galleryResetKey}
                />
                <div className={styles.cardBody}>
                  <h3 className={styles.name}>{coconName}</h3>
                  {priceLabel && <p className={styles.price}>{priceLabel}</p>}
                  <button
                    type="button"
                    data-primary
                    className={styles.chooseBtn}
                    onClick={() => onChoose(cocon.id, urls[cocon.id]!)}
                  >
                    {t("choose")}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
