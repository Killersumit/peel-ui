"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
    activeFocusIdRef.current = id;
    const item = itemsWithCounts.find((it) => it.id === id);
    if (!item) return;

    const prevIndex = sortedItems.findIndex((it) => it.id === id);
    const nextVoted = !item.isVoted;

    setVotedMap((prev) => ({
      ...prev,
      [id]: nextVoted,
    }));

    onVote?.(id, nextVoted);

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

    let msg = `${item.title}: ${nextVotes} votes`;
    if (nextIndex !== prevIndex) {
      msg += `, now number ${nextIndex + 1}`;
    }
    setAnnouncement(msg);
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
                  <span className="block">{item.displayedVotes}</span>
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
