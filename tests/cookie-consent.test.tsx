import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { setReducedMotion } from "./setup";
import { CookieConsent } from "@/components/ui/cookie-consent";

describe("CookieConsent", () => {
  beforeEach(() => {
    setReducedMotion(false);
    document.cookie = "";
    localStorage.clear();
  });

  describe("Core actions & onSave callbacks", () => {
    it("Accept all calls onSave once with every category true", async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(<CookieConsent onSave={handleSave} />);

      const acceptButton = screen.getByRole("button", { name: "Accept all" });
      await user.click(acceptButton);

      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith({
        essential: true,
        analytics: true,
        marketing: true,
      });
    });

    it("Reject all calls onSave once with required categories true and optional false", async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(<CookieConsent onSave={handleSave} />);

      const rejectButton = screen.getByRole("button", { name: "Reject all" });
      await user.click(rejectButton);

      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith({
        essential: true,
        analytics: false,
        marketing: false,
      });
    });

    it("Save choices calls onSave once with the current switch states", async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(<CookieConsent onSave={handleSave} />);

      await user.click(screen.getByRole("button", { name: /customize/i }));

      const analyticsSwitch = await screen.findByRole("switch", { name: "Analytics" });
      expect(analyticsSwitch).toHaveAttribute("aria-checked", "false");

      await user.click(analyticsSwitch);
      expect(analyticsSwitch).toHaveAttribute("aria-checked", "true");

      const saveChoicesButton = screen.getByRole("button", { name: "Save choices" });
      await user.click(saveChoicesButton);

      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith({
        essential: true,
        analytics: true,
        marketing: false,
      });
    });

    it("Changing a switch in CHOICES does NOT call onSave yet", async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(<CookieConsent onSave={handleSave} />);

      await user.click(screen.getByRole("button", { name: /customize/i }));

      const analyticsSwitch = await screen.findByRole("switch", { name: "Analytics" });
      await user.click(analyticsSwitch);

      expect(handleSave).not.toHaveBeenCalled();
    });

    it("Controlled value updates reflect in the switches without calling onSave", async () => {
      const user = userEvent.setup();
      const handleSave = vi.fn();
      const { rerender } = render(
        <CookieConsent
          value={{ essential: true, analytics: false, marketing: false }}
          onSave={handleSave}
        />
      );

      await user.click(screen.getByRole("button", { name: /customize/i }));

      const analyticsSwitch = await screen.findByRole("switch", { name: "Analytics" });
      expect(analyticsSwitch).toHaveAttribute("aria-checked", "false");

      rerender(
        <CookieConsent
          value={{ essential: true, analytics: true, marketing: false }}
          onSave={handleSave}
        />
      );

      expect(analyticsSwitch).toHaveAttribute("aria-checked", "true");
      expect(handleSave).not.toHaveBeenCalled();
    });
  });

  describe("Navigation & Keyboard interactions", () => {
    it("Pressing Escape in BANNER does nothing", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      expect(screen.getByText("We use cookies")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(screen.getByText("We use cookies")).toBeInTheDocument();
    });

    it("Pressing Escape in CHOICES returns to BANNER", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      await user.click(screen.getByRole("button", { name: /customize/i }));
      const heading = await screen.findByRole("heading", { name: "Cookie choices" });
      expect(heading).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.getByText("We use cookies")).toBeInTheDocument();
      });
    });

    it("Pressing Escape in CHOICES returns to BUTTON if opened from BUTTON", async () => {
      const user = userEvent.setup();
      render(<CookieConsent defaultView="button" />);

      const triggerBtn = screen.getByRole("button", { name: "Cookie settings" });
      await user.click(triggerBtn);

      const heading = await screen.findByRole("heading", { name: "Cookie choices" });
      expect(heading).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Cookie settings" })).toBeInTheDocument();
      });
    });

    it("Focus shifts to the 'Cookie choices' heading when opening CHOICES", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      await user.click(screen.getByRole("button", { name: /customize/i }));

      const heading = await screen.findByRole("heading", { name: "Cookie choices" });
      await waitFor(() => {
        expect(heading).toHaveFocus();
      });
    });

    it("defaultView='button' starts in button view", () => {
      render(<CookieConsent defaultView="button" />);
      expect(screen.getByRole("button", { name: "Cookie settings" })).toBeInTheDocument();
      expect(screen.queryByText("We use cookies")).not.toBeInTheDocument();
    });
  });

  describe("Feedback, Storage & Accessibility", () => {
    it("Live polite region announces 'Preferences saved' on save", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      const politeRegion = screen.getByRole("status");
      expect(politeRegion).toHaveTextContent("");

      const acceptButton = screen.getByRole("button", { name: "Accept all" });
      await user.click(acceptButton);

      expect(politeRegion).toHaveTextContent("Preferences saved");
      expect(screen.getByText("Preferences saved")).toBeInTheDocument();
    });

    it("Nothing is written to document.cookie or localStorage", async () => {
      const user = userEvent.setup();
      render(<CookieConsent />);

      await user.click(screen.getByRole("button", { name: "Accept all" }));

      expect(document.cookie).toBe("");
      expect(localStorage.length).toBe(0);
    });

    it("Reduced motion path behaves as specified", async () => {
      setReducedMotion(true);
      const user = userEvent.setup();
      const handleSave = vi.fn();
      render(<CookieConsent onSave={handleSave} />);

      expect(screen.getByText("We use cookies")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Accept all" }));

      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Preferences saved")).toBeInTheDocument();
    });

    it("has valid accessible labels and zero axe violations in banner view", async () => {
      const { container } = render(<CookieConsent policyHref="/privacy" />);
      expect(screen.getByRole("region", { name: "Cookie consent" })).toBeInTheDocument();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has zero axe violations in choices view", async () => {
      const user = userEvent.setup();
      const { container } = render(<CookieConsent />);
      await user.click(screen.getByRole("button", { name: /customize/i }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
