"use client";

import React, { useId } from "react";

const MONO = "var(--font-dm-mono), monospace";

export const inputStyle: React.CSSProperties = {
  padding: "7px 10px",
  fontFamily: MONO,
  fontSize: 12,
  background: "#f7f8fa",
  border: "1.5px solid #dde2ea",
  borderRadius: 5,
  boxSizing: "border-box",
  color: "#1a2235",
  width: "100%",
};

export const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  border: "1.5px solid #e05c5c",
  background: "#fff8f8",
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: MONO,
  fontSize: 11,
  color: "#7a90a8",
  marginBottom: 3,
};

export const errorTextStyle: React.CSSProperties = {
  color: "#e05c5c",
  fontFamily: MONO,
  fontSize: 11,
  marginTop: 2,
};

export const successTextStyle: React.CSSProperties = {
  color: "#4caf7d",
  fontFamily: MONO,
  fontSize: 12,
  marginTop: 12,
};

export const primaryButtonStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 13,
  background: "#1a2235",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  padding: "8px 20px",
  cursor: "pointer",
};

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const nodes = React.Children.toArray(children);
  const first = nodes[0];
  const rest = nodes.slice(1);
  const labeled = React.isValidElement(first)
    ? React.cloneElement(first as React.ReactElement<{ id?: string }>, { id })
    : first;
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      {labeled}
      {rest}
    </div>
  );
}

export function IconButton({
  onClick,
  title,
  children,
  danger,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      style={{
        fontFamily: MONO,
        fontSize: 11,
        background: "none",
        color: danger ? "#e05c5c" : "#7a90a8",
        border: `1px solid ${danger ? "#e05c5c" : "#dde2ea"}`,
        borderRadius: 4,
        padding: "2px 7px",
        cursor: "pointer",
        lineHeight: "1.4",
      }}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}

export function AddButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: MONO,
        fontSize: 11,
        background: "none",
        color: "#4a7fa5",
        border: "1px dashed #4a7fa5",
        borderRadius: 5,
        padding: "5px 12px",
        cursor: "pointer",
        width: "100%",
        marginTop: 8,
      }}
    >
      {label}
    </button>
  );
}

export function FormFooter({
  error,
  success,
  isPending,
  disabled,
  viewHref,
}: {
  error?: string;
  success: boolean;
  isPending: boolean;
  disabled: boolean;
  viewHref?: string;
}) {
  return (
    <div style={{ marginTop: 20 }}>
      {error && (
        <p role="alert" style={{ ...errorTextStyle, marginTop: 0, marginBottom: 10 }}>{error}</p>
      )}
      {success && (
        <p role="status" style={successTextStyle}>Saved. Changes propagate within ~10 seconds.</p>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <button
          type="submit"
          disabled={isPending || disabled}
          style={
            isPending || disabled
              ? { ...primaryButtonStyle, opacity: 0.45, cursor: "not-allowed" }
              : primaryButtonStyle
          }
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        {success && viewHref && (
          <a
            href={viewHref}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "#4caf7d",
              textDecoration: "none",
            }}
          >
            View on site →
          </a>
        )}
      </div>
    </div>
  );
}
