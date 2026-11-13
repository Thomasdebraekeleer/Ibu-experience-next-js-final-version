/**
 * Discovery Lodgify — GET v2 only. No reservations endpoints.
 * Output: scripts/lodgify-discovery-output.json (gitignored, sanitized).
 */
import fs from "fs";
import path from "path";

const MIN_MATCH_SCORE = 6;
const MIN_SCORE_GAP = 2;

/** Mapping validé manuellement (decouverte IBÙ — Mehaignoul). */
const HUMAN_CONFIRMED_MAPPING = {
  cocon1: { propertyId: 710587, roomTypeId: 777690 },
  cocon2: { propertyId: 738662, roomTypeId: 805778 },
  structure: "two_properties_one_room_type_each",
};

function loadApiKey() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, "utf8");
  const line = content.split(/\r?\n/).find((l) => l.startsWith("LODGIFY_API_KEY="));
  if (!line) return null;
  const value = line.slice("LODGIFY_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
  return value.length > 0 ? value : null;
}

function brusselsToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Brussels",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDaysYmd(ymd, days) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return [
    dt.getUTCFullYear(),
    String(dt.getUTCMonth() + 1).padStart(2, "0"),
    String(dt.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

async function lodgifyGet(apiKey, pathname, query = {}) {
  const url = new URL(`https://api.lodgify.com${pathname}`);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json", "X-ApiKey": apiKey },
      signal: controller.signal,
    });
    let body = null;
    if (res.ok) {
      const text = await res.text();
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = null;
      }
    } else {
      await res.text();
    }
    return {
      ok: res.ok,
      status: res.status,
      path: url.pathname,
      search: url.search,
      body,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function errorEntry(step, result, extra = {}) {
  return {
    step,
    status: result.status,
    path: result.path,
    ...extra,
  };
}

function matchCocon1(text) {
  const n = String(text || "").toLowerCase();
  let score = 0;
  if (n.includes("mehaignoul")) score += 2;
  if (n.includes("cocon")) score += 2;
  if (n.includes("ibu")) score += 1;
  if (/cocon\s*[-_]?\s*1\b|cocon1\b|pod\s*1\b|#\s*1\b|\bcocon ibù 1\b/.test(n)) score += 6;
  if (/cocon\s*[-_]?\s*2\b|cocon2\b|pod\s*2\b/.test(n)) score -= 4;
  return Math.max(0, score);
}

function matchCocon2(text) {
  const n = String(text || "").toLowerCase();
  let score = 0;
  if (n.includes("mehaignoul")) score += 2;
  if (n.includes("cocon")) score += 2;
  if (n.includes("ibu")) score += 1;
  if (/cocon\s*[-_]?\s*2\b|cocon2\b|pod\s*2\b|#\s*2\b|\bcocon ibù 2\b/.test(n)) score += 6;
  if (/cocon\s*[-_]?\s*1\b|cocon1\b|pod\s*1\b/.test(n)) score -= 4;
  return Math.max(0, score);
}

function pickPropertyFields(raw) {
  return {
    propertyId: raw.id ?? raw.Id ?? null,
    name: raw.name ?? raw.Name ?? raw.title ?? raw.Title ?? null,
    status: raw.status ?? raw.Status ?? raw.is_active ?? raw.isActive ?? null,
    slug: raw.slug ?? raw.Slug ?? null,
    url:
      raw.url ??
      raw.Url ??
      raw.website_url ??
      raw.websiteUrl ??
      raw.booking_url ??
      raw.bookingUrl ??
      null,
  };
}

function pickRoomFields(raw) {
  const capacity =
    raw.capacity ??
    raw.Capacity ??
    raw.max_guests ??
    raw.maxGuests ??
    raw.number_of_guests ??
    null;
  return {
    roomTypeId: raw.id ?? raw.Id ?? raw.room_type_id ?? raw.roomTypeId ?? null,
    roomTypeName: raw.name ?? raw.Name ?? raw.title ?? raw.Title ?? null,
    capacity: capacity ?? null,
  };
}

function redactString(value) {
  if (typeof value !== "string") return value;
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value)) return value;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "[redacted-email]";
  if (/^\+?\d[\d\s().-]{7,}$/.test(value)) return "[redacted-phone]";
  if (/\d+\s+\w+\s+(street|st|avenue|ave|rue|chaussée|route)/i.test(value)) {
    return "[redacted-address]";
  }
  return value;
}

/** Sanitize availability/rates samples for output (no booking ids, guests, addresses). */
function sanitizeAvailabilitySample(body) {
  if (body === null || body === undefined) return null;
  const stripKeys = (obj) => {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.slice(0, 2).map(stripKeys);
    if (typeof obj !== "object") return redactString(obj);
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const lk = k.toLowerCase();
      if (
        lk === "user_id" ||
        lk === "bookings" ||
        lk === "channel_calendars" ||
        lk.includes("booking") ||
        lk.includes("guest") ||
        lk.includes("customer") ||
        lk.includes("email") ||
        lk.includes("phone") ||
        lk.includes("address") ||
        lk.includes("firstname") ||
        lk.includes("lastname")
      ) {
        continue;
      }
      out[k] = stripKeys(v);
    }
    return out;
  };
  return stripKeys(body);
}

