"use client";

import { useActionState, useRef, useState } from "react";
import { saveProjects, type SaveProjectsResult } from "./actions";
import type { AdminProject } from "@/app/lib/projects-admin";
import type { ProjectLink, ProjectStatus } from "@/app/types";
import {
  PROJECT_STATUS_TEXT_ON_LIGHT,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_OPTIONS,
} from "@/app/lib/project-meta";
import { SectionLabel } from "@/app/components/ui";
import {
  Field,
  FormFooter,
  IconButton,
  AddButton,
  inputStyle,
  inputErrorStyle,
  labelStyle,
  errorTextStyle,
} from "./fields";

const MONO = "var(--font-dm-mono), monospace";


const LINK_KINDS: ProjectLink["kind"][] = ["github", "ios", "android", "web", "page"];

const LINK_PLACEHOLDERS: Record<ProjectLink["kind"], string> = {
  github: "https://github.com/...",
  ios: "https://apps.apple.com/...",
  android: "https://play.google.com/...",
  web: "https://...",
  page: "/projects/your-slug",
};

interface CardItem {
  project: AdminProject;
  expanded: boolean;
}

function idIsValid(id: string) {
  return /^[a-z0-9-]+$/.test(id) && id.length > 0 && id.length <= 60;
}

function projectIsValid(p: AdminProject) {
  return (
    idIsValid(p.id) &&
    p.title.trim().length > 0 &&
    p.tagline.trim().length > 0 &&
    p.desc.trim().length > 0 &&
    p.statusLabel.trim().length > 0 &&
    p.links.every((l) => l.label.trim().length > 0 && l.href.trim().length > 0)
  );
}

