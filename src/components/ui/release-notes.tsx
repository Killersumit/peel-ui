"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ReleaseChange {
  tag: string;
  lead: string;
  detail?: string;
}

export interface ReleaseItem {
  version: string;
  date: string;
  title: string;
  changes: ReleaseChange[];
}

export interface ReleaseNotesProps {
  releases: ReleaseItem[];
  highlightTag?: string;
  height?: number | string;
  className?: string;
}

export function ReleaseNotes({
  releases,
  highlightTag = "New",
  height,
  className,
}: ReleaseNotesProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const bandRef = React.useRef<HTMLDivElement>(null);
  const releaseRefs = React.useRef<(HTMLElement | null)[]>([]);

  const isOwnScroll = height !== undefined;

  React.useEffect(() => {
    const bandEl = bandRef.current;
    if (!bandEl || releases.length === 0) return;

    if (isOwnScroll) {
      const container = scrollContainerRef.current;
      if (!container) return;

      const handleScroll = () => {
        // Pin to the first release when resting at the very top.
        if (container.scrollTop <= 4) {
          setActiveIndex(0);
          return;
        }

        if (
          container.scrollHeight - container.scrollTop - container.clientHeight <= 2
        ) {
          setActiveIndex(releases.length - 1);
          return;
        }

        const bandRect = bandEl.getBoundingClientRect();
        const threshold = bandRect.bottom + 24;

        let nextIndex = 0;
        for (let i = 0; i < releases.length; i++) {
          const el = releaseRefs.current[i];
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= threshold) {
              nextIndex = i;
            }
          }
        }
        setActiveIndex(nextIndex);
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    } else {
      const handleWindowScroll = () => {
        if (window.scrollY <= 4) {
          setActiveIndex(0);
          return;
        }

        const bandRect = bandEl.getBoundingClientRect();
        const threshold = bandRect.bottom + 24;

        let nextIndex = 0;
        for (let i = 0; i < releases.length; i++) {
          const el = releaseRefs.current[i];
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= threshold) {
              nextIndex = i;
            }
          }
        }
        setActiveIndex(nextIndex);
      };

      window.addEventListener("scroll", handleWindowScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleWindowScroll);
    }
  }, [releases.length, isOwnScroll]);

  const activeRelease = releases[activeIndex] ?? releases[0];

  const content = (
    <>
      <div
        ref={bandRef}
        aria-hidden="true"
        className={cn(
          "sticky top-0 z-20 bg-primary text-primary-foreground select-none",
          "pt-4 pb-4 px-5",
          isOwnScroll && "rounded-t-[19px]"
        )}
      >
        <div className="flex items-end justify-between">
          <div className="h-[96px] overflow-hidden -ml-1">
            <span className="block text-[100px] leading-[96px] font-semibold tracking-[-0.065em] tabular-nums">
              {activeRelease?.version}
            </span>
          </div>

          <div className="text-right text-[13px] tabular-nums pb-[10px]">
            <div className="font-medium">
              {activeIndex === 0
                ? "Latest release"
                : `Version ${activeRelease?.version}`}
            </div>
            <div className="opacity-[0.72] text-primary-foreground">
              {activeRelease?.date}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-[6px]">
          {releases.map((rel, i) => (
            <div
              key={rel.version}
              className={cn(
                "h-[2px] rounded-full",
                i === activeIndex
                  ? "w-[40px] bg-primary-foreground opacity-100"
                  : "w-[14px] bg-primary-foreground opacity-[0.28]"
              )}
            />
          ))}
        </div>
      </div>

      <div className={cn("pt-7", isOwnScroll ? "px-5" : "px-0")}>
        {releases.map((release, index) => {
          const isActive = index === activeIndex;
          const isLast = index === releases.length - 1;

          return (
            <section
              key={release.version}
              ref={(el) => {
                releaseRefs.current[index] = el;
              }}
              data-release-version={release.version}
              className={cn(
                "pb-[52px]",
                isLast && "min-h-[300px]",
                isActive ? "opacity-100" : "opacity-[0.38]"
              )}
            >
              <h2 className="text-[22px] font-medium tracking-[-0.025em] leading-[1.2] mb-[18px] text-foreground">
                <span className="sr-only">
                  Version {release.version}, {release.date}:{" "}
                </span>
                {release.title}
              </h2>

              <div className="flex flex-col">
                {release.changes.map((change, cIdx) => {
                  const isHighlighted =
                    change.tag.toLowerCase() === highlightTag.toLowerCase();

                  return (
                    <div
                      key={cIdx}
                      className="py-3 border-t border-border flex flex-col"
                    >
                      <span
                        className={cn(
                          "text-[11px] font-medium tracking-[0.08em] uppercase mb-1",
                          isHighlighted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {change.tag}
                      </span>
                      <p className="text-[15px] text-muted-foreground max-w-[40ch] m-0 leading-normal">
                        <span className="font-medium text-foreground">
                          {change.lead}
                        </span>
                        {change.detail ? ` ${change.detail}` : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );

  if (isOwnScroll) {
    return (
      <div
        ref={scrollContainerRef}
        role="region"
        aria-label="Release notes"
        tabIndex={0}
        style={{ height, scrollbarWidth: "thin" }}
        className={cn(
          "relative overflow-y-auto rounded-[20px] border border-border bg-background text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full text-foreground", className)}>
      {content}
    </div>
  );
}
ReleaseNotes.displayName = "ReleaseNotes";
