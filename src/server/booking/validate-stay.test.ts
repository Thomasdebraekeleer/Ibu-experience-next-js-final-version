import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { BookingCocon } from "@/config/booking/types";
import type { NormalizedDayRate } from "@/config/booking/types";
import { evaluateCoconStay, validateStay } from "./validate-stay";
import type { CoconRateMeta } from "./fetch-place-calendar";
import { todayYmdBrussels } from "@/lib/dates/brussels";
import { addDaysYmd } from "@/lib/dates/ymd";

const cocon1: BookingCocon = {
  id: "cocon-1",
  status: "active",
  capacityAdults: 2,
  lodgify: { propertyId: 710587, roomTypeId: 777690 },
  checkoutUrlKey: "mehaignoulCocon1",
};

const cocon2: BookingCocon = {
  id: "cocon-2",
  status: "active",
  capacityAdults: 2,
  lodgify: { propertyId: 738662, roomTypeId: 805778 },
  checkoutUrlKey: "mehaignoulCocon2",
};

function baseInput(cocons: BookingCocon[]) {
  const bookableByCocon = new Map<string, Map<string, boolean>>();
  const ratesByCocon = new Map<string, Map<string, NormalizedDayRate>>();
  const rateMetaByCocon = new Map<string, CoconRateMeta>();

  for (const c of cocons) {
    bookableByCocon.set(
      c.id,
      new Map([
        ["2026-12-10", true],
        ["2026-12-11", true],
      ])
    );
    ratesByCocon.set(
      c.id,
      new Map([
        [
          "2026-12-10",
          {
            date: "2026-12-10",
            minStay: 1,
            maxStay: 7,
            indicativePricePerDay: 200,
            currencyCode: "EUR",
          },
        ],
      ])
    );
    rateMetaByCocon.set(c.id, {
      advanceNoticeDays: 0,
      advanceNoticeHours: 0,
      checkInHour: 17,
      pricesByDate: new Map([
        [
          "2026-12-10",
          [{ min_stay: 1, max_stay: 7, price_per_day: 200 }],
        ],
      ]),
    });
  }

  return {
    arrival: "2026-12-10",
    departure: "2026-12-12",
    adults: 2,
    cocons,
    bookableByCocon,
    ratesByCocon,
    rateMetaByCocon,
  };
}

describe("validateStay", () => {
  it("accepts available cocon with pricing", () => {
    const result = validateStay(baseInput([cocon1]));
    assert.equal(result.valid, true);
    assert.deepEqual(result.availableCoconIds, ["cocon-1"]);
  });

  it("rejects unavailable nights", () => {
    const input = baseInput([cocon1]);
    input.bookableByCocon.get("cocon-1")!.set("2026-12-11", false);
    const result = validateStay(input);
    assert.equal(result.valid, false);
    assert.equal(result.reason, "dates_unavailable");
  });

  it("rejects min stay when tier missing", () => {
    const input = baseInput([cocon1]);
    input.rateMetaByCocon.get("cocon-1")!.pricesByDate.set("2026-12-10", [
      { min_stay: 7, max_stay: 14, price_per_day: 200 },
    ]);
    const result = validateStay(input);
    assert.equal(result.valid, false);
    assert.equal(result.reason, "min_stay_not_met");
  });

  it("rejects missing tariff on arrival (fail closed)", () => {
    const input = baseInput([cocon1]);
    input.ratesByCocon.set("cocon-1", new Map());
    input.rateMetaByCocon.get("cocon-1")!.pricesByDate.clear();
    const result = validateStay(input);
    assert.equal(result.valid, false);
  });

  it("with coconId=all, adults above every cocon capacity yields no eligible cocons", () => {
    const input = baseInput([cocon1, cocon2]);
    input.adults = 3;
    const r1 = evaluateCoconStay(cocon1, input);
    const r2 = evaluateCoconStay(cocon2, input);
    assert.equal(r1.eligible, false);
    assert.equal(r1.failReason, "adults_exceed_capacity");
    assert.equal(r2.eligible, false);
    assert.equal(r2.failReason, "adults_exceed_capacity");
    const result = validateStay(input);
    assert.equal(result.valid, false);
  });

  it("advance notice blocks when hours before check-in are insufficient", () => {
    const today = todayYmdBrussels();
    const input = baseInput([cocon1]);
    input.arrival = today;
    input.departure = addDaysYmd(today, 2);
    input.bookableByCocon.set(
      "cocon-1",
      new Map([
        [today, true],
        [addDaysYmd(today, 1), true],
      ])
    );
    input.ratesByCocon.set(
      "cocon-1",
      new Map([
        [
          today,
          {
            date: today,
            minStay: 1,
            maxStay: 7,
            indicativePricePerDay: 200,
            currencyCode: "EUR",
          },
        ],
      ])
    );
    input.rateMetaByCocon.get("cocon-1")!.advanceNoticeHours = 9999;
    input.rateMetaByCocon.get("cocon-1")!.checkInHour = 23;
    input.rateMetaByCocon.get("cocon-1")!.pricesByDate.set(today, [
      { min_stay: 1, max_stay: 7, price_per_day: 200 },
    ]);
    const result = validateStay(input);
    assert.equal(result.valid, false);
    assert.equal(result.reason, "advance_notice_not_met");
  });
});
