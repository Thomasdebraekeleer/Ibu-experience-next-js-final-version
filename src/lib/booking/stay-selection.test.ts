import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildDayIndex,
  coconsEligibleForStay,
  intersectCoconIdsAcrossNights,
  isStayRangeValid,
  shouldClearDatesOnCoconChange,
} from "./stay-selection";
import type { AvailabilityDay } from "./types";
import { resolveCheckoutFlow } from "./checkout-flow";

const capacity = new Map([
  ["cocon-1", 2],
  ["cocon-2", 2],
]);

function day(
  date: string,
  availableCoconIds: string[],
  status: AvailabilityDay["status"] = "available"
): AvailabilityDay {
  return {
    date,
    availableCount: availableCoconIds.length,
    totalCount: 2,
    availableCoconIds,
    status,
  };
}

const rates = {
  "cocon-1": [
    { date: "2026-12-10", minStay: 1, maxStay: 7, indicativePricePerDay: 200, currencyCode: "EUR" },
  ],
  "cocon-2": [
    { date: "2026-12-10", minStay: 1, maxStay: 7, indicativePricePerDay: 200, currencyCode: "EUR" },
  ],
};

describe("intersectCoconIdsAcrossNights", () => {
  it("keeps same cocon on all nights", () => {
    const index = buildDayIndex([
      day("2026-12-10", ["cocon-1", "cocon-2"]),
      day("2026-12-11", ["cocon-1", "cocon-2"]),
    ]);
    assert.deepEqual(
      intersectCoconIdsAcrossNights(["2026-12-10", "2026-12-11"], index),
      ["cocon-1", "cocon-2"]
    );
  });

  it("returns empty when no single cocon covers all nights", () => {
    const index = buildDayIndex([
      day("2026-12-10", ["cocon-1"]),
      day("2026-12-11", ["cocon-2"]),
    ]);
    assert.deepEqual(intersectCoconIdsAcrossNights(["2026-12-10", "2026-12-11"], index), []);
  });
});

describe("stay range validation", () => {
  it("accepts 2/2 available range", () => {
    const index = buildDayIndex([
      day("2026-12-10", ["cocon-1", "cocon-2"], "available"),
      day("2026-12-11", ["cocon-1", "cocon-2"], "available"),
    ]);
    assert.equal(
      isStayRangeValid({
        arrival: "2026-12-10",
        departure: "2026-12-12",
        adults: 2,
        coconFilter: "all",
        dayIndex: index,
        ratesByCocon: rates,
        capacityByCocon: capacity,
      }),
      true
    );
  });

  it("accepts partial days when one cocon fits whole stay", () => {
    const index = buildDayIndex([
      day("2026-12-10", ["cocon-1"], "partial"),
      day("2026-12-11", ["cocon-1"], "partial"),
    ]);
    assert.equal(
      coconsEligibleForStay({
        arrival: "2026-12-10",
        departure: "2026-12-12",
        adults: 2,
        coconFilter: "all",
        dayIndex: index,
        ratesByCocon: rates,
        capacityByCocon: capacity,
      }).length,
      1
    );
  });

  it("rejects middle unavailable night", () => {
    const index = buildDayIndex([
      day("2026-12-10", ["cocon-1"]),
      day("2026-12-11", []),
      day("2026-12-12", ["cocon-1"]),
    ]);
    assert.equal(
      isStayRangeValid({
        arrival: "2026-12-10",
        departure: "2026-12-13",
        adults: 2,
        coconFilter: "all",
        dayIndex: index,
        ratesByCocon: rates,
        capacityByCocon: capacity,
      }),
      false
    );
  });

  it("rejects minStay violation", () => {
    const strictRates = {
      "cocon-1": [
        { date: "2026-12-10", minStay: 3, maxStay: 7, indicativePricePerDay: 200, currencyCode: "EUR" },
      ],
      "cocon-2": [
        { date: "2026-12-10", minStay: 3, maxStay: 7, indicativePricePerDay: 200, currencyCode: "EUR" },
      ],
    };
    const index = buildDayIndex([
      day("2026-12-10", ["cocon-1", "cocon-2"]),
      day("2026-12-11", ["cocon-1", "cocon-2"]),
    ]);
    assert.equal(
      isStayRangeValid({
        arrival: "2026-12-10",
        departure: "2026-12-12",
        adults: 2,
        coconFilter: "all",
        dayIndex: index,
        ratesByCocon: strictRates,
        capacityByCocon: capacity,
      }),
      false
    );
  });

  it("rejects adults over cocon capacity", () => {
    const index = buildDayIndex([day("2026-12-10", ["cocon-1"]), day("2026-12-11", ["cocon-1"])]);
    assert.equal(
      isStayRangeValid({
        arrival: "2026-12-10",
        departure: "2026-12-12",
        adults: 3,
        coconFilter: "cocon-1",
        dayIndex: index,
        ratesByCocon: rates,
        capacityByCocon: capacity,
      }),
      false
    );
  });

  it("clears dates when cocon change invalidates stay", () => {
    const index = buildDayIndex([
      day("2026-12-10", ["cocon-2"]),
      day("2026-12-11", ["cocon-2"]),
    ]);
    assert.equal(
      shouldClearDatesOnCoconChange(
        "2026-12-10",
        "2026-12-12",
        2,
        "cocon-1",
        index,
        rates,
        capacity
      ),
      true
    );
  });
});

describe("resolveCheckoutFlow", () => {
  it("redirects when single checkout URL", () => {
    const r = resolveCheckoutFlow(
      {
        valid: true,
        availableCoconIds: ["cocon-1"],
        reason: null,
        constraints: {},
        checkoutUrls: { "cocon-1": "https://example.com/a" },
        checkoutBlocked: {},
      },
      "all"
    );
    assert.equal(r.type, "redirect");
  });

  it("requires choice for two checkout URLs", () => {
    const r = resolveCheckoutFlow(
      {
        valid: true,
        availableCoconIds: ["cocon-1", "cocon-2"],
        reason: null,
        constraints: {},
        checkoutUrls: {
          "cocon-1": "https://example.com/1",
          "cocon-2": "https://example.com/2",
        },
        checkoutBlocked: {},
      },
      "all"
    );
    assert.equal(r.type, "choose_cocon");
  });

  it("redirects directly for specific cocon selection", () => {
    const r = resolveCheckoutFlow(
      {
        valid: true,
        availableCoconIds: ["cocon-2"],
        reason: null,
        constraints: {},
        checkoutUrls: { "cocon-2": "https://example.com/2" },
        checkoutBlocked: {},
      },
      "cocon-2"
    );
    assert.equal(r.type, "redirect");
    if (r.type === "redirect") assert.ok(r.url.includes("2"));
  });
});
