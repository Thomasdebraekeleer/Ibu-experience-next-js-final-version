/**
 * Read-only quote discovery — GET /v2/quote/{propertyId} only.
 */
import fs from "fs";
import path from "path";

function loadApiKey() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return null;
  const line = fs.readFileSync(envPath, "utf8").split(/\r?\n/).find((l) => l.startsWith("LODGIFY_API_KEY="));
  if (!line) return null;
  const v = line.slice("LODGIFY_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
  return v.length ? v : null;
}

function addDays(ymd, n) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return [dt.getUTCFullYear(), String(dt.getUTCMonth() + 1).padStart(2, "0"), String(dt.getUTCDate()).padStart(2, "0")].join("-");
}

function brusselsToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function stripQuote(body) {
  if (!body || typeof body !== "object") return body;
  const o = { ...body };
  for (const k of Object.keys(o)) {
    if (/email|phone|guest|customer|address|booking/i.test(k)) delete o[k];
  }
  if (Array.isArray(o.room_types)) {
    o.room_types = o.room_types.map((rt) => {
      if (!rt || typeof rt !== "object") return rt;
      const copy = { ...rt };
      for (const k of Object.keys(copy)) {
        if (/email|phone|guest|customer|address|booking/i.test(k)) delete copy[k];
      }
      return copy;
    });
  }
  return o;
}

async function getQuote(apiKey, propertyId, roomTypeId, arrival, departure, adults = 2) {
  const url = new URL(`https://api.lodgify.com/v2/quote/${propertyId}`);
  url.searchParams.set("arrival", arrival);
  url.searchParams.set("departure", departure);
  url.searchParams.set("roomTypes[0].id", String(roomTypeId));
  url.searchParams.set("roomTypes[0].people", String(adults));

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json", "X-ApiKey": apiKey },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  return {
    ok: res.ok,
    status: res.status,
    path: url.pathname,
    sample: res.ok ? stripQuote(body) : undefined,
  };
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.log(JSON.stringify({ error: "LODGIFY_API_KEY missing" }));
    process.exit(1);
  }

  async function findBookableWindow() {
    const today = brusselsToday();
    for (let offset = 14; offset <= 365; offset += 1) {
      const arrival = addDays(today, offset);
      const departure = addDays(arrival, 3);
      const s1 = await getQuote(apiKey, 710587, 777690, arrival, departure, 2);
      const s2 = await getQuote(apiKey, 738662, 805778, arrival, departure, 2);
      if (s1.ok && s2.ok) return { arrival, departure };
    }
    return null;
  }

  const window = await findBookableWindow();
  if (!window) {
    console.log(JSON.stringify({ error: "no_bookable_quote_window" }));
    process.exit(1);
  }
  const { arrival, departure } = window;

  const cases = [
    { label: "cocon1", propertyId: 710587, roomTypeId: 777690 },
    { label: "cocon2", propertyId: 738662, roomTypeId: 805778 },
  ];

  const out = { arrival, departure, adults: 2, quotes: {}, errors: [] };
  for (const c of cases) {
    const r = await getQuote(apiKey, c.propertyId, c.roomTypeId, arrival, departure, 2);
    out.quotes[c.label] = {
      propertyId: c.propertyId,
      roomTypeId: c.roomTypeId,
      ok: r.ok,
      status: r.status,
      sample: r.sample,
    };
    if (!r.ok) out.errors.push({ label: c.label, status: r.status });
  }

  const file = path.join(process.cwd(), "scripts", "lodgify-quote-discovery-output.json");
  fs.writeFileSync(file, JSON.stringify(out, null, 2));
  console.log("OK scripts/lodgify-quote-discovery-output.json");
}

main().catch(() => process.exit(1));
