import type { PlaceDayAvailability, DayAggregateStatus } from "@/config/booking/types";

export function aggregatePlaceDay(
  date: string,
  coconIds: string[],
  bookableByCocon: Map<string, boolean>
): PlaceDayAvailability {
  const totalCount = coconIds.length;
  const availableCoconIds = coconIds.filter((id) => bookableByCocon.get(id) === true);
  const availableCount = availableCoconIds.length;

  let status: DayAggregateStatus = "unavailable";
  if (availableCount === totalCount && totalCount > 0) status = "available";
  else if (availableCount > 0) status = "partial";

  return {
    date,
    availableCount,
    totalCount,
    availableCoconIds,
    status,
  };
}

export function aggregatePlaceRange(
  dates: string[],
  coconIds: string[],
  bookableByCoconAndDate: Map<string, Map<string, boolean>>
): PlaceDayAvailability[] {
  return dates.map((date) => {
    const perCocon = new Map<string, boolean>();
    for (const coconId of coconIds) {
      perCocon.set(coconId, bookableByCoconAndDate.get(coconId)?.get(date) === true);
    }
    return aggregatePlaceDay(date, coconIds, perCocon);
  });
}
