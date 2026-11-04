import { fetchQuote } from "./client";

export type QuoteExpected = {
  propertyId: number;
  roomTypeId: number;
  arrival: string;
  departure: string;
  adults: number;
};

export type QuoteConfirmation = {
  confirmed: boolean;
  currencyCode?: string;
  totalIncludingVat?: number;
  errorCode?: string;
};

function stripSensitive(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(stripSensitive);
  if (typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (/email|phone|guest|customer|address|firstname|lastname|booking_id/i.test(k)) {
      continue;
    }
    out[k] = stripSensitive(v);
  }
  return out;
}

function normalizeQuoteDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.slice(0, 10);
}

function readRoomTypes(o: Record<string, unknown>): unknown[] {
  const rt = o.room_types ?? o.roomTypes;
  return Array.isArray(rt) ? rt : [];
}

/** Lodgify renvoie parfois un tableau d’une entrée au lieu d’un objet. */
export function normalizeQuoteBody(body: unknown): unknown {
  if (Array.isArray(body)) {
    return body.length > 0 ? body[0] : null;
  }
  return body;
}

/** Interprétation stricte d’une quote Lodgify 200. */
export function interpretQuoteResponse(body: unknown, expected: QuoteExpected): QuoteConfirmation {
  const normalized = normalizeQuoteBody(body);
  if (!normalized || typeof normalized !== "object") {
    return { confirmed: false, errorCode: "empty_quote" };
  }

  const o = normalized as Record<string, unknown>;

  if (o.error || o.errors) {
    return { confirmed: false, errorCode: "quote_error" };
  }

  const propertyId = o.property_id ?? o.propertyId;
  if (Number(propertyId) !== expected.propertyId) {
    return { confirmed: false, errorCode: "property_mismatch" };
  }

  const arrival = normalizeQuoteDate(o.date_arrival ?? o.arrival);
  const departure = normalizeQuoteDate(o.date_departure ?? o.departure);
  if (arrival !== expected.arrival || departure !== expected.departure) {
    return { confirmed: false, errorCode: "dates_mismatch" };
  }

  const currencyCode =
    typeof o.currency_code === "string" && o.currency_code.trim()
      ? o.currency_code
      : "";
  if (!currencyCode) {
    return { confirmed: false, errorCode: "missing_currency" };
  }

  const totalIncludingVat =
    typeof o.total_including_vat === "number" ? o.total_including_vat : NaN;
  if (!Number.isFinite(totalIncludingVat) || totalIncludingVat <= 0) {
    return { confirmed: false, errorCode: "invalid_total" };
  }

  const roomTypes = readRoomTypes(o);
  if (roomTypes.length === 0) {
    return { confirmed: false, errorCode: "empty_room_types" };
  }

  const matching = roomTypes.find((item) => {
    if (!item || typeof item !== "object") return false;
    const row = item as Record<string, unknown>;
    const id = row.room_type_id ?? row.roomTypeId ?? row.id;
    return Number(id) === expected.roomTypeId;
  });

  if (!matching || typeof matching !== "object") {
    return { confirmed: false, errorCode: "room_type_mismatch" };
  }

  const row = matching as Record<string, unknown>;
  const people = row.people ?? row.People;
  if (Number(people) !== expected.adults) {
    return { confirmed: false, errorCode: "people_mismatch" };
  }

  const subtotal = typeof row.subtotal === "number" ? row.subtotal : NaN;
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return { confirmed: false, errorCode: "invalid_subtotal" };
  }

  return {
    confirmed: true,
    currencyCode,
    totalIncludingVat,
  };
}

export async function confirmStayWithQuote(options: QuoteExpected): Promise<QuoteConfirmation> {
  const body = await fetchQuote(options);
  return interpretQuoteResponse(body, options);
}

export function sanitizeQuoteSample(body: unknown): unknown {
  return stripSensitive(body);
}
