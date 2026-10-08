"use client";

import * as React from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface DetentTabsRange {
  id: string;
  label: string;
  value: number;
  delta?: string;
  points: number[];
  axis: [string, string, string];
}

export interface DetentTabsProps {
  ranges: DetentTabsRange[];
  title?: string;
  formatValue?: (n: number) => string;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (i: number) => void;
  className?: string;
}

function resamplePoints(rawPoints: number[], targetCount = 32): number[] {
  if (rawPoints.length === 0) return Array(targetCount).fill(0);
  if (rawPoints.length === 1) return Array(targetCount).fill(rawPoints[0]);

  const result: number[] = [];
  const m = rawPoints.length;
  for (let k = 0; k < targetCount; k++) {
    const t = k / (targetCount - 1);
    const r = t * (m - 1);
    const i = Math.floor(r);
    const frac = r - i;
    if (i >= m - 1) {
      result.push(rawPoints[m - 1]);
    } else {
      result.push(rawPoints[i] + frac * (rawPoints[i + 1] - rawPoints[i]));
    }
  }
  return result;
}

function normalizePoints(points: number[]): number[] {
  let min = Infinity;
  let max = -Infinity;
  for (const v of points) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (max === min) {
    return points.map(() => 0.5);
  }
  return points.map((v) => (v - min) / (max - min));
}

function pointsToPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const current = pts[i];
    const next = pts[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    d += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` Q ${last.x.toFixed(2)} ${last.y.toFixed(2)} ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

export const DetentTabs = React.forwardRef<HTMLDivElement, DetentTabsProps>(
  function DetentTabs(
    {
      ranges,
      title = "Revenue",
      formatValue = (n: number) => n.toLocaleString("en-US"),
      index: indexProp,
      defaultIndex = 0,
      onIndexChange,
      className,
    },
    ref
  ) {
    const isControlled = indexProp !== undefined;
    const [uncontrolledIndex, setUncontrolledIndex] = React.useState(defaultIndex);
    const activeIndex = isControlled ? indexProp : uncontrolledIndex;
    const safeIndex = Math.max(0, Math.min(ranges.length - 1, activeIndex));

    const [committedIndex, setCommittedIndex] = React.useState(safeIndex);

    const shouldReduceMotion = useReducedMotion();
    const p = useMotionValue(safeIndex);

    const generatedId = React.useId();
    const uniqueId = generatedId.replace(/:/g, "");

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const trackInnerRef = React.useRef<HTMLDivElement | null>(null);
    const thumbRef = React.useRef<HTMLDivElement | null>(null);
    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    const detentDotRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const axisSetRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const linePathRef = React.useRef<SVGPathElement | null>(null);
    const areaPathRef = React.useRef<SVGPathElement | null>(null);
    const endDotRef = React.useRef<HTMLDivElement | null>(null);
    const bigValueRef = React.useRef<HTMLDivElement | null>(null);
    const chipRef = React.useRef<HTMLSpanElement | null>(null);

    const animationRef = React.useRef<{ stop: () => void } | null>(null);
    const isDraggingRef = React.useRef(false);
    const isPointerDownRef = React.useRef(false);
    const startXRef = React.useRef(0);
    const pStartRef = React.useRef(0);
    const colWidthRef = React.useRef(100);
    const wasDraggedRef = React.useRef(false);

    const processedData = React.useMemo(() => {
      const xs = Array.from({ length: 32 }, (_, k) => (k / 31) * 360);
      const coords = ranges.map((range) => {
        const resampled = resamplePoints(range.points, 32);
        const normalized = normalizePoints(resampled);
        return normalized.map((u) => 110 - u * 88);
      });
      return { xs, coords };
    }, [ranges]);

    const updateDOM = React.useCallback(
      (currentP: number) => {
        const count = ranges.length;
        if (count < 2) return;

        const clampedP = Math.max(0, Math.min(count - 1, currentP));
        const i0 = Math.min(Math.floor(clampedP), count - 2);
        const f = clampedP - i0;
        const i1 = i0 + 1;

        const pts: { x: number; y: number }[] = [];
        for (let k = 0; k < 32; k++) {
          const y =
            (1 - f) * processedData.coords[i0][k] +
            f * processedData.coords[i1][k];
          pts.push({ x: processedData.xs[k], y });
        }

        const lineD = pointsToPath(pts);
        const areaD = `${lineD} L 360 132 L 0 132 Z`;
        const yLast = pts[31]?.y ?? 110;

        linePathRef.current?.setAttribute("d", lineD);
        areaPathRef.current?.setAttribute("d", areaD);
        if (endDotRef.current) {
          endDotRef.current.style.top = `${(yLast / 132) * 100}%`;
        }

        const blendedVal =
          (1 - f) * ranges[i0].value + f * ranges[i1].value;
        const roundedVal = Math.round(blendedVal);
        if (bigValueRef.current) {
          bigValueRef.current.textContent = formatValue(roundedVal);
        }

        const nearest = Math.round(clampedP);
        if (chipRef.current) {
          const delta = ranges[nearest]?.delta ?? "";
          chipRef.current.textContent = delta;
          chipRef.current.style.display = delta ? "" : "none";
        }

        for (let j = 0; j < count; j++) {
          const op = Math.min(1, Math.max(0, 1 - 2 * Math.abs(clampedP - j)));
          const setEl = axisSetRefs.current[j];
          if (setEl) {
            setEl.style.opacity = op.toString();
          }

          const tabEl = tabRefs.current[j];
          if (tabEl) {
            if (j === nearest) {
              tabEl.classList.add("text-foreground");
              tabEl.classList.remove("text-muted-foreground");
            } else {
              tabEl.classList.remove("text-foreground");
              tabEl.classList.add("text-muted-foreground");
            }
          }
        }

        if (thumbRef.current) {
          const scale =
            isDraggingRef.current && !shouldReduceMotion ? " scaleX(1.04)" : "";
          thumbRef.current.style.transform = `translateX(${clampedP * 100}%)${scale}`;
        }
      },
      [ranges, processedData, formatValue, shouldReduceMotion]
    );

    React.useEffect(() => {
      const unsub = p.on("change", (latest) => {
        updateDOM(latest);
      });
      updateDOM(p.get());
      return () => {
        unsub();
        animationRef.current?.stop();
      };
    }, [p, updateDOM]);

    const animateTo = React.useCallback(
      (targetIndex: number) => {
        if (shouldReduceMotion) {
          p.set(targetIndex);
          return;
        }
        animationRef.current?.stop();
        animationRef.current = animate(p, targetIndex, {
          type: "spring",
          stiffness: 300,
          damping: 26,
          mass: 1,
        });
      },
      [p, shouldReduceMotion]
    );

    React.useEffect(() => {
      if (!isDraggingRef.current && safeIndex !== Math.round(p.get())) {
        animateTo(safeIndex);
        setCommittedIndex(safeIndex);
      }
    }, [safeIndex, animateTo, p]);

    const commitIndex = (idx: number) => {
      if (!isControlled) {
        setUncontrolledIndex(idx);
      }
      setCommittedIndex(idx);
      onIndexChange?.(idx);
    };

    const handleSelect = (idx: number) => {
      if (wasDraggedRef.current) {
        wasDraggedRef.current = false;
        return;
      }
      commitIndex(idx);
      animateTo(idx);
    };

    const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
      let targetIndex = -1;
      if (e.key === "ArrowRight") {
        targetIndex = Math.min(ranges.length - 1, currentIndex + 1);
      } else if (e.key === "ArrowLeft") {
        targetIndex = Math.max(0, currentIndex - 1);
      } else if (e.key === "Home") {
        targetIndex = 0;
      } else if (e.key === "End") {
        targetIndex = ranges.length - 1;
      }
      if (targetIndex !== -1) {
        e.preventDefault();
        commitIndex(targetIndex);
        animateTo(targetIndex);
        tabRefs.current[targetIndex]?.focus();
      }
    };

    const startPointerDrag = (
      e: React.PointerEvent<HTMLElement>,
      captureTarget: HTMLElement
    ) => {
      if (e.button !== 0) return;
      isPointerDownRef.current = true;
      isDraggingRef.current = false;
      wasDraggedRef.current = false;
      startXRef.current = e.clientX;
      pStartRef.current = p.get();
      animationRef.current?.stop();

      const rect = trackInnerRef.current?.getBoundingClientRect();
      colWidthRef.current = rect ? rect.width / ranges.length : 100;

      captureTarget.setPointerCapture(e.pointerId);
    };

    const movePointerDrag = (e: React.PointerEvent<HTMLElement>) => {
      if (!isPointerDownRef.current) return;
      const dx = e.clientX - startXRef.current;

      if (!isDraggingRef.current) {
        if (Math.abs(dx) >= 5) {
          isDraggingRef.current = true;
          wasDraggedRef.current = true;
          if (!shouldReduceMotion) {
            detentDotRefs.current.forEach((dot) => {
              if (dot) dot.style.opacity = "0.45";
            });
          }
        }
      }

      if (isDraggingRef.current) {
        const raw = Math.max(
          0,
          Math.min(ranges.length - 1, pStartRef.current + dx / colWidthRef.current)
        );
        const n = Math.round(raw);
        const nextP = n + (raw - n) * 0.5;
        p.set(nextP);
      }
    };

    const endPointerDrag = (
      e: React.PointerEvent<HTMLElement>,
      captureTarget: HTMLElement
    ) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;

      if (captureTarget.hasPointerCapture(e.pointerId)) {
        captureTarget.releasePointerCapture(e.pointerId);
      }

      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        detentDotRefs.current.forEach((dot) => {
          if (dot) dot.style.opacity = "0";
        });

        const target = Math.round(p.get());
        commitIndex(target);
        if (shouldReduceMotion) {
          p.set(target);
        } else {
          animateTo(target);
        }
        setTimeout(() => {
          wasDraggedRef.current = false;
        }, 50);
      }
    };

    const committedRange = ranges[committedIndex] ?? ranges[0];
    const liveAnnouncement = `${committedRange.label}: ${formatValue(committedRange.value)}${committedRange.delta ? `, ${committedRange.delta}` : ""}`;

    const setCombinedRef = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div
        ref={setCombinedRef}
        className={cn("w-full max-w-[420px] select-none text-foreground", className)}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-[14px] text-muted-foreground">{title}</span>
          <span
            ref={chipRef}
            className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[12px] font-medium tabular-nums text-foreground"
          >
            {committedRange.delta}
          </span>
        </div>

        <div
          ref={bigValueRef}
          className="text-[46px] font-semibold tracking-[-0.04em] tabular-nums leading-none mb-[22px]"
        >
          {formatValue(committedRange.value)}
        </div>

        <div
          role="tabpanel"
          id={`tabpanel-${uniqueId}`}
          aria-labelledby={`tab-${uniqueId}-${committedRange.id}`}
          className="relative w-full"
        >
          <div className="relative w-full h-[132px]">
            <svg
              viewBox="0 0 360 132"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="22"
                x2="360"
                y2="22"
                className="stroke-border"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="66"
                x2="360"
                y2="66"
                className="stroke-border"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="110"
                x2="360"
                y2="110"
                className="stroke-border"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <path
                ref={areaPathRef}
                className="fill-primary"
                fillOpacity={0.09}
              />
              <path
                ref={linePathRef}
                className="stroke-primary"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div
              ref={endDotRef}
              className="absolute pointer-events-none size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-[4px] ring-background"
              style={{ left: "100%" }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="relative mt-[10px] mb-[18px] h-[18px] w-full text-[12px] text-muted-foreground tabular-nums select-none">
          {ranges.map((range, i) => (
            <div
              key={range.id}
              ref={(el) => {
                axisSetRefs.current[i] = el;
              }}
              data-axis-set={i}
              className="absolute inset-0 grid grid-cols-3 items-center pointer-events-none"
            >
              <span className="text-left">{range.axis[0]}</span>
              <span className="text-center">{range.axis[1]}</span>
              <span className="text-right">{range.axis[2]}</span>
            </div>
          ))}
        </div>

        <div
          role="tablist"
          aria-label={`${title} range`}
          className="relative h-[42px] w-full rounded-full border border-border bg-muted p-[3px] touch-pan-y"
        >
          <div ref={trackInnerRef} className="relative h-full w-full">
            <div
              ref={thumbRef}
              onPointerDown={(e) => startPointerDrag(e, e.currentTarget)}
              onPointerMove={movePointerDrag}
              onPointerUp={(e) => endPointerDrag(e, e.currentTarget)}
              onPointerCancel={(e) => endPointerDrag(e, e.currentTarget)}
              className="absolute top-0 bottom-0 z-0 cursor-grab active:cursor-grabbing rounded-full border border-border bg-card dark:bg-input shadow-xs touch-none origin-center"
              style={{
                width: `${100 / ranges.length}%`,
              }}
              aria-hidden="true"
            />
            <div
              className="relative z-10 grid h-full w-full"
              style={{
                gridTemplateColumns: `repeat(${ranges.length}, minmax(0, 1fr))`,
              }}
            >
              {ranges.map((range, i) => {
                const isSelected = i === safeIndex;
                return (
                  <button
                    key={range.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`tab-${uniqueId}-${range.id}`}
                    aria-selected={isSelected}
                    aria-controls={`tabpanel-${uniqueId}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => handleSelect(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPointerDown={(e) => {
                      if (i === Math.round(p.get())) {
                        startPointerDrag(e, e.currentTarget);
                      }
                    }}
                    onPointerMove={movePointerDrag}
                    onPointerUp={(e) => endPointerDrag(e, e.currentTarget)}
                    onPointerCancel={(e) => endPointerDrag(e, e.currentTarget)}
                    className={cn(
                      "relative flex h-full w-full items-center justify-center rounded-full text-[14px] font-medium transition-colors select-none focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <span>{range.label}</span>
                    <span
                      ref={(el) => {
                        detentDotRefs.current[i] = el;
                      }}
                      className="pointer-events-none absolute bottom-1 size-[3px] rounded-full bg-foreground opacity-0 transition-opacity duration-200"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
DetentTabs.displayName = "DetentTabs";
