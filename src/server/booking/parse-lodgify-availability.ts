import type { LodgifyAvailabilityPayload, LodgifyAvailabilityPeriod } from "@/server/lodgify/types";

export function extractPeriodsFromAvailabilityResponse(body: unknown): LodgifyAvailabilityPeriod[] {
  if (!body) return [];

  if (Array.isArray(body)) {
    const periods: LodgifyAvailabilityPeriod[] = [];
    for (const chunk of body as LodgifyAvailabilityPayload[]) {
      if (chunk?.periods?.length) periods.push(...chunk.periods);
    }
    return periods;
  }

  const single = body as LodgifyAvailabilityPayload;
  return single.periods ?? [];
}
