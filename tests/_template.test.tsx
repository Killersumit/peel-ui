import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { setReducedMotion } from "./setup";

/**
 * Standard Unit Test Template for Peel UI Components
 *
 * NOTE ON JSDOM LIMITATIONS:
 * jsdom does not calculate layout, geometry, or visual rendering.
 * Tests that depend on measured positions, element dimensions,
 * FLIP animations (e.g. GSAP Flip), or drag distances are NOT valid here
 * and must be verified in a real browser (e.g., via Playwright).
 *
 * Standard Component Checks:
 * 1. Rendering: Renders correctly with default and custom props/classes.
 * 2. Keyboard interaction: Tab, arrows, Enter/Space, Escape behave as expected.
 * 3. ARIA & Accessibility: Correct roles, states, labels, and zero axe violations.
 * 4. Reduced Motion: Behaves gracefully under prefers-reduced-motion: reduce.
 * 5. Callbacks & State: Controlled and uncontrolled state changes fire proper handlers.
 */

interface ExampleComponentProps {
  label?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  disabled?: boolean;
}

function ExampleComponent({
  label = "Action",
  defaultValue = "",
  onChange,
  disabled = false,
}: ExampleComponentProps) {
  return (
    <div role="region" aria-label="Example section">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange?.("clicked")}
      >
        {label}
      </button>
      <input
        type="text"
        aria-label="Example input"
        defaultValue={defaultValue}
      />
    </div>
  );
}

describe("Component Template: ExampleComponent", () => {
  beforeEach(() => {
    // Reset reduced motion state to default (no-preference) before each test
    setReducedMotion(false);
  });

  describe("1. Rendering", () => {
    it("renders with default props", () => {
      render(<ExampleComponent />);
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    });

    it("renders custom label when provided", () => {
      render(<ExampleComponent label="Custom Label" />);
      expect(screen.getByRole("button", { name: "Custom Label" })).toBeInTheDocument();
    });
  });

  describe("2. Keyboard & Interactions", () => {
    it("handles click and keyboard activations", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ExampleComponent onChange={handleChange} />);

      const button = screen.getByRole("button", { name: "Action" });
      await user.click(button);
      expect(handleChange).toHaveBeenCalledWith("clicked");
    });
  });

  describe("3. ARIA & Accessibility", () => {
    it("has valid accessible labels and roles", () => {
      render(<ExampleComponent />);
      expect(screen.getByRole("region", { name: "Example section" })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Example input" })).toBeInTheDocument();
    });

    it("has no axe accessibility violations", async () => {
      const { container } = render(<ExampleComponent />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("4. Reduced Motion", () => {
    it("renders and remains functional under prefers-reduced-motion: reduce", async () => {
      setReducedMotion(true);
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ExampleComponent onChange={handleChange} />);

      const button = screen.getByRole("button", { name: "Action" });
      await user.click(button);
      expect(handleChange).toHaveBeenCalledWith("clicked");
    });
  });

  describe("5. Props & Callbacks", () => {
    it("respects disabled state", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ExampleComponent disabled onChange={handleChange} />);

      const button = screen.getByRole("button", { name: "Action" });
      expect(button).toBeDisabled();
      await user.click(button);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
