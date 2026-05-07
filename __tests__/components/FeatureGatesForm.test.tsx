/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeatureGatesForm from "@/app/admin/(protected)/FeatureGatesForm";
import type { FeatureGates } from "@/app/lib/feature-gates";

vi.mock("@/app/admin/(protected)/actions", () => ({
  saveFeatureGates: vi.fn(),
}));

const allOn: FeatureGates = { githubGraph: true, writing: true, projects: true };
const allOff: FeatureGates = { githubGraph: false, writing: false, projects: false };

describe("FeatureGatesForm", () => {
  describe("rendering", () => {
    it("renders checkboxes for all three feature gates", () => {
      render(<FeatureGatesForm initialGates={allOn} />);
      expect(screen.getByLabelText("GitHub contribution graph")).toBeInTheDocument();
      expect(screen.getByLabelText("Writing section")).toBeInTheDocument();
      expect(screen.getByLabelText("Projects card")).toBeInTheDocument();
    });

    it("render a Save button that is enabled initially", () => {
      render(<FeatureGatesForm initialGates={allOn} />);
      expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
    });
  });

  describe("initial checkbox state", () => {
    it("checks all boxes when all gates are true", () => {
      render(<FeatureGatesForm initialGates={allOn} />);
      expect(screen.getByLabelText("GitHub contribution graph")).toBeChecked();
      expect(screen.getByLabelText("Writing section")).toBeChecked();
      expect(screen.getByLabelText("Projects card")).toBeChecked();
    });

    it("unchecks all boxes when all gates are false", () => {
      render(<FeatureGatesForm initialGates={allOff} />);
      expect(screen.getByLabelText("GitHub contribution graph")).not.toBeChecked();
      expect(screen.getByLabelText("Writing section")).not.toBeChecked();
      expect(screen.getByLabelText("Projects card")).not.toBeChecked();
    });

    it("respects mixed initial values", () => {
      render(<FeatureGatesForm initialGates={{ githubGraph: true, writing: false, projects: true }} />);
      expect(screen.getByLabelText("GitHub contribution graph")).toBeChecked();
      expect(screen.getByLabelText("Writing section")).not.toBeChecked();
      expect(screen.getByLabelText("Projects card")).toBeChecked();
    });
  });

  describe("checkbox toggling", () => {
    it("toggling an unchecked box makes it checked", async () => {
      const user = userEvent.setup();
      render(<FeatureGatesForm initialGates={allOff} />);
      await user.click(screen.getByLabelText("Writing section"));
      expect(screen.getByLabelText("Writing section")).toBeChecked();
    });

    it("toggling a checked box makes it unchecked", async () => {
      const user = userEvent.setup();
      render(<FeatureGatesForm initialGates={allOn} />);
      await user.click(screen.getByLabelText("GitHub contribution graph"));
      expect(screen.getByLabelText("GitHub contribution graph")).not.toBeChecked();
    });

    it("toggling one box does not affect the others", async () => {
      const user = userEvent.setup();
      render(<FeatureGatesForm initialGates={allOn} />);
      await user.click(screen.getByLabelText("Writing section"));
      expect(screen.getByLabelText("GitHub contribution graph")).toBeChecked();
      expect(screen.getByLabelText("Projects card")).toBeChecked();
    });
  });
});
