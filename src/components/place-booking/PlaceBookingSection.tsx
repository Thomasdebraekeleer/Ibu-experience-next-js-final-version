"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { PublicCoconId } from "@/config/booking/public-places";
import { PUBLIC_COCONS, maxAdultsForCoconFilter } from "@/config/booking/public-places";
import { usePlaceCatalog } from "@/lib/booking/use-place-catalog";
import type { PlaceCatalogCocon } from "@/lib/booking/place-catalog-types";
import type { ValidateResponse } from "@/lib/booking/types";
import { formatStayDayShort } from "@/lib/booking/format-booking-money";
import { trackBookingClick, trackPlaceBookingEvent } from "@/lib/analytics/events";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";
import BookingCalendarGrid, {
  defaultMonthStart,
  monthFetchEnd,
  shiftMonthStart,
} from "@/components/booking-search/BookingCalendarGrid";
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
import PlaceBookingSearchBar from "./PlaceBookingSearchBar";
import PlaceLodgingCard from "./PlaceLodgingCard";
import PlaceGalleryModal from "./PlaceGalleryModal";
import PlaceCoconBookingModal from "./PlaceCoconBookingModal";
import styles from "./place-booking.module.scss";

const CAPACITY = new Map(PUBLIC_COCONS.map((c) => [c.id, c.capacityAdults]));
const ORDER: PublicCoconId[] = ["cocon-1", "cocon-2"];

type SearchPhase = "initial" | "loading" | "results" | "empty" | "error";

type Props = {
  placeId: string;
};

