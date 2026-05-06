import { headers, cookies } from "next/headers";
import { blockStyle } from "./shared";

const HEADING = "// geo-ip lookup · ipinfo.io";

const FALLBACK = {
  ip:        "73.214.108.42",
  geo:       "herndon, va",
  region:    "us-east",
  asn:       "AS7922 · dial up",
  lastLogin: "12 hours ago",
  lastLoginNote: "same address" as string | undefined,
  threat:    "0.02 — you look familiar",
};

function relativeTime(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60_000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return `${Math.floor(days / 30)} months ago`;
}

async function fetchData() {
  const reqHeaders = await headers();

  const ip = (
    reqHeaders.get("x-real-ip") ??
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
  const city    = reqHeaders.get("x-vercel-ip-city")           ?? "";
  const region  = reqHeaders.get("x-vercel-ip-country-region") ?? "";
  const country = reqHeaders.get("x-vercel-ip-country")        ?? "";

  if (!city && !region && !country) return FALLBACK;

  const geoCity = city ? decodeURIComponent(city).toLowerCase() : "unknown";
  const geoReg  = region.toLowerCase();
  const geo     = geoCity && geoReg ? `${geoCity}, ${geoReg}` : geoCity || geoReg || country.toLowerCase();

  let asn = "–";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`https://ipinfo.io/${ip}/json`, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const json = (await res.json()) as { org?: string };
      if (json.org) asn = json.org.toLowerCase();
    }
  } catch (err) {
    console.error("ipinfo.io fetch failed:", err);
  }

  let lastLogin = "never";
  let lastLoginNote: string | undefined;
  const cookie = (await cookies()).get("adminLastLogin")?.value;
  if (cookie) {
    const [tsStr, prevIp] = cookie.split("|");
    const ts = parseInt(tsStr, 10);
    if (!isNaN(ts)) {
      lastLogin = relativeTime(ts);
      if (prevIp) lastLoginNote = prevIp === ip ? "same address" : "different address";
    }
  }

  const ipOctet = parseInt(ip.split(".").at(-1) ?? "0", 10);
  const threat  = `${((ipOctet % 7) * 0.003 + 0.01).toFixed(2)} — you look familiar`;

  return { ip, geo, region: `${country.toLowerCase()}-${geoReg}`, asn, lastLogin, lastLoginNote, threat };
}

export default async function CenterGeo() {
  const data = await fetchData();

  const rows = [
    { key: "ip",         val: data.ip,        accent: false, dim: ""                                                      },
    { key: "geo",        val: data.geo,        accent: true,  dim: `· ${data.region}`                                     },
    { key: "asn",        val: data.asn,        accent: false, dim: ""                                                      },
    { key: "last login", val: data.lastLogin,  accent: false, dim: data.lastLoginNote ? `· ${data.lastLoginNote}` : ""    },
    { key: "threat",     val: data.threat,     accent: false, dim: ""                                                      },
  ];

  return (
    <div style={{ ...blockStyle, lineHeight: 1.65 }}>
      <div
        style={{
          color: "#5a7088",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          marginBottom: 6,
        }}
      >
        {HEADING}
      </div>
      {rows.map(({ key, val, accent, dim }) => (
        <div key={key} style={{ display: "flex", gap: 10 }}>
          <span
            style={{
              color: "#5a7088",
              width: 78,
              flexShrink: 0,
              textTransform: "uppercase",
              fontSize: 9,
              letterSpacing: "0.14em",
              paddingTop: 2,
            }}
          >
            {key}
          </span>
          <span style={{ color: accent ? "#6a9fc5" : "#c9d6e2", flex: 1 }}>
            {val}
            {dim ? <span style={{ color: "#5a7088" }}> {dim}</span> : null}
          </span>
        </div>
      ))}
    </div>
  );
}
