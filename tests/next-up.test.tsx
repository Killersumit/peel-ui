import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextUp, type NextUpStep } from "@/components/ui/next-up";
import { setReducedMotion } from "./setup";

const TEST_STEPS: NextUpStep[] = [
  {
    id: "1",
    title: "Create workspace",
    description: "Setup workspace.",
    actionLabel: "Create",
    duration: "1 min",
  },
  {
    id: "2",
    title: "Connect domain",
    description: "Add DNS.",
    actionLabel: "Connect",
    duration: "2 min",
  },
  {
    id: "3",
    title: "Invite team",
    description: "Send invite.",
    actionLabel: "Invite",
    duration: "1 min",
  },
];

describe("NextUp Component", () => {
  beforeEach(() => {
    setReducedMotion(true);
  });

  it("renders with current step open and finished steps at bottom", () => {
    render(<NextUp steps={TEST_STEPS} defaultCompletedIds={["1"]} />);

    expect(screen.getByText("1 of 3 done")).toBeInTheDocument();
    expect(screen.getByText("1/3")).toBeInTheDocument();

    const currentItem = screen
      .getAllByRole("listitem")
      .find((el) => el.getAttribute("aria-current") === "step");
    expect(currentItem).toBeDefined();
    expect(currentItem).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("Connect domain")).toBeInTheDocument();
    expect(screen.getByText("Add DNS.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Connect" })).toBeInTheDocument();

    expect(screen.getByText("Later")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("completing current step calls onStepComplete and advances to next step", async () => {
    const onStepComplete = vi.fn();
    render(
      <NextUp
        steps={TEST_STEPS}
        defaultCompletedIds={["1"]}
        onStepComplete={onStepComplete}
      />
    );

    const button = screen.getByRole("button", { name: "Connect" });
    fireEvent.click(button);

    expect(onStepComplete).toHaveBeenCalledWith("2");
    await waitFor(() => {
      expect(screen.getByText("2 of 3 done")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
  });

  it("shows doneMessage when all steps are completed", async () => {
    render(
      <NextUp
        steps={TEST_STEPS}
        defaultCompletedIds={["1", "2"]}
        doneMessage="All complete!"
      />
    );

    const button = screen.getByRole("button", { name: "Invite" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("All complete!")).toBeInTheDocument();
      expect(screen.getByText("3 of 3 done")).toBeInTheDocument();
    });
  });

  it("announces completion via live polite region", async () => {
    render(<NextUp steps={TEST_STEPS} defaultCompletedIds={[]} />);

    const button = screen.getByRole("button", { name: "Create" });
    fireEvent.click(button);

    await waitFor(() => {
      const liveRegion = screen.getByText("Create workspace done. 1 of 3 done.");
      expect(liveRegion).toBeInTheDocument();
    });
  });

  it("controlled completedIds reflects parent state", () => {
    const { rerender } = render(
      <NextUp steps={TEST_STEPS} completedIds={["1"]} />
    );

    expect(screen.getByText("1 of 3 done")).toBeInTheDocument();
    expect(screen.getByText("Connect domain")).toBeInTheDocument();

    rerender(<NextUp steps={TEST_STEPS} completedIds={["1", "2"]} />);
    expect(screen.getByText("2 of 3 done")).toBeInTheDocument();
    expect(screen.getByText("Invite team")).toBeInTheDocument();
  });
});