function sameLodgifyId(a, b) {
  return a != null && b != null && String(a) === String(b);
}

function lookupConfirmedEntry(properties, { propertyId, roomTypeId }) {
  const prop = properties.find((p) => sameLodgifyId(p.propertyId, propertyId));
  if (!prop) return null;
  const room = prop.roomTypes.find((r) => sameLodgifyId(r.roomTypeId, roomTypeId));
  if (!room) return null;
  return {
    propertyId,
    roomTypeId,
    propertyName: prop.name,
    roomTypeName: room.roomTypeName,
  };
}

function applyHumanConfirmedMapping(report) {
  const c1 = lookupConfirmedEntry(report.properties, HUMAN_CONFIRMED_MAPPING.cocon1);
  const c2 = lookupConfirmedEntry(report.properties, HUMAN_CONFIRMED_MAPPING.cocon2);
  if (!c1 || !c2) {
    report.mapping.humanConfirmedValidation = "ids_not_found_in_properties_list";
    return;
  }
  report.mapping.cocon1 = { ...c1, matchScore: null };
  report.mapping.cocon2 = { ...c2, matchScore: null };
  report.mapping.structure = HUMAN_CONFIRMED_MAPPING.structure;
  report.mapping.needsHumanConfirmation = false;
  report.mapping.cocon1Resolution = "human_confirmed";
  report.mapping.cocon2Resolution = "human_confirmed";
}

function sanitizeErrorMessage(message) {
  if (typeof message !== "string") return "unknown_error";
  return message
    .replace(/X-ApiKey[^\s]*/gi, "[redacted]")
    .replace(/[A-Za-z0-9_=-]{24,}/g, "[redacted-token]")
    .slice(0, 240);
}

