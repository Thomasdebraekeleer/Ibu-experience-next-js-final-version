"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./HeroBookingSearch.module.scss";
import { PUBLIC_COCONS } from "@/config/booking/public-places";
import {
  dayAggregateVisual,
  isArrivalSelectable,
  isDepartureSelectable,
} from "@/lib/booking/stay-selection";
import type { DayIndex } from "@/lib/booking/stay-selection";
import type { DayRate } from "@/lib/booking/types";
import type { PublicCoconFilter } from "@/config/booking/public-places";
import { addDaysYmd, compareYmd } from "@/lib/dates/ymd";

gsap.registerPlugin(useGSAP);

type Props = {
  localeTag: string;
  monthStart: string;
  monthCount: number;
  today: string;
  coconFilter: PublicCoconFilter;
  dayIndex: DayIndex;
  ratesByCocon: Record<string, DayRate[]>;
  capacityByCocon: Map<string, number>;
  adults: number;
  arrival: string | null;
  departure: string | null;
  onSelectDate: (date: string) => void;
  loading?: boolean;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  isMobile?: boolean;
  /** Bouton d’action mobile (ex. Suivant), aligné avec la légende. */
  mobileFooterAction?: React.ReactNode;
};

type PartialTipState = {
  lines: string[];
  x: number;
  y: number;
};

function monthDays(monthStart: string): string[] {
  const [y, m] = monthStart.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const last = new Date(Date.UTC(y, m, 0));
  const days: string[] = [];
  for (let d = 1; d <= last.getUTCDate(); d += 1) {
    days.push(
      [
        y,
        String(m).padStart(2, "0"),
        String(d).padStart(2, "0"),
      ].join("-")
    );
  }
  return days;
}

function weekdayOffset(monthStart: string): number {
  const [y, m] = monthStart.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const day = first.getUTCDay();
  return day === 0 ? 6 : day - 1;
}

