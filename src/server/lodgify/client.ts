import { LodgifyApiError } from "./types";

const BASE_URL = "https://api.lodgify.com";
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_RETRIES = 3;

function getApiKey(): string {
  const key = process.env.LODGIFY_API_KEY;
  if (!key?.trim()) {
    throw new LodgifyApiError("lodgify_not_configured", 500, "config");
  }
  return key.trim();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

async function lodgifyGetOnce(
  apiKey: string,
  pathname: string,
  query: Record<string, string | number | boolean>
): Promise<{ status: number; body: unknown }> {
  const url = new URL(BASE_URL + pathname);
  for (const [k, v] of Object.entries(query)) {
    url.searchParams.set(k, String(v));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-ApiKey": apiKey,
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      await res.text();
      throw new LodgifyApiError("lodgify_http_error", res.status, url.pathname);
    }

    const text = await res.text();
    const body = text ? JSON.parse(text) : null;
    return { status: res.status, body };
  } catch (err) {
    if (err instanceof LodgifyApiError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new LodgifyApiError("lodgify_timeout", 504, pathname);
    }
    throw new LodgifyApiError("lodgify_network_error", 503, pathname);
  } finally {
    clearTimeout(timer);
  }
}

async function lodgifyGetWithRetry(
  pathname: string,
  query: Record<string, string | number | boolean>
): Promise<unknown> {
  const apiKey = getApiKey();
  let lastError: LodgifyApiError | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      const { body } = await lodgifyGetOnce(apiKey, pathname, query);
      return body;
    } catch (err) {
      if (!(err instanceof LodgifyApiError)) throw err;
      lastError = err;
      const retryable =
        err.status === 503 ||
        err.status === 504 ||
        isRetryableStatus(err.status);
      if (!retryable || attempt === MAX_RETRIES - 1) throw err;
      await sleep(400 * (attempt + 1));
    }
  }

  throw lastError ?? new LodgifyApiError("lodgify_unknown", 500, pathname);
}

/** GET /v2/availability/{propertyId}/{roomTypeId} */
export async function fetchAvailability(
  propertyId: number,
  roomTypeId: number,
  start: string,
  end: string
): Promise<unknown> {
  return lodgifyGetWithRetry(`/v2/availability/${propertyId}/${roomTypeId}`, {
    start,
    end,
    includeDetails: false,
  });
}

/** GET /v2/rates/calendar */
export async function fetchRatesCalendar(
  houseId: number,
  roomTypeId: number,
  startDate: string,
  endDate: string
): Promise<unknown> {
  return lodgifyGetWithRetry("/v2/rates/calendar", {
    houseId,
    roomTypeId,
    startDate,
    endDate,
  });
}

/** GET /v2/properties/{propertyId}/rooms — médias read-only. */
export async function fetchPropertyRooms(propertyId: number): Promise<unknown> {
  return lodgifyGetWithRetry(`/v2/properties/${propertyId}/rooms`, {});
}

/** GET /v2/quote/{propertyId} — lecture seule, jamais de réservation. */
export async function fetchQuote(options: {
  propertyId: number;
  roomTypeId: number;
  arrival: string;
  departure: string;
  adults: number;
}): Promise<unknown> {
  return lodgifyGetWithRetry(`/v2/quote/${options.propertyId}`, {
    arrival: options.arrival,
    departure: options.departure,
    "roomTypes[0].id": options.roomTypeId,
    "roomTypes[0].people": options.adults,
  });
}
