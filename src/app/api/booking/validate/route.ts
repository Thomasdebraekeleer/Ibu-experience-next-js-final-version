import { NextRequest, NextResponse } from "next/server";
import { resolveCoconCheckoutUrl } from "@/config/booking/checkout-url";
import type { Locale } from "@/i18n/routing";
import { fetchPlaceCalendar } from "@/server/booking/fetch-place-calendar";
import { parseValidateBody } from "@/server/booking/validate-request";
import { validateStay } from "@/server/booking/validate-stay";
import { getActiveCocons } from "@/config/booking/places";
import { addDaysYmd, countNights } from "@/lib/dates/ymd";
import type { PublicCoconPricing } from "@/lib/booking/types";
import { LodgifyApiError } from "@/server/lodgify/types";
import { confirmStayWithQuote } from "@/server/lodgify/quote";
import { buildValidateCheckoutOutcome } from "@/server/booking/validate-checkout-outcome";

export const runtime = "nodejs";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function parseLocale(value: unknown): Locale {
  if (value === "nl-BE") return "nl-BE";
  return "fr";
}

function emptyValidateResponse(reason: string, status: number) {
  return NextResponse.json(
    {
      valid: false,
      availableCoconIds: [],
      reason,
      constraints: {},
      checkoutUrls: {},
      checkoutBlocked: {},
      pricingByCocon: {},
    },
    { status, headers: NO_STORE }
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return emptyValidateResponse("invalid_request", 400);
  }

  const parsed = parseValidateBody(body);
  if (!parsed.ok) {
    return emptyValidateResponse(parsed.reason, 400);
  }

  const locale = parseLocale((body as Record<string, unknown>).locale);

  try {
    const lastNight = addDaysYmd(parsed.departure, -1);
    const calendar = await fetchPlaceCalendar({
      placeId: parsed.place.id,
      cocons: getActiveCocons(parsed.place),
      start: parsed.arrival,
      end: lastNight,
      useCache: false,
    });

    const validation = validateStay({
      arrival: parsed.arrival,
      departure: parsed.departure,
      adults: parsed.adults,
      cocons: parsed.cocons,
      bookableByCocon: calendar.bookableByCocon,
      ratesByCocon: calendar.ratesByCocon,
      rateMetaByCocon: calendar.rateMetaByCocon,
    });

    if (!validation.valid) {
      return NextResponse.json(
        {
          valid: false,
          availableCoconIds: [],
          reason: validation.reason,
          constraints: validation.constraints,
          checkoutUrls: {},
          checkoutBlocked: {},
          pricingByCocon: {},
        },
        { status: 422, headers: NO_STORE }
      );
    }

    const stayNights = countNights(parsed.arrival, parsed.departure);

    const quoteJobs = validation.availableCoconIds.map((coconId) => {
      const cocon =
        parsed.cocons.find((c) => c.id === coconId) ??
        getActiveCocons(parsed.place).find((c) => c.id === coconId);
      return { coconId, cocon };
    });

    const quoteResults = await Promise.allSettled(
      quoteJobs.map(async ({ coconId, cocon }) => {
        if (!cocon) return { coconId, quote: { confirmed: false as const } };
        const quote = await confirmStayWithQuote({
          propertyId: cocon.lodgify.propertyId,
          roomTypeId: cocon.lodgify.roomTypeId,
          arrival: parsed.arrival,
          departure: parsed.departure,
          adults: parsed.adults,
        });
        return { coconId, quote };
      })
    );

    const quoteConfirmedIds: string[] = [];
    const pricingByCocon: Record<string, PublicCoconPricing> = {};
    for (const result of quoteResults) {
      if (result.status !== "fulfilled") continue;
      const { coconId, quote } = result.value;
      if (
        quote.confirmed &&
        typeof quote.totalIncludingVat === "number" &&
        quote.currencyCode
      ) {
        quoteConfirmedIds.push(coconId);
        pricingByCocon[coconId] = {
          totalIncludingVat: quote.totalIncludingVat,
          currencyCode: quote.currencyCode,
          nights: stayNights,
        };
      }
    }

    if (quoteConfirmedIds.length === 0) {
      return NextResponse.json(
        {
          valid: false,
          availableCoconIds: [],
          reason: "quote_not_available",
          constraints: validation.constraints,
          checkoutUrls: {},
          checkoutBlocked: {},
          pricingByCocon: {},
        },
        { status: 422, headers: NO_STORE }
      );
    }

    const checkoutUrls: Record<string, string> = {};
    const checkoutBlocked: Record<string, string> = {};

    for (const coconId of quoteConfirmedIds) {
      const cocon =
        parsed.cocons.find((c) => c.id === coconId) ??
        getActiveCocons(parsed.place).find((c) => c.id === coconId);
      if (!cocon) continue;

      const checkout = resolveCoconCheckoutUrl(cocon, locale, {
        arrival: parsed.arrival,
        departure: parsed.departure,
        adults: parsed.adults,
      });

      if (checkout.ok) {
        checkoutUrls[coconId] = checkout.url;
      } else {
        checkoutBlocked[coconId] = checkout.reason;
      }
    }

    const filteredPricing: Record<string, PublicCoconPricing> = {};
    for (const id of Object.keys(checkoutUrls)) {
      if (pricingByCocon[id]) filteredPricing[id] = pricingByCocon[id]!;
    }

    const outcome = buildValidateCheckoutOutcome({
      quoteConfirmedIds,
      checkoutUrls,
      checkoutBlocked,
      constraints: validation.constraints,
      pricingByCocon: filteredPricing,
    });

    return NextResponse.json(outcome.body, { status: outcome.status, headers: NO_STORE });
  } catch (err) {
    if (err instanceof LodgifyApiError) {
      return emptyValidateResponse("lodgify_error", 503);
    }
    return emptyValidateResponse("lodgify_error", 503);
  }
}