export default function BookingCalendarGrid({
  localeTag,
  monthStart,
  monthCount,
  today,
  coconFilter,
  dayIndex,
  ratesByCocon,
  capacityByCocon,
  adults,
  arrival,
  departure,
  onSelectDate,
  loading,
  onPrevMonth,
  onNextMonth,
  isMobile = false,
  mobileFooterAction,
}: Props) {
  const t = useTranslations("bookingSearch.calendar");
  const tBooking = useTranslations("bookingSearch");
  const calendarRootRef = useRef<HTMLDivElement>(null);
  const partialTipRef = useRef<HTMLDivElement>(null);
  const [partialTip, setPartialTip] = useState<PartialTipState | null>(null);
  const [tipMounted, setTipMounted] = useState(false);

  const showPartialFeatures = coconFilter === "all" && !isMobile;

  useEffect(() => {
    setTipMounted(true);
  }, []);

  useEffect(() => {
    setPartialTip(null);
  }, [monthStart, coconFilter]);
  const slideBodyRef = useRef<HTMLDivElement>(null);
  const monthTitleRef = useRef<HTMLParagraphElement>(null);
  const prevMonthStartRef = useRef(monthStart);
  const skipMonthSlideRef = useRef(true);

  useGSAP(
    () => {
      if (skipMonthSlideRef.current) {
        skipMonthSlideRef.current = false;
        prevMonthStartRef.current = monthStart;
        return;
      }
      if (prevMonthStartRef.current === monthStart) return;

      const forward = compareYmd(monthStart, prevMonthStartRef.current) > 0;
      prevMonthStartRef.current = monthStart;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const xFrom = forward ? 26 : -26;
      const targets = [monthTitleRef.current, slideBodyRef.current].filter(
        Boolean
      ) as HTMLElement[];

      gsap.fromTo(
        targets,
        { x: xFrom, opacity: 0.45 },
        {
          x: 0,
          opacity: 1,
          duration: 0.36,
          ease: "power2.out",
          stagger: 0.04,
          overwrite: "auto",
        }
      );
    },
    { dependencies: [monthStart], scope: calendarRootRef }
  );

  useGSAP(
    () => {
      if (!partialTipRef.current || !partialTip) return;
      gsap.fromTo(
        partialTipRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" }
      );
    },
    { dependencies: [partialTip], scope: partialTipRef }
  );

  const formatMonthLabel = (ms: string) =>
    new Intl.DateTimeFormat(localeTag, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${ms}T12:00:00Z`));

  const months = useMemo(() => {
    const list: string[] = [];
    let cursor = monthStart;
    for (let i = 0; i < monthCount; i += 1) {
      list.push(cursor);
      const [y, m] = cursor.split("-").map(Number);
      const next = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
      cursor = next;
    }
    return list;
  }, [monthStart, monthCount]);

  const weekdayLabels = useMemo(() => {
    const base = new Date(Date.UTC(2024, 0, 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.UTC(2024, 0, 1 + i));
      return new Intl.DateTimeFormat(localeTag, { weekday: "narrow" }).format(d);
    });
  }, [localeTag]);

  const showMonthToolbar =
    Boolean(onPrevMonth && onNextMonth && months.length === 1);

  return (
    <div ref={calendarRootRef} className={styles.calendarRoot} aria-busy={loading || undefined}>
      {showMonthToolbar && (
        <div className={styles.calendarMonthHeader}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={onPrevMonth}
            aria-label={t("prevMonth")}
            disabled={loading}
          >
            ‹
          </button>
          <p ref={monthTitleRef} className={styles.calendarMonthTitleCentered}>
            {formatMonthLabel(months[0])}
          </p>
          <button
            type="button"
            className={styles.navBtn}
            onClick={onNextMonth}
            aria-label={t("nextMonth")}
            disabled={loading}
          >
            ›
          </button>
        </div>
      )}
      <div className={styles.calendarSlideViewport}>
        <div ref={slideBodyRef} className={styles.calendarSlideContent}>
          <div className={styles.calendarMonths}>
            {months.map((ms) => {
          const label = formatMonthLabel(ms);
          const days = monthDays(ms);
          const pad = weekdayOffset(ms);
          return (
            <div key={ms} className={styles.calendarMonth}>
              {!showMonthToolbar && (
                <p className={styles.calendarMonthTitle}>{label}</p>
              )}
              <div className={styles.calendarWeekdays} aria-hidden="true">
                {weekdayLabels.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
              <div className={styles.calendarGrid} role="grid" aria-label={label}>
                {Array.from({ length: pad }).map((_, i) => (
                  <span key={`pad-${i}`} className={styles.calendarCellEmpty} />
                ))}
                {days.map((date) => {
                  const visual = dayAggregateVisual(dayIndex.get(date), coconFilter);
                  const inRange =
                    arrival &&
                    departure &&
                    compareYmd(date, arrival) >= 0 &&
                    compareYmd(date, departure) < 0;
                  const isArrival = arrival === date;
                  const isDeparture = departure === date;

                  let disabled = compareYmd(date, today) < 0;
                  if (!arrival) {
                    if (visual === "unavailable") disabled = true;
                    else if (!disabled) {
                      disabled = !isArrivalSelectable(date, today, coconFilter, dayIndex);
                    }
                  } else if (arrival && !departure) {
                    if (compareYmd(date, arrival) <= 0) {
                      if (!disabled) {
                        disabled = !isArrivalSelectable(date, today, coconFilter, dayIndex);
                      }
                    } else {
                      // Jour de départ : peut être « complet » pour une nouvelle arrivée
                      // tout en restant un checkout valide (nuits = [arrivée … veille du départ]).
                      if (!disabled) {
                        disabled = !isDepartureSelectable(arrival, date, {
                          adults,
                          coconFilter,
                          dayIndex,
                          ratesByCocon,
                          capacityByCocon,
                        });
                      }
                    }
                  } else if (arrival && departure) {
                    if (visual === "unavailable") disabled = true;
                    else if (!disabled) {
                      disabled = !isArrivalSelectable(date, today, coconFilter, dayIndex);
                    }
                  }

                  const stateClass =
                    visual === "partial"
                      ? styles.dayPartial
                      : visual === "unavailable"
                        ? styles.dayUnavailable
                        : styles.dayAvailable;

                  const ariaKey =
                    visual === "partial"
                      ? "legendPartial"
                      : visual === "unavailable"
                        ? "legendUnavailable"
                        : "legendAvailable";

                  const dayRecord = dayIndex.get(date);
                  const showPartialTip =
                    showPartialFeatures && visual === "partial" && !disabled && !loading;

                  const openPartialTip = (
                    e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>
                  ) => {
                    if (!showPartialTip || !dayRecord?.availableCoconIds.length) return;
                    const lines = PUBLIC_COCONS.filter((c) =>
                      dayRecord.availableCoconIds.includes(c.id)
                    ).map((c) =>
                      t("coconAvailableOnDay", {
                        name: tBooking(`cocoons.${c.nameKey}.name`),
                      })
                    );
                    if (!lines.length) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPartialTip({
                      lines,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  };

                  return (
                    <button
                      key={date}
                      type="button"
                      role="gridcell"
                      disabled={disabled || loading}
                      className={[
                        styles.calendarDay,
                        stateClass,
                        inRange ? styles.dayInRange : "",
                        isArrival || isDeparture ? styles.daySelected : "",
                        disabled ? styles.dayDisabled : "",
                        showPartialTip ? styles.calendarDayPartialHover : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => onSelectDate(date)}
                      onMouseEnter={openPartialTip}
                      onMouseLeave={() => setPartialTip(null)}
                      onFocus={openPartialTip}
                      onBlur={() => setPartialTip(null)}
                      aria-label={`${date}, ${t(ariaKey)}`}
                      aria-selected={isArrival || isDeparture || inRange || undefined}
                    >
                      <span>{Number(date.slice(8, 10))}</span>
                      {visual === "partial" && (
                        <span className={styles.dayDot} aria-hidden="true" />
                      )}
                      {visual === "unavailable" && (
                        <span className={styles.dayStrike} aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>
      {isMobile && mobileFooterAction ? (
        <div className={styles.mobileCalendarBottomRow}>
          <ul className={styles.calendarLegend}>
            <li>
              <span
                className={`${styles.legendSwatch} ${styles.legendSwatchAvailable}`}
                aria-hidden="true"
              />
              {t("legendAvailable")}
            </li>
            {coconFilter === "all" && (
              <li>
                <span
                  className={`${styles.legendSwatch} ${styles.legendSwatchPartial}`}
                  aria-hidden="true"
                />
                {t("legendPartial")}
              </li>
            )}
            <li>
              <span
                className={`${styles.legendSwatch} ${styles.legendSwatchUnavailable}`}
                aria-hidden="true"
              />
              {t("legendUnavailable")}
            </li>
          </ul>
          <div className={styles.mobileCalendarBottomAction}>{mobileFooterAction}</div>
        </div>
      ) : (
        <ul className={styles.calendarLegend}>
          <li>
            <span
              className={`${styles.legendSwatch} ${styles.legendSwatchAvailable}`}
              aria-hidden="true"
            />
            {t("legendAvailable")}
          </li>
          {coconFilter === "all" && (
            <li>
              <span
                className={`${styles.legendSwatch} ${styles.legendSwatchPartial}`}
                aria-hidden="true"
              />
              {t("legendPartial")}
            </li>
          )}
          <li>
            <span
              className={`${styles.legendSwatch} ${styles.legendSwatchUnavailable}`}
              aria-hidden="true"
            />
            {t("legendUnavailable")}
          </li>
        </ul>
      )}
      {tipMounted &&
        partialTip &&
        createPortal(
          <div
            className={styles.calendarPartialTooltip}
            style={{ left: partialTip.x, top: partialTip.y }}
            role="tooltip"
          >
            <div ref={partialTipRef} className={styles.calendarPartialTooltipInner}>
              {partialTip.lines.map((line) => (
                <p key={line} className={styles.calendarPartialTooltipLine}>
                  {line}
                </p>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export function defaultMonthStart(today: string): string {
  return `${today.slice(0, 7)}-01`;
}

export function shiftMonthStart(monthStart: string, delta: number): string {
  const [y, m] = monthStart.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1 + delta, 1));
  return [
    dt.getUTCFullYear(),
    String(dt.getUTCMonth() + 1).padStart(2, "0"),
    "01",
  ].join("-");
}

export function monthFetchEnd(monthStart: string, monthCount: number): string {
  let ms = monthStart;
  for (let i = 0; i < monthCount; i += 1) {
    ms = shiftMonthStart(ms, 1);
  }
  return addDaysYmd(ms, -1);
}
