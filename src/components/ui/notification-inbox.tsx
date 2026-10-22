"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  time: string;
  read: boolean;
}

export interface NotificationInboxProps {
  notifications: NotificationItem[];
  onRead?: (id: string) => void;
  onReadAll?: () => void;
  className?: string;
}

export function NotificationInbox({
  notifications,
  onRead,
  onReadAll,
  className,
}: NotificationInboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [announcement, setAnnouncement] = React.useState("");

  const containerRef = React.useRef<HTMLDivElement>(null);
  const bellRef = React.useRef<HTMLButtonElement>(null);
  const seenIdsRef = React.useRef<Set<string>>(new Set());
  const isInitialMount = React.useRef(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    // Detect arrivals after initial mount without announcing the initial list
    if (isInitialMount.current) {
      isInitialMount.current = false;
      notifications.forEach((n) => seenIdsRef.current.add(n.id));
      return;
    }

    for (const item of notifications) {
      if (!item.read && !seenIdsRef.current.has(item.id)) {
        setAnnouncement(`New notification: ${item.title}`);
        break;
      }
    }
    notifications.forEach((n) => seenIdsRef.current.add(n.id));
  }, [notifications]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        bellRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const displayedNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAllRead = () => {
    setAnnouncement("All notifications marked as read");
    onReadAll?.();
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <button
        ref={bellRef}
        type="button"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="notification-inbox-popover"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center w-12 h-12 bg-transparent text-foreground border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transformOrigin: "50% 6%" }}
          aria-hidden="true"
        >
          <path d="M6 16.5h12l-1.6-2.2V10a4.4 4.4 0 0 0-8.8 0v4.3L6 16.5z" />
          <path d="M10 19.6a2 2 0 0 0 4 0" />
        </svg>

        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1 right-0.5 min-w-[20px] h-5 px-[5px] flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold leading-none select-none overflow-hidden transition-transform",
            unreadCount === 0 && "scale-0 invisible"
          )}
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      </button>

      <div
        id="notification-inbox-popover"
        role="dialog"
        aria-label="Notifications"
        className={cn(
          "absolute right-0 top-full mt-2 w-[min(380px,calc(100vw-32px))] max-h-[min(480px,72vh)] flex flex-col bg-background border border-foreground rounded-none shadow-none z-50",
          !isOpen && "hidden"
        )}
      >
        <header className="p-[16px_18px_12px] border-b border-border flex items-end justify-between">
          <h2 className="text-[34px] font-black uppercase leading-[0.9] tracking-tight [font-stretch:62%] select-none m-0">
            Inbox
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filter === "all"
                  ? "text-foreground border-b-[1.5px] border-foreground pb-0.5"
                  : "text-muted-foreground hover:text-foreground pb-[2px]"
              )}
            >
              All
            </button>
            <button
              type="button"
              aria-pressed={filter === "unread"}
              onClick={() => setFilter("unread")}
              className={cn(
                "text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filter === "unread"
                  ? "text-foreground border-b-[1.5px] border-foreground pb-0.5"
                  : "text-muted-foreground hover:text-foreground pb-[2px]"
              )}
            >
              Unread
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {displayedNotifications.length === 0 ? (
            <div className="py-10 px-[22px] text-[28px] font-extrabold uppercase text-muted-foreground leading-tight select-none">
              {filter === "all" ? "Nothing here." : "All caught up."}
            </div>
          ) : (
            displayedNotifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!item.read) onRead?.(item.id);
                }}
                className="w-full text-left relative p-[14px_18px_14px_22px] border-b border-border bg-transparent hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors block"
              >
                <span
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 bg-primary origin-left",
                    item.read ? "scale-x-0" : "scale-x-100"
                  )}
                  aria-hidden="true"
                />
                <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-2">
                  <span
                    className={cn(
                      "text-[15px] leading-tight",
                      item.read
                        ? "font-medium text-muted-foreground"
                        : "font-bold text-foreground"
                    )}
                  >
                    {item.title}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] tabular-nums text-muted-foreground shrink-0">
                    {item.time}
                  </span>
                  {item.body && (
                    <p className="col-span-2 text-[14px] leading-snug text-muted-foreground mt-1 mb-0">
                      {item.body}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <footer className="p-[12px_18px] border-t border-border flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {unreadCount === 0 ? "No unread" : `${unreadCount} unread`}
          </span>
          <button
            type="button"
            disabled={unreadCount === 0}
            onClick={handleMarkAllRead}
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground hover:text-muted-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Mark all read
          </button>
        </footer>
      </div>
    </div>
  );
}
