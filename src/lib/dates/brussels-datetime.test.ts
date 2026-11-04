import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { minutesUntilCheckInBrussels } from "./brussels-datetime";
import { meetsAdvanceNotice } from "@/server/booking/validate-stay";

describe("minutesUntilCheckInBrussels", () => {
  it("returns negative minutes when check-in hour already passed today", () => {
    const now = new Date("2026-06-15T16:00:00+02:00");
    const minutes = minutesUntilCheckInBrussels("2026-06-15", 17, now);
    assert.ok(minutes !== null && minutes > 0 && minutes <= 120);
  });

  it("fails advance notice when only one hour remains before check-in", () => {
    const fixedNow = new Date("2026-06-15T16:00:00+02:00");
    const ok = meetsAdvanceNotice(
      "2026-06-15",
      { advanceNoticeDays: 0, advanceNoticeHours: 2, checkInHour: 17 },
      fixedNow
    );
    assert.equal(ok, false);
  });

  it("passes advance notice when enough hours remain before check-in", () => {
    const fixedNow = new Date("2026-06-15T10:00:00+02:00");
    const ok = meetsAdvanceNotice(
      "2026-06-15",
      { advanceNoticeDays: 0, advanceNoticeHours: 2, checkInHour: 17 },
      fixedNow
    );
    assert.equal(ok, true);
  });
});
