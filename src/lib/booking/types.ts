import type { ValidateReason } from "@/config/booking/types";

export type AvailabilityDay = {
  date: string;
  availableCount: number;
  totalCount: number;
  availableCoconIds: string[];
  status: "available" | "partial" | "unavailable";
};

export type DayRate = {
  date: string;
  minStay: number;
  maxStay: number;
  indicativePricePerDay: number | null;
  currencyCode: string;
};

export type AvailabilityResponse =
  | {
      ok: true;
      placeId: string;
      start: string;
      end: string;
      days: AvailabilityDay[];
      ratesByCocon: Record<string, DayRate[]>;
    }
  | { ok: false; reason: ValidateReason };

export type ValidateResponse = {
  valid: boolean;
  availableCoconIds: string[];
  reason: ValidateReason | null;
  constraints: {
    nights?: number;
    minStay?: number;
    maxStay?: number;
    currencyCode?: string;
  };
  checkoutUrls: Record<string, string>;
  checkoutBlocked: Record<string, string>;
};

export type DayVisualState =
  | "past"
  | "unknown"
  | "loading"
  | "available"
  | "partial"
  | "unavailable"
  | "selected"
  | "in-range"
  | "disabled";
