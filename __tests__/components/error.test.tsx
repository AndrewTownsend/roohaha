/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "@/app/error";

describe("Error boundary page", () => {
  const testError = new Error("Test error");
  const reset = vi.fn();

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    reset.mockClear();
  });

  it("renders the 'Something went wrong' heading", () => {
    render(<ErrorPage error={testError} reset={reset} />);
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
  });

  it("renders the 'Try again' button", () => {
    render(<ErrorPage error={testError} reset={reset} />);
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("calls the reset prop when 'Try again' is clicked", async () => {
    const user = userEvent.setup();
    render(<ErrorPage error={testError} reset={reset} />);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
  });

  it("renders descriptive text about environment variables", () => {
    render(<ErrorPage error={testError} reset={reset} />);
    expect(screen.getByText(/environment variables/i)).toBeInTheDocument();
  });
});
