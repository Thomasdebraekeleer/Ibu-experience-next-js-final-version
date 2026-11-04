import { NextRequest, NextResponse } from "next/server";
import { parseCoconMediaQuery } from "@/server/booking/parse-cocon-media-query";
import { resolveCoconMediaGalleries } from "@/server/booking/fetch-cocon-media";
import { LodgifyApiError } from "@/server/lodgify/types";

export const runtime = "nodejs";

const CACHE_HEADER =
  "public, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsed = parseCoconMediaQuery({
    placeId: searchParams.get("placeId"),
    coconIds: searchParams.get("coconIds"),
  });

  if (!parsed.ok) {
    return NextResponse.json({ ok: false, reason: parsed.reason }, { status: 400 });
  }

  try {
    const { galleries, lodgifyFailures } = await resolveCoconMediaGalleries(parsed.cocons);

    if (lodgifyFailures === parsed.cocons.length) {
      return NextResponse.json(
        { ok: false, reason: "lodgify_media_error" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        placeId: parsed.place.id,
        galleries,
      },
      { headers: { "Cache-Control": CACHE_HEADER } }
    );
  } catch (err) {
    if (err instanceof LodgifyApiError) {
      const status = err.status >= 500 ? 503 : 502;
      return NextResponse.json(
        { ok: false, reason: "lodgify_media_error" },
        { status, headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json(
      { ok: false, reason: "lodgify_media_error" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
