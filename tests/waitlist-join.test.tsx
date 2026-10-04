import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WaitlistJoin } from "@/components/ui/waitlist-join";
import { setReducedMotion } from "./setup";

describe("WaitlistJoin Component", () => {
  beforeEach(() => {
    setReducedMotion(false);
  });

  it("invalid email shows the message and does not call onSubmit", async () => {
    const onSubmit = vi.fn();
    render(<WaitlistJoin onSubmit={onSubmit} />);

    const button = screen.getByRole("button", { name: /join/i });
    fireEvent.click(button);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
  });

  it("a valid email calls onSubmit exactly once with the trimmed value", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ position: 1285 });
    render(<WaitlistJoin onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "  test@example.com  ");
    const button = screen.getByRole("button", { name: /join/i });
    await user.click(button);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("position shown from the result", async () => {
    const user = userEvent.setup();
    const onSubmitWithPos = vi.fn().mockResolvedValue({ position: 42 });
    render(<WaitlistJoin count={100} onSubmit={onSubmitWithPos} />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "user@example.com");
    await user.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(screen.getByText("#42")).toBeInTheDocument();
    });
  });

  it("position shown as count + 1 if no position returned", async () => {
    const user = userEvent.setup();
    const onSubmitNoPos = vi.fn().mockResolvedValue(undefined);
    render(<WaitlistJoin count={100} onSubmit={onSubmitNoPos} />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "user2@example.com");
    await user.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(screen.getByText("#101")).toBeInTheDocument();
    });
  });

  it("a rejection keeps the email and shows the error", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Fail"));
    render(<WaitlistJoin onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Email address") as HTMLInputElement;
    await user.type(input, "fail@example.com");
    await user.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Couldn't join. Try again.");
      expect(input.value).toBe("fail@example.com");
      expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    });
  });

  it("double submit is ignored while submitting", async () => {
    let resolveSubmit: (val: { position: number }) => void = () => {};
    const onSubmit = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<WaitlistJoin onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Email address");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    const form = input.closest("form")!;

    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    resolveSubmit({ position: 100 });
  });

  it("focus moves as specified", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ position: 50 });
    render(<WaitlistJoin onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "focus@example.com");
    await user.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      const card = screen.getByText("You're in").closest("[tabindex='-1']");
      expect(document.activeElement).toBe(card);
    });
  });

  it("live region text announces submission and result", async () => {
    const user = userEvent.setup();
    let resolveSubmit: (val: { position: number }) => void = () => {};
    const onSubmit = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<WaitlistJoin onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Email address");
    await user.type(input, "live@example.com");
    await user.click(screen.getByRole("button", { name: /join/i }));

    const liveRegion = document.querySelector("[aria-live='polite']");
    expect(liveRegion?.textContent).toBe("Joining the waitlist");

    resolveSubmit({ position: 200 });

    await waitFor(() => {
      expect(liveRegion?.textContent).toBe("You're in. Your place is 200.");
    });
  });

  it("reduced motion path renders final values immediately", async () => {
    setReducedMotion(true);
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ position: 300 });
    render(<WaitlistJoin onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Email address");
    await user.type(input, "motion@example.com");
    await user.click(screen.getByRole("button", { name: /join/i }));

    await waitFor(() => {
      expect(screen.getByText("#300")).toBeInTheDocument();
    });
  });

  it("no avatar image alt text", () => {
    render(
      <WaitlistJoin
        avatars={[
          { name: "Maya R", src: "https://example.com/avatar.jpg" },
        ]}
      />
    );

    const img = document.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute("alt")).toBe("");
  });
});
