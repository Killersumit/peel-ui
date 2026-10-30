"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

const isReducedMotion = () => {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export interface RoadmapVoteItem {
  id: string;
  title: string;
  description?: string;
  status?: string;
  votes: number;
  voted?: boolean;
}

export interface RoadmapVoteProps {
  items: RoadmapVoteItem[];
  heading?: string;
  caption?: string;
  activeStatus?: string;
  onVote?: (id: string, voted: boolean) => void;
  className?: string;
}

export function RoadmapVote({
  items,
  heading,
  caption,
  activeStatus = "In progress",
  onVote,
  className,
}: RoadmapVoteProps) {
  const [votedMap, setVotedMap] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of items) {
      if (item.voted) {
        initial[item.id] = true;
      }
    }
    return initial;
  });

  const [announcement, setAnnouncement] = React.useState("");
  const activeFocusIdRef = React.useRef<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const activeTimelineRef = React.useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      return () => {
        activeTimelineRef.current?.kill();
        if (containerRef.current) {
          gsap.killTweensOf(containerRef.current);
        }
      };
    },
    { scope: containerRef }
  );

  const itemsWithCounts = React.useMemo(() => {
    return items.map((item, originalIndex) => {
      const isVoted = Boolean(votedMap[item.id]);
      const initialVoted = Boolean(item.voted);
      let delta = 0;
      if (isVoted && !initialVoted) delta = 1;
      if (!isVoted && initialVoted) delta = -1;
      const displayedVotes = Math.max(0, item.votes + delta);

      return {
        ...item,
        isVoted,
        displayedVotes,
        originalIndex,
      };
    });
  }, [items, votedMap]);

  const sortedItems = React.useMemo(() => {
    return [...itemsWithCounts].sort((a, b) => {
      if (b.displayedVotes !== a.displayedVotes) {
        return b.displayedVotes - a.displayedVotes;
      }
      if (b.isVoted !== a.isVoted) {
        return (b.isVoted ? 1 : 0) - (a.isVoted ? 1 : 0);
      }
      return a.originalIndex - b.originalIndex;
    });
  }, [itemsWithCounts]);

  const maxVotes = React.useMemo(() => {
    let max = 0;
    for (const item of sortedItems) {
      if (item.displayedVotes > max) {
        max = item.displayedVotes;
      }
    }
    return max;
  }, [sortedItems]);

  const handleToggleVote = (id: string) => {
    // Fast-forward any running animation so rapid clicks never stack or glitch.
    if (activeTimelineRef.current) {
      activeTimelineRef.current.progress(1);
      activeTimelineRef.current = null;
    }

    activeFocusIdRef.current = id;
    const item = itemsWithCounts.find((it) => it.id === id);
    if (!item) return;

    const prevIndex = sortedItems.findIndex((it) => it.id === id);
    const nextVoted = !item.isVoted;
    const nextDelta = nextVoted
      ? item.voted
        ? 0
        : 1
      : item.voted
        ? -1
        : 0;
    const nextVotes = Math.max(0, item.votes + nextDelta);

    const projectedList = itemsWithCounts.map((it) => {
      if (it.id === id) {
        return {
          ...it,
          isVoted: nextVoted,
          displayedVotes: nextVotes,
        };
      }
      return it;
    });

    projectedList.sort((a, b) => {
      if (b.displayedVotes !== a.displayedVotes) {
        return b.displayedVotes - a.displayedVotes;
      }
      if (b.isVoted !== a.isVoted) {
        return (b.isVoted ? 1 : 0) - (a.isVoted ? 1 : 0);
      }
      return a.originalIndex - b.originalIndex;
    });

    const nextIndex = projectedList.findIndex((it) => it.id === id);
    let projectedMax = 0;
    for (const it of projectedList) {
      if (it.displayedVotes > projectedMax) {
        projectedMax = it.displayedVotes;
      }
    }

    let msg = `${item.title}: ${nextVotes} votes`;
    if (nextIndex !== prevIndex) {
      msg += `, now number ${nextIndex + 1}`;
    }

    if (isReducedMotion() || !containerRef.current) {
      setVotedMap((prev) => ({
        ...prev,
        [id]: nextVoted,
      }));
      onVote?.(id, nextVoted);
      setAnnouncement(msg);
      return;
    }

    const rowEls = Array.from(
      containerRef.current.querySelectorAll<HTMLLIElement>("[data-item-id]")
    );
    // Capture geometry before DOM rearrangement for calm translation.
    const flipState = Flip.getState(rowEls);

    const oldBarPercents = new Map<string, number>();
    for (const it of sortedItems) {
      const pct = maxVotes > 0 ? (it.displayedVotes / maxVotes) * 100 : 0;
      oldBarPercents.set(it.id, pct);
    }

    const targetBtn = containerRef.current.querySelector<HTMLButtonElement>(
      `button[data-vote-btn="${id}"]`
    );
    const slot1 = targetBtn?.querySelector<HTMLElement>('[data-num-slot="1"]');
    const slot2 = targetBtn?.querySelector<HTMLElement>('[data-num-slot="2"]');
    const oldVotes = item.displayedVotes;

    ReactDOM.flushSync(() => {
      setVotedMap((prev) => ({
        ...prev,
        [id]: nextVoted,
      }));
    });

    onVote?.(id, nextVoted);
    setAnnouncement(msg);

    const tl = gsap.timeline({
      onComplete: () => {
        activeTimelineRef.current = null;
        if (slot2) {
          slot2.style.visibility = "hidden";
          gsap.set(slot2, { clearProps: "transform" });
        }
        if (slot1) {
          gsap.set(slot1, { clearProps: "transform" });
        }
      },
    });
    activeTimelineRef.current = tl;

    if (slot1 && slot2) {
      slot2.textContent = String(oldVotes);
      slot2.style.visibility = "visible";
      if (nextVoted) {
        gsap.set(slot2, { y: 0 });
        gsap.set(slot1, { y: 42 });
        tl.to(slot2, { y: -42, duration: 0.28, ease: "power3.out" }, 0);
        tl.to(slot1, { y: 0, duration: 0.28, ease: "power3.out" }, 0);
      } else {
        gsap.set(slot2, { y: 0 });
        gsap.set(slot1, { y: -42 });
        tl.to(slot2, { y: 42, duration: 0.28, ease: "power3.out" }, 0);
        tl.to(slot1, { y: 0, duration: 0.28, ease: "power3.out" }, 0);
      }
    }

    tl.add(
      Flip.from(flipState, {
        duration: 0.4,
        ease: "power3.out",
        scale: false,
      }),
      0
    );

    const barEls =
      containerRef.current.querySelectorAll<HTMLElement>("[data-bar-fill]");
    barEls.forEach((bar) => {
      const itemId = bar.getAttribute("data-bar-item");
      if (!itemId) return;
      const oldPct = oldBarPercents.get(itemId) ?? 0;
      const targetItem = projectedList.find((x) => x.id === itemId);
      const newPct =
        projectedMax > 0 && targetItem
          ? (targetItem.displayedVotes / projectedMax) * 100
          : 0;
      tl.fromTo(
        bar,
        { width: `${oldPct}%` },
        { width: `${newPct}%`, duration: 0.4, ease: "power3.out" },
        0
      );
    });
  };

  React.useLayoutEffect(() => {
    if (activeFocusIdRef.current && containerRef.current) {
      const targetBtn = containerRef.current.querySelector<HTMLButtonElement>(
        `button[data-vote-btn="${activeFocusIdRef.current}"]`
      );
      if (targetBtn && document.activeElement !== targetBtn) {
        targetBtn.focus({ preventScroll: true });
      }
      activeFocusIdRef.current = null;
    }
  });

  return (
    <div
      ref={containerRef}
      className={cn("w-full text-foreground select-none", className)}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {heading && (
        <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.035em] max-w-[14ch] text-foreground m-0">
          {heading}
        </h2>
      )}

      {caption && (
        <p className="mt-3 mb-7 text-[14px] text-muted-foreground m-0">
          {caption}
        </p>
      )}

      <ol className="m-0 p-0 list-none border-t-2 border-foreground">
        {sortedItems.map((item) => {
          const percent =
            maxVotes > 0 ? (item.displayedVotes / maxVotes) * 100 : 0;
          const isActive =
            item.status?.toLowerCase() === activeStatus.toLowerCase();

          return (
            <li
              key={item.id}
              data-item-id={item.id}
              className="relative grid grid-cols-[92px_1fr] gap-4 pt-[22px] pb-[26px]"
            >
              <div className="flex flex-col items-start">
                <button
                  type="button"
                  data-vote-btn={item.id}
                  onClick={() => handleToggleVote(item.id)}
                  aria-pressed={item.isVoted}
                  aria-label={
                    item.isVoted
                      ? `Remove your vote: ${item.title}, ${item.displayedVotes} votes`
                      : `Vote: ${item.title}, ${item.displayedVotes} votes`
                  }
                  style={{ outline: "none" }}
                  className={cn(
                    "h-[42px] px-2 -ml-2 rounded-lg border-none overflow-hidden cursor-pointer",
                    "text-[40px] leading-[42px] font-semibold tracking-[-0.045em] tabular-nums",
                    "transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[3px] focus-visible:ring-offset-background",
                    item.isVoted
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-foreground hover:bg-muted"
                  )}
                >
                  <span className="relative block h-[42px] leading-[42px] overflow-hidden select-none">
                    <span
                      data-num-slot="1"
                      className="block h-[42px] leading-[42px]"
                    >
                      {item.displayedVotes}
                    </span>
                    <span
                      data-num-slot="2"
                      aria-hidden="true"
                      className="absolute inset-0 block h-[42px] leading-[42px] invisible pointer-events-none"
                    />
                  </span>
                </button>
                <span className="mt-1.5 text-[12px] text-muted-foreground select-none">
                  {item.isVoted ? "your vote" : "votes"}
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <h3 className="text-[17px] font-medium tracking-[-0.015em] leading-[1.3] text-foreground m-0 p-0">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-[14px] leading-normal text-muted-foreground max-w-[34ch] m-0 p-0">
                    {item.description}
                  </p>
                )}
                {item.status && (
                  <span
                    className={cn(
                      "mt-3 text-[11px] font-medium tracking-[0.08em] uppercase select-none",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.status}
                  </span>
                )}
              </div>

              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-[2px] w-full bg-border overflow-hidden"
              >
                <div
                  data-bar-fill
                  data-bar-item={item.id}
                  className="h-full bg-foreground"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
RoadmapVote.displayName = "RoadmapVote";
