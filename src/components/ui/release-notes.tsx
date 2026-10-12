"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function checkReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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

  const slotARef = React.useRef<HTMLDivElement>(null);
  const slotBRef = React.useRef<HTMLDivElement>(null);
  const spanARef = React.useRef<HTMLSpanElement>(null);
  const spanBRef = React.useRef<HTMLSpanElement>(null);
  const activeSlotRef = React.useRef<"A" | "B">("A");
  const displayedVersionRef = React.useRef<string>(releases[0]?.version ?? "");
  const isRollingRef = React.useRef<boolean>(false);
  const pendingTargetRef = React.useRef<{
    version: string;
    direction: number;
  } | null>(null);
  const currentTimelineRef = React.useRef<gsap.core.Timeline | null>(null);

  const isOwnScroll = height !== undefined;

  const rollNumeral = React.useCallback(
    function roll(targetVersion: string, direction: number) {
      if (checkReducedMotion()) {
        displayedVersionRef.current = targetVersion;
        if (spanARef.current) spanARef.current.textContent = targetVersion;
        if (slotARef.current) gsap.set(slotARef.current, { y: 0, autoAlpha: 1 });
        if (slotBRef.current) gsap.set(slotBRef.current, { autoAlpha: 0 });
        activeSlotRef.current = "A";
        isRollingRef.current = false;
        pendingTargetRef.current = null;
        return;
      }

      if (targetVersion === displayedVersionRef.current) {
        if (pendingTargetRef.current?.version === targetVersion) {
          pendingTargetRef.current = null;
        }
        return;
      }

      if (isRollingRef.current) {
        pendingTargetRef.current = { version: targetVersion, direction };
        return;
      }

      isRollingRef.current = true;
      const isSlotA = activeSlotRef.current === "A";
      const currentSlot = isSlotA ? slotARef.current : slotBRef.current;
      const incomingSlot = isSlotA ? slotBRef.current : slotARef.current;
      const incomingSpan = isSlotA ? spanBRef.current : spanARef.current;
      const nextSlotName = isSlotA ? "B" : "A";

      if (!currentSlot || !incomingSlot || !incomingSpan) {
        isRollingRef.current = false;
        return;
      }

      incomingSpan.textContent = targetVersion;

      const dir = direction >= 0 ? 1 : -1;
      const oldY = dir > 0 ? -96 : 96;
      const newStartY = dir > 0 ? 96 : -96;

      gsap.set(incomingSlot, { y: newStartY, autoAlpha: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          displayedVersionRef.current = targetVersion;
          activeSlotRef.current = nextSlotName;
          gsap.set(currentSlot, { autoAlpha: 0 });
          isRollingRef.current = false;

          if (
            pendingTargetRef.current &&
            pendingTargetRef.current.version !== targetVersion
          ) {
            const next = pendingTargetRef.current;
            pendingTargetRef.current = null;
            roll(next.version, next.direction);
          } else {
            pendingTargetRef.current = null;
          }
        },
      });

      currentTimelineRef.current = tl;

      tl.to(
        currentSlot,
        {
          y: oldY,
          duration: 0.32,
          ease: "power3.out",
        },
        0
      );

      tl.to(
        incomingSlot,
        {
          y: 0,
          duration: 0.32,
          ease: "power3.out",
        },
        0
      );
    },
    []
  );

  const handleActivate = React.useCallback(
    (index: number, direction: number) => {
      const targetRelease = releases[index];
      if (!targetRelease) return;

      setActiveIndex(index);
      rollNumeral(targetRelease.version, direction);
    },
    [releases, rollNumeral]
  );

  useGSAP(
    () => {
      const bandEl = bandRef.current;
      if (!bandEl || releases.length === 0) return;

      const scroller = isOwnScroll ? scrollContainerRef.current : undefined;
      const getThreshold = () => (bandEl.offsetHeight || 138) + 24;

      releases.forEach((_, i) => {
        const el = releaseRefs.current[i];
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          scroller,
          start: i === 0 ? "top bottom" : () => `top ${getThreshold()}px`,
          end: () => `bottom ${getThreshold()}px`,
          onToggle: (self) => {
            if (self.isActive) {
              handleActivate(i, self.direction || 1);
            }
          },
        });
      });

      const handleScrollRest = () => {
        if (scroller ? scroller.scrollTop <= 4 : window.scrollY <= 4) {
          handleActivate(0, -1);
        }
      };

      const targetScroller = scroller || window;
      targetScroller.addEventListener("scroll", handleScrollRest, {
        passive: true,
      });

      // Refresh layout positions after fonts load to avoid offset drift.
      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready
          .then(() => {
            ScrollTrigger.refresh();
          })
          .catch(() => {});
      }

      return () => {
        targetScroller.removeEventListener("scroll", handleScrollRest);
      };
    },
    {
      scope: scrollContainerRef,
      dependencies: [releases, isOwnScroll, handleActivate],
    }
  );

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
          <div className="h-[96px] overflow-hidden -ml-1 relative">
            <div ref={slotARef} className="absolute inset-0">
              <span
                ref={spanARef}
                className="block text-[100px] leading-[96px] font-semibold tracking-[-0.065em] tabular-nums"
              >
                {activeRelease?.version}
              </span>
            </div>
            <div
              ref={slotBRef}
              className="absolute inset-0"
              style={{ visibility: "hidden" }}
            >
              <span
                ref={spanBRef}
                className="block text-[100px] leading-[96px] font-semibold tracking-[-0.065em] tabular-nums"
              />
            </div>
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
                "h-[2px] rounded-full transition-all duration-300 motion-reduce:transition-none",
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
                "pb-[52px] transition-opacity duration-300 motion-reduce:transition-none",
                isLast && "min-h-[500px]",
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
    <div
      ref={scrollContainerRef}
      className={cn("relative w-full text-foreground", className)}
    >
      {content}
    </div>
  );
}
ReleaseNotes.displayName = "ReleaseNotes";
