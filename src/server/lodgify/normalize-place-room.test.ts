import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizePlaceRoomForCatalog } from "./normalize-place-room";

const room777690 = {
  id: 777690,
  min_price: 250,
  max_people: 2,
  bedrooms: 1,
  bathrooms: 1,
  has_parking: true,
  image_url: "//l.icdbcdn.com/oh/a.jpg?f=32",
  images: [{ url: "//l.icdbcdn.com/oh/a.jpg?f=32" }, { url: "//l.icdbcdn.com/oh/b.jpg?f=32" }],
  amenities: {
    cooking: [{ name: "CookingEatingKitchenette", text: "Kitchenette" }],
    sleeping: [{ name: "SleepingQueenBed", text: "1 Queen bed" }],
    room: [{ name: "RoomsBathroom", text: "1 Bathroom" }],
  },
};

describe("normalizePlaceRoomForCatalog", () => {
  it("normalizes object room response", () => {
    const out = normalizePlaceRoomForCatalog(room777690, 777690, "cocon-1", 2);
    assert.ok(out);
    assert.equal(out!.minPrice?.amount, 250);
    assert.equal(out!.minPrice?.currencyCode, "EUR");
    assert.ok(out!.amenityKeys.includes("kitchenette"));
    assert.equal(out!.bedType, "queen");
    assert.equal(out!.gallery.length, 2);
    assert.ok(out!.coverImageUrl?.startsWith("https://l.icdbcdn.com/"));
  });

  it("selects room from array by roomTypeId", () => {
    const out = normalizePlaceRoomForCatalog([room777690, { id: 999 }], 777690, "cocon-1", 2);
    assert.ok(out);
    assert.equal(out!.id, "cocon-1");
  });

  it("returns null for unknown roomTypeId", () => {
    const out = normalizePlaceRoomForCatalog(room777690, 999, "cocon-1", 2);
    assert.equal(out, null);
  });

  it("rejects invalid image host", () => {
    const bad = {
      ...room777690,
      images: [{ url: "https://evil.com/x.jpg" }],
      image_url: null,
    };
    const out = normalizePlaceRoomForCatalog(bad, 777690, "cocon-1", 2);
    assert.ok(out);
    assert.equal(out!.gallery.length, 0);
    assert.equal(out!.coverImageUrl, null);
  });

  it("omits min price when absent", () => {
    const noPrice = { ...room777690, min_price: 0 };
    const out = normalizePlaceRoomForCatalog(noPrice, 777690, "cocon-1", 2);
    assert.ok(out);
    assert.equal(out!.minPrice, null);
  });
});
