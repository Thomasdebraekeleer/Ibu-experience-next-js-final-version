"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { PublicCoconId } from "@/config/booking/public-places";
import type { PlaceCatalogCocon } from "@/lib/booking/place-catalog-types";
import type { ValidateResponse } from "@/lib/booking/types";
import { formatBookingMoney } from "@/lib/booking/format-booking-money";
import { trackBookingClick, trackPlaceBookingEvent } from "@/lib/analytics/events";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";
import BookingCalendarGrid, {
  defaultMonthStart,
  monthFetchEnd,
  shiftMonthStart,
} from "@/components/booking-search/BookingCalendarGrid";
import { PUBLIC_COCONS } from "@/config/booking/public-places";
import { todayYmdBrussels } from "@/lib/dates/brussels";
import {
  buildDayIndex,
  isStayRangeValid,
} from "@/lib/booking/stay-selection";
import {
  cacheToRatesRecord,
  createAvailabilityCache,
  fetchAvailabilitySpan,
} from "@/lib/booking/fetch-availability";
import { compareYmd } from "@/lib/dates/ymd";
import styles from "./place-booking.module.scss";

const CAPACITY = new Map(PUBLIC_COCONS.map((c) => [c.id, c.capacityAdults]));

type Props = {
  open: boolean;
  placeId: string;
  cocon: PlaceCatalogCocon;
  initialArrival: string | null;
  initialDeparture: string | null;
  initialAdults: number;
  onClose: () => void;
};

