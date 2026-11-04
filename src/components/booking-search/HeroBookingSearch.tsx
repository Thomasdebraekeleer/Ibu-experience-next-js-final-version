"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import styles from "./HeroBookingSearch.module.scss";
import {
  PUBLIC_BOOKING_PLACES,
  PUBLIC_COCONS,
  maxAdultsForCoconFilter,
  type PublicCoconFilter,
} from "@/config/booking/public-places";
import { todayYmdBrussels } from "@/lib/dates/brussels";
import {
  buildDayIndex,
  isStayRangeValid,
  shouldClearDatesOnCoconChange,
} from "@/lib/booking/stay-selection";
import {
  cacheToRatesRecord,
  createAvailabilityCache,
  fetchAvailabilitySpan,
} from "@/lib/booking/fetch-availability";
import type { ValidateResponse } from "@/lib/booking/types";
import { resolveCheckoutFlow } from "@/lib/booking/checkout-flow";
import BookingCalendarGrid, {
  defaultMonthStart,
  monthFetchEnd,
  shiftMonthStart,
} from "./BookingCalendarGrid";
import CoconChoiceModal from "./CoconChoiceModal";
import FloatingBookingPanel, { type FloatingPanelKind } from "./FloatingBookingPanel";
import { compareYmd, countNights, enumerateStayNights } from "@/lib/dates/ymd";
import { trackBookingClick, trackBookingSearchEvent } from "@/lib/analytics/events";
import { toAnalyticsSiteLanguage } from "@/lib/analytics/site-language";
import type { PublicCoconId } from "@/config/booking/public-places";

export type HeroBookingSearchProps = {
  className?: string;
};

const CAPACITY = new Map(PUBLIC_COCONS.map((c) => [c.id, c.capacityAdults]));
const PANEL_ID = "hero-booking-floating-panel";

