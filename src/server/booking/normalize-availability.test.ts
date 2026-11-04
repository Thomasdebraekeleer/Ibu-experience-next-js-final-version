import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeLodgifyPeriods } from "./normalize-availability";
import { aggregatePlaceRange } from "./aggregate-place";
import { countDaysInclusive, expandInclusivePeriod } from "@/lib/dates/ymd";
import type { LodgifyAvailabilityPeriod } from "@/server/lodgify/types";
import { parseAvailabilityQuery, parseValidateBody } from "./validate-request";
import { selectPriceTierForNights } from "./normalize-rates";
import type { LodgifyPriceTier } from "@/server/lodgify/types";

describe("expandInclusivePeriod via normalizeLodgifyPeriods", () => {
  it("expands inclusive period 3 to 5 into three days", () => {
    const periods: LodgifyAvailabilityPeriod[] = [
      { start: "2026-11-03", end: "2026-11-05", available: 1, closed_period: null },
    ];
    const { days } = normalizeLodgifyPeriods(periods, "2026-11-03", "2026-11-05");
    assert.equal(days.get("2026-11-03"), true);
    assert.equal(days.get("2026-11-04"), true);
    assert.equal(days.get("2026-11-05"), true);
  });

  it("marks available=0 as not bookable", () => {
    const periods: LodgifyAvailabilityPeriod[] = [
      { start: "2026-11-03", end: "2026-11-03", available: 0, closed_period: null },
    ];
    const { days } = normalizeLodgifyPeriods(periods, "2026-11-03", "2026-11-03");
    assert.equal(days.get("2026-11-03"), false);
  });

  it("marks closed_period as not bookable", () => {
    const periods: LodgifyAvailabilityPeriod[] = [
      {
        start: "2026-11-03",
        end: "2026-11-03",
        available: 1,
        closed_period: { id: 1 },
      },
    ];
    const { days } = normalizeLodgifyPeriods(periods, "2026-11-03", "2026-11-03");
    assert.equal(days.get("2026-11-03"), false);
  });

  it("detects gap in window", () => {
    const periods: LodgifyAvailabilityPeriod[] = [
      { start: "2026-11-03", end: "2026-11-03", available: 1, closed_period: null },
    ];
    const { gaps } = normalizeLodgifyPeriods(periods, "2026-11-03", "2026-11-05");
    assert.deepEqual(gaps, ["2026-11-04", "2026-11-05"]);
  });

  it("detects overlapping contradictory periods", () => {
    const periods: LodgifyAvailabilityPeriod[] = [
      { start: "2026-11-03", end: "2026-11-03", available: 1, closed_period: null },
      { start: "2026-11-03", end: "2026-11-03", available: 0, closed_period: null },
    ];
    const { overlaps } = normalizeLodgifyPeriods(periods, "2026-11-03", "2026-11-03");
    assert.deepEqual(overlaps, ["2026-11-03"]);
  });
});

describe("aggregatePlaceRange", () => {
  const dates = expandInclusivePeriod("2026-11-03", "2026-11-03");

  it("aggregates 2/2 available", () => {
    const map = new Map<string, Map<string, boolean>>([
      ["cocon-1", new Map([["2026-11-03", true]])],
      ["cocon-2", new Map([["2026-11-03", true]])],
    ]);
    const [day] = aggregatePlaceRange(dates, ["cocon-1", "cocon-2"], map);
    assert.equal(day.status, "available");
    assert.equal(day.availableCount, 2);
    assert.equal(day.totalCount, 2);
  });

  it("aggregates 1/2 partial", () => {
    const map = new Map<string, Map<string, boolean>>([
      ["cocon-1", new Map([["2026-11-03", true]])],
      ["cocon-2", new Map([["2026-11-03", false]])],
    ]);
    const [day] = aggregatePlaceRange(dates, ["cocon-1", "cocon-2"], map);
    assert.equal(day.status, "partial");
    assert.equal(day.availableCount, 1);
  });

  it("aggregates 0/2 unavailable", () => {
    const map = new Map<string, Map<string, boolean>>([
      ["cocon-1", new Map([["2026-11-03", false]])],
      ["cocon-2", new Map([["2026-11-03", false]])],
    ]);
    const [day] = aggregatePlaceRange(dates, ["cocon-1", "cocon-2"], map);
    assert.equal(day.status, "unavailable");
    assert.equal(day.availableCount, 0);
  });

  it("supports more than two cocons", () => {
    const map = new Map<string, Map<string, boolean>>([
      ["a", new Map([["2026-11-03", true]])],
      ["b", new Map([["2026-11-03", true]])],
      ["c", new Map([["2026-11-03", false]])],
    ]);
    const [day] = aggregatePlaceRange(dates, ["a", "b", "c"], map);
    assert.equal(day.status, "partial");
    assert.equal(day.totalCount, 3);
    assert.equal(day.availableCount, 2);
  });
});

