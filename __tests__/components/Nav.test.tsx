/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Nav from "@/app/components/Nav";

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

describe("Nav", () => {
  describe("link rendering", () => {
    it("renders the four base nav links by default", () => {
      render(<Nav />);
      expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(1);
      expect(screen.getAllByRole("link", { name: "Skills" })).toHaveLength(1);
      expect(screen.getAllByRole("link", { name: "Highlights" })).toHaveLength(1);
      expect(screen.getAllByRole("link", { name: "Contact" })).toHaveLength(1);
    });

    it("does not render a Projects link by default", () => {
      render(<Nav />);
      expect(screen.queryByRole("link", { name: "Projects" })).not.toBeInTheDocument();
    });

    it("renders a Projects link when showProjects is true", () => {
      render(<Nav showProjects />);
      expect(screen.getAllByRole("link", { name: "Projects" })).toHaveLength(1);
    });
  });

  describe("hamburger toggle", () => {
    it("hamburger button has aria-expanded=false initially", () => {
      render(<Nav />);
      expect(screen.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("mobile nav links are not present before the menu is opened", () => {
      render(<Nav />);
      // Desktop renders one copy of each link; mobile adds a second copy when open.
      // With the menu closed there is exactly one instance of each.
      expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(1);
    });

    it("clicking the hamburger opens the mobile menu", async () => {
      const user = userEvent.setup();
      render(<Nav />);
      await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
      expect(screen.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      // Both desktop and mobile copies are now in the DOM.
      expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(2);
    });

    it("clicking the hamburger a second time closes the menu", async () => {
      const user = userEvent.setup();
      render(<Nav />);
      const btn = screen.getByRole("button", { name: "Toggle navigation" });
      await user.click(btn);
      await user.click(btn);
      expect(btn).toHaveAttribute("aria-expanded", "false");
      expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(1);
    });

    it("clicking a link inside the mobile menu closes it", async () => {
      const user = userEvent.setup();
      render(<Nav />);
      await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
      // Two "About" links exist; click the second one (the mobile copy).
      const mobileAbout = screen.getAllByRole("link", { name: "About" })[1];
      await user.click(mobileAbout);
      expect(screen.getAllByRole("link", { name: "About" })).toHaveLength(1);
    });
  });
});
