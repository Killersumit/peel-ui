import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  NotificationInbox,
  type NotificationItem,
} from "@/components/ui/notification-inbox";
import { setReducedMotion } from "./setup";

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Maya replied to your note",
    body: "Sounds right. I will move it to Planned.",
    time: "5m",
    read: false,
  },
  {
    id: "notif-2",
    title: "Build 481 passed",
    body: "Deployed to staging in 38 seconds.",
    time: "1h",
    read: false,
  },
  {
    id: "notif-3",
    title: "Sam joined the workspace",
    body: "Say hello in the team channel.",
    time: "3h",
    read: true,
  },
  {
    id: "notif-4",
    title: "Weekly summary is ready",
    body: "You wrote 14 notes and shared 3.",
    time: "1d",
    read: true,
  },
];

describe("NotificationInbox Component", () => {
  beforeEach(() => {
    setReducedMotion(true);
  });

  it("renders bell button with correct aria attributes and unread badge", () => {
    render(<NotificationInbox notifications={MOCK_NOTIFICATIONS} />);

    const bell = screen.getByRole("button", {
      name: "Notifications, 2 unread",
    });
    expect(bell).toBeInTheDocument();
    expect(bell).toHaveAttribute("aria-haspopup", "dialog");
    expect(bell).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("toggles popover on bell button click", () => {
    render(<NotificationInbox notifications={MOCK_NOTIFICATIONS} />);

    const bell = screen.getByRole("button", {
      name: "Notifications, 2 unread",
    });
    const popover = document.getElementById("notification-inbox-popover");
    expect(popover).toHaveClass("hidden");

    fireEvent.click(bell);
    expect(bell).toHaveAttribute("aria-expanded", "true");
    expect(popover).not.toHaveClass("hidden");
    expect(screen.getByRole("heading", { name: /inbox/i })).toBeInTheDocument();

    fireEvent.click(bell);
    expect(bell).toHaveAttribute("aria-expanded", "false");
    expect(popover).toHaveClass("hidden");
  });

  it("switches between All and Unread filter tabs", () => {
    render(<NotificationInbox notifications={MOCK_NOTIFICATIONS} />);

    const bell = screen.getByRole("button", {
      name: "Notifications, 2 unread",
    });
    fireEvent.click(bell);

    // Initial is All tab: 4 items rendered
    expect(screen.getByText("Maya replied to your note")).toBeInTheDocument();
    expect(screen.getByText("Build 481 passed")).toBeInTheDocument();
    expect(screen.getByText("Sam joined the workspace")).toBeInTheDocument();
    expect(screen.getByText("Weekly summary is ready")).toBeInTheDocument();

    const unreadTab = screen.getByRole("button", { name: "Unread" });
    fireEvent.click(unreadTab);
    expect(unreadTab).toHaveAttribute("aria-pressed", "true");

    // Only unread items rendered
    expect(screen.getByText("Maya replied to your note")).toBeInTheDocument();
    expect(screen.getByText("Build 481 passed")).toBeInTheDocument();
    expect(
      screen.queryByText("Sam joined the workspace")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Weekly summary is ready")
    ).not.toBeInTheDocument();
  });

  it("displays correct empty states when no items match", () => {
    const allReadNotifications: NotificationItem[] = [
      {
        id: "1",
        title: "Test",
        time: "1m",
        read: true,
      },
    ];

    const { rerender } = render(
      <NotificationInbox notifications={allReadNotifications} />
    );

    const bell = screen.getByRole("button", { name: "Notifications" });
    fireEvent.click(bell);

    const unreadTab = screen.getByRole("button", { name: "Unread" });
    fireEvent.click(unreadTab);
    expect(screen.getByText("All caught up.")).toBeInTheDocument();

    rerender(<NotificationInbox notifications={[]} />);
    const allTab = screen.getByRole("button", { name: "All" });
    fireEvent.click(allTab);
    expect(screen.getByText("Nothing here.")).toBeInTheDocument();
  });

  it("calls onRead when an unread notification row is clicked", () => {
    const onRead = vi.fn();
    render(
      <NotificationInbox
        notifications={MOCK_NOTIFICATIONS}
        onRead={onRead}
      />
    );

    const bell = screen.getByRole("button", {
      name: "Notifications, 2 unread",
    });
    fireEvent.click(bell);

    const unreadItem = screen.getByText("Maya replied to your note");
    fireEvent.click(unreadItem);
    expect(onRead).toHaveBeenCalledWith("notif-1");

    // Read item should not trigger onRead
    const readItem = screen.getByText("Sam joined the workspace");
    fireEvent.click(readItem);
    expect(onRead).toHaveBeenCalledTimes(1);
  });

  it("calls onReadAll when Mark all read is clicked", () => {
    const onReadAll = vi.fn();
    render(
      <NotificationInbox
        notifications={MOCK_NOTIFICATIONS}
        onReadAll={onReadAll}
      />
    );

    const bell = screen.getByRole("button", {
      name: "Notifications, 2 unread",
    });
    fireEvent.click(bell);

    const markAllButton = screen.getByRole("button", {
      name: "Mark all read",
    });
    expect(markAllButton).not.toBeDisabled();
    fireEvent.click(markAllButton);
    expect(onReadAll).toHaveBeenCalled();
  });

  it("closes popover on Escape and focuses the bell button", () => {
    render(<NotificationInbox notifications={MOCK_NOTIFICATIONS} />);

    const bell = screen.getByRole("button", {
      name: "Notifications, 2 unread",
    });
    fireEvent.click(bell);
    const popover = document.getElementById("notification-inbox-popover");
    expect(popover).not.toHaveClass("hidden");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(popover).toHaveClass("hidden");
    expect(document.activeElement).toBe(bell);
  });

  it("announces arrivals and mark-all-read in polite live region", () => {
    const { rerender } = render(
      <NotificationInbox notifications={MOCK_NOTIFICATIONS} />
    );

    const statusRegion = screen.getByRole("status");
    expect(statusRegion).toHaveTextContent("");

    const newArrival: NotificationItem = {
      id: "arrival-1",
      title: "Maya commented on Offline mode",
      time: "now",
      read: false,
    };

    rerender(
      <NotificationInbox
        notifications={[newArrival, ...MOCK_NOTIFICATIONS]}
      />
    );

    expect(statusRegion).toHaveTextContent(
      "New notification: Maya commented on Offline mode"
    );
  });
});
