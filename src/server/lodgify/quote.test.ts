import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { interpretQuoteResponse, type QuoteExpected } from "./quote";

const expected: QuoteExpected = {
  propertyId: 710587,
  roomTypeId: 777690,
  arrival: "2027-01-02",
  departure: "2027-01-05",
  adults: 2,
};

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    property_id: 710587,
    date_arrival: "2027-01-02",
    date_departure: "2027-01-05",
    currency_code: "EUR",
    total_including_vat: 795,
    amount_gross: 795,
    room_types: [
      {
        room_type_id: 777690,
        people: 2,
        subtotal: 750,
      },
    ],
    ...overrides,
  };
}

describe("interpretQuoteResponse", () => {
  it("confirms a valid Lodgify 200 payload", () => {
    const r = interpretQuoteResponse(validPayload(), expected);
    assert.equal(r.confirmed, true);
    assert.equal(r.currencyCode, "EUR");
    assert.equal(r.totalIncludingVat, 795);
  });

  it("accepts array-wrapped quote payload", () => {
    const r = interpretQuoteResponse([validPayload()], expected);
    assert.equal(r.confirmed, true);
  });

  it("rejects empty room_types", () => {
    const r = interpretQuoteResponse(validPayload({ room_types: [] }), expected);
    assert.equal(r.confirmed, false);
    assert.equal(r.errorCode, "empty_room_types");
  });

  it("rejects wrong property_id", () => {
    const r = interpretQuoteResponse(validPayload({ property_id: 1 }), expected);
    assert.equal(r.errorCode, "property_mismatch");
  });

  it("rejects wrong room_type_id", () => {
    const r = interpretQuoteResponse(
      validPayload({
        room_types: [{ room_type_id: 1, people: 2, subtotal: 100 }],
      }),
      expected
    );
    assert.equal(r.errorCode, "room_type_mismatch");
  });

  it("rejects wrong dates", () => {
    const r = interpretQuoteResponse(
      validPayload({ date_departure: "2027-01-06" }),
      expected
    );
    assert.equal(r.errorCode, "dates_mismatch");
  });

  it("rejects wrong people count", () => {
    const r = interpretQuoteResponse(
      validPayload({
        room_types: [{ room_type_id: 777690, people: 1, subtotal: 100 }],
      }),
      expected
    );
    assert.equal(r.errorCode, "people_mismatch");
  });

  it("rejects zero total", () => {
    const r = interpretQuoteResponse(validPayload({ total_including_vat: 0 }), expected);
    assert.equal(r.errorCode, "invalid_total");
  });

  it("rejects empty payload", () => {
    const r = interpretQuoteResponse(null, expected);
    assert.equal(r.errorCode, "empty_quote");
  });

  it("confirms one cocon and rejects another via separate calls", () => {
    const ok = interpretQuoteResponse(validPayload(), expected);
    const bad = interpretQuoteResponse(validPayload({ property_id: 738662 }), {
      ...expected,
      propertyId: 738662,
      roomTypeId: 805778,
    });
    assert.equal(ok.confirmed, true);
    assert.equal(bad.confirmed, false);
  });
});
