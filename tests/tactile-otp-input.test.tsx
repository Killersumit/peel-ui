import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { TactileOtpInput } from "@/components/ui/tactile-otp-input";
import { setReducedMotion } from "./setup";

describe("TactileOtpInput", () => {
  beforeEach(() => {
    setReducedMotion(false);
  });

  it("renders with correct ARIA attributes and default initial values", () => {
    render(<TactileOtpInput length={4} initialValues={["", "", "", ""]} />);
    const input = screen.getByLabelText("Verification PIN code");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveAttribute("maxlength", "4");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
  });

  it("handles typing digits into slots sequentially", async () => {
    const user = userEvent.setup();
    render(<TactileOtpInput length={4} initialValues={["", "", "", ""]} />);
    const input = screen.getByLabelText("Verification PIN code");

    await user.type(input, "12");
    expect(input).toHaveValue("12");
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("handles backspace across slots", async () => {
    const user = userEvent.setup();
    render(<TactileOtpInput length={4} initialValues={["", "", "", ""]} />);
    const input = screen.getByLabelText("Verification PIN code");

    await user.type(input, "123");
    expect(input).toHaveValue("123");

    await user.type(input, "{backspace}");
    expect(input).toHaveValue("12");
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("3")).not.toBeInTheDocument();
    });
  });

  it("supports arrow key navigation across slots", () => {
    render(<TactileOtpInput length={4} initialValues={["1", "2", "", ""]} />);
    const input = screen.getByLabelText("Verification PIN code");

    fireEvent.keyDown(input, { key: "ArrowLeft" });
    fireEvent.keyDown(input, { key: "ArrowRight" });
    expect(input).toBeInTheDocument();
  });

  it("handles paste of digits and strips non-digits correctly", () => {
    const onComplete = vi.fn();
    render(
      <TactileOtpInput
        length={4}
        initialValues={["", "", "", ""]}
        onComplete={onComplete}
      />
    );
    const input = screen.getByLabelText("Verification PIN code");

    // Simulate pasting dirty string with non-digits
    fireEvent.change(input, { target: { value: "9a-b8c7d6" } });

    expect(input).toHaveValue("9876");
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("fires onComplete exactly once when all slots are populated", async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(
      <TactileOtpInput
        length={4}
        initialValues={["", "", "", ""]}
        onComplete={onComplete}
      />
    );
    const input = screen.getByLabelText("Verification PIN code");

    await user.type(input, "4567");
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith("4567");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <TactileOtpInput length={4} initialValues={["1", "2", "3", ""]} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("functions properly under prefers-reduced-motion: reduce", async () => {
    setReducedMotion(true);
    const onComplete = vi.fn();
    const user = userEvent.setup();

    render(
      <TactileOtpInput
        length={4}
        initialValues={["", "", "", ""]}
        onComplete={onComplete}
      />
    );
    const input = screen.getByLabelText("Verification PIN code");

    await user.type(input, "9012");
    expect(input).toHaveValue("9012");
    expect(onComplete).toHaveBeenCalledWith("9012");
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
