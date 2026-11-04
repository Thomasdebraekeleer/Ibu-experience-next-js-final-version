"use client";

import React from "react";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./place-booking.module.scss";

type Props = {
  arrivalLabel: string;
  departureLabel: string;
  adults: number;
  maxAdults: number;
  onOpenDates: () => void;
  onAdultsChange: (next: number) => void;
  onSearch: () => void;
  searching: boolean;
  searchDisabled: boolean;
  datesPillRef?: React.RefObject<HTMLButtonElement>;
  datesDropdown?: React.ReactNode;
  datesExpanded?: boolean;
};

export default function PlaceBookingSearchBar({
  arrivalLabel,
  departureLabel,
  adults,
  maxAdults,
  onOpenDates,
  onAdultsChange,
  onSearch,
  searching,
  searchDisabled,
  datesPillRef,
  datesDropdown,
  datesExpanded = false,
}: Props) {
  const t = useTranslations("placeBooking");

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchDatesAnchor}>
        <button
          ref={datesPillRef}
          type="button"
          className={styles.searchDatesPill}
          onClick={onOpenDates}
          aria-label={t("datesTitle")}
          aria-expanded={datesExpanded}
          aria-haspopup="dialog"
        >
          <span className={styles.searchDatesZoneBefore}>
            <Calendar className={styles.searchDatesIcon} aria-hidden="true" size={20} strokeWidth={2} />
            <span className={styles.searchDateCluster}>
              <span className={styles.searchDateInline}>
                <span className={styles.searchDateWord}>{t("arrival")}</span>
                <span className={styles.searchDateValue}>{arrivalLabel}</span>
              </span>
            </span>
          </span>
          <ArrowRight className={styles.searchDatesArrow} aria-hidden="true" size={20} strokeWidth={2.75} />
          <span className={styles.searchDatesZoneAfter}>
            <span className={styles.searchDateCluster}>
              <span className={styles.searchDateInline}>
                <span className={styles.searchDateWord}>{t("departure")}</span>
                <span className={styles.searchDateValue}>{departureLabel}</span>
              </span>
            </span>
          </span>
        </button>
        {datesDropdown}
      </div>

      <div className={styles.searchGuestsPill} role="group" aria-label={t("adults")}>
        <button
          type="button"
          className={styles.searchStepperBtn}
          disabled={adults <= 1}
          onClick={() => onAdultsChange(adults - 1)}
          aria-label={t("decreaseAdults")}
        >
          −
        </button>
        <span className={styles.searchGuestsCount}>{t("adultsCount", { count: adults })}</span>
        <button
          type="button"
          className={styles.searchStepperBtn}
          disabled={adults >= maxAdults}
          onClick={() => onAdultsChange(adults + 1)}
          aria-label={t("increaseAdults")}
        >
          +
        </button>
      </div>

      <button
        type="button"
        className={`${styles.primaryBtn} ${styles.searchSubmitBtn}`}
        disabled={searchDisabled || searching}
        onClick={onSearch}
      >
        <Search aria-hidden="true" size={18} strokeWidth={2.25} />
        <span>{searching ? t("searching") : t("search")}</span>
      </button>
    </div>
  );
}