export default function PlaceBookingSection({ placeId }: Props) {
  const locale = useLocale() as Locale;
  const localeTag = locale === "nl-BE" ? "nl-BE" : "fr-BE";
  const t = useTranslations("placeBooking");
  const tErrors = useTranslations("bookingSearch.errors");
  const tCoconNames = useTranslations("bookingSearch.cocoons");

  const { loading: catalogLoading, error: catalogError, cocons: catalogCocons } =
    usePlaceCatalog(placeId);

  const today = useMemo(() => todayYmdBrussels(), []);
  const cacheRef = useRef(createAvailabilityCache());
  const datesPillRef = useRef<HTMLButtonElement>(null);
  const datesDropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [arrival, setArrival] = useState<string | null>(null);
  const [departure, setDeparture] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [datesOpen, setDatesOpen] = useState(false);
  const [monthStart, setMonthStart] = useState(() => defaultMonthStart(today));
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [cacheVersion, setCacheVersion] = useState(0);

  const [searchPhase, setSearchPhase] = useState<SearchPhase>("initial");
  const [lastValidate, setLastValidate] = useState<ValidateResponse | null>(null);

  const [galleryCocon, setGalleryCocon] = useState<PlaceCatalogCocon | null>(null);
  const [reserveCocon, setReserveCocon] = useState<PlaceCatalogCocon | null>(null);

  const maxAdults = maxAdultsForCoconFilter("all");

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
      { placeId, start: fetchStart, end, coconId: "all" },
      cacheRef.current
    );
    setCalendarLoading(false);
    if (!result.ok) {
      setCalendarError(tErrors(result.reason as Parameters<typeof tErrors>[0]));
    } else {
      setCalendarError(null);
      setCacheVersion((v) => v + 1);
    }
  }, [placeId, monthStart, today, tErrors]);

  useEffect(() => {
    if (datesOpen) void loadCalendar();
  }, [datesOpen, loadCalendar]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!datesOpen || isMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDatesOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (datesDropdownRef.current?.contains(target)) return;
      if (datesPillRef.current?.contains(target)) return;
      setDatesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [datesOpen, isMobile]);

  const onSelectDate = (date: string) => {
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
      coconFilter: "all",
      dayIndex,
      ratesByCocon,
      capacityByCocon: CAPACITY,
    });
    if (ok) {
      setDeparture(date);
      setDatesOpen(false);
    } else {
      setArrival(date);
      setDeparture(null);
    }
  };

  const arrivalLabel = arrival ? formatStayDayShort(arrival, localeTag) : t("pickDate");
  const departureLabel = departure ? formatStayDayShort(departure, localeTag) : t("pickDate");

  const sortedCatalog = useMemo(() => {
    const map = new Map(catalogCocons.map((c) => [c.id, c]));
    return ORDER.map((id) => map.get(id)).filter(Boolean) as PlaceCatalogCocon[];
  }, [catalogCocons]);

  const visibleCocons = useMemo(() => {
    if (searchPhase !== "results") return sortedCatalog;
    if (!lastValidate?.valid) return [] as PlaceCatalogCocon[];
    const ids = new Set(lastValidate.availableCoconIds);
    return sortedCatalog.filter(
      (c) =>
        ids.has(c.id) &&
        lastValidate.checkoutUrls[c.id] &&
        lastValidate.pricingByCocon?.[c.id]
    );
  }, [searchPhase, sortedCatalog, lastValidate]);

  const handleSearch = async () => {
    if (!arrival || !departure) return;
    setSearchPhase("loading");
    trackPlaceBookingEvent("place_booking_search", {
      siteLanguage: toAnalyticsSiteLanguage(locale),
      placeId,
    });
    try {
      const res = await fetch("/api/booking/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          coconId: "all",
          arrival,
          departure,
          adults,
          locale,
        }),
      });
      const body = (await res.json()) as ValidateResponse;
      setLastValidate(body);
      if (body.valid && body.availableCoconIds.length > 0) {
        setSearchPhase("results");
      } else if (body.reason === "lodgify_error") {
        setSearchPhase("error");
      } else {
        setSearchPhase("empty");
      }
    } catch {
      setSearchPhase("error");
    }
  };

  const resetSearch = () => {
    setSearchPhase("initial");
    setLastValidate(null);
  };

  const handleChoose = (cocon: PlaceCatalogCocon) => {
    const hasSearch =
      searchPhase === "results" &&
      lastValidate?.valid &&
      lastValidate.checkoutUrls[cocon.id] &&
      arrival &&
      departure;

    if (hasSearch) {
      const url = lastValidate!.checkoutUrls[cocon.id]!;
      trackPlaceBookingEvent("place_booking_choose", {
        siteLanguage: toAnalyticsSiteLanguage(locale),
        placeId,
        coconId: cocon.id,
      });
      trackPlaceBookingEvent("place_booking_checkout", {
        siteLanguage: toAnalyticsSiteLanguage(locale),
        placeId,
        coconId: cocon.id,
      });
      trackBookingClick({
        href: url,
        siteLanguage: toAnalyticsSiteLanguage(locale),
        buttonLocation: "place_booking_card",
      });
      window.location.href = url;
      return;
    }
    setReserveCocon(cocon);
  };

  const dateCalendarContent = (
    <>
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
        coconFilter="all"
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
    </>
  );

  const desktopDatesDropdown =
    datesOpen && !isMobile ? (
      <div
        ref={datesDropdownRef}
        className={styles.datesDropdownPanel}
        role="dialog"
        aria-modal="false"
        aria-label={t("datesTitle")}
      >
        {dateCalendarContent}
      </div>
    ) : null;

  const openGallery = (cocon: PlaceCatalogCocon) => {
    trackPlaceBookingEvent("place_booking_gallery_open", {
      siteLanguage: toAnalyticsSiteLanguage(locale),
      placeId,
      coconId: cocon.id,
    });
    setGalleryCocon(cocon);
  };

  return (
    <section className={styles.section} aria-label={t("sectionAria")}>
      <div className={styles.searchBarOuter}>
        <PlaceBookingSearchBar
          arrivalLabel={arrivalLabel}
          departureLabel={departureLabel}
          adults={adults}
          maxAdults={maxAdults}
          datesPillRef={datesPillRef}
          datesDropdown={desktopDatesDropdown}
          datesExpanded={datesOpen}
          onOpenDates={() => setDatesOpen((open) => (isMobile ? true : !open))}
          onAdultsChange={setAdults}
          onSearch={() => void handleSearch()}
          searching={searchPhase === "loading"}
          searchDisabled={!arrival || !departure}
        />
      </div>

      {catalogLoading && (
        <p className={styles.statusMessage} role="status">
          {t("catalogLoading")}
        </p>
      )}
      {catalogError && !catalogLoading && (
        <p className={styles.inlineError} role="alert">
          {t("catalogError")}
        </p>
      )}

      {searchPhase === "empty" && (
        <div className={styles.emptyState} role="status">
          <p>{t("noAvailability")}</p>
          <div className={styles.emptyActions}>
            <button type="button" className={styles.secondaryBtn} onClick={() => setDatesOpen(true)}>
              {t("changeDates")}
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={resetSearch}>
              {t("resetSearch")}
            </button>
          </div>
        </div>
      )}

      {searchPhase === "error" && (
        <div className={styles.emptyState} role="alert">
          <p>{tErrors("lodgify_error")}</p>
          <button type="button" className={styles.secondaryBtn} onClick={() => void handleSearch()}>
            {t("retry")}
          </button>
        </div>
      )}

      <div className={styles.cardList} aria-busy={searchPhase === "loading"}>
        {(searchPhase === "empty" || searchPhase === "error" ? [] : visibleCocons).map((cocon) => (
          <PlaceLodgingCard
            key={cocon.id}
            cocon={cocon}
            hasActiveSearch={searchPhase === "results"}
            pricing={lastValidate?.pricingByCocon?.[cocon.id] ?? null}
            chooseEnabled={
              searchPhase !== "loading" &&
              (searchPhase === "initial" ||
                Boolean(
                  lastValidate?.checkoutUrls[cocon.id] &&
                    lastValidate?.pricingByCocon?.[cocon.id]
                ))
            }
            onMorePhotos={() => openGallery(cocon)}
            onChoose={() => handleChoose(cocon)}
          />
        ))}
      </div>

      {datesOpen &&
        isMobile &&
        createPortal(
          <div className={styles.modalOverlay} role="presentation" onClick={() => setDatesOpen(false)}>
            <div
              className={styles.dateDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="place-date-picker-title"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 id="place-date-picker-title" className={styles.modalTitle}>
                  {t("datesTitle")}
                </h2>
                <button
                  type="button"
                  className={styles.modalClose}
                  onClick={() => setDatesOpen(false)}
                  aria-label={t("close")}
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <div className={styles.modalBody}>{dateCalendarContent}</div>
            </div>
          </div>,
          document.body
        )}

      <PlaceGalleryModal
        open={Boolean(galleryCocon)}
        coconName={galleryCocon ? tCoconNames(`${galleryCocon.nameKey}.name`) : ""}
        images={
          galleryCocon?.gallery.map((g) => g.url).length
            ? galleryCocon!.gallery.map((g) => g.url)
            : galleryCocon?.coverImageUrl
              ? [galleryCocon.coverImageUrl]
              : galleryCocon?.fallbackImage
                ? [galleryCocon.fallbackImage]
                : []
        }
        onClose={() => setGalleryCocon(null)}
      />

      {reserveCocon && (
        <PlaceCoconBookingModal
          open
          placeId={placeId}
          cocon={reserveCocon}
          initialArrival={arrival}
          initialDeparture={departure}
          initialAdults={adults}
          onClose={() => setReserveCocon(null)}
        />
      )}
    </section>
  );
}
