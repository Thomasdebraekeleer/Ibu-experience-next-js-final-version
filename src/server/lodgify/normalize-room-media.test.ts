import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_COCON_GALLERY_IMAGES,
  normalizeLodgifyImageUrl,
  normalizeRoomMediaForRoomType,
} from "./normalize-room-media";

describe("normalizeLodgifyImageUrl", () => {
  it("converts protocol-relative URL to HTTPS", () => {
    assert.equal(
      normalizeLodgifyImageUrl("//l.icdbcdn.com/a/b.jpg"),
      "https://l.icdbcdn.com/a/b.jpg"
    );
  });

  it("keeps valid HTTPS CDN URL", () => {
    const u = "https://l.icdbcdn.com/photo.webp";
    assert.equal(normalizeLodgifyImageUrl(u), u);
  });

  it("rejects other hostnames", () => {
    assert.equal(normalizeLodgifyImageUrl("https://evil.com/x.jpg"), null);
  });

  it("rejects HTTP", () => {
    assert.equal(normalizeLodgifyImageUrl("http://l.icdbcdn.com/x.jpg"), null);
  });

  it("rejects empty", () => {
    assert.equal(normalizeLodgifyImageUrl(""), null);
    assert.equal(normalizeLodgifyImageUrl(null), null);
  });
});

describe("normalizeRoomMediaForRoomType", () => {
  const room777690 = {
    id: 777690,
    name: "Cocon 1",
    images: [
      { url: "//l.icdbcdn.com/a.jpg" },
      { url: "https://l.icdbcdn.com/b.jpg" },
      { url: "//l.icdbcdn.com/a.jpg" },
      { url: "https://other.cdn/c.jpg" },
    ],
  };

  it("handles single room object", () => {
    const out = normalizeRoomMediaForRoomType(room777690, 777690);
    assert.equal(out.length, 2);
    assert.equal(out[0]!.url, "https://l.icdbcdn.com/a.jpg");
    assert.equal(out[1]!.url, "https://l.icdbcdn.com/b.jpg");
  });

  it("handles array of rooms and selects roomTypeId", () => {
    const payload = [
      { id: 1, images: [{ url: "//l.icdbcdn.com/wrong.jpg" }] },
      room777690,
    ];
    const out = normalizeRoomMediaForRoomType(payload, 777690);
    assert.equal(out.length, 2);
  });

  it("handles wrapper with rooms key", () => {
    const out = normalizeRoomMediaForRoomType({ rooms: [room777690] }, 777690);
    assert.equal(out.length, 2);
  });

  it("returns empty for unknown roomTypeId", () => {
    const out = normalizeRoomMediaForRoomType([room777690], 999);
    assert.deepEqual(out, []);
  });

  it("returns empty when no images", () => {
    const out = normalizeRoomMediaForRoomType({ id: 777690, images: [] }, 777690);
    assert.deepEqual(out, []);
  });

  it("limits to six images preserving order", () => {
    const images = Array.from({ length: 10 }, (_, i) => ({
      url: `//l.icdbcdn.com/${i}.jpg`,
    }));
    const out = normalizeRoomMediaForRoomType({ id: 1, images }, 1);
    assert.equal(out.length, MAX_COCON_GALLERY_IMAGES);
    assert.equal(out[0]!.url, "https://l.icdbcdn.com/0.jpg");
    assert.equal(out[5]!.url, "https://l.icdbcdn.com/5.jpg");
  });

  it("returns empty for invalid payload", () => {
    assert.deepEqual(normalizeRoomMediaForRoomType(null, 1), []);
    assert.deepEqual(normalizeRoomMediaForRoomType("nope", 1), []);
  });
});
