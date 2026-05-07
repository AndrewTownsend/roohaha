/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/app/components/ContactForm";

describe("ContactForm", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("renders name, email, and message fields with a submit button", () => {
      render(<ContactForm />);
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
    });

    it("submit button is enabled on initial render", () => {
      render(<ContactForm />);
      expect(screen.getByRole("button", { name: "Send message" })).not.toBeDisabled();
    });
  });

  describe("name validation", () => {
    it("shows an error when blurred with an empty field", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.click(screen.getByLabelText("Name"));
      await user.tab();
      expect(screen.getByText("At least 2 characters required.")).toBeInTheDocument();
    });

    it("shows an error when blurred with only 1 character", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Name"), "A");
      await user.tab();
      expect(screen.getByText("At least 2 characters required.")).toBeInTheDocument();
    });

    it("clears the error as soon as the field is changed", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.click(screen.getByLabelText("Name"));
      await user.tab();
      expect(screen.getByText("At least 2 characters required.")).toBeInTheDocument();
      await user.type(screen.getByLabelText("Name"), "A");
      expect(screen.queryByText("At least 2 characters required.")).not.toBeInTheDocument();
    });

    it("shows no error when blurred with a valid name", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Name"), "Andrew");
      await user.tab();
      expect(screen.queryByText("At least 2 characters required.")).not.toBeInTheDocument();
    });
  });

  describe("email validation", () => {
    it("shows an error when blurred with an invalid email format", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Email"), "notanemail");
      await user.tab();
      expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    });

    it("shows the example.com easter egg error", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Email"), "someone@example.com");
      await user.tab();
      expect(screen.getByText("Are you suuuuuure you work for example.com?")).toBeInTheDocument();
    });

    it("shows no error when blurred with an empty field", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.click(screen.getByLabelText("Email"));
      await user.tab();
      expect(screen.queryByText("Enter a valid email address.")).not.toBeInTheDocument();
    });

    it("clears the error as soon as the field is changed", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Email"), "bad");
      await user.tab();
      expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
      await user.type(screen.getByLabelText("Email"), "x");
      expect(screen.queryByText("Enter a valid email address.")).not.toBeInTheDocument();
    });

    it("shows no error when blurred with a valid email", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Email"), "test@example.org");
      await user.tab();
      expect(screen.queryByText("Enter a valid email address.")).not.toBeInTheDocument();
    });
  });

  describe("message validation", () => {
    it("shows an error immediately on blur when content has fewer than 5 words", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Message"), "too short");
      await user.tab();
      expect(screen.getByText("Please write at least 5 words.")).toBeInTheDocument();
    });

    it("shows no error on blur when message has 5 or more words", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Message"), "this has exactly five words");
      await user.tab();
      expect(screen.queryByText("Please write at least 5 words.")).not.toBeInTheDocument();
    });

    it("shows no error on blur when the field is empty", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.click(screen.getByLabelText("Message"));
      await user.tab();
      expect(screen.queryByText("Please write at least 5 words.")).not.toBeInTheDocument();
    });

    it("shows an error after the 600 ms debounce when fewer than 5 words are typed", () => {
      vi.useFakeTimers();
      render(<ContactForm />);
      fireEvent.change(screen.getByLabelText("Message"), { target: { value: "only four words" } });
      expect(screen.queryByText("Please write at least 5 words.")).not.toBeInTheDocument();
      act(() => { vi.advanceTimersByTime(600); });
      expect(screen.getByText("Please write at least 5 words.")).toBeInTheDocument();
    });

    it("shows no error after the debounce when 5 or more words are typed", () => {
      vi.useFakeTimers();
      render(<ContactForm />);
      fireEvent.change(screen.getByLabelText("Message"), { target: { value: "this is a valid message" } });
      act(() => { vi.advanceTimersByTime(600); });
      expect(screen.queryByText("Please write at least 5 words.")).not.toBeInTheDocument();
    });
  });

  describe("submit validation", () => {
    it("shows all field errors when an empty form is submitted", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.click(screen.getByRole("button", { name: "Send message" }));
      expect(screen.getByText("At least 2 characters required.")).toBeInTheDocument();
      expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
      expect(screen.getByText("Please write at least 5 words.")).toBeInTheDocument();
    });

    it("does not call fetch when client validation fails", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      await user.click(screen.getByRole("button", { name: "Send message" }));
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("form submission", () => {
    async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
      await user.type(screen.getByLabelText("Name"), "Andrew");
      await user.type(screen.getByLabelText("Email"), "andrew@example.org");
      await user.type(screen.getByLabelText("Message"), "Hello this is a test message");
      await user.click(screen.getByRole("button", { name: "Send message" }));
    }

    it("disables the button and shows 'Sending…' while the request is in flight", async () => {
      const user = userEvent.setup();
      mockFetch.mockReturnValue(new Promise(() => {}));
      render(<ContactForm />);
      await fillAndSubmit(user);
      const button = screen.getByRole("button", { name: "Sending…" });
      expect(button).toBeDisabled();
    });

    it("shows a success message after a successful submission", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue(new Response(null, { status: 200 }));
      render(<ContactForm />);
      await fillAndSubmit(user);
      await screen.findByText("Message sent! I'll get back to you soon.");
    });

    it("resets all fields after a successful submission", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue(new Response(null, { status: 200 }));
      render(<ContactForm />);
      await fillAndSubmit(user);
      await screen.findByText("Message sent! I'll get back to you soon.");
      expect(screen.getByLabelText("Name")).toHaveValue("");
      expect(screen.getByLabelText("Email")).toHaveValue("");
      expect(screen.getByLabelText("Message")).toHaveValue("");
    });

    it("shows an error message when the network request fails", async () => {
      const user = userEvent.setup();
      mockFetch.mockRejectedValue(new Error("Network error"));
      render(<ContactForm />);
      await fillAndSubmit(user);
      await screen.findByText("Network error");
    });

    it("shows the server error message from a non-OK response body", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue(
        new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 }),
      );
      render(<ContactForm />);
      await fillAndSubmit(user);
      await screen.findByText("Rate limit exceeded");
    });

    it("re-enables the submit button after the request fails", async () => {
      const user = userEvent.setup();
      mockFetch.mockRejectedValue(new Error("oops"));
      render(<ContactForm />);
      await fillAndSubmit(user);
      await screen.findByText("oops");
      expect(screen.getByRole("button", { name: "Send message" })).not.toBeDisabled();
    });
  });
});
