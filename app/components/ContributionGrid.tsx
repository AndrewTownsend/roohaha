"use client";

import { useState } from "react";
import type { ContributionWeek } from "@/app/lib/github";

// ---------------------------------------------------------------------------
// Colour levels (accent-blue palette, empty → full)
// ---------------------------------------------------------------------------
const CELL_COLORS = ["#eef1f5", "#c5d9eb", "#91bcd8", "#5f9bbf", "#4a7fa5"] as const;

function getColor(count: number): string {
  if (count === 0) return CELL_COLORS[0];
  if (count === 1) return CELL_COLORS[1];
  if (count <= 3) return CELL_COLORS[2];
  if (count <= 6) return CELL_COLORS[3];
  return CELL_COLORS[4];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function formatTooltip(date: string, count: number): string {
  const d = new Date(date + "T12:00:00"); // noon avoids any TZ edge cases
  const month = MONTH_NAMES[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  const label = count === 1 ? "1 contribution" : `${count.toLocaleString()} contributions`;
  return `${label} on ${month} ${day}, ${year}`;
}

interface TooltipState {
  text: string;
  x: number;
  y: number;
}

function Tooltip({ tip }: { tip: TooltipState }) {
  return (
    <div
      style={{
        position: "fixed",
        left: tip.x,
        top: tip.y - 8,
        transform: "translateX(-50%) translateY(-100%)",
        background: "#1a2235",
        color: "#e8ecf0",
        fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
        fontSize: 11,
        padding: "5px 9px",
        borderRadius: 5,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
      }}
    >
      {tip.text}
      {/* Caret */}
      <span
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          borderWidth: 5,
          borderStyle: "solid",
          borderColor: "#1a2235 transparent transparent transparent",
        }}
      />
    </div>
  );
}

const dayLabelStyle: React.CSSProperties = {
  height: 10,
  width: 24,
  fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
  fontSize: 9,
  color: "#7a90a8",
  lineHeight: "10px",
  textAlign: "right",
};

interface Props {
  weeks: ContributionWeek[];
  totalContributions: number;
}

export default function ContributionGrid({ weeks, totalContributions }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Derive month label positions (first week of each new month)
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, col) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date + "T12:00:00").getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTH_NAMES[month], col });
      lastMonth = month;
    }
  });

  return (
    <>
      {tooltip && <Tooltip tip={tooltip} />}

      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "inline-block", minWidth: "max-content" }}>

          {/* Month labels */}
          <div style={{ position: "relative", height: 16, marginLeft: 28, marginBottom: 4 }}>
            {monthLabels.map(({ label, col }) => (
              <span
                key={`${label}-${col}`}
                style={{
                  position: "absolute",
                  left: col * 12,
                  fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
                  fontSize: 10,
                  color: "#7a90a8",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Day-of-week labels + grid */}
          <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>

            {/* Sun / Mon / … / Sat — only Mon, Wed, Fri shown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={dayLabelStyle} />
              <div style={dayLabelStyle}>Mon</div>
              <div style={dayLabelStyle} />
              <div style={dayLabelStyle}>Wed</div>
              <div style={dayLabelStyle} />
              <div style={dayLabelStyle}>Fri</div>
              <div style={dayLabelStyle} />
            </div>

            {/* Week columns */}
            <div
              role="img"
              aria-label={`GitHub contribution graph: ${totalContributions.toLocaleString()} contributions in the last year`}
              style={{ display: "flex", gap: 2 }}
            >
              {weeks.map((week) => {
                const weekKey = week.contributionDays[0]?.date ?? `week-${week.contributionDays.length}`;
                return (
                  <div key={weekKey} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {week.contributionDays.map((day) => (
                      <div
                        key={day.date}
                        title={formatTooltip(day.date, day.contributionCount)}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: getColor(day.contributionCount),
                          flexShrink: 0,
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            text: formatTooltip(day.date, day.contributionCount),
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contribution total */}
          <p
            style={{
              margin: "10px 0 0 28px",
              fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
              fontSize: 10,
              color: "#7a90a8",
            }}
          >
            {totalContributions.toLocaleString()} contributions in the last year
          </p>

        </div>
      </div>
    </>
  );
}
