"use client";

import { useActionState, useState } from "react";
import { savePlaying, type SavePlayingResult } from "./actions";
import type { Game } from "@/app/types";
import { SectionLabel } from "@/app/components/ui";
import {
  Field,
  FormFooter,
  IconButton,
  AddButton,
  inputStyle,
  inputErrorStyle,
} from "./fields";

export default function PlayingForm({
  initialPlaying,
}: {
  initialPlaying: Game[];
}) {
  const [state, formAction, isPending] = useActionState(savePlaying, null);
  const [games, setGames] = useState<Game[]>(initialPlaying);
  const [prevState, setPrevState] = useState<SavePlayingResult | null>(null);

  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) setGames(state.value);
  }

  function update(i: number, v: string) {
    setGames((prev) => prev.map((g, j) => (j === i ? { title: v } : g)));
  }

  function remove(i: number) {
    setGames((prev) => prev.filter((_, j) => j !== i));
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setGames((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  function moveDown(i: number) {
    setGames((prev) => {
      if (i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }

  function add() {
    setGames((prev) => [...prev, { title: "" }]);
  }

  const hasEmpty = games.some((g) => !g.title.trim());

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify(games)}
        onChange={() => {}}
      />
      <SectionLabel>Currently Playing</SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {games.map((game, i) => (
          <div
            key={`${i}-${game.title}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 8,
              alignItems: "end",
            }}
          >
            <Field label="Title">
              <input
                style={!game.title.trim() ? inputErrorStyle : inputStyle}
                value={game.title}
                onChange={(e) => update(i, e.target.value)}
              />
            </Field>
            <div style={{ display: "flex", gap: 4, paddingBottom: 1 }}>
              <IconButton onClick={() => moveUp(i)} title="Move up">↑</IconButton>
              <IconButton onClick={() => moveDown(i)} title="Move down">↓</IconButton>
              <IconButton onClick={() => remove(i)} title="Remove" danger>×</IconButton>
            </div>
          </div>
        ))}
      </div>

      <AddButton onClick={add} label="+ Add game" />

      <FormFooter
        error={state && !state.ok ? state.error : undefined}
        success={state?.ok ?? false}
        isPending={isPending}
        disabled={hasEmpty}
        viewHref="/#reading-playing"
      />
    </form>
  );
}