interface ProjectCardProps {
  item: CardItem;
  onToggle: () => void;
  onUpdate: (patch: Partial<AdminProject>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddLink: () => void;
  onRemoveLink: (li: number) => void;
  onUpdateLink: (li: number, patch: Partial<ProjectLink>) => void;
  onSetLinkPrimary: (li: number) => void;
}

function ProjectCard({
  item,
  onToggle,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
  onSetLinkPrimary,
}: ProjectCardProps) {
  const { project, expanded } = item;
  const isInvalid = !projectIsValid(project);

  return (
    <div
      style={{
        border: `1.5px solid ${isInvalid ? "#e05c5c" : "#dde2ea"}`,
        borderRadius: 6,
        marginTop: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          background: "#f7f8fa",
          cursor: "default",
          userSelect: "none",
        }}
        onClick={onToggle}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style={{
            flexShrink: 0,
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
            color: "#5a7088",
            cursor: "pointer",
          }}
        >
          <path
            d="M5 3L9 7L5 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "#1a2235",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.title || "New Project"}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: PROJECT_STATUS_TEXT_ON_LIGHT[project.status],
            border: `1px solid ${PROJECT_STATUS_TEXT_ON_LIGHT[project.status]}`,
            borderRadius: 3,
            padding: "1px 6px",
            flexShrink: 0,
          }}
        >
          {project.status}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdate({ visible: !project.visible });
          }}
          title={project.visible ? "Visible — click to hide" : "Hidden — click to show"}
          style={{
            fontFamily: MONO,
            fontSize: 10,
            background: "none",
            color: project.visible ? "#4caf7d" : "#8a9ab0",
            border: `1px solid ${project.visible ? "#4caf7d" : "#dde2ea"}`,
            borderRadius: 3,
            padding: "1px 6px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {project.visible ? "visible" : "hidden"}
        </button>
        <div
          style={{ display: "flex", gap: 4, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton onClick={onMoveUp} title="Move up">↑</IconButton>
          <IconButton onClick={onMoveDown} title="Move down">↓</IconButton>
          <IconButton onClick={onRemove} title="Remove project" danger>×</IconButton>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="ID (slug)">
              <input
                style={!idIsValid(project.id) ? inputErrorStyle : inputStyle}
                value={project.id}
                onChange={(e) => onUpdate({ id: e.target.value })}
                placeholder="my-project"
              />
              {!idIsValid(project.id) && (
                <p style={errorTextStyle}>lowercase letters, digits, hyphens only</p>
              )}
            </Field>
            <Field label="Title">
              <input
                style={!project.title.trim() ? inputErrorStyle : inputStyle}
                value={project.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Tagline">
            <input
              style={!project.tagline.trim() ? inputErrorStyle : inputStyle}
              value={project.tagline}
              onChange={(e) => onUpdate({ tagline: e.target.value })}
            />
          </Field>

          <Field label="Description">
            <textarea
              style={{
                ...(!project.desc.trim() ? inputErrorStyle : inputStyle),
                resize: "vertical",
                minHeight: 72,
              }}
              value={project.desc}
              onChange={(e) => onUpdate({ desc: e.target.value })}
              rows={3}
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Status">
              <select
                style={inputStyle}
                value={project.status}
                onChange={(e) => {
                  const s = e.target.value as ProjectStatus;
                  onUpdate({ status: s, statusLabel: PROJECT_STATUS_LABEL[s] });
                }}
              >
                {PROJECT_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status label">
              <input
                style={!project.statusLabel.trim() ? inputErrorStyle : inputStyle}
                value={project.statusLabel}
                onChange={(e) => onUpdate({ statusLabel: e.target.value })}
              />
            </Field>
            <Field label="Meta (e.g. 2026 · Web)">
              <input
                style={inputStyle}
                value={project.meta}
                onChange={(e) => onUpdate({ meta: e.target.value })}
                placeholder="2026 · Web"
              />
            </Field>
          </div>

          <div>
            <p style={{ ...labelStyle, marginBottom: 6 }}>Links</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {project.links.map((link, li) => (
                <div
                  key={li}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr 2fr auto auto",
                    gap: 6,
                    alignItems: "end",
                  }}
                >
                  <Field label="Kind">
                    <select
                      style={inputStyle}
                      value={link.kind}
                      onChange={(e) =>
                        onUpdateLink(li, { kind: e.target.value as ProjectLink["kind"] })
                      }
                    >
                      {LINK_KINDS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Label">
                    <input
                      style={!link.label.trim() ? inputErrorStyle : inputStyle}
                      value={link.label}
                      onChange={(e) => onUpdateLink(li, { label: e.target.value })}
                    />
                  </Field>
                  <Field label="URL / path">
                    <input
                      style={!link.href.trim() ? inputErrorStyle : inputStyle}
                      value={link.href}
                      onChange={(e) => onUpdateLink(li, { href: e.target.value })}
                      placeholder={LINK_PLACEHOLDERS[link.kind]}
                    />
                  </Field>
                  <div style={{ paddingBottom: 1 }}>
                    <label style={{ ...labelStyle, marginBottom: 5 }}>Primary</label>
                    <input
                      type="checkbox"
                      checked={link.primary === true}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSetLinkPrimary(li);
                        } else {
                          onUpdateLink(li, { primary: undefined });
                        }
                      }}
                      style={{ accentColor: "#1a2235", width: 16, height: 16 }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 4, paddingBottom: 1 }}>
                    <IconButton onClick={() => onRemoveLink(li)} title="Remove link" danger>
                      ×
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
            <AddButton onClick={onAddLink} label="+ Add link" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsForm({
  initialProjects,
}: {
  initialProjects: AdminProject[];
}) {
  const [state, formAction, isPending] = useActionState(saveProjects, null);
  const [items, setItems] = useState<CardItem[]>(() =>
    initialProjects.map((p) => ({ project: p, expanded: false })),
  );
  const [prevState, setPrevState] = useState<SaveProjectsResult | null>(null);
  const nextIdCounter = useRef(0);

  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) {
      setItems(state.value.map((p) => ({ project: p, expanded: false })));
    }
  }

  function toggleExpand(i: number) {
    setItems((prev) =>
      prev.map((item, j) => (j === i ? { ...item, expanded: !item.expanded } : item)),
    );
  }

  function updateProject(i: number, patch: Partial<AdminProject>) {
    setItems((prev) =>
      prev.map((item, j) =>
        j === i ? { ...item, project: { ...item.project, ...patch } } : item,
      ),
    );
  }

  function removeProject(i: number) {
    setItems((prev) => prev.filter((_, j) => j !== i));
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  function moveDown(i: number) {
    setItems((prev) => {
      if (i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }

  function addProject() {
    nextIdCounter.current += 1;
    const tempId = `new-project-${nextIdCounter.current}`;
    const newProject: AdminProject = {
      id: tempId,
      visible: true,
      title: "",
      tagline: "",
      desc: "",
      status: "planned",
      statusLabel: "Planning",
      meta: "",
      links: [],
    };
    setItems((prev) => [...prev, { project: newProject, expanded: true }]);
  }

  function addLink(i: number) {
    setItems((prev) =>
      prev.map((item, j) => {
        if (j !== i) return item;
        const link: ProjectLink = { kind: "web", label: "", href: "" };
        return { ...item, project: { ...item.project, links: [...item.project.links, link] } };
      }),
    );
  }

  function removeLink(i: number, li: number) {
    setItems((prev) =>
      prev.map((item, j) => {
        if (j !== i) return item;
        const links = item.project.links.filter((_, k) => k !== li);
        return { ...item, project: { ...item.project, links } };
      }),
    );
  }

  function updateLink(i: number, li: number, patch: Partial<ProjectLink>) {
    setItems((prev) =>
      prev.map((item, j) => {
        if (j !== i) return item;
        const links = item.project.links.map((l, k) =>
          k === li ? { ...l, ...patch } : l,
        );
        return { ...item, project: { ...item.project, links } };
      }),
    );
  }

  function setLinkPrimary(i: number, li: number) {
    setItems((prev) =>
      prev.map((item, j) => {
        if (j !== i) return item;
        const links = item.project.links.map((l, k) => ({
          ...l,
          primary: k === li ? (true as const) : undefined,
        }));
        return { ...item, project: { ...item.project, links } };
      }),
    );
  }

  const hasDuplicateIds =
    new Set(items.map((item) => item.project.id)).size !== items.length;
  const allValid = items.every((item) => projectIsValid(item.project)) && !hasDuplicateIds;

  return (
    <form action={formAction}>
      <input
        type="hidden"
        name="payload"
        value={JSON.stringify(items.map((item) => item.project))}
        onChange={() => {}}
      />
      <SectionLabel>Projects</SectionLabel>

      {hasDuplicateIds && (
        <p style={{ ...errorTextStyle, marginTop: 6 }}>Duplicate project IDs detected</p>
      )}

      {items.map((item, i) => (
        <ProjectCard
          key={`${i}-${item.project.id}`}
          item={item}
          onToggle={() => toggleExpand(i)}
          onUpdate={(patch) => updateProject(i, patch)}
          onRemove={() => removeProject(i)}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
          onAddLink={() => addLink(i)}
          onRemoveLink={(li) => removeLink(i, li)}
          onUpdateLink={(li, patch) => updateLink(i, li, patch)}
          onSetLinkPrimary={(li) => setLinkPrimary(i, li)}
        />
      ))}

      <AddButton onClick={addProject} label="+ Add project" />

      <FormFooter
        error={state && !state.ok ? state.error : undefined}
        success={state?.ok ?? false}
        isPending={isPending}
        disabled={!allValid}
        viewHref="/"
      />
    </form>
  );
}