export default function PlaceCoconBookingModal({
  open,
  placeId,
  cocon,
  initialArrival,
  initialDeparture,
  initialAdults,
  onClose,
}: Props) {
  const locale = useLocale() as Locale;
  const localeTag = locale === "nl-BE" ? "nl-BE" : "fr-BE";
  const t = useTranslations("placeBooking");
  const tErrors = useTranslations("bookingSearch.errors");
  const tNames = useTranslations("bookingSearch.cocoons");

  const today = useMemo(() => todayYmdBrussels(), []);
  const cacheRef = useRef(createAvailabilityCache());
  const openerRef = useRef<HTMLElement | null>(null);

  const [arrival, setArrival] = useState<string | null>(initialArrival);
  const [departure, setDeparture] = useState<string | null>(initialDeparture);
  const [adults, setAdults] = useState(initialAdults);
  const [monthStart, setMonthStart] = useState(() => defaultMonthStart(today));
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [cacheVersion, setCacheVersion] = useState(0);
  const [validateLoading, setValidateLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pricing, setPricing] = useState<ValidateResponse["pricingByCocon"]>(undefined);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const coconName = tNames(`${cocon.nameKey}.name`);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      setArrival(initialArrival);
      setDeparture(initialDeparture);
      setAdults(initialAdults);
      setPricing(undefined);
      setCheckoutUrl(null);
      setFormError(null);
      document.body.style.overflow = "hidden";
      trackPlaceBookingEvent("place_booking_reserve_modal", {
        siteLanguage: toAnalyticsSiteLanguage(locale),
        placeId,
        coconId: cocon.id,
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, initialArrival, initialDeparture, initialAdults, cocon.id, locale, placeId]);

  const dayIndex = useMemo(
    () => buildDayIndex(Array.from(cacheRef.current.days.values())),
    [cacheVersion]
  );
  const ratesByCocon = useMemo(
    () => cacheToRatesRecord(cacheRef.current),
    [cacheVersion]
  );

  const loadCalendar = useCallback(async () => {
    setCalendarLoading(true);
    const fetchStart = compareYmd(monthStart, today) < 0 ? today : monthStart;
    const end = monthFetchEnd(monthStart, 1);
    const result = await fetchAvailabilitySpan(
      {
        placeId,
        start: fetchStart,
        end,
        coconId: cocon.id,
      },
      cacheRef.current
    );
    setCalendarLoading(false);
    if (!result.ok) {
      setCalendarError(tErrors(result.reason as Parameters<typeof tErrors>[0]));
    } else {
      setCalendarError(null);
      setCacheVersion((v) => v + 1);
    }
  }, [placeId, cocon.id, monthStart, today, tErrors]);

  useEffect(() => {
    if (open) void loadCalendar();
  }, [open, loadCalendar]);

  const onSelectDate = (date: string) => {
    setFormError(null);
    if (!arrival || (arrival && departure)) {
      setArrival(date);
      setDeparture(null);
      return;
    }
    if (compareYmd(date, arrival) <= 0) {
      setArrival(date);
      setDeparture(null);
      return;
    }
    const ok = isStayRangeValid({
      arrival,
      departure: date,
      adults,
      coconFilter: cocon.id,
      dayIndex,
      ratesByCocon,
      capacityByCocon: CAPACITY,
    });
    if (ok) setDeparture(date);
    else {
      setArrival(date);
      setDeparture(null);
    }
  };

  const handleValidate = async () => {
    if (!arrival || !departure) {
      setFormError(t("errors.missingDates"));
      return;
    }
    setValidateLoading(true);
    setFormError(null);
    setPricing(undefined);
    setCheckoutUrl(null);
    try {
      const res = await fetch("/api/booking/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          coconId: cocon.id,
          arrival,
          departure,
          adults,
          locale,
        }),
      });
      const body = (await res.json()) as ValidateResponse;
      if (!body.valid || !body.checkoutUrls[cocon.id]) {
        setFormError(tErrors(body.reason ?? "quote_not_available"));
        return;
      }
      setPricing(body.pricingByCocon);
      setCheckoutUrl(body.checkoutUrls[cocon.id]!);
    } catch {
      setFormError(tErrors("lodgify_error"));
    } finally {
      setValidateLoading(false);
    }
  };

  const handleFinalize = () => {
    if (!checkoutUrl) return;
    trackPlaceBookingEvent("place_booking_checkout", {
      siteLanguage: toAnalyticsSiteLanguage(locale),
      placeId,
      coconId: cocon.id,
    });
    trackBookingClick({
      href: checkoutUrl,
      siteLanguage: toAnalyticsSiteLanguage(locale),
      buttonLocation: "place_booking_cocon_modal",
    });
    window.location.href = checkoutUrl;
  };

  const priceLine = pricing?.[cocon.id];

  if (!open) return null;

  return createPortal(
    <div className={styles.modalOverlay} role="presentation" onClick={onClose}>
      <div
        className={styles.reserveDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-cocon-booking-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 id="place-cocon-booking-title" className={styles.modalTitle}>
            {coconName}
          </h2>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label={t("close")}>
            <X aria-hidden="true" />
          </button>
        </div>
        <div className={styles.modalBody}>
          {calendarError && (
            <p className={styles.inlineError} role="alert">
              {calendarError}
            </p>
          )}
          <BookingCalendarGrid
            localeTag={localeTag}
            monthStart={monthStart}
            monthCount={1}
            today={today}
            coconFilter={cocon.id}
            dayIndex={dayIndex}
            ratesByCocon={ratesByCocon}
            capacityByCocon={CAPACITY}
            adults={adults}
            arrival={arrival}
            departure={departure}
            onSelectDate={onSelectDate}
            loading={calendarLoading}
            onPrevMonth={() => setMonthStart((m) => shiftMonthStart(m, -1))}
            onNextMonth={() => setMonthStart((m) => shiftMonthStart(m, 1))}
          />
          <div className={styles.modalGuestsRow}>
            <span className={styles.guestsLabel}>{t("adults")}</span>
            <div className={styles.guestsStepper}>
              <button
                type="button"
                className={styles.stepperBtn}
                disabled={adults <= 1}
                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                aria-label={t("decreaseAdults")}
              >
                −
              </button>
              <span>{t("adultsCount", { count: adults })}</span>
              <button
                type="button"
                className={styles.stepperBtn}
                disabled={adults >= cocon.capacityAdults}
                onClick={() => setAdults((a) => Math.min(cocon.capacityAdults, a + 1))}
                aria-label={t("increaseAdults")}
              >
                +
              </button>
            </div>
            <span className={styles.capacityHint}>
              {t("maxCapacity", { count: cocon.capacityAdults })}
            </span>
          </div>
          {priceLine && (
            <p className={styles.modalPrice} role="status">
              {t("stayPrice", {
                price: formatBookingMoney(
                  priceLine.totalIncludingVat,
                  priceLine.currencyCode,
                  localeTag
                ),
                nights: priceLine.nights,
              })}
            </p>
          )}
          {formError && (
            <p className={styles.inlineError} role="alert">
              {formError}
            </p>
          )}
        </div>
        <div className={styles.modalFooter}>
          {!checkoutUrl ? (
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={!arrival || !departure || validateLoading}
              onClick={() => void handleValidate()}
            >
              {validateLoading ? t("validating") : t("checkPrice")}
            </button>
          ) : (
            <button type="button" className={styles.primaryBtn} onClick={handleFinalize}>
              {t("finalizeBooking")}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
