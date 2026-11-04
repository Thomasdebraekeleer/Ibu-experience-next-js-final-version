import { NextRequest, NextResponse } from "next/server";
import { fetchPlaceCalendar } from "@/server/booking/fetch-place-calendar";
import { parseAvailabilityQuery } from "@/server/booking/validate-request";
import { LodgifyApiError } from "@/server/lodgify/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsed = parseAvailabilityQuery({
    placeId: searchParams.get("placeId"),
    start: searchParams.get("start"),
    end: searchParams.get("end"),
    coconId: searchParams.get("coconId"),
  });

  if (!parsed.ok) {
    return NextResponse.json({ ok: false, reason: parsed.reason }, { status: 400 });
  }

  try {
    const calendar = await fetchPlaceCalendar({
      placeId: parsed.place.id,
      cocons: parsed.cocons,
      start: parsed.start,
      end: parsed.end,
      useCache: true,
    });

    const rates: Record<string, { date: string; minStay: number; maxStay: number; indicativePricePerDay: number | null; currencyCode: string }[]> = {};

    for (const cocon of parsed.cocons) {
      const map = calendar.ratesByCocon.get(cocon.id);
      if (!map) continue;
      rates[cocon.id] = Array.from(map.values()).sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    }

    return NextResponse.json(
      {
        ok: true,
        placeId: parsed.place.id,
        start: parsed.start,
        end: parsed.end,
        coconId: (() => {
          const raw = searchParams.get("coconId");
          return raw === "all" || raw == null || raw === "" ? null : raw;
        })(),
        days: calendar.days,
        ratesByCocon: rates,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=60",
        },
      }
    );
  } catch (err) {
    if (err instanceof LodgifyApiError) {
      const status = err.status === 401 ? 502 : err.status >= 500 ? 503 : 502;
      return NextResponse.json({ ok: false, reason: "lodgify_error" }, { status });
    }
    return NextResponse.json({ ok: false, reason: "lodgify_error" }, { status: 503 });
  }
}
