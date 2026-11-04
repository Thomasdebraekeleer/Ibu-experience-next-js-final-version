import { NextRequest, NextResponse } from "next/server";
import { parsePlaceCatalogQuery } from "@/server/booking/parse-place-catalog-query";
import { resolvePlaceCatalog } from "@/server/booking/fetch-place-catalog";
import { LodgifyApiError } from "@/server/lodgify/types";
import { PUBLIC_COCONS } from "@/config/booking/public-places";

export const runtime = "nodejs";

const CACHE_HEADER = "public, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("placeId");
  const parsed = parsePlaceCatalogQuery(placeId);

  if (!parsed.ok) {
    return NextResponse.json({ ok: false, reason: parsed.reason }, { status: 400 });
  }

  try {
    const { cocons, partialFailures } = await resolvePlaceCatalog(parsed.place);

    const publicCocons = cocons.map((c) => {
      const meta = PUBLIC_COCONS.find((p) => p.id === c.id);
      return {
        ...c,
        fallbackImage: meta?.image ?? "",
        nameKey: meta?.nameKey ?? c.id,
      };
    });

    if (partialFailures === parsed.place.cocons.filter((c) => c.status === "active").length) {
      return NextResponse.json(
        { ok: false, reason: "lodgify_catalog_error" },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        placeId: parsed.place.id,
        cocons: publicCocons,
        partialFailures,
      },
      { headers: { "Cache-Control": CACHE_HEADER } }
    );
  } catch (err) {
    if (err instanceof LodgifyApiError) {
      return NextResponse.json(
        { ok: false, reason: "lodgify_catalog_error" },
        { status: err.status >= 500 ? 503 : 502, headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json(
      { ok: false, reason: "lodgify_catalog_error" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
