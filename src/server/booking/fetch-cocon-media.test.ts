import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseCoconMediaQuery } from "./parse-cocon-media-query";

describe("parseCoconMediaQuery", () => {
  it("rejects unknown placeId", () => {
    const r = parseCoconMediaQuery({ placeId: "nope", coconIds: "cocon-1" });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "invalid_place");
  });

  it("rejects unknown coconId", () => {
    const r = parseCoconMediaQuery({
      placeId: "domaine-mehaignoul",
      coconIds: "cocon-99",
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, "invalid_cocon");
  });

  it("accepts two valid cocons", () => {
    const r = parseCoconMediaQuery({
      placeId: "domaine-mehaignoul",
      coconIds: "cocon-1,cocon-2",
    });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(r.cocons.length, 2);
      assert.equal(r.cocons[0]!.id, "cocon-1");
      assert.equal(r.cocons[1]!.id, "cocon-2");
    }
  });

  it("deduplicates cocon ids", () => {
    const r = parseCoconMediaQuery({
      placeId: "domaine-mehaignoul",
      coconIds: "cocon-1,cocon-1",
    });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.cocons.length, 1);
  });
});

describe("cocon media response shape", () => {
  it("does not expose lodgify ids in parsed cocons public contract", () => {
    const r = parseCoconMediaQuery({
      placeId: "domaine-mehaignoul",
      coconIds: "cocon-1",
    });
    assert.equal(r.ok, true);
    if (r.ok) {
      assert.equal(typeof r.cocons[0]!.lodgify.propertyId, "number");
    }
  });
});
