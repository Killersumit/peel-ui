import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RoadmapVote, type RoadmapVoteItem } from "@/components/ui/roadmap-vote";
import { setReducedMotion } from "./setup";

const TEST_ITEMS: RoadmapVoteItem[] = [
  {
    id: "item-1",
    title: "Feature Alpha",
    description: "Alpha description.",
    status: "Planned",
    votes: 100,
  },
  {
    id: "item-2",
    title: "Feature Beta",
    description: "Beta description.",
    status: "In progress",
    votes: 99,
  },
  {
    id: "item-3",
    title: "Feature Gamma",
    status: "Under review",
    votes: 50,
  },
];

describe("RoadmapVote Component", () => {
  beforeEach(() => {
    setReducedMotion(true);
  });

  it("renders heading, caption, and sorted items", () => {
    render(
      <RoadmapVote
        items={TEST_ITEMS}
        heading="Roadmap Title"
        caption="Vote on features below."
      />
    );

    expect(screen.getByText("Roadmap Title")).toBeInTheDocument();
    expect(screen.getByText("Vote on features below.")).toBeInTheDocument();
    expect(screen.getByText("Feature Alpha")).toBeInTheDocument();
    expect(screen.getByText("Feature Beta")).toBeInTheDocument();
    expect(screen.getByText("Feature Gamma")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("100");
    expect(buttons[1]).toHaveTextContent("99");
    expect(buttons[2]).toHaveTextContent("50");
  });

  it("highlights active status in text-foreground", () => {
    render(
      <RoadmapVote
        items={TEST_ITEMS}
        activeStatus="In progress"
      />
    );

    const inProgress = screen.getByText("In progress");
    expect(inProgress).toHaveClass("text-foreground");

    const planned = screen.getByText("Planned");
    expect(planned).toHaveClass("text-muted-foreground");
  });

  it("toggles vote, updates label, fires onVote, and re-sorts item to top on tie", () => {
    const onVote = vi.fn();
    render(
      <RoadmapVote
        items={TEST_ITEMS}
        onVote={onVote}
      />
    );

    // Initial order: Feature Alpha (100) at top, Feature Beta (99) second
    let items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Feature Alpha");
    expect(items[1]).toHaveTextContent("Feature Beta");

    // Click vote on Feature Beta (99)
    const betaBtn = screen.getByRole("button", { name: /Feature Beta/ });
    fireEvent.click(betaBtn);

    expect(onVote).toHaveBeenCalledWith("item-2", true);

    // Beta votes become 100 and voted=true. With Alpha at 100 (unvoted), Beta wins tie and climbs to #1
    items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Feature Beta");
    expect(items[1]).toHaveTextContent("Feature Alpha");

    expect(screen.getByText("your vote")).toBeInTheDocument();

    // Click again to remove vote
    fireEvent.click(betaBtn);
    expect(onVote).toHaveBeenCalledWith("item-2", false);

    // Beta drops back to 99, Alpha returns to #1
    items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Feature Alpha");
    expect(items[1]).toHaveTextContent("Feature Beta");
  });

  it("handles initial voted=true state correctly", () => {
    const itemsWithVoted: RoadmapVoteItem[] = [
      {
        id: "item-1",
        title: "Feature One",
        votes: 10,
        voted: true,
      },
      {
        id: "item-2",
        title: "Feature Two",
        votes: 8,
      },
    ];

    render(<RoadmapVote items={itemsWithVoted} />);

    // Item 1 is already voted, so vote count is 10 and label is "your vote"
    expect(screen.getByText("your vote")).toBeInTheDocument();

    // Clicking it unvotes it -> 10 - 1 = 9
    const btn = screen.getByRole("button", { name: /Feature One/ });
    fireEvent.click(btn);

    expect(btn).toHaveTextContent("9");
  });
});
