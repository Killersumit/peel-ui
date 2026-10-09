"use client";

import * as React from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
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
    const initialT = activeView === "grid" ? 1 : 0;
    const t = useMotionValue(initialT);
    const currentRawRef = React.useRef<number>(initialT);
    const shouldReduceMotion = useReducedMotion();

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const ulRef = React.useRef<HTMLUListElement | null>(null);
    const thumbRef = React.useRef<HTMLDivElement | null>(null);
    const listBtnRef = React.useRef<HTMLButtonElement | null>(null);
    const gridBtnRef = React.useRef<HTMLButtonElement | null>(null);
    const dotRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);
    const thumbItemRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const textRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const trailingRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const dividerRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    const measuredWidthRef = React.useRef<number>(440);
    const itemsRef = React.useRef<LayoutScrubItem[]>(items);
    itemsRef.current = items;

    const animRef = React.useRef<{ stop: () => void } | null>(null);
    const didDragRef = React.useRef<boolean>(false);
    const dragStateRef = React.useRef<{
      pointerId: number;
      startX: number;
      startRaw: number;
      isDragging: boolean;
    } | null>(null);

    const updateLayout = React.useCallback(
      (val: number) => {
        const w = measuredWidthRef.current;
        const c = columns;
        const n = itemsRef.current.length;
        const rows = Math.ceil(n / c);
        const cw = Math.max(1, Math.round((w - (c - 1) * 16) / c));
        const gridThumbH = Math.round(cw / 1.6);
        const gridCellH = gridThumbH + 48;
        const listH = n * 66;
        const gridH = rows * gridCellH + (rows - 1) * 24;

        if (ulRef.current) {
          ulRef.current.style.height = `${Math.round((1 - val) * listH + val * gridH)}px`;
        }

        if (thumbRef.current) {
          thumbRef.current.style.transform = `translateX(${Math.round(val * 75)}px)`;
        }

        if (listBtnRef.current && gridBtnRef.current) {
          if (val < 0.5) {
            listBtnRef.current.classList.add("text-foreground");
            listBtnRef.current.classList.remove("text-muted-foreground");
            gridBtnRef.current.classList.add("text-muted-foreground");
            gridBtnRef.current.classList.remove("text-foreground");
          } else {
            gridBtnRef.current.classList.add("text-foreground");
            gridBtnRef.current.classList.remove("text-muted-foreground");
            listBtnRef.current.classList.add("text-muted-foreground");
            listBtnRef.current.classList.remove("text-foreground");
          }
        }

        const trailingOpacity = Math.max(0, 1 - 3.5 * val);
        const dividerOpacity = Math.max(0, 1 - 4 * val);
        const thumbRadius = Math.round((1 - val) * 8 + val * 12);
        const thumbY = Math.round(6 * (1 - val));
        const textX = Math.round(104 * (1 - val));
        const textY = Math.round((1 - val) * 14 + val * (gridThumbH + 10));

        for (let i = 0; i < n; i++) {
          const li = itemRefs.current[i];
          if (!li) continue;

          const col = i % c;
          const row = Math.floor(i / c);

          const itemX = Math.round(val * (col * (cw + 16)));
          const itemY = Math.round((1 - val) * (i * 66) + val * (row * (gridCellH + 24)));
          const itemW = Math.round((1 - val) * w + val * cw);
          const itemH = Math.round((1 - val) * 66 + val * gridCellH);

          li.style.transform = `translate(${itemX}px, ${itemY}px)`;
          li.style.width = `${itemW}px`;
          li.style.height = `${itemH}px`;

          const thumbEl = thumbItemRefs.current[i];
          if (thumbEl) {
            const thumbW = Math.round((1 - val) * 88 + val * cw);
            const thumbH = Math.round((1 - val) * 55 + val * gridThumbH);
            thumbEl.style.width = `${thumbW}px`;
            thumbEl.style.height = `${thumbH}px`;
            thumbEl.style.transform = `translateY(${thumbY}px)`;
            thumbEl.style.borderRadius = `${thumbRadius}px`;
          }

          const textEl = textRefs.current[i];
          if (textEl) {
            textEl.style.width = `${cw}px`;
            textEl.style.transform = `translate(${textX}px, ${textY}px)`;
          }

          const trailingEl = trailingRefs.current[i];
          if (trailingEl) {
            trailingEl.style.opacity = `${trailingOpacity}`;
            trailingEl.style.pointerEvents = trailingOpacity > 0 ? "auto" : "none";
          }

          const dividerEl = dividerRefs.current[i];
          if (dividerEl) {
            dividerEl.style.opacity = `${dividerOpacity}`;
          }
        }
      },
      [columns]
    );

    React.useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const updateWidth = () => {
        const w = el.getBoundingClientRect().width;
        if (w > 0) {
          measuredWidthRef.current = w;
          updateLayout(t.get());
        }
      };

      updateWidth();

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          if (cr.width > 0) {
            measuredWidthRef.current = cr.width;
            updateLayout(t.get());
          }
        }
      });

      observer.observe(el);
      return () => observer.disconnect();
    }, [t, updateLayout]);

    React.useEffect(() => {
      updateLayout(t.get());
      const unsubscribe = t.on("change", (latest) => {
        updateLayout(latest);
      });
      return () => {
        unsubscribe();
      };
    }, [t, updateLayout]);

    React.useEffect(() => {
      return () => {
        animRef.current?.stop();
      };
    }, []);

    React.useEffect(() => {
      if (controlledView !== undefined) {
        const targetT = controlledView === "grid" ? 1 : 0;
        currentRawRef.current = targetT;
        setCommittedView(controlledView);
        if (shouldReduceMotion) {
          t.set(targetT);
        } else {
          animRef.current?.stop();
          animRef.current = animate(t, targetT, {
            duration: 0.3,
            ease: [0.2, 0.8, 0.2, 1],
          });
        }
      }
    }, [controlledView, shouldReduceMotion, t]);

    const selectView = (newView: "list" | "grid") => {
      if (didDragRef.current) return;
      const targetT = newView === "grid" ? 1 : 0;
      currentRawRef.current = targetT;
      if (!isControlled) {
        setUncontrolledView(newView);
      }
      setCommittedView(newView);
      onViewChange?.(newView);

      if (shouldReduceMotion) {
        t.set(targetT);
      } else {
        animRef.current?.stop();
        animRef.current = animate(t, targetT, {
          duration: 0.3,
          ease: [0.2, 0.8, 0.2, 1],
        });
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "Home") {
        e.preventDefault();
        selectView("list");
        listBtnRef.current?.focus();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "End") {
        e.preventDefault();
        selectView("grid");
        gridBtnRef.current?.focus();
      }
    };

    const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      const thumbEl = thumbRef.current;
      if (!thumbEl) return;
      const rect = thumbEl.getBoundingClientRect();
      const isOnThumb =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isOnThumb) return;

      animRef.current?.stop();
      dragStateRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startRaw: currentRawRef.current,
        isDragging: false,
      };

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!dragStateRef.current || moveEvent.pointerId !== dragStateRef.current.pointerId) return;

        const dx = moveEvent.clientX - dragStateRef.current.startX;
        if (!dragStateRef.current.isDragging) {
          if (Math.abs(dx) >= 5) {
            dragStateRef.current.isDragging = true;
            didDragRef.current = true;
            try {
              thumbEl.setPointerCapture(dragStateRef.current.pointerId);
            } catch {}
            dotRefs.current.forEach((dot) => {
              if (dot) dot.style.opacity = "0.45";
            });
          }
        }

        if (dragStateRef.current.isDragging) {
          const raw = Math.min(1, Math.max(0, dragStateRef.current.startRaw + dx / 75));
          currentRawRef.current = raw;
          const smoothT = raw * raw * (3 - 2 * raw);
          t.set(smoothT);
        }
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        if (!dragStateRef.current || upEvent.pointerId !== dragStateRef.current.pointerId) return;

        const wasDragging = dragStateRef.current.isDragging;
        if (wasDragging) {
          try {
            thumbEl.releasePointerCapture(upEvent.pointerId);
          } catch {}
          dotRefs.current.forEach((dot) => {
            if (dot) dot.style.opacity = "0";
          });

          const finalRaw = currentRawRef.current;
          const targetView: "list" | "grid" = finalRaw >= 0.5 ? "grid" : "list";
          const targetT = targetView === "grid" ? 1 : 0;
          currentRawRef.current = targetT;

          if (!isControlled) {
            setUncontrolledView(targetView);
          }
          setCommittedView(targetView);
          onViewChange?.(targetView);

          if (shouldReduceMotion) {
            t.set(targetT);
          } else {
            animRef.current = animate(t, targetT, {
              duration: 0.3,
              ease: [0.2, 0.8, 0.2, 1],
            });
          }

          setTimeout(() => {
            didDragRef.current = false;
          }, 50);
        }

        dragStateRef.current = null;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    };

    const n = items.length;
    const c = columns;
    const rows = Math.ceil(n / c);
    const initialWidth = measuredWidthRef.current;
    const cw = Math.max(1, Math.round((initialWidth - (c - 1) * 16) / c));
    const gridThumbH = Math.round(cw / 1.6);
    const gridCellH = gridThumbH + 48;
    const listH = n * 66;
    const gridH = rows * gridCellH + (rows - 1) * 24;

    const initialContainerHeight = Math.round((1 - initialT) * listH + initialT * gridH);
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
            onPointerDown={handleTrackPointerDown}
            className="relative h-[36px] w-[156px] shrink-0 rounded-full border border-border bg-muted p-[3px] touch-pan-y"
          >
            <div className="relative h-full w-full">
              <div
                ref={thumbRef}
                className="absolute top-0 bottom-0 z-0 rounded-full border border-border bg-card dark:bg-input shadow-xs transition-transform duration-0"
                style={{
                  width: "50%",
                  transform: `translateX(${initialT * 75}px)`,
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
                  onClick={() => selectView("list")}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "relative flex h-full w-full items-center justify-center rounded-full text-[13px] font-medium transition-colors focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                    initialT < 0.5 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span>List</span>
                  <span
                    ref={(el) => {
                      dotRefs.current[0] = el;
                    }}
                    className="pointer-events-none absolute bottom-1 size-[3px] rounded-full bg-foreground opacity-0 transition-opacity duration-200"
                    aria-hidden="true"
                  />
                </button>

                <button
                  ref={gridBtnRef}
                  type="button"
                  role="radio"
                  aria-checked={activeView === "grid"}
                  tabIndex={activeView === "grid" ? 0 : -1}
                  onClick={() => selectView("grid")}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "relative flex h-full w-full items-center justify-center rounded-full text-[13px] font-medium transition-colors focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                    initialT >= 0.5 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <span>Grid</span>
                  <span
                    ref={(el) => {
                      dotRefs.current[1] = el;
                    }}
                    className="pointer-events-none absolute bottom-1 size-[3px] rounded-full bg-foreground opacity-0 transition-opacity duration-200"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <ul
          ref={ulRef}
          aria-label={heading || "Items"}
          className="relative w-full list-none p-0 m-0 overflow-visible"
          style={{ height: `${initialContainerHeight}px` }}
        >
          {items.map((item, i) => {
            const col = i % c;
            const row = Math.floor(i / c);

            const itemX = Math.round(initialT * (col * (cw + 16)));
            const itemY = Math.round((1 - initialT) * (i * 66) + initialT * (row * (gridCellH + 24)));
            const itemW = Math.round((1 - initialT) * initialWidth + initialT * cw);
            const itemH = Math.round((1 - initialT) * 66 + initialT * gridCellH);

            const thumbW = Math.round((1 - initialT) * 88 + initialT * cw);
            const thumbH = Math.round((1 - initialT) * 55 + initialT * gridThumbH);
            const thumbY = Math.round(6 * (1 - initialT));
            const thumbRadius = Math.round((1 - initialT) * 8 + initialT * 12);

            const textX = Math.round(104 * (1 - initialT));
            const textY = Math.round((1 - initialT) * 14 + initialT * (gridThumbH + 10));

            const trailingOpacity = Math.max(0, 1 - 3.5 * initialT);
            const dividerOpacity = Math.max(0, 1 - 4 * initialT);

            return (
              <li
                key={item.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="absolute left-0 top-0 overflow-visible"
                style={{
                  width: `${itemW}px`,
                  height: `${itemH}px`,
                  transform: `translate(${itemX}px, ${itemY}px)`,
                }}
              >
                <div
                  ref={(el) => {
                    thumbItemRefs.current[i] = el;
                  }}
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
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
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
                    ref={(el) => {
                      trailingRefs.current[i] = el;
                    }}
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
                    ref={(el) => {
                      dividerRefs.current[i] = el;
                    }}
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
