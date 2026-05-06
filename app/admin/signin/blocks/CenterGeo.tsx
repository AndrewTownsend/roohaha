import { blockStyle } from "./shared";

export interface GeoData {
  ip: string;
  geo: string;
  region: string;
  asn: string;
  lastLogin: string;
  threat: string;
}


const FALLBACK: GeoData = {
  ip:        "73.214.108.42",
  geo:       "herndon, va",
  region:    "us-east",
  asn:       "AS7922 · comcast cable",
  lastLogin: "12 hours ago",
  threat:    "0.02 — you look familiar",
};

const heading = "// geo-ip lookup · ipinfo.io";

export default function CenterGeo({ data = FALLBACK }: { data?: GeoData }) {
  const rows = [
    { key: "ip",         val: data.ip,        accent: false, dim: ""              },
    { key: "geo",        val: data.geo,        accent: true,  dim: `· ${data.region}` },
    { key: "asn",        val: data.asn,        accent: false, dim: ""              },
    { key: "last login", val: data.lastLogin,  accent: false, dim: "· same address" },
    { key: "threat",     val: data.threat,     accent: false, dim: ""              },
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
        {heading}
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
