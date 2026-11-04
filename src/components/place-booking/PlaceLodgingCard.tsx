"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Users, BedDouble } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { PlaceCatalogCocon } from "@/lib/booking/place-catalog-types";
import type { PublicCoconPricing } from "@/lib/booking/types";
import { formatBookingMoney } from "@/lib/booking/format-booking-money";
import { AMENITY_ICONS } from "./amenity-icons";
import styles from "./place-booking.module.scss";

type Props = {
  cocon: PlaceCatalogCocon;
  pricing?: PublicCoconPricing | null;
  hasActiveSearch: boolean;
  chooseEnabled: boolean;
  onMorePhotos: () => void;
  onChoose: () => void;
};

export default function PlaceLodgingCard({
  cocon,
  pricing,
  hasActiveSearch,
  chooseEnabled,
  onMorePhotos,
  onChoose,
}: Props) {
  const locale = useLocale() as Locale;
  const localeTag = locale === "nl-BE" ? "nl-BE" : "fr-BE";
  const t = useTranslations("placeBooking");
  const tNames = useTranslations("bookingSearch.cocoons");
  const tAmenities = useTranslations("placeBooking.amenities");

  const [imgSrc, setImgSrc] = useState(cocon.coverImageUrl ?? cocon.fallbackImage);
  const name = tNames(`${cocon.nameKey}.name`);

  const priceBlock = () => {
    if (hasActiveSearch && pricing) {
      return (
        <p className={styles.cardPriceMain}>
          {t("stayPrice", {
            price: formatBookingMoney(
              pricing.totalIncludingVat,
              pricing.currencyCode,
              localeTag
            ),
            nights: pricing.nights,
          })}
        </p>
      );
    }
    if (cocon.minPrice) {
      return (
        <p className={styles.cardPriceMain}>
          {t("fromPrice", {
            price: formatBookingMoney(
              cocon.minPrice.amount,
              cocon.minPrice.currencyCode,
              localeTag
            ),
          })}
        </p>
      );
    }
    return <p className={styles.cardPriceFallback}>{t("priceUnavailable")}</p>;
  };

  return (
    <article className={styles.lodgingCard}>
      <div className={styles.cardMedia}>
        <div className={styles.cardMediaFrame}>
          <Image
            src={imgSrc}
            alt={name}
            fill
            className={styles.cardImage}
            sizes="(max-width: 768px) 100vw, 360px"
            onError={() => setImgSrc(cocon.fallbackImage)}
          />
          {cocon.gallery.length > 0 && (
            <button type="button" className={styles.morePhotosBtn} onClick={onMorePhotos}>
              {t("morePhotos")}
            </button>
          )}
        </div>
      </div>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{name}</h3>
        <ul className={styles.cardMeta}>
          <li>
            <Users size={16} aria-hidden="true" />
            {t("capacity", { count: cocon.capacityAdults })}
          </li>
          {cocon.bedrooms != null && (
            <li>
              <BedDouble size={16} aria-hidden="true" />
              {t("bedrooms", { count: cocon.bedrooms })}
            </li>
          )}
        </ul>
        <ul className={styles.amenityList}>
          {cocon.amenityKeys.map((key) => {
            const Icon = AMENITY_ICONS[key];
            return (
              <li key={key}>
                <Icon size={16} aria-hidden="true" />
                {tAmenities(key)}
              </li>
            );
          })}
        </ul>
        {cocon.amenityExtraCount > 0 && (
          <p className={styles.amenityMore}>
            {t("amenitiesMore", { count: cocon.amenityExtraCount })}
          </p>
        )}
      </div>
      <div className={styles.cardAside}>
        {priceBlock()}
        <button
          type="button"
          className={styles.primaryBtn}
          disabled={!chooseEnabled}
          onClick={onChoose}
        >
          {t("choose")}
        </button>
      </div>
    </article>
  );
}
