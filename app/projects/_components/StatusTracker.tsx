const ANIMATION_NAME = "status-tracker-pulse";

const STAGE_COLORS: Record<string, string> = {
  "Planning":       "#4a7fa5",
  "In development": "#d4a04a",
  "Beta":           "#7b6cc7",
  "Shipped":        "#4ea372",
  "Paused":         "#a0a8b4",
};

const DEFAULT_COLOR = "#4a7fa5";

interface StatusTrackerProps {
  stages: string[];
  current: string;
  color?: string;
}

export default function StatusTracker({ stages, current, color }: StatusTrackerProps) {
  const currentIndex = stages.indexOf(current);
  const resolvedColor = color ?? STAGE_COLORS[current] ?? DEFAULT_COLOR;
  const colorFaint = `${resolvedColor}70`;
  const colorRipple = `${resolvedColor}80`;

  const items = stages.flatMap((label, i) => {
    const isPast = i < currentIndex;
    const isCurrent = i === currentIndex;

    const dot = (
      <div
        key={label}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flexShrink: 0 }}
      >
        <div
          className={isCurrent ? `${ANIMATION_NAME}-dot` : undefined}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: isCurrent ? resolvedColor : isPast ? colorFaint : "transparent",
            border: isCurrent || isPast ? "none" : "1.5px solid #c8d0da",
            animation: isCurrent ? `${ANIMATION_NAME} 2.4s ease-in-out infinite` : "none",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: isCurrent ? resolvedColor : isPast ? "#8a9ab0" : "#c0c9d4",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
    );

    if (i < stages.length - 1) {
      return [
        dot,
        <div
          key={`line-${i}`}
          style={{
            flex: 1,
            height: 1,
            background: i < currentIndex ? colorFaint : "#e2e6ec",
            alignSelf: "flex-start",
            marginTop: 5,
            minWidth: 16,
          }}
        />,
      ];
    }
    return [dot];
  });

  return (
    <>
      <style>{`
        @keyframes ${ANIMATION_NAME} {
          0%, 100% { box-shadow: 0 0 0 0 ${colorRipple}; }
          50% { box-shadow: 0 0 0 5px transparent; }
        }
        @media (prefers-reduced-motion: reduce) {
          .${ANIMATION_NAME}-dot { animation: none; }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "flex-start" }}>{items}</div>
    </>
  );
}
