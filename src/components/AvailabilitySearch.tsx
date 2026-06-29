"use client";

import React, { useState, useCallback, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getLodgifyAllPropertiesSearchUrl } from "@/config/lodgify";
import type { Locale } from "@/i18n/routing";
import styles from "./AvailabilitySearch.module.scss";

function formatDateForUrl(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayStr(): string {
  return formatDateForUrl(new Date());
}

export type AvailabilitySearchProps = {
  className?: string;
  variant?: "hero" | "default";
};

export default function AvailabilitySearch({
  className = "",
  variant = "default",
}: AvailabilitySearchProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("forms.availability");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [adults, setAdults] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const arrivalInputRef = useRef<HTMLInputElement>(null);
  const departureInputRef = useRef<HTMLInputElement>(null);

  const minDate = todayStr();

  const openArrivalPicker = useCallback(() => {
    if (arrivalInputRef.current && "showPicker" in arrivalInputRef.current) {
      (arrivalInputRef.current as HTMLInputElement).showPicker();
    }
  }, []);
  const openDeparturePicker = useCallback(() => {
    if (departureInputRef.current && "showPicker" in departureInputRef.current) {
      (departureInputRef.current as HTMLInputElement).showPicker();
    }
  }, []);

  const handleArrivalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setArrival(value);
      setError(null);
      if (departure && value && departure <= value) {
        setDeparture("");
      }
    },
    [departure]
  );

  const handleDepartureChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDeparture(e.target.value);
      setError(null);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!arrival?.trim()) {
        setError(t("errors.missingArrival"));
        return;
      }
      if (!departure?.trim()) {
        setError(t("errors.missingDeparture"));
        return;
      }
      if (departure <= arrival) {
        setError(t("errors.invalidRange"));
        return;
      }

      const params = new URLSearchParams({
        adults: String(adults),
        sort: "price",
        arrival,
        departure,
        children: "0",
        infants: "0",
        pets: "0",
      });
      const url = `${getLodgifyAllPropertiesSearchUrl(locale)}?${params.toString()}`;
      window.location.href = url;
    },
    [arrival, departure, adults, locale, t]
  );

  const isHero = variant === "hero";
  const wrapperClass = [styles.wrapper, isHero ? styles.hero : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} role="search" aria-label={t("ariaSearch")}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={error ? "availability-error" : undefined}
      >
        <div className={styles.row}>
          <div className={`${styles.fieldGroup} ${styles.fieldGroupDates}`}>
            <label htmlFor="availability-arrival" className={styles.label}>
              {t("arrival")}
            </label>
            <div className={styles.dateInputWrap} onClick={openArrivalPicker}>
              <input
                ref={arrivalInputRef}
                id="availability-arrival"
                type="date"
                className={styles.input}
                placeholder={t("arrival")}
                value={arrival}
                min={minDate}
                onChange={handleArrivalChange}
                aria-label={t("aria.arrivalDate")}
                aria-required="true"
              />
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="availability-departure" className={styles.label}>
              {t("departure")}
            </label>
            <div className={styles.dateInputWrap} onClick={openDeparturePicker}>
              <input
                ref={departureInputRef}
                id="availability-departure"
                type="date"
                className={styles.input}
                placeholder={t("departure")}
                value={departure}
                min={arrival || minDate}
                onChange={handleDepartureChange}
                aria-label={t("aria.departureDate")}
                aria-required="true"
              />
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={`${styles.fieldGroup} ${styles.fieldGroupAdults}`}>
            <span className={styles.label} id="adults-label">
              {t("adults")}
            </span>
            <div
              className={styles.stepper}
              role="group"
              aria-labelledby="adults-label"
            >
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                aria-label={t("aria.decreaseAdults")}
                disabled={adults <= 1}
              >
                −
              </button>
              <span
                className={styles.stepperValue}
                aria-live="polite"
                aria-atomic="true"
              >
                {adults}
              </span>
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={() => setAdults((a) => Math.min(2, a + 1))}
                aria-label={t("aria.increaseAdults")}
                disabled={adults >= 2}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.submitWrapper}>
            <button
              type="submit"
              className={styles.submitBtn}
              aria-label={t("aria.submit")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {t("search")}
            </button>
          </div>
        </div>

        {error && (
          <p id="availability-error" className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
