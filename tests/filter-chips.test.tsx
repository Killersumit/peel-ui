import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { FilterChips, type FilterChipOption } from "@/components/ui/filter-chips";
import { setReducedMotion } from "./setup";

const sampleOptions: FilterChipOption[] = [
  { id: "all", label: "All Items", count: 12 },
  { id: "active", label: "Active", count: 8 },
  { id: "pending", label: "Pending", count: 4 },
  { id: "archived", label: "Archived", count: 0, disabled: true },
];

describe("FilterChips", () => {
  beforeEach(() => {
    setReducedMotion(false);
  });

  describe("Single selection mode", () => {
    it("renders with radiogroup role and radio chips", () => {
      render(
        <FilterChips
          options={sampleOptions}
          mode="single"
          defaultValue="all"
        />
      );

      const group = screen.getByRole("radiogroup", { name: "Filter options" });
      expect(group).toBeInTheDocument();

      const allRadio = screen.getByRole("radio", { name: /All Items/ });
      const activeRadio = screen.getByRole("radio", { name: /Active/ });

      expect(allRadio).toHaveAttribute("aria-checked", "true");
      expect(activeRadio).toHaveAttribute("aria-checked", "false");
    });

    it("supports roving tabindex and arrow key navigation", () => {
      render(
        <FilterChips
          options={sampleOptions}
          mode="single"
          defaultValue="all"
        />
      );

      const allRadio = screen.getByRole("radio", { name: /All Items/ });
      const activeRadio = screen.getByRole("radio", { name: /Active/ });

      expect(allRadio).toHaveAttribute("tabindex", "0");
      expect(activeRadio).toHaveAttribute("tabindex", "-1");

      // Press ArrowRight to move and select next enabled chip
      fireEvent.keyDown(allRadio, { key: "ArrowRight" });
      expect(activeRadio).toHaveAttribute("aria-checked", "true");
    });

    it("skips disabled options when navigating with arrow keys", () => {
      render(
        <FilterChips
          options={sampleOptions}
          mode="single"
          defaultValue="pending"
        />
      );

      const pendingRadio = screen.getByRole("radio", { name: /Pending/ });
      const allRadio = screen.getByRole("radio", { name: /All Items/ });

      // ArrowRight from pending would hit "archived" (disabled), so it loops around to "all"
      fireEvent.keyDown(pendingRadio, { key: "ArrowRight" });
      expect(allRadio).toHaveAttribute("aria-checked", "true");
    });

    it("clears selection when Reset button is clicked", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterChips
          options={sampleOptions}
          mode="single"
          defaultValue="active"
          showClear
          onChange={onChange}
        />
      );

      const clearBtn = screen.getByRole("button", { name: "Reset" });
      expect(clearBtn).toBeInTheDocument();

      await user.click(clearBtn);
      expect(onChange).toHaveBeenCalledWith("");
    });
  });

  describe("Multiple selection mode", () => {
    it("renders group role and uses aria-pressed for toggle chips", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterChips
          options={sampleOptions}
          mode="multiple"
          defaultValue={["all"]}
          onChange={onChange}
        />
      );

      const group = screen.getByRole("group", { name: "Filter options" });
      expect(group).toBeInTheDocument();

      const allChip = screen.getByRole("button", { name: /All Items/ });
      const activeChip = screen.getByRole("button", { name: /Active/ });

      expect(allChip).toHaveAttribute("aria-pressed", "true");
      expect(activeChip).toHaveAttribute("aria-pressed", "false");

      await user.click(activeChip);
      expect(onChange).toHaveBeenCalledWith(["all", "active"]);
    });

    it("selects options via keyboard Space and Enter keys", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterChips
          options={sampleOptions}
          mode="multiple"
          defaultValue={[]}
          onChange={onChange}
        />
      );

      const activeChip = screen.getByRole("button", { name: /Active/ });
      activeChip.focus();

      await user.keyboard(" ");
      expect(onChange).toHaveBeenCalledWith(["active"]);

      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith([]);
    });

    it("disables inactive options correctly", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterChips
          options={sampleOptions}
          mode="multiple"
          defaultValue={[]}
          onChange={onChange}
        />
      );

      const archivedChip = screen.getByRole("button", { name: /Archived/ });
      expect(archivedChip).toBeDisabled();

      await user.click(archivedChip);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("clears multiple selections when Reset is clicked", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterChips
          options={sampleOptions}
          mode="multiple"
          defaultValue={["all", "active"]}
          showClear
          onChange={onChange}
        />
      );

      const clearBtn = screen.getByRole("button", { name: "Reset" });
      await user.click(clearBtn);
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  describe("Accessibility and reduced motion", () => {
    it("passes axe accessibility checks in single mode", async () => {
      const { container } = render(
        <FilterChips options={sampleOptions} mode="single" defaultValue="all" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("passes axe accessibility checks in multiple mode", async () => {
      const { container } = render(
        <FilterChips
          options={sampleOptions}
          mode="multiple"
          defaultValue={["active"]}
          showClear
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("functions smoothly when reduced motion is enabled", async () => {
      setReducedMotion(true);
      const onChange = vi.fn();
      const user = userEvent.setup();

      render(
        <FilterChips
          options={sampleOptions}
          mode="single"
          defaultValue="all"
          onChange={onChange}
        />
      );

      const activeRadio = screen.getByRole("radio", { name: /Active/ });
      await user.click(activeRadio);
      expect(onChange).toHaveBeenCalledWith("active");
    });
  });
});