describe("selectPriceTierForNights", () => {
  const prices: LodgifyPriceTier[] = [
    { min_stay: 1, max_stay: 6, price_per_day: 265 },
    { min_stay: 7, max_stay: 30, price_per_day: 200 },
  ];

  it("selects tier for 2 nights", () => {
    const tier = selectPriceTierForNights(prices, 2);
    assert.equal(tier?.min_stay, 1);
    assert.equal(tier?.price_per_day, 265);
  });

  it("selects tier for 7 nights", () => {
    const tier = selectPriceTierForNights(prices, 7);
    assert.equal(tier?.price_per_day, 200);
  });

  it("returns null when no tier matches", () => {
    assert.equal(selectPriceTierForNights(prices, 40), null);
  });
});

describe("date bounds", () => {
  it("rejects calendar window ending in 9999 without expanding", () => {
    const r = parseAvailabilityQuery({
      placeId: "domaine-mehaignoul",
      start: "2026-12-01",
      end: "9999-12-31",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "calendar_window_exceeded");
  });

  it("countDaysInclusive is O(1) for long spans", () => {
    assert.equal(countDaysInclusive("2026-01-01", "9999-12-31") > 93, true);
  });
});

describe("parseAvailabilityQuery coconId", () => {
  it("treats coconId=all like absent", () => {
    const a = parseAvailabilityQuery({
      placeId: "domaine-mehaignoul",
      start: "2026-12-01",
      end: "2026-12-10",
    });
    const b = parseAvailabilityQuery({
      placeId: "domaine-mehaignoul",
      start: "2026-12-01",
      end: "2026-12-10",
      coconId: "all",
    });
    assert.equal(a.ok, true);
    assert.equal(b.ok, true);
    if (a.ok && b.ok) {
      assert.equal(a.cocons.length, b.cocons.length);
    }
  });
});

describe("parseAvailabilityQuery", () => {
  it("rejects unknown place", () => {
    const r = parseAvailabilityQuery({
      placeId: "unknown",
      start: "2026-12-01",
      end: "2026-12-05",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "invalid_place");
  });

  it("rejects past start", () => {
    const r = parseAvailabilityQuery({
      placeId: "domaine-mehaignoul",
      start: "2020-01-01",
      end: "2020-01-05",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "arrival_in_past");
  });
});

describe("parseValidateBody", () => {
  it("rejects departure before arrival", () => {
    const r = parseValidateBody({
      placeId: "domaine-mehaignoul",
      coconId: "all",
      arrival: "2026-12-10",
      departure: "2026-12-10",
      adults: 2,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "departure_not_after_arrival");
  });

  it("rejects adults over capacity", () => {
    const r = parseValidateBody({
      placeId: "domaine-mehaignoul",
      coconId: "cocon-1",
      arrival: "2026-12-10",
      departure: "2026-12-12",
      adults: 3,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "adults_exceed_capacity");
  });

  it("rejects invalid place", () => {
    const r = parseValidateBody({
      placeId: "chateau-fictif",
      coconId: "all",
      arrival: "2026-12-10",
      departure: "2026-12-12",
      adults: 2,
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "invalid_place");
  });
});
