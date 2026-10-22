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

function checkReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatBadge(val: number): string {
  return val > 9 ? "9+" : String(val);
}

export function NotificationInbox({
  notifications,
  onRead,
  onReadAll,
  className,
}: NotificationInboxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [announcement, setAnnouncement] = React.useState("");
  const [pendingRemovalIds, setPendingRemovalIds] = React.useState<Set<string>>(
    () => new Set()
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const bellRef = React.useRef<HTMLButtonElement>(null);
  const bellGlyphRef = React.useRef<SVGSVGElement>(null);
  const badgeRef = React.useRef<HTMLSpanElement>(null);
  const badgeRollerRef = React.useRef<HTMLSpanElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const bellAnimRef = React.useRef<Animation | null>(null);

  const rowButtonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const barRefs = React.useRef<Map<string, HTMLSpanElement>>(new Map());

  const [expandingArrivalId, setExpandingArrivalId] = React.useState<string | null>(null);
  const [arrivalIsExpanded, setArrivalIsExpanded] = React.useState(false);

  const seenIdsRef = React.useRef<Set<string>>(new Set());
  const isInitialMount = React.useRef(true);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const prevCountRef = React.useRef(unreadCount);

  const ringBell = React.useCallback(() => {
    if (checkReducedMotion()) return;
    const el = bellGlyphRef.current;
    if (!el || typeof el.animate !== "function") return;

    if (bellAnimRef.current) {
      bellAnimRef.current.cancel();
    }

    bellAnimRef.current = el.animate(
      [
        { transform: "rotate(0deg)", offset: 0 },
        { transform: "rotate(16deg)", offset: 0.14 },
        { transform: "rotate(-13deg)", offset: 0.3 },
        { transform: "rotate(9deg)", offset: 0.46 },
        { transform: "rotate(-5deg)", offset: 0.62 },
        { transform: "rotate(2deg)", offset: 0.78 },
        { transform: "rotate(0deg)", offset: 1 },
      ],
      {
        duration: 950,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      }
    );
  }, []);

  React.useEffect(() => {
    // Detect arrivals after initial mount without announcing the initial list
    if (isInitialMount.current) {
      isInitialMount.current = false;
      notifications.forEach((n) => seenIdsRef.current.add(n.id));
      return;
    }

    let newlyArrived: NotificationItem | null = null;
    for (const item of notifications) {
      if (!item.read && !seenIdsRef.current.has(item.id)) {
        newlyArrived = item;
        setAnnouncement(`New notification: ${item.title}`);
        break;
      }
    }

    if (newlyArrived) {
      ringBell();
      if (isOpen && !checkReducedMotion()) {
        const arrivalId = newlyArrived.id;
        setExpandingArrivalId(arrivalId);
        setArrivalIsExpanded(false);

        requestAnimationFrame(() => {
          setArrivalIsExpanded(true);
          const btn = rowButtonRefs.current.get(arrivalId);
          if (btn && typeof btn.animate === "function") {
            const primary =
              getComputedStyle(btn).getPropertyValue("--primary").trim() ||
              "currentColor";
            btn.animate(
              [
                { backgroundColor: primary },
                { backgroundColor: "transparent" },
              ],
              { duration: 1000, easing: "ease-out" }
            );
          }
        });

        setTimeout(() => {
          setExpandingArrivalId(null);
          setArrivalIsExpanded(false);
        }, 400);
      }
    }

    notifications.forEach((n) => seenIdsRef.current.add(n.id));
  }, [notifications, isOpen, ringBell]);

  React.useEffect(() => {
    const prev = prevCountRef.current;
    const curr = unreadCount;
    prevCountRef.current = curr;

    if (prev === curr) return;

    const roller = badgeRollerRef.current;
    if (!roller) return;

    if (checkReducedMotion()) {
      roller.textContent = formatBadge(curr);
      return;
    }

    if (prev === 0 && curr > 0) {
      if (typeof badgeRef.current?.animate === "function") {
        badgeRef.current.animate(
          [{ transform: "scale(0)" }, { transform: "scale(1)" }],
          {
            duration: 200,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            fill: "forwards",
          }
        );
      }
    } else if (curr === 0 && prev > 0) {
      if (typeof badgeRef.current?.animate === "function") {
        badgeRef.current.animate(
          [{ transform: "scale(1)" }, { transform: "scale(0)" }],
          {
            duration: 200,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            fill: "forwards",
          }
        );
      }
    }

    if (typeof roller.animate !== "function") {
      roller.textContent = formatBadge(curr);
      return;
    }

    if (curr > prev) {
      roller.innerHTML = `<span class="h-5 flex items-center justify-center">${formatBadge(prev)}</span><span class="h-5 flex items-center justify-center">${formatBadge(curr)}</span>`;
      roller.animate(
        [{ transform: "translateY(0px)" }, { transform: "translateY(-20px)" }],
        { duration: 260, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      ).onfinish = () => {
        roller.innerHTML = `<span class="h-5 flex items-center justify-center">${formatBadge(curr)}</span>`;
      };
    } else {
      roller.innerHTML = `<span class="h-5 flex items-center justify-center">${formatBadge(curr)}</span><span class="h-5 flex items-center justify-center">${formatBadge(prev)}</span>`;
      roller.animate(
        [{ transform: "translateY(-20px)" }, { transform: "translateY(0px)" }],
        { duration: 260, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      ).onfinish = () => {
        roller.innerHTML = `<span class="h-5 flex items-center justify-center">${formatBadge(curr)}</span>`;
      };
    }
  }, [unreadCount]);

  const openPopover = () => {
    setIsOpen(true);
    setPopoverVisible(true);
    if (!checkReducedMotion()) {
      requestAnimationFrame(() => {
        if (typeof popoverRef.current?.animate === "function") {
          popoverRef.current.animate(
            [
              { clipPath: "inset(0 0 100% 0)" },
              { clipPath: "inset(0 0 0% 0)" },
            ],
            {
              duration: 320,
              easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
              fill: "forwards",
            }
          );
        }
      });
    }
  };

  const closePopover = () => {
    setIsOpen(false);
    if (checkReducedMotion() || typeof popoverRef.current?.animate !== "function") {
      setPopoverVisible(false);
    } else {
      // Clean up popover display after reverse clip-path transition completes
      const anim = popoverRef.current.animate(
        [
          { clipPath: "inset(0 0 0% 0)" },
          { clipPath: "inset(0 0 100% 0)" },
        ],
        {
          duration: 320,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "forwards",
        }
      );
      anim.onfinish = () => setPopoverVisible(false);
    }
  };

  const togglePopover = () => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        closePopover();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopover();
        bellRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const displayedNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read || pendingRemovalIds.has(n.id))
      : notifications;

  const handleRowClick = (item: NotificationItem) => {
    if (item.read) return;

    if (checkReducedMotion()) {
      onRead?.(item.id);
      return;
    }

    const bar = barRefs.current.get(item.id);
    if (bar && typeof bar.animate === "function") {
      bar.animate(
        [
          { transform: "scaleX(1)", transformOrigin: "left" },
          { transform: "scaleX(0)", transformOrigin: "left" },
        ],
        {
          duration: 350,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          fill: "forwards",
        }
      );
    }

    if (filter === "unread") {
      // Delay row removal in unread filter until bar sweep completes
      setPendingRemovalIds((prev) => new Set(prev).add(item.id));
      setTimeout(() => {
        setPendingRemovalIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }, 380);
    }

    onRead?.(item.id);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    setAnnouncement("All notifications marked as read");

    if (checkReducedMotion()) {
      onReadAll?.();
      return;
    }

    // Animate unread bars sequentially oldest last on mark all read
    const unreadItems = notifications.filter((n) => !n.read);
    unreadItems.forEach((item, idx) => {
      const bar = barRefs.current.get(item.id);
      if (bar && typeof bar.animate === "function") {
        bar.animate(
          [
            { transform: "scaleX(1)", transformOrigin: "left" },
            { transform: "scaleX(0)", transformOrigin: "left" },
          ],
          {
            duration: 350,
            delay: idx * 70,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            fill: "forwards",
          }
        );
      }
    });

    if (filter === "unread" && unreadItems.length > 0) {
      setPendingRemovalIds(new Set(unreadItems.map((n) => n.id)));
      const totalDelay = (unreadItems.length - 1) * 70 + 380;
      setTimeout(() => {
        setPendingRemovalIds(new Set());
      }, totalDelay);
    }

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
        onClick={togglePopover}
        className="relative flex items-center justify-center w-12 h-12 bg-transparent text-foreground border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg
          ref={bellGlyphRef}
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
          ref={badgeRef}
          aria-hidden="true"
          className={cn(
            "absolute top-1 right-0.5 min-w-[20px] h-5 px-[5px] flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold leading-none select-none overflow-hidden",
            unreadCount === 0 && "scale-0 invisible"
          )}
        >
          <span
            ref={badgeRollerRef}
            className="flex flex-col items-center select-none"
          >
            <span className="h-5 flex items-center justify-center">
              {formatBadge(unreadCount)}
            </span>
          </span>
        </span>
      </button>

      <div
        ref={popoverRef}
        id="notification-inbox-popover"
        role="dialog"
        aria-label="Notifications"
        className={cn(
          "absolute right-0 top-full mt-2 w-[min(380px,calc(100vw-32px))] max-h-[min(480px,72vh)] flex flex-col bg-background border border-foreground rounded-none shadow-none z-50",
          !popoverVisible && "hidden"
        )}
      >
        <header className="p-[16px_18px_12px] border-b border-border flex items-end justify-between shrink-0">
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
            displayedNotifications.map((item) => {
              const isArrivalTarget = expandingArrivalId === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "grid",
                    isArrivalTarget &&
                      "transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                  )}
                  style={{
                    gridTemplateRows: isArrivalTarget
                      ? arrivalIsExpanded
                        ? "1fr"
                        : "0fr"
                      : "1fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <button
                      ref={(el) => {
                        if (el) rowButtonRefs.current.set(item.id, el);
                        else rowButtonRefs.current.delete(item.id);
                      }}
                      type="button"
                      onClick={() => handleRowClick(item)}
                      className="w-full text-left relative p-[14px_18px_14px_22px] border-b border-border bg-transparent hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors block"
                    >
                      <span
                        ref={(el) => {
                          if (el) barRefs.current.set(item.id, el);
                          else barRefs.current.delete(item.id);
                        }}
                        className={cn(
                          "absolute left-0 top-0 bottom-0 w-1 bg-primary origin-left",
                          item.read ? "scale-x-0" : "scale-x-100"
                        )}
                        aria-hidden="true"
                      />
                      <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-2">
                        <span
                          className={cn(
                            "text-[15px] leading-tight transition-colors duration-300",
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
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer className="p-[12px_18px] border-t border-border flex items-center justify-between shrink-0">
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
