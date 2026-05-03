"use client";

import { useActionState, useState } from "react";
import { saveContent } from "./actions";
import { SectionLabel } from "@/app/components/ui";

function isValidJson(s: string) {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
}

function useJsonField(initial: string) {
  const [value, setValue] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);

  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setValue(initial);
  }

  const invalid = value.trim() !== "" && !isValidJson(value);
  return { value, invalid, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value) };
}

export default function AdminForm({
  initialReading,
  initialPlaying,
}: {
  initialReading: string;
  initialPlaying: string;
}) {
  const [state, formAction, isPending] = useActionState(saveContent, null);

  const readingInitial = state?.ok ? JSON.stringify(state.value.reading, null, 2) : initialReading;
  const playingInitial = state?.ok ? JSON.stringify(state.value.playing, null, 2) : initialPlaying;

  const reading = useJsonField(readingInitial);
  const playing = useJsonField(playingInitial);

  const hasErrors = reading.invalid || playing.invalid;

  return (
    <form action={formAction}>
      <SectionLabel>Currently Reading</SectionLabel>
      <textarea
        name="reading"
        value={reading.value}
        onChange={reading.onChange}
        rows={10}
        style={reading.invalid ? { ...textareaStyle, ...errorStyle } : textareaStyle}
        spellCheck={false}
      />
      {reading.invalid && <p style={errorTextStyle}>Invalid JSON</p>}

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Currently Playing</SectionLabel>
        <textarea
          name="playing"
          value={playing.value}
          onChange={playing.onChange}
          rows={6}
          style={playing.invalid ? { ...textareaStyle, ...errorStyle } : textareaStyle}
          spellCheck={false}
        />
        {playing.invalid && <p style={errorTextStyle}>Invalid JSON</p>}
      </div>

      {state && !state.ok && (
        <p style={{ ...errorTextStyle, marginTop: 12 }}>{state.error}</p>
      )}
      {state?.ok && (
        <p
          style={{
            color: "#4caf7d",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          Saved. Changes propagate within ~10 seconds.
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          type="submit"
          disabled={isPending || hasErrors}
          style={isPending || hasErrors ? { ...buttonStyle, opacity: 0.45, cursor: "not-allowed" } : buttonStyle}
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

const textareaStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  padding: "10px 12px",
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 12,
  background: "#f7f8fa",
  border: "1.5px solid #dde2ea",
  borderRadius: 6,
  resize: "vertical",
  boxSizing: "border-box",
  color: "#1a2235",
};

const errorStyle: React.CSSProperties = {
  border: "1.5px solid #e05c5c",
  background: "#fff8f8",
};

const errorTextStyle: React.CSSProperties = {
  color: "#e05c5c",
  fontFamily: "var(--font-dm-mono), monospace",
  fontSize: 12,
  marginTop: 4,
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
