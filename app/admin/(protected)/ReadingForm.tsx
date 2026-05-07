"use client";

import { useActionState, useState } from "react";
import { saveReading, type SaveReadingResult } from "./actions";
import type { Book } from "@/app/types";
import { SectionLabel } from "@/app/components/ui";
import {
  Field,
  FormFooter,
  IconButton,
  AddButton,
  inputStyle,
  inputErrorStyle,
} from "./fields";

export default function ReadingForm({
  initialReading,
}: {
  initialReading: Book[];
}) {
  const [state, formAction, isPending] = useActionState(saveReading, null);
  const [books, setBooks] = useState<Book[]>(initialReading);
  const [prevState, setPrevState] = useState<SaveReadingResult | null>(null);

  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) setBooks(state.value);
  }

  function update(i: number, field: keyof Book, v: string) {
    setBooks((prev) => prev.map((b, j) => (j === i ? { ...b, [field]: v } : b)));
  }

  function remove(i: number) {
    setBooks((prev) => prev.filter((_, j) => j !== i));
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setBooks((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  function moveDown(i: number) {
    setBooks((prev) => {
      if (i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }

  function add() {
    setBooks((prev) => [...prev, { title: "", author: "" }]);
  }

  const hasEmpty = books.some((b) => !b.title.trim() || !b.author.trim());

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify(books)}
        onChange={() => {}}
      />
      <SectionLabel>Currently Reading</SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {books.map((book, i) => (
          <div
            key={`${i}-${book.title}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 8,
              alignItems: "end",
            }}
          >
            <Field label="Title">
              <input
                style={!book.title.trim() ? inputErrorStyle : inputStyle}
                value={book.title}
                onChange={(e) => update(i, "title", e.target.value)}
              />
            </Field>
            <Field label="Author">
              <input
                style={!book.author.trim() ? inputErrorStyle : inputStyle}
                value={book.author}
                onChange={(e) => update(i, "author", e.target.value)}
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

      <AddButton onClick={add} label="+ Add book" />

      <FormFooter
        error={state && !state.ok ? state.error : undefined}
        success={state?.ok ?? false}
        isPending={isPending}
        disabled={hasEmpty}
        viewHref="/"
      />
    </form>
  );
}
