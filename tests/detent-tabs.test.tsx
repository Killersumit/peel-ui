import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DetentTabs, type DetentTabsRange } from "@/components/ui/detent-tabs";
import { setReducedMotion } from "./setup";

const TEST_RANGES: DetentTabsRange[] = [
  {
    id: "7d",
    label: "7 days",
    value: 9420,
    delta: "+3.1%",
    points: [4, 5, 4, 7, 6, 8, 7, 9, 11, 10, 12, 14],
    axis: ["Mon", "Wed", "Fri"],
  },
  {
    id: "30d",
    label: "30 days",
    value: 48210,
    delta: "+12.4%",
    points: [20, 22, 21, 25, 24, 23, 28, 30, 29, 34, 33, 38],
    axis: ["Sep 8", "Sep 18", "Sep 28"],
  },
  {
    id: "90d",
    label: "90 days",
    value: 131860,
    delta: "+27.8%",
    points: [10, 12, 11, 16, 15, 22, 20, 28, 36, 34, 45, 52],
    axis: ["Jul", "Aug", "Sep"],
  },
];

describe("DetentTabs Component", () => {
  beforeEach(() => {
    setReducedMotion(true);
  });

  it("renders with title, value, delta chip, tabs and axis labels", () => {
    render(
      <DetentTabs
        ranges={TEST_RANGES}
        title="Revenue"
        formatValue={(n) => `$${n.toLocaleString("en-US")}`}
        defaultIndex={1}
      />
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$48,210")).toBeInTheDocument();
    expect(screen.getByText("+12.4%")).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("tabindex", "0");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[0]).toHaveAttribute("tabindex", "-1");

    expect(screen.getByText("Sep 8")).toBeInTheDocument();
    expect(screen.getByText("Sep 18")).toBeInTheDocument();
    expect(screen.getByText("Sep 28")).toBeInTheDocument();
  });

  it("clicking a tab updates selection and invokes onIndexChange", () => {
    const onIndexChange = vi.fn();
    render(
      <DetentTabs
        ranges={TEST_RANGES}
        defaultIndex={1}
        onIndexChange={onIndexChange}
      />
    );

    const firstTab = screen.getByRole("tab", { name: /7 days/i });
    fireEvent.click(firstTab);

    expect(onIndexChange).toHaveBeenCalledWith(0);
    expect(firstTab).toHaveAttribute("aria-selected", "true");
    expect(firstTab).toHaveAttribute("tabindex", "0");
  });

  it("supports keyboard navigation with ArrowRight, ArrowLeft, Home, and End", () => {
    const onIndexChange = vi.fn();
    render(
      <DetentTabs
        ranges={TEST_RANGES}
        defaultIndex={0}
        onIndexChange={onIndexChange}
      />
    );

    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(onIndexChange).toHaveBeenCalledWith(1);

    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(onIndexChange).toHaveBeenCalledWith(2);

    fireEvent.keyDown(tabs[2], { key: "ArrowLeft" });
    expect(onIndexChange).toHaveBeenCalledWith(1);

    fireEvent.keyDown(tabs[1], { key: "Home" });
    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("announces committed range via polite live region", () => {
    const { container } = render(
      <DetentTabs
        ranges={TEST_RANGES}
        formatValue={(n) => `$${n.toLocaleString("en-US")}`}
        defaultIndex={1}
      />
    );

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion?.textContent).toBe("30 days: $48,210, +12.4%");
  });

  it("controlled index mode synchronizes with parent prop", () => {
    const { rerender } = render(
      <DetentTabs
        ranges={TEST_RANGES}
        index={0}
      />
    );

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    rerender(
      <DetentTabs
        ranges={TEST_RANGES}
        index={2}
      />
    );

    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
  });
});
