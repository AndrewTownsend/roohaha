import { blockStyle } from "./shared";

const heading = "// dual-key authorization required";

export default function CenterNuke() {
  return (
    <div style={blockStyle}>
      <div
        style={{
          color: "#5a7088",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          marginBottom: 10,
        }}
      >
        {heading}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #4a7fa5",
            borderRadius: 4,
            padding: 12,
            textAlign: "center",
            background: "rgba(74,127,165,0.1)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#6a9fc5",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            key 1
          </div>
          <div style={{ fontSize: 18, color: "#6a9fc5", marginBottom: 6 }}>⦿—</div>
          <div
            style={{
              fontSize: 10,
              color: "#6abf8a",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            turned
          </div>
        </div>
        <div
          style={{
            flex: 1,
            border: "1px solid #1f2d3f",
            borderRadius: 4,
            padding: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#5a7088",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            key 2
          </div>
          <div style={{ fontSize: 18, color: "#3d5068", marginBottom: 6 }}>⦾ ┃</div>
          <div
            style={{
              fontSize: 10,
              color: "#d4a85a",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            awaiting
          </div>
        </div>
      </div>
    </div>
  );
}
