"use client";

import { useState, useRef, useSyncExternalStore, type FormEvent, type ChangeEvent, type FocusEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = { name?: string; email?: string; message?: string };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function emailError(email: string): string | undefined {
  const trimmed = email.trim();
  if (!isValidEmail(trimmed)) return "Enter a valid email address.";
  if (/@example\.com$/i.test(trimmed)) return "Are you suuuuuure you work for example.com?";
  return undefined;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validate(name: string, email: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (name.trim().length < 2) errors.name = "At least 2 characters required.";
  const emailErr = emailError(email);
  if (emailErr) errors.email = emailErr;
  if (wordCount(message) < 5) errors.message = "Please write at least 5 words.";
  return errors;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const messageDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  function setFieldError(field: keyof FieldErrors, error: string | undefined) {
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  }

  // Name / Email: clear error on change, validate on blur
  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    if (name === "name") {
      setFieldError("name", value.trim().length < 2 ? "At least 2 characters required." : undefined);
    } else if (name === "email") {
      setFieldError("email", value ? emailError(value) : undefined);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name } = e.currentTarget;
    if (name === "name" || name === "email") {
      setFieldError(name, undefined);
    }
  }

  // Message: debounced validation — only fires when there's content
  function handleMessageChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.currentTarget.value;
    if (messageDebounce.current) clearTimeout(messageDebounce.current);
    messageDebounce.current = setTimeout(() => {
      if (value.trim().length > 0) {
        setFieldError("message", wordCount(value) < 5 ? "Please write at least 5 words." : undefined);
      } else {
        setFieldError("message", undefined);
      }
    }, 600);
  }

  function handleMessageBlur(e: FocusEvent<HTMLTextAreaElement>) {
    if (messageDebounce.current) clearTimeout(messageDebounce.current);
    const value = e.currentTarget.value;
    if (value.trim().length > 0) {
      setFieldError("message", wordCount(value) < 5 ? "Please write at least 5 words." : undefined);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageDebounce.current) clearTimeout(messageDebounce.current);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    const errors = validate(name, email, message);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus("loading");
    setSubmitError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (!mounted) {
    return <div className="flex flex-col gap-3" aria-hidden style={{ minHeight: 280 }} />;
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e); }} noValidate className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="cf-name" className="form-label">Name</label>
        <input
          id="cf-name"
          name="name"
          type="text"
          placeholder="Your name"
          autoComplete="off"
          className={`form-input${fieldErrors.name ? " form-input-error" : ""}`}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {fieldErrors.name && <span className="form-error">{fieldErrors.name}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cf-email" className="form-label">Email</label>
        <input
          id="cf-email"
          name="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="off"
          className={`form-input${fieldErrors.email ? " form-input-error" : ""}`}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cf-message" className="form-label">Message</label>
        <textarea
          id="cf-message"
          name="message"
          placeholder="What's on your mind?"
          className={`form-textarea${fieldErrors.message ? " form-input-error" : ""}`}
          onChange={handleMessageChange}
          onBlur={handleMessageBlur}
        />
        {fieldErrors.message && <span className="form-error">{fieldErrors.message}</span>}
      </div>

      <button type="submit" disabled={status === "loading"} className="submit-btn">
        {status === "loading" ? "Sending…" : "Send message"}
      </button>

      {status === "success" && (
        <p style={{ fontSize: 13, color: "#4a7fa5" }}>
          Message sent! I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p style={{ fontSize: 13, color: "#c0392b" }}>{submitError}</p>
      )}
    </form>
  );
}
