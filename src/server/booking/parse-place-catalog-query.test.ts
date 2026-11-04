import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parsePlaceCatalogQuery } from "./parse-place-catalog-query";

describe("parsePlaceCatalogQuery", () => {
  it("rejects unknown place", () => {
    const r = parsePlaceCatalogQuery("unknown");
    assert.equal(r.ok, false);
  });

  it("accepts domaine-mehaignoul", () => {
    const r = parsePlaceCatalogQuery("domaine-mehaignoul");
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.place.id, "domaine-mehaignoul");
  });
});
