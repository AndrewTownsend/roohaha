import { blockStyle } from "./shared";

const ROWS = [
  { bracket: "[+]", msg: "firewall",            dim: "· 6 rules loaded", status: "OK",   ok: true  },
  { bracket: "[+]", msg: "crypto",              dim: "· tls 1.3",        status: "OK",   ok: true  },
  { bracket: "[+]", msg: "intrusion detection", dim: "",                 status: "OK",   ok: true  },
  { bracket: "[~]", msg: "identity",            dim: "· awaiting human", status: "WAIT", ok: false },
] as const;

export default function CenterBoot() {
  return (
    <div style={blockStyle}>
      {ROWS.map(({ bracket, msg, dim, status, ok }) => (
        <div key={msg} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ color: "#3d5068", flexShrink: 0 }}>{bracket}</span>
          <span style={{ color: "#c9d6e2", flex: 1 }}>
            {msg}
            {dim ? <span style={{ color: "#5a7088" }}> {dim}</span> : null}
          </span>
          <span
            style={{
              flexShrink: 0,
              fontSize: 10,
              letterSpacing: "0.14em",
              color: ok ? "#6abf8a" : "#d4a85a",
            }}
          >
            {status}
          </span>
        </div>
      ))}
    </div>
  );
}