function formatStayDayLabel(ymd: string, localeTag: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Intl.DateTimeFormat(localeTag, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export default function HeroBookingSearch({ className = "" }: HeroBookingSearchProps) {
  const locale = useLocale() as Locale;
  const localeTag = locale === "nl-BE" ? "nl-BE" : "fr-BE";
  const t = useTranslations("bookingSearch");
  const tErrors = useTranslations("bookingSearch.errors");

  const today = useMemo(() => todayYmdBrussels(), []);
  const shellRef = useRef<HTMLDivElement>(null);
  const segmentCoconRef = useRef<HTMLDivElement>(null);
  const segmentDatesRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef(createAvailabilityCache());
  const abortRef = useRef<AbortController | null>(null);
  const openedRef = useRef(false);
  const triggerRefs = useRef<Record<"place" | "cocon" | "dates", HTMLButtonElement | null>>({
    place: null,
    cocon: null,
    dates: null,
  });

  const [placeId, setPlaceId] = useState<string | null>(null);
  const [coconFilter, setCoconFilter] = useState<PublicCoconFilter>("all");
  const [arrival, setArrival] = useState<string | null>(null);
  const [departure, setDeparture] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [activePanel, setActivePanel] = useState<FloatingPanelKind | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [monthStart, setMonthStart] = useState(() => defaultMonthStart(today));
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [validateLoading, setValidateLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [coconChoiceUrls, setCoconChoiceUrls] = useState<Record<string, string> | null>(
    null
  );
  const [datesClearedNotice, setDatesClearedNotice] = useState(false);
  const [cacheVersion, setCacheVersion] = useState(0);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mqMobile.matches);
    sync();
    mqMobile.addEventListener("change", sync);
    return () => mqMobile.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    trackBookingSearchEvent("booking_search_open", {
      siteLanguage: toAnalyticsSiteLanguage(locale),
    });
  }, [locale]);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- cacheVersion invalide le cache ref après fetch
  const dayIndex = useMemo(
    () => buildDayIndex(Array.from(cacheRef.current.days.values())),
    [cacheVersion]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps -- cacheVersion invalide le cache ref après fetch
  const ratesByCocon = useMemo(
    () => cacheToRatesRecord(cacheRef.current),
    [cacheVersion]
  );

  const loadCalendar = useCallback(async () => {
    if (!placeId) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setCalendarLoading(true);
    const fetchStart = compareYmd(monthStart, today) < 0 ? today : monthStart;
    const end = monthFetchEnd(monthStart, 1);
    const result = await fetchAvailabilitySpan(
      {
        placeId,
        start: fetchStart,
        end,
        coconId: coconFilter,
        signal: controller.signal,
      },
      cacheRef.current
    );
    if (controller.signal.aborted) return;
    setCalendarLoading(false);
    if (!result.ok) {
      if (result.reason === "arrival_in_past") {
        setCalendarError(null);
        setCacheVersion((v) => v + 1);
        return;
      }
      setCalendarError(tErrors(result.reason as Parameters<typeof tErrors>[0]));
    } else {
      setCalendarError(null);
      setCacheVersion((v) => v + 1);
    }
  }, [placeId, monthStart, coconFilter, tErrors, today]);

  useEffect(() => {
    if (activePanel === "dates" && placeId) void loadCalendar();
  }, [activePanel, placeId, monthStart, coconFilter, loadCalendar]);

  const openPanel = (p: FloatingPanelKind) => {
    setFormError(null);
    if (p === "dates") {
      setCalendarError(null);
      setMonthStart(defaultMonthStart(today));
    }
    setActivePanel(p);
    if (isMobile) setMobileSheetOpen(true);
  };

  const closePanel = () => {
    setActivePanel(null);
    if (isMobile) setMobileSheetOpen(false);
  };

  const selectPlace = (id: string) => {
    const place = PUBLIC_BOOKING_PLACES.find((p) => p.id === id);
    if (!place || place.status !== "active") return;
    setPlaceId(id);
    cacheRef.current = createAvailabilityCache();
    setArrival(null);
    setDeparture(null);
    trackBookingSearchEvent("booking_search_place", {
      siteLanguage: toAnalyticsSiteLanguage(locale),
      placeId: id,
    });
    setActivePanel("cocon");
  };

  const selectCocon = (filter: PublicCoconFilter) => {
    const prev = coconFilter;
    setCoconFilter(filter);
    trackBookingSearchEvent("booking_search_cocon", {
      siteLanguage: toAnalyticsSiteLanguage(locale),
      placeId: placeId ?? undefined,
      coconId: filter,
    });
    if (
      arrival &&
      departure &&
      shouldClearDatesOnCoconChange(
        arrival,
        departure,
        adults,
        filter,
        dayIndex,
        ratesByCocon,
        CAPACITY
      )
    ) {
      setArrival(null);
      setDeparture(null);
      setDatesClearedNotice(true);
    } else {
      setDatesClearedNotice(false);
    }
    if (prev !== filter) {
      cacheRef.current = createAvailabilityCache();
    }
    setCalendarError(null);
    setMonthStart(defaultMonthStart(today));
    setActivePanel("dates");
  };

  const onSelectDate = (date: string) => {
    setDatesClearedNotice(false);
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
    const departureOk = isStayRangeValid({
      arrival,
      departure: date,
      adults,
      coconFilter,
      dayIndex,
      ratesByCocon,
      capacityByCocon: CAPACITY,
    });
    if (departureOk) {
      setDeparture(date);
      return;
    }
    setArrival(date);
    setDeparture(null);
  };

  const maxAdults = placeId ? maxAdultsForCoconFilter(coconFilter) : 1;

  useEffect(() => {
    if (adults > maxAdults) setAdults(maxAdults);
  }, [maxAdults, adults]);

  const indicativeForChoice = useMemo(() => {
    if (!arrival || !departure) return {};
    const nights = enumerateStayNights(arrival, departure);
    const out: Partial<Record<PublicCoconId, number>> = {};
    for (const c of PUBLIC_COCONS) {
      let sum = 0;
      let ok = true;
      for (const n of nights) {
        const rate = ratesByCocon[c.id]?.find((r) => r.date === n);
        if (rate?.indicativePricePerDay == null) {
          ok = false;
          break;
        }
        sum += rate.indicativePricePerDay;
      }
      if (ok) out[c.id] = sum;
    }
    return out;
  }, [arrival, departure, ratesByCocon]);

  const handleValidate = async () => {
    if (!placeId || !arrival || !departure) {
      setFormError(t("errors.missingDates"));
      return;
    }
    setValidateLoading(true);
    setFormError(null);
    trackBookingSearchEvent("booking_search_submit", {
      siteLanguage: toAnalyticsSiteLanguage(locale),
      placeId,
      coconId: coconFilter,
    });

    try {
      const res = await fetch("/api/booking/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          coconId: coconFilter,
          arrival,
          departure,
          adults,
          locale,
        }),
      });
      const body = (await res.json()) as ValidateResponse;
      const flow = resolveCheckoutFlow(body, coconFilter);

      if (flow.type === "redirect") {
        trackBookingSearchEvent("booking_search_validated", {
          siteLanguage: toAnalyticsSiteLanguage(locale),
          placeId,
          coconId: coconFilter,
        });
        trackBookingClick({
          href: flow.url,
          siteLanguage: toAnalyticsSiteLanguage(locale),
          buttonLocation: "hero_booking_search",
        });
        window.location.href = flow.url;
        return;
      }

      if (flow.type === "choose_cocon") {
        trackBookingSearchEvent("booking_search_validated", {
          siteLanguage: toAnalyticsSiteLanguage(locale),
          placeId,
          coconId: "all",
        });
        setCoconChoiceUrls(flow.urls);
        return;
      }

      trackBookingSearchEvent("booking_search_rejected", {
        siteLanguage: toAnalyticsSiteLanguage(locale),
        placeId,
        reason: flow.reason,
      });

      const reason = flow.reason as Parameters<typeof tErrors>[0];
      setFormError(tErrors(reason));

      if (flow.reason === "dates_unavailable") {
        cacheRef.current = createAvailabilityCache();
        openPanel("dates");
        void loadCalendar();
      }
    } catch {
      setFormError(tErrors("lodgify_error"));
    } finally {
      setValidateLoading(false);
    }
  };

  const selectedPlace = placeId
    ? PUBLIC_BOOKING_PLACES.find((p) => p.id === placeId)
    : undefined;
  const placeLabel = selectedPlace
    ? t(`places.${selectedPlace.nameKey}.name`)
    : t("fields.placePlaceholder");

  const coconLabel =
    coconFilter === "all"
      ? t("fields.allCocons")
      : t(`cocoons.${PUBLIC_COCONS.find((c) => c.id === coconFilter)?.nameKey}.name`);

  const dateLabel =
    arrival && departure
      ? t("fields.dateRange", { arrival, departure, nights: countNights(arrival, departure) })
      : arrival
        ? t("fields.arrivalOnly", { arrival })
        : t("fields.datesPlaceholder");

  const guestLabel = t("fields.guests", { count: adults });

  const panelTitle =
    activePanel === "place"
      ? t("fields.place")
      : activePanel === "cocon"
        ? t("fields.lodging")
        : activePanel === "dates"
          ? t("fields.dates")
          : activePanel === "guests"
            ? t("fields.guestsLabel")
            : "";

  const mobileDatesHeaderExtra =
    isMobile && activePanel === "dates" && arrival
      ? arrival && departure
        ? t("mobile.dateRangeShort", {
            from: formatStayDayLabel(arrival, localeTag),
            to: formatStayDayLabel(departure, localeTag),
          })
        : t("mobile.arrivalShort", { from: formatStayDayLabel(arrival, localeTag) })
      : undefined;

  const goToMobileGuestsStep = () => {
    if (!arrival || !departure) return;
    setActivePanel("guests");
    if (isMobile) setMobileSheetOpen(true);
  };

  const placePicker = (
    <div className={styles.placePanel}>
      <div className={styles.placeListScroll}>
        <ul className={styles.placeListMenu} role="listbox" aria-label={t("fields.place")}>
          {PUBLIC_BOOKING_PLACES.map((place) => {
          const isActive = place.status === "active";
          const selected = placeId === place.id;
          return (
            <li key={place.id} role="none">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                className={`${styles.placeListRow} ${selected ? styles.placeListRowSelected : ""} ${!isActive ? styles.placeListRowDisabled : ""}`}
                disabled={!isActive}
                onClick={() => selectPlace(place.id)}
              >
                <span className={styles.placeListThumbWrap}>
                  <Image
                    src={place.image}
                    alt=""
                    width={48}
                    height={48}
                    className={styles.placeListThumb}
                  />
                </span>
                <span className={styles.placeListText}>
                  <span className={styles.placeName}>{t(`places.${place.nameKey}.name`)}</span>
                  {!isActive && (
                    <span className={styles.comingSoon}>{t("comingSoon")}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
        </ul>
      </div>
      <Link href="/reservations" className={styles.placeMenuFooterLink} onClick={closePanel}>
        {t("discoverAllPlaces")}
      </Link>
    </div>
  );

  const coconPicker = (
    <div className={styles.coconPanel}>
      <ul className={styles.placeListMenu} role="listbox" aria-label={t("fields.lodging")}>
        <li role="none">
          <button
            type="button"
            role="option"
            aria-selected={coconFilter === "all"}
            className={`${styles.placeListRow} ${coconFilter === "all" ? styles.placeListRowSelected : ""}`}
            onClick={() => selectCocon("all")}
          >
            <span className={styles.placeListThumbWrap}>
              <Image
                src={PUBLIC_COCONS[0].image}
                alt=""
                width={48}
                height={48}
                className={styles.placeListThumb}
              />
            </span>
            <span className={styles.placeListText}>
              <span className={styles.placeName}>{t("fields.allCocons")}</span>
            </span>
          </button>
        </li>
        {PUBLIC_COCONS.map((c) => (
          <li key={c.id} role="none">
            <button
              type="button"
              role="option"
              aria-selected={coconFilter === c.id}
              className={`${styles.placeListRow} ${coconFilter === c.id ? styles.placeListRowSelected : ""}`}
              onClick={() => selectCocon(c.id)}
            >
              <span className={styles.placeListThumbWrap}>
                <Image
                  src={c.image}
                  alt=""
                  width={48}
                  height={48}
                  className={styles.placeListThumb}
                />
              </span>
              <span className={styles.placeListText}>
                <span className={styles.placeName}>{t(`cocoons.${c.nameKey}.name`)}</span>
                <span className={styles.coconCapacityInline}>
                  {t("maxAdults", { count: c.capacityAdults })}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const calendarPanel = (
    <div className={styles.datesPanel}>
      {datesClearedNotice && (
        <p className={styles.notice} role="status">
          {t("datesClearedOnCoconChange")}
        </p>
      )}
      {calendarError && (
        <p className={styles.error} role="alert">
          {calendarError}
        </p>
      )}
      <BookingCalendarGrid
        localeTag={localeTag}
        monthStart={monthStart}
        monthCount={1}
        today={today}
        coconFilter={coconFilter}
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
        isMobile={isMobile}
        mobileFooterAction={
          isMobile ? (
            <button
              type="button"
              className={styles.mobileStepNextBtn}
              disabled={!arrival || !departure || calendarLoading}
              onClick={goToMobileGuestsStep}
            >
              {t("mobile.next")}
            </button>
          ) : undefined
        }
      />
    </div>
  );

  const guestsPanel = (
    <div className={styles.mobileGuestsPanel}>
      <p className={styles.mobileGuestsIntro}>{t("fields.guestsLabel")}</p>
      <div className={styles.guestsInline} role="group" aria-label={t("fields.guestsLabel")}>
        <button
          type="button"
          className={styles.stepperBtn}
          disabled={!placeId || adults <= 1 || validateLoading}
          onClick={() => setAdults((a) => Math.max(1, a - 1))}
          aria-label={t("guests.decrease")}
        >
          −
        </button>
        <span className={styles.guestsValue} aria-live="polite">
          {guestLabel}
        </span>
        <button
          type="button"
          className={styles.stepperBtn}
          disabled={!placeId || adults >= maxAdults || validateLoading}
          onClick={() => setAdults((a) => Math.min(maxAdults, a + 1))}
          aria-label={t("guests.increase")}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className={styles.mobileGuestsSubmitBtn}
        disabled={!placeId || !arrival || !departure || validateLoading}
        aria-busy={validateLoading}
        onClick={() => void handleValidate()}
      >
        {validateLoading ? t("searching") : t("search")}
      </button>
    </div>
  );

  const panelContent =
    activePanel === "place"
      ? placePicker
      : activePanel === "cocon"
        ? coconPicker
        : activePanel === "dates"
          ? calendarPanel
          : activePanel === "guests"
            ? guestsPanel
            : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePanel(null);
        setMobileSheetOpen(false);
      }
    };
    if (activePanel) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activePanel]);

  return (
    <div
      className={[styles.root, styles.hero, className].filter(Boolean).join(" ")}
      role="search"
      aria-label={t("ariaSearch")}
    >
      <div className={styles.mobileTriggerWrap}>
        <button
          type="button"
          className={styles.mobileTrigger}
          onClick={() => {
            setMobileSheetOpen(true);
            if (!activePanel) openPanel("place");
          }}
        >
          {t("mobileOpen")}
        </button>
      </div>

      <div
        ref={shellRef}
        className={`${styles.shell} ${mobileSheetOpen ? styles.mobileSheetOpen : ""}`}
      >
        {mobileSheetOpen && isMobile && (
          <button
            type="button"
            className={styles.mobileClose}
            onClick={closePanel}
            aria-label={t("mobileClose")}
          >
            ×
          </button>
        )}

        <form
          className={styles.bar}
          onSubmit={(e) => {
            e.preventDefault();
            void handleValidate();
          }}
        >
          <div className={`${styles.segment} ${styles.segmentPlace}`}>
            <button
              ref={(el) => {
                triggerRefs.current.place = el;
              }}
              type="button"
              className={styles.segmentBtn}
              disabled={validateLoading}
              onClick={() => openPanel("place")}
              aria-expanded={activePanel === "place"}
              aria-controls={PANEL_ID}
            >
              <span className={styles.segmentLabel}>{t("fields.place")}</span>
              <span className={styles.segmentValue} title={placeLabel}>
                {placeLabel}
              </span>
            </button>
          </div>
          <div className={styles.divider} aria-hidden="true" />
          <div
            ref={segmentCoconRef}
            className={`${styles.segment} ${styles.segmentLodging}`}
          >
            <button
              ref={(el) => {
                triggerRefs.current.cocon = el;
              }}
              type="button"
              className={styles.segmentBtn}
              disabled={!placeId || validateLoading}
              onClick={() => openPanel("cocon")}
              aria-expanded={activePanel === "cocon"}
              aria-controls={PANEL_ID}
            >
              <span className={styles.segmentLabel}>{t("fields.lodging")}</span>
              <span className={styles.segmentValue} title={placeId ? coconLabel : undefined}>
                {placeId ? coconLabel : "—"}
              </span>
            </button>
          </div>
          <div className={styles.divider} aria-hidden="true" />
          <div ref={segmentDatesRef} className={`${styles.segment} ${styles.segmentDates}`}>
            <button
              ref={(el) => {
                triggerRefs.current.dates = el;
              }}
              type="button"
              className={styles.segmentBtn}
              disabled={!placeId || validateLoading}
              onClick={() => openPanel("dates")}
              aria-expanded={activePanel === "dates"}
              aria-controls={PANEL_ID}
            >
              <span className={styles.segmentLabel}>{t("fields.dates")}</span>
              <span className={styles.segmentValue} title={placeId ? dateLabel : undefined}>
                {placeId ? dateLabel : "—"}
              </span>
            </button>
          </div>
          <div className={styles.divider} aria-hidden="true" />
          <div className={`${styles.segment} ${styles.segmentGuests}`}>
            <span className={styles.segmentLabel} id="hero-guests-label">
              {t("fields.guestsLabel")}
            </span>
            <div className={styles.guestsInline} role="group" aria-labelledby="hero-guests-label">
              <button
                type="button"
                className={styles.stepperBtn}
                disabled={!placeId || adults <= 1 || validateLoading}
                onClick={() => setAdults((a) => Math.max(1, a - 1))}
                aria-label={t("guests.decrease")}
              >
                −
              </button>
              <span className={styles.guestsValue} aria-live="polite">
                {placeId ? guestLabel : "—"}
              </span>
              <button
                type="button"
                className={styles.stepperBtn}
                disabled={!placeId || adults >= maxAdults || validateLoading}
                onClick={() => setAdults((a) => Math.min(maxAdults, a + 1))}
                aria-label={t("guests.increase")}
              >
                +
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!placeId || !arrival || !departure || validateLoading}
            aria-busy={validateLoading}
          >
            {validateLoading ? t("searching") : t("search")}
          </button>
        </form>
      </div>

      <FloatingBookingPanel
        open={activePanel !== null}
        kind={activePanel}
        anchorRef={shellRef}
        getColumnAnchorEl={() => {
          if (activePanel === "cocon") return segmentCoconRef.current;
          if (activePanel === "dates") return segmentDatesRef.current;
          return shellRef.current;
        }}
        isMobile={isMobile}
        onClose={closePanel}
        title={panelTitle}
        mobileHeaderExtra={mobileDatesHeaderExtra}
      >
        <div id={PANEL_ID}>{panelContent}</div>
      </FloatingBookingPanel>

      <div aria-live="polite" className={styles.srOnly}>
        {calendarLoading && t("calendar.loading")}
      </div>

      {formError && (
        <p className={styles.formError} role="alert">
          {formError}
          {(formError === tErrors("lodgify_error") ||
            formError === tErrors("quote_not_available")) && (
            <button type="button" className={styles.retryBtn} onClick={() => void handleValidate()}>
              {t("retry")}
            </button>
          )}
        </p>
      )}

      <CoconChoiceModal
        open={Boolean(coconChoiceUrls)}
        placeId={placeId}
        urls={coconChoiceUrls ?? {}}
        indicativeByCocon={indicativeForChoice}
        stayNights={
          arrival && departure ? countNights(arrival, departure) : undefined
        }
        onClose={() => setCoconChoiceUrls(null)}
        onChoose={(id, url) => {
          trackBookingSearchEvent("booking_search_checkout_choice", {
            siteLanguage: toAnalyticsSiteLanguage(locale),
            coconId: id,
          });
          trackBookingClick({
            href: url,
            siteLanguage: toAnalyticsSiteLanguage(locale),
            buttonLocation: "hero_booking_cocon_choice",
          });
          window.location.href = url;
        }}
      />
    </div>
  );
}
