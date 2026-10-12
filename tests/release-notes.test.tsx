import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ReleaseNotes, type ReleaseItem } from "@/components/ui/release-notes";
import { setReducedMotion } from "./setup";

const TEST_RELEASES: ReleaseItem[] = [
  {
    version: "2.4",
    date: "Oct 6, 2026",
    title: "Work offline",
    changes: [
      {
        tag: "New",
        lead: "Write on the train.",
        detail: "Everything syncs when you are back.",
      },
      {
        tag: "Improved",
        lead: "Search is twice as fast",
        detail: "on long notes.",
      },
      {
        tag: "Fixed",
        lead: "Pasted images",
        detail: "no longer lose their size.",
      },
    ],
  },
  {
    version: "2.3",
    date: "Sep 15, 2026",
    title: "Share a note as a link",
    changes: [
      {
        tag: "New",
        lead: "Anyone with the link can read.",
        detail: "Nobody can edit.",
      },
    ],
  },
];

describe("ReleaseNotes Component", () => {
  beforeEach(() => {
    setReducedMotion(true);
  });

  it("renders releases with titles, tags, leads, and details", () => {
    render(<ReleaseNotes releases={TEST_RELEASES} />);

    expect(screen.getByText("Work offline")).toBeInTheDocument();
    expect(screen.getByText("Share a note as a link")).toBeInTheDocument();
    expect(screen.getByText("Write on the train.")).toBeInTheDocument();
    expect(screen.getByText(/Everything syncs when you are back\./)).toBeInTheDocument();
    expect(screen.getByText("Search is twice as fast")).toBeInTheDocument();
    expect(screen.getByText("Pasted images")).toBeInTheDocument();
  });

  it("renders band with version numeral and 'Latest release' for initial release", () => {
    const { container } = render(<ReleaseNotes releases={TEST_RELEASES} />);

    expect(screen.getByText("Latest release")).toBeInTheDocument();
    expect(screen.getByText("Oct 6, 2026")).toBeInTheDocument();

    const sections = container.querySelectorAll("section");
    expect(sections[0]).toHaveClass("opacity-100");
    expect(sections[1]).toHaveClass("opacity-[0.38]");
  });

  it("highlights specified tag in text-foreground and others in text-muted-foreground", () => {
    render(<ReleaseNotes releases={TEST_RELEASES} highlightTag="New" />);

    const newTags = screen.getAllByText("New");
    newTags.forEach((tag) => {
      expect(tag).toHaveClass("text-foreground");
    });

    const improvedTag = screen.getByText("Improved");
    expect(improvedTag).toHaveClass("text-muted-foreground");

    const fixedTag = screen.getByText("Fixed");
    expect(fixedTag).toHaveClass("text-muted-foreground");
  });

  it("respects custom highlightTag prop", () => {
    render(<ReleaseNotes releases={TEST_RELEASES} highlightTag="Improved" />);

    const improvedTag = screen.getByText("Improved");
    expect(improvedTag).toHaveClass("text-foreground");

    const newTags = screen.getAllByText("New");
    newTags.forEach((tag) => {
      expect(tag).toHaveClass("text-muted-foreground");
    });
  });

  it("configures own-scroll accessibility when height is provided", () => {
    render(<ReleaseNotes releases={TEST_RELEASES} height={600} />);

    const region = screen.getByRole("region", { name: "Release notes" });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveClass("overflow-y-auto");
    expect(region).toHaveClass("rounded-[20px]");
    expect(region).toHaveClass("border-border");
  });

  it("does not render region wrapper when height is omitted", () => {
    render(<ReleaseNotes releases={TEST_RELEASES} />);

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("includes sr-only version announcements in heading elements", () => {
    render(<ReleaseNotes releases={TEST_RELEASES} />);

    expect(
      screen.getByText("Version 2.4, Oct 6, 2026:")
    ).toHaveClass("sr-only");
    expect(
      screen.getByText("Version 2.3, Sep 15, 2026:")
    ).toHaveClass("sr-only");
  });
});
