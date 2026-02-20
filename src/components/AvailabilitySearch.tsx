"use client";

import React, { useState, useCallback, useRef } from "react";
import styles from "./AvailabilitySearch.module.scss";

const LODGIFY_BASE_URL =
  "https://ibu-experience.lodgify.com/fr/toutes-les-proprietes/";

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
        setError("Veuillez choisir une date d'arrivée.");
        return;
      }
      if (!departure?.trim()) {
        setError("Veuillez choisir une date de départ.");
        return;
      }
      if (departure <= arrival) {
        setError("La date de départ doit être après la date d'arrivée.");
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
      const url = `${LODGIFY_BASE_URL}?${params.toString()}`;
      window.location.href = url;
    },
    [arrival, departure, adults]
  );

  const isHero = variant === "hero";
  const wrapperClass = [
    styles.wrapper,
    isHero ? styles.hero : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} role="search" aria-label="Recherche de disponibilités">
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={error ? "availability-error" : undefined}
      >
        <div className={styles.row}>
          <div className={`${styles.fieldGroup} ${styles.fieldGroupDates}`}>
            <label htmlFor="availability-arrival" className={styles.label}>
              Arrivée
            </label>
            <div
              className={styles.dateInputWrap}
              onClick={openArrivalPicker}
            >
              <input
                ref={arrivalInputRef}
                id="availability-arrival"
                type="date"
                className={styles.input}
                placeholder="Arrivée"
                value={arrival}
                min={minDate}
                onChange={handleArrivalChange}
                aria-label="Date d'arrivée"
                aria-required="true"
              />
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="availability-departure" className={styles.label}>
              Départ
            </label>
            <div
              className={styles.dateInputWrap}
              onClick={openDeparturePicker}
            >
              <input
                ref={departureInputRef}
                id="availability-departure"
                type="date"
                className={styles.input}
                placeholder="Départ"
                value={departure}
                min={arrival || minDate}
                onChange={handleDepartureChange}
                aria-label="Date de départ"
                aria-required="true"
              />
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={`${styles.fieldGroup} ${styles.fieldGroupAdults}`}>
            <span className={styles.label} id="adults-label">
              Adultes
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
                aria-label="Réduire le nombre d'adultes"
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
                aria-label="Augmenter le nombre d'adultes"
                disabled={adults >= 2}
              >
                +
              </button>
            </div>
          </div>
          <div className={styles.submitWrapper}>
            <button type="submit" className={styles.submitBtn} aria-label="Lancer la recherche de disponibilités">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Rechercher
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

/*
 Checklist manuelle (tests rapides) :
 - [ ] Arrivée + Départ vides => clic Rechercher => message "Veuillez choisir une date d'arrivée."
 - [ ] Arrivée remplie, Départ vide => message "Veuillez choisir une date de départ."
 - [ ] Arrivée = Départ ou Départ < Arrivée => message "La date de départ doit être après la date d'arrivée."
 - [ ] Changer Arrivée après avoir choisi Départ : si Départ <= Arrivée, Départ est réinitialisé.
 - [ ] Dates valides + Adultes 1 ou 2 => clic Rechercher => redirection vers Lodgify avec query ?adults=1|2&sort=price&arrival=YYYY-MM-DD&departure=YYYY-MM-DD&children=0&infants=0&pets=0
 - [ ] Navigation clavier : Tab entre champs, focus visible.
 - [ ] Mobile : formulaire en colonne, bouton pleine largeur.
 - [ ] Desktop : disposition horizontale (dates + adultes + bouton).
 */
