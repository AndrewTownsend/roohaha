/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminTabs from "@/app/admin/(protected)/AdminTabs";
import type { FeatureGates } from "@/app/lib/feature-gates";

vi.mock("@/app/admin/(protected)/ProjectsForm", () => ({
  default: (_props: object) => <div data-testid="projects-form" />,
}));
vi.mock("@/app/admin/(protected)/ReadingForm", () => ({
  default: (_props: object) => <div data-testid="reading-form" />,
}));
vi.mock("@/app/admin/(protected)/PlayingForm", () => ({
  default: (_props: object) => <div data-testid="playing-form" />,
}));
vi.mock("@/app/admin/(protected)/FeatureGatesForm", () => ({
  default: (_props: object) => <div data-testid="gates-form" />,
}));

const defaultGates: FeatureGates = { githubGraph: true, writing: true, projects: true };

function renderTabs() {
  return render(
    <AdminTabs
      initialReading={[]}
      initialPlaying={[]}
      initialProjects={[]}
      initialGates={defaultGates}
    />,
  );
}

describe("AdminTabs", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("tab bar", () => {
    it("renders all four tab buttons", () => {
      renderTabs();
      expect(screen.getByRole("tab", { name: "Projects" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Reading" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Playing" })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: "Feature Gates" })).toBeInTheDocument();
    });
  });

  describe("default panel", () => {
    it("shows the Projects panel on first load", () => {
      renderTabs();
      expect(screen.getByTestId("projects-form")).toBeInTheDocument();
      expect(screen.queryByTestId("reading-form")).not.toBeInTheDocument();
      expect(screen.queryByTestId("playing-form")).not.toBeInTheDocument();
      expect(screen.queryByTestId("gates-form")).not.toBeInTheDocument();
    });
  });

  describe("tab switching", () => {
    it("clicking Reading shows the ReadingForm", async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.click(screen.getByRole("tab", { name: "Reading" }));
      expect(screen.getByTestId("reading-form")).toBeInTheDocument();
      expect(screen.queryByTestId("projects-form")).not.toBeInTheDocument();
    });

    it("clicking Playing shows the PlayingForm", async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.click(screen.getByRole("tab", { name: "Playing" }));
      expect(screen.getByTestId("playing-form")).toBeInTheDocument();
      expect(screen.queryByTestId("projects-form")).not.toBeInTheDocument();
    });

    it("clicking Feature Gates shows the FeatureGatesForm", async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.click(screen.getByRole("tab", { name: "Feature Gates" }));
      expect(screen.getByTestId("gates-form")).toBeInTheDocument();
      expect(screen.queryByTestId("projects-form")).not.toBeInTheDocument();
    });

    it("clicking back to Projects restores the Projects panel", async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.click(screen.getByRole("tab", { name: "Reading" }));
      await user.click(screen.getByRole("tab", { name: "Projects" }));
      expect(screen.getByTestId("projects-form")).toBeInTheDocument();
      expect(screen.queryByTestId("reading-form")).not.toBeInTheDocument();
    });
  });

  describe("sessionStorage persistence", () => {
    it("writes the selected tab to sessionStorage on switch", async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.click(screen.getByRole("tab", { name: "Reading" }));
      expect(sessionStorage.getItem("admin:tab")).toBe("reading");
    });

    it("restores the active tab from sessionStorage on mount", () => {
      sessionStorage.setItem("admin:tab", "playing");
      renderTabs();
      expect(screen.getByTestId("playing-form")).toBeInTheDocument();
      expect(screen.queryByTestId("projects-form")).not.toBeInTheDocument();
    });

    it("ignores an unrecognised sessionStorage value and defaults to Projects", () => {
      sessionStorage.setItem("admin:tab", "bogus");
      renderTabs();
      expect(screen.getByTestId("projects-form")).toBeInTheDocument();
    });
  });
});
