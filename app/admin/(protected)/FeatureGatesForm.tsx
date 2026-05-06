"use client";

import { useActionState, useState } from "react";
import { saveFeatureGates } from "./actions";
import { type FeatureGates } from "@/app/lib/feature-gates";
import { SectionLabel } from "@/app/components/ui";

function useBoolField(initial: boolean) {
  const [value, setValue] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);

  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setValue(initial);
  }

  return { value, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.checked) };
}

export default function FeatureGatesForm({ initialGates }: { initialGates: FeatureGates }) {
  const [state, formAction, isPending] = useActionState(saveFeatureGates, null);

  const githubGraphInitial = state?.ok ? state.value.githubGraph : initialGates.githubGraph;
  const writingInitial = state?.ok ? state.value.writing : initialGates.writing;

  const githubGraph = useBoolField(githubGraphInitial);
  const writing = useBoolField(writingInitial);

  return (
    <form action={formAction}>
      <SectionLabel>Feature Gates</SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        <label style={labelStyle}>
          <input
            type="checkbox"
            name="githubGraph"
            checked={githubGraph.value}
            onChange={githubGraph.onChange}
            style={checkboxStyle}
          />
          GitHub contribution graph
        </label>
        <label style={labelStyle}>
          <input
            type="checkbox"
            name="writing"
            checked={writing.value}
            onChange={writing.onChange}
            style={checkboxStyle}
          />
          Writing section
        </label>
      </div>

      {state && !state.ok && (
        <p style={errorStyle}>{state.error}</p>
      )}
      {state?.ok && (
        <p style={successStyle}>Saved. Changes propagate within ~10 seconds.</p>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          type="submit"
          disabled={isPending}
          style={isPending ? { ...buttonStyle, opacity: 0.45, cursor: "not-allowed" } : buttonStyle}
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 13,
  color: "#1a2235",
  cursor: "pointer",
};

const checkboxStyle: React.CSSProperties = {
  width: 16,
  height: 16,
  cursor: "pointer",
  accentColor: "#1a2235",
};

const errorStyle: React.CSSProperties = {
  color: "#e05c5c",
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 12,
  marginTop: 12,
};

const successStyle: React.CSSProperties = {
  color: "#4caf7d",
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 12,
  marginTop: 12,
};

const buttonStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 13,
  background: "#1a2235",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  padding: "8px 20px",
  cursor: "pointer",
};