function resolveAutoMapping(candidates, scoreKey) {
  const ranked = [...candidates]
    .filter((c) => c[scoreKey] >= MIN_MATCH_SCORE)
    .sort((a, b) => b[scoreKey] - a[scoreKey]);

  if (ranked.length === 0) {
    return { mapping: null, reason: "no_candidate_above_threshold" };
  }

  const top = ranked[0];
  const second = ranked[1];
  if (second && top[scoreKey] - second[scoreKey] < MIN_SCORE_GAP) {
    return {
      mapping: null,
      reason: "ambiguous_top_candidates",
      topCandidates: ranked.slice(0, 3).map((c) => ({
        propertyId: c.propertyId,
        roomTypeId: c.roomTypeId,
        [scoreKey]: c[scoreKey],
      })),
    };
  }

  return {
    mapping: {
      propertyId: top.propertyId,
      roomTypeId: top.roomTypeId,
      propertyName: top.propertyName,
      roomTypeName: top.roomTypeName,
      matchScore: top[scoreKey],
    },
    reason: "auto_mapped",
  };
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.log(JSON.stringify({ error: "LODGIFY_API_KEY absent or empty in .env.local" }));
    process.exit(1);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    timezone: "Europe/Brussels",
    properties: [],
    candidates: [],
    mapping: {
      cocon1: null,
      cocon2: null,
      structure: null,
      needsHumanConfirmation: true,
      cocon1Resolution: null,
      cocon2Resolution: null,
    },
    availabilitySamples: {},
    ratesSamples: {},
    errors: [],
  };

  const list = await lodgifyGet(apiKey, "/v2/properties", {
    page: 1,
    size: 50,
    includeCount: true,
  });

  if (!list.ok) {
    report.errors.push(errorEntry("properties", list));
  } else {
    const items =
      list.body?.items ??
      list.body?.Items ??
      (Array.isArray(list.body) ? list.body : list.body?.data) ??
      [];

    for (const raw of items) {
      const property = pickPropertyFields(raw);
      if (!property.propertyId) continue;

      const roomsRes = await lodgifyGet(apiKey, `/v2/properties/${property.propertyId}/rooms`);
      if (!roomsRes.ok) {
        report.errors.push(errorEntry("rooms", roomsRes, { propertyId: property.propertyId }));
        report.properties.push({ ...property, roomTypes: [] });
        continue;
      }

      const roomList = Array.isArray(roomsRes.body)
        ? roomsRes.body
        : roomsRes.body?.items ?? roomsRes.body?.Items ?? roomsRes.body?.rooms ?? [];

      const roomTypes = roomList.map(pickRoomFields).filter((r) => r.roomTypeId != null);
      report.properties.push({ ...property, roomTypes });

      if (roomTypes.length === 0) {
        const label = property.name ?? "";
        report.candidates.push({
          propertyId: property.propertyId,
          propertyName: property.name,
          propertyStatus: property.status,
          slug: property.slug,
          url: property.url,
          roomTypeId: null,
          roomTypeName: null,
          capacity: null,
          matchCocon1: matchCocon1(label),
          matchCocon2: matchCocon2(label),
        });
      } else {
        for (const room of roomTypes) {
          const label = `${property.name ?? ""} ${room.roomTypeName ?? ""}`;
          report.candidates.push({
            propertyId: property.propertyId,
            propertyName: property.name,
            propertyStatus: property.status,
            slug: property.slug,
            url: property.url,
            roomTypeId: room.roomTypeId,
            roomTypeName: room.roomTypeName,
            capacity: room.capacity,
            matchCocon1: matchCocon1(label),
            matchCocon2: matchCocon2(label),
          });
        }
      }
    }
  }

  const cocon1Result = resolveAutoMapping(report.candidates, "matchCocon1");
  const cocon2Result = resolveAutoMapping(report.candidates, "matchCocon2");

  report.mapping.cocon1Resolution = cocon1Result.reason;
  report.mapping.cocon2Resolution = cocon2Result.reason;
  if (cocon1Result.topCandidates) {
    report.mapping.cocon1Ambiguity = cocon1Result.topCandidates;
  }
  if (cocon2Result.topCandidates) {
    report.mapping.cocon2Ambiguity = cocon2Result.topCandidates;
  }

  if (cocon1Result.mapping) report.mapping.cocon1 = cocon1Result.mapping;
  if (cocon2Result.mapping) report.mapping.cocon2 = cocon2Result.mapping;

  const bothMapped = report.mapping.cocon1 && report.mapping.cocon2;
  report.mapping.needsHumanConfirmation = !bothMapped;

  if (bothMapped) {
    const sameProperty =
      report.mapping.cocon1.propertyId === report.mapping.cocon2.propertyId;
    const sameRoom =
      report.mapping.cocon1.roomTypeId === report.mapping.cocon2.roomTypeId;
    if (sameProperty && !sameRoom) {
      report.mapping.structure = "one_property_two_room_types";
    } else if (!sameProperty) {
      report.mapping.structure = "two_properties_one_room_type_each";
    } else {
      report.mapping.structure = "ambiguous_same_property_and_room";
      report.mapping.needsHumanConfirmation = true;
    }
  }

  report.mapping.autoMapping = {
    cocon1: cocon1Result.mapping,
    cocon2: cocon2Result.mapping,
    cocon1Resolution: cocon1Result.reason,
    cocon2Resolution: cocon2Result.reason,
  };
  applyHumanConfirmedMapping(report);

  const startDate = brusselsToday();
  const endDate = addDaysYmd(startDate, 45);

  async function sampleAvailability(key, propertyId, roomTypeId) {
    if (!propertyId || !roomTypeId) {
      report.availabilitySamples[key] = {
        skipped: "availability_skipped_missing_property_or_room_type_id",
      };
      return;
    }
    const res = await lodgifyGet(apiKey, `/v2/availability/${propertyId}/${roomTypeId}`, {
      start: startDate,
      end: endDate,
      includeDetails: false,
    });
    if (!res.ok) {
      report.availabilitySamples[key] = {
        ok: false,
        status: res.status,
        path: res.path,
      };
      report.errors.push(errorEntry("availability", res, { label: key }));
      return;
    }
    report.availabilitySamples[key] = {
      ok: true,
      status: res.status,
      path: res.path,
      query: { start: startDate, end: endDate, includeDetails: false },
      sample: sanitizeAvailabilitySample(
        Array.isArray(res.body) ? res.body.slice(0, 2) : res.body
      ),
    };
  }

  async function sampleRates(key, houseId, roomTypeId) {
    if (!houseId || !roomTypeId) {
      report.ratesSamples[key] = { skipped: "rates_skipped_missing_room_type_id" };
      return;
    }
    const res = await lodgifyGet(apiKey, "/v2/rates/calendar", {
      houseId,
      roomTypeId,
      startDate,
      endDate,
    });
    if (!res.ok) {
      report.ratesSamples[key] = {
        ok: false,
        status: res.status,
        path: res.path,
      };
      report.errors.push(errorEntry("rates_calendar", res, { label: key }));
      return;
    }
    report.ratesSamples[key] = {
      ok: true,
      status: res.status,
      path: res.path,
      query: { houseId, roomTypeId, startDate, endDate },
      sample: sanitizeAvailabilitySample(
        Array.isArray(res.body) ? res.body.slice(0, 2) : res.body
      ),
    };
  }

  for (const key of ["cocon1", "cocon2"]) {
    const m = report.mapping[key];
    if (m) {
      await sampleAvailability(key, m.propertyId, m.roomTypeId);
      await sampleRates(key, m.propertyId, m.roomTypeId);
    }
  }

  const outPath = path.join(process.cwd(), "scripts", "lodgify-discovery-output.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  console.log("OK written scripts/lodgify-discovery-output.json");
}

main().catch((err) => {
  console.error(
    JSON.stringify({
      exception: err instanceof Error ? err.name : "Error",
      message: sanitizeErrorMessage(err instanceof Error ? err.message : String(err)),
    })
  );
  process.exit(1);
});
