"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./HeroBookingSearch.module.scss";

export type FloatingPanelKind = "place" | "cocon" | "dates" | "guests";

type Props = {
  open: boolean;
  kind: FloatingPanelKind | null;
  /** Barre entière : position verticale au-dessus de la carte. */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Colonne active (ex. segment Hébergement) pour l’alignement horizontal à gauche. */
  getColumnAnchorEl?: () => HTMLElement | null;
  isMobile: boolean;
  onClose: () => void;
  title: string;
  /** Sous-titre mobile (ex. dates sélectionnées). */
  mobileHeaderExtra?: React.ReactNode;
  children: React.ReactNode;
};

const PANEL_WIDTH: Record<FloatingPanelKind, number> = {
  place: 420,
  cocon: 420,
  dates: 420,
  guests: 420,
};

export default function FloatingBookingPanel({
  open,
  kind,
  anchorRef,
  getColumnAnchorEl,
  isMobile,
  onClose,
  title,
  mobileHeaderExtra,
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastLayoutRef = useRef<string>("");
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const recompute = () => {
    if (!open || !kind || isMobile || !anchorRef.current) {
      setStyle(null);
      return;
    }
    const barRect = anchorRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const margin = 16;
    const width = Math.min(PANEL_WIDTH[kind], vw - margin * 2);
    let left: number;
    if (kind === "place") {
      left = barRect.left;
    } else {
      const columnEl = getColumnAnchorEl?.() ?? anchorRef.current;
      left = columnEl.getBoundingClientRect().left;
    }
    left = Math.max(margin, Math.min(left, vw - margin - width));
    const gap = 14;
    const bottom = window.innerHeight - barRect.top + gap;
    const maxHeight = barRect.top - margin - gap;
    const key = `${left}|${bottom}|${width}|${maxHeight}`;
    if (key === lastLayoutRef.current) return;
    lastLayoutRef.current = key;
    setStyle({
      position: "fixed",
      left,
      width,
      bottom,
      maxHeight,
    });
  };

  useLayoutEffect(() => {
    if (!open || !kind) {
      setVisible(false);
      setStyle(null);
      lastLayoutRef.current = "";
      return;
    }
    if (isMobile) {
      setVisible(true);
      return;
    }
    recompute();
    const raf = requestAnimationFrame(() => setVisible(true));
    const ro = panelRef.current ? new ResizeObserver(recompute) : null;
    if (panelRef.current && ro) ro.observe(panelRef.current);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute lit le DOM anchor
  }, [open, kind, isMobile, children]);

  useEffect(() => {
    if (!open || isMobile) return;
    const onScrollOrResize = () => recompute();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);

    // ScrollSmoother (GSAP) déplace #smooth-content en transform : peu d’events scroll par frame.
    let rafId = 0;
    const syncWithScroll = () => {
      recompute();
      rafId = requestAnimationFrame(syncWithScroll);
    };
    rafId = requestAnimationFrame(syncWithScroll);

    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isMobile, kind]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, onClose, anchorRef]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const focusable = panelRef.current.querySelector<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
  }, [open, kind]);

  if (!mounted || !open || !kind) return null;

  if (isMobile) {
    return createPortal(
      <div className={styles.mobilePanelOverlay} role="presentation" onClick={onClose}>
        <div
          ref={panelRef}
          className={styles.mobilePanelSheet}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.mobilePanelHeader}>
            <div className={styles.mobilePanelHeaderMain}>
              <h2 id={titleId} className={styles.panelTitle}>
                {title}
              </h2>
              {mobileHeaderExtra ? (
                <p className={styles.mobilePanelHeaderExtra}>{mobileHeaderExtra}</p>
              ) : null}
            </div>
            <button type="button" className={styles.mobilePanelClose} onClick={onClose}>
              ×
            </button>
          </div>
          <div className={styles.panelBodyScroll}>{children}</div>
        </div>
      </div>,
      document.body
    );
  }

  if (!style) return null;

  return createPortal(
    <>
      <div
        className={styles.floatingBackdrop}
        aria-hidden="true"
        onMouseDown={onClose}
      />
      <div
        ref={panelRef}
        className={`${styles.floatingPanel} ${styles[`panelKind_${kind}`]} ${kind === "place" ? styles.floatingPanelPlaceMenu : ""} ${kind === "cocon" ? styles.floatingPanelCoconMenu : ""} ${kind === "dates" ? styles.floatingPanelDatesMenu : ""} ${visible ? styles.floatingPanelVisible : ""}`}
        style={style}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
      >
        <h2
          id={titleId}
          className={
            kind === "place" || kind === "dates" ? styles.panelTitleSrOnly : styles.panelTitle
          }
        >
          {title}
        </h2>
        <div className={styles.floatingPanelInner}>{children}</div>
      </div>
    </>,
    document.body
  );
}
