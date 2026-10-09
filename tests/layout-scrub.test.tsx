import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LayoutScrub, type LayoutScrubItem } from "@/components/ui/layout-scrub";
import { setReducedMotion } from "./setup";

const TEST_ITEMS: LayoutScrubItem[] = [
  {
    id: "studio",
    title: "Studio",
    meta: "Portfolio",
    trailing: "Free",
    thumbnail: <div data-testid="thumb-studio">Studio Thumb</div>,
  },
  {
    id: "atlas",
    title: "Atlas",
    meta: "Dashboard",
    trailing: "$29",
    thumbnail: <div data-testid="thumb-atlas">Atlas Thumb</div>,
  },
];

describe("LayoutScrub Component", () => {
  beforeEach(() => {
    setReducedMotion(true);
  });

  it("renders with heading, caption, radio options, and items", () => {
    render(
      <LayoutScrub
        items={TEST_ITEMS}
        heading="Templates"
        caption="2 templates"
        defaultView="list"
      />
    );

    expect(screen.getByText("Templates")).toBeInTheDocument();
    expect(screen.getByText("2 templates")).toBeInTheDocument();
    expect(screen.getByText("Studio")).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Atlas")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]).toHaveAttribute("tabindex", "0");
    expect(radios[1]).toHaveAttribute("aria-checked", "false");
    expect(radios[1]).toHaveAttribute("tabindex", "-1");
  });

  it("clicking Grid radio updates selection and calls onViewChange", () => {
    const onViewChange = vi.fn();
    render(
      <LayoutScrub
        items={TEST_ITEMS}
        defaultView="list"
        onViewChange={onViewChange}
      />
    );

    const gridRadio = screen.getByRole("radio", { name: /grid/i });
    fireEvent.click(gridRadio);

    expect(onViewChange).toHaveBeenCalledWith("grid");
    expect(gridRadio).toHaveAttribute("aria-checked", "true");
    expect(gridRadio).toHaveAttribute("tabindex", "0");
  });

  it("supports keyboard navigation with arrow keys", () => {
    const onViewChange = vi.fn();
    render(
      <LayoutScrub
        items={TEST_ITEMS}
        defaultView="list"
        onViewChange={onViewChange}
      />
    );

    const listRadio = screen.getByRole("radio", { name: /list/i });
    listRadio.focus();

    fireEvent.keyDown(listRadio, { key: "ArrowRight" });
    expect(onViewChange).toHaveBeenCalledWith("grid");

    const gridRadio = screen.getByRole("radio", { name: /grid/i });
    fireEvent.keyDown(gridRadio, { key: "ArrowLeft" });
    expect(onViewChange).toHaveBeenCalledWith("list");
  });

  it("controlled view mode respects view prop", () => {
    const { rerender } = render(
      <LayoutScrub
        items={TEST_ITEMS}
        view="list"
      />
    );

    const listRadio = screen.getByRole("radio", { name: /list/i });
    const gridRadio = screen.getByRole("radio", { name: /grid/i });
    expect(listRadio).toHaveAttribute("aria-checked", "true");
    expect(gridRadio).toHaveAttribute("aria-checked", "false");

    rerender(
      <LayoutScrub
        items={TEST_ITEMS}
        view="grid"
      />
    );

    expect(listRadio).toHaveAttribute("aria-checked", "false");
    expect(gridRadio).toHaveAttribute("aria-checked", "true");
  });
});
