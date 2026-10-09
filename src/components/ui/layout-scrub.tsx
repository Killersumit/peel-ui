"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LayoutScrubItem {
  id: string;
  thumbnail: React.ReactNode;
  title: string;
  meta?: string;
  trailing?: string;
}

export interface LayoutScrubProps {
  items: LayoutScrubItem[];
  heading?: string;
  caption?: string;
  columns?: 2 | 3 | 4;
  view?: "list" | "grid";
  defaultView?: "list" | "grid";
  onViewChange?: (view: "list" | "grid") => void;
  className?: string;
}

export const LayoutScrub = React.forwardRef<HTMLDivElement, LayoutScrubProps>(
  function LayoutScrub(
    {
      items,
      heading,
      caption,
      columns = 2,
      view: controlledView,
      defaultView = "list",
      onViewChange,
      className,
    },
    ref
  ) {
    const isControlled = controlledView !== undefined;
    const [uncontrolledView, setUncontrolledView] = React.useState<"list" | "grid">(defaultView);
    const activeView = isControlled ? controlledView : uncontrolledView;

    const [committedView, setCommittedView] = React.useState<"list" | "grid">(activeView);
    const [measuredWidth, setMeasuredWidth] = React.useState<number>(440);

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const listBtnRef = React.useRef<HTMLButtonElement | null>(null);
    const gridBtnRef = React.useRef<HTMLButtonElement | null>(null);

    const t = activeView === "grid" ? 1 : 0;

    React.useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const updateWidth = () => {
        const w = el.getBoundingClientRect().width;
        if (w > 0) setMeasuredWidth(w);
      };

      updateWidth();

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          if (cr.width > 0) {
            setMeasuredWidth(cr.width);
          }
        }
      });

      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const handleSelectView = (newView: "list" | "grid") => {
      if (!isControlled) {
        setUncontrolledView(newView);
      }
      setCommittedView(newView);
      onViewChange?.(newView);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "Home") {
        e.preventDefault();
        handleSelectView("list");
        listBtnRef.current?.focus();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "End") {
        e.preventDefault();
        handleSelectView("grid");
        gridBtnRef.current?.focus();
      }
    };

    const n = items.length;
    const c = columns;
    const rows = Math.ceil(n / c);
    const cw = Math.max(1, Math.round((measuredWidth - (c - 1) * 16) / c));
    const gridThumbH = Math.round(cw / 1.6);
    const gridCellH = gridThumbH + 48;
    const listH = n * 66;
    const gridH = rows * gridCellH + (rows - 1) * 24;

    const containerHeight = Math.round((1 - t) * listH + t * gridH);

    const liveAnnouncement = committedView === "grid" ? "Grid view" : "List view";

    const setCombinedRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div
        ref={setCombinedRef}
        className={cn("w-full max-w-[440px] select-none text-foreground", className)}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        <div
          className={cn(
            "flex items-center gap-4 mb-6",
            heading || caption ? "justify-between" : "justify-end"
          )}
        >
          {heading || caption ? (
            <div>
              {heading && (
                <h2 className="text-[20px] font-semibold tracking-[-0.03em] leading-tight text-foreground">
                  {heading}
                </h2>
              )}
              {caption && (
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  {caption}
                </p>
              )}
            </div>
          ) : null}

          <div
            role="radiogroup"
            aria-label="View"
            className="relative h-[36px] w-[156px] shrink-0 rounded-full border border-border bg-muted p-[3px] touch-pan-y"
          >
            <div className="relative h-full w-full">
              <div
                className="absolute top-0 bottom-0 z-0 rounded-full border border-border bg-card dark:bg-input shadow-xs transition-transform duration-0"
                style={{
                  width: "50%",
                  transform: `translateX(${t * 100}%)`,
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 grid h-full w-full grid-cols-2">
                <button
                  ref={listBtnRef}
                  type="button"
                  role="radio"
                  aria-checked={activeView === "list"}
                  tabIndex={activeView === "list" ? 0 : -1}
                  onClick={() => handleSelectView("list")}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "relative flex h-full w-full items-center justify-center rounded-full text-[13px] font-medium transition-colors focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                    t < 0.5 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span>List</span>
                  <span
                    className="pointer-events-none absolute bottom-1 size-[3px] rounded-full bg-foreground opacity-0"
                    aria-hidden="true"
                  />
                </button>

                <button
                  ref={gridBtnRef}
                  type="button"
                  role="radio"
                  aria-checked={activeView === "grid"}
                  tabIndex={activeView === "grid" ? 0 : -1}
                  onClick={() => handleSelectView("grid")}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "relative flex h-full w-full items-center justify-center rounded-full text-[13px] font-medium transition-colors focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                    t >= 0.5 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span>Grid</span>
                  <span
                    className="pointer-events-none absolute bottom-1 size-[3px] rounded-full bg-foreground opacity-0"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <ul
          aria-label={heading || "Items"}
          className="relative w-full list-none p-0 m-0 overflow-visible"
          style={{ height: `${containerHeight}px` }}
        >
          {items.map((item, i) => {
            const col = i % c;
            const row = Math.floor(i / c);

            const itemX = Math.round(t * (col * (cw + 16)));
            const itemY = Math.round((1 - t) * (i * 66) + t * (row * (gridCellH + 24)));
            const itemW = Math.round((1 - t) * measuredWidth + t * cw);
            const itemH = Math.round((1 - t) * 66 + t * gridCellH);

            const thumbW = Math.round((1 - t) * 88 + t * cw);
            const thumbH = Math.round((1 - t) * 55 + t * gridThumbH);
            const thumbY = Math.round(6 * (1 - t));
            const thumbRadius = Math.round((1 - t) * 8 + t * 12);

            const textX = Math.round(104 * (1 - t));
            const textY = Math.round((1 - t) * 14 + t * (gridThumbH + 10));

            const trailingOpacity = Math.max(0, 1 - 3.5 * t);
            const dividerOpacity = Math.max(0, 1 - 4 * t);

            return (
              <li
                key={item.id}
                className="absolute left-0 top-0 overflow-visible"
                style={{
                  width: `${itemW}px`,
                  height: `${itemH}px`,
                  transform: `translate(${itemX}px, ${itemY}px)`,
                }}
              >
                <div
                  className="absolute left-0 top-0 shrink-0 overflow-hidden"
                  style={{
                    width: `${thumbW}px`,
                    height: `${thumbH}px`,
                    transform: `translateY(${thumbY}px)`,
                    borderRadius: `${thumbRadius}px`,
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none rounded-[inherit] border border-border z-10" />
                  {item.thumbnail}
                </div>

                <div
                  className="absolute left-0 top-0 overflow-hidden"
                  style={{
                    width: `${cw}px`,
                    transform: `translate(${textX}px, ${textY}px)`,
                  }}
                >
                  <div className="text-[14.5px] font-medium leading-tight text-foreground truncate select-none">
                    {item.title}
                  </div>
                  {item.meta && (
                    <div className="mt-[2px] text-[12.5px] leading-tight text-muted-foreground truncate select-none">
                      {item.meta}
                    </div>
                  )}
                </div>

                {item.trailing && (
                  <div
                    className="absolute right-0 top-[33px] -translate-y-1/2 text-[13.5px] font-medium text-foreground tabular-nums select-none"
                    style={{
                      opacity: trailingOpacity,
                      pointerEvents: trailingOpacity > 0 ? "auto" : "none",
                    }}
                  >
                    {item.trailing}
                  </div>
                )}

                {i < n - 1 && (
                  <div
                    className="absolute left-0 right-0 top-[65px] h-[1px] bg-border pointer-events-none"
                    style={{
                      opacity: dividerOpacity,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
);
LayoutScrub.displayName = "LayoutScrub";
