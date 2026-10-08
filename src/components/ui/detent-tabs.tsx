"use client";

import * as React from "react";
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

    const generatedId = React.useId();
    const uniqueId = generatedId.replace(/:/g, "");
    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    const processedRanges = React.useMemo(() => {
      return ranges.map((range) => {
        const resampled = resamplePoints(range.points, 32);
        const normalized = normalizePoints(resampled);
        const coords = normalized.map((u, k) => ({
          x: (k / 31) * 360,
          y: 110 - u * 88,
        }));
        const lineD = pointsToPath(coords);
        const areaD = `${lineD} L 360 132 L 0 132 Z`;
        const yLast = coords[coords.length - 1]?.y ?? 110;
        return { lineD, areaD, yLast };
      });
    }, [ranges]);

    const currentRange = ranges[safeIndex] ?? ranges[0];
    const currentChart = processedRanges[safeIndex] ?? processedRanges[0];
    const formattedValue = formatValue(currentRange.value);
    const deltaText = currentRange.delta ? `, ${currentRange.delta}` : "";
    const announcement = `${currentRange.label}: ${formattedValue}${deltaText}`;

    const handleSelect = (idx: number) => {
      if (!isControlled) {
        setUncontrolledIndex(idx);
      }
      onIndexChange?.(idx);
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
        handleSelect(targetIndex);
        tabRefs.current[targetIndex]?.focus();
      }
    };

    return (
      <div
        ref={ref}
        className={cn("w-full max-w-[420px] select-none text-foreground", className)}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-[14px] text-muted-foreground">{title}</span>
          {currentRange.delta && (
            <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[12px] font-medium tabular-nums text-foreground">
              {currentRange.delta}
            </span>
          )}
        </div>

        <div className="text-[46px] font-semibold tracking-[-0.04em] tabular-nums leading-none mb-[22px]">
          {formattedValue}
        </div>

        <div
          role="tabpanel"
          id={`tabpanel-${uniqueId}`}
          aria-labelledby={`tab-${uniqueId}-${currentRange.id}`}
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
                d={currentChart.areaD}
                className="fill-primary"
                fillOpacity={0.09}
              />
              <path
                d={currentChart.lineD}
                className="stroke-primary"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div
              className="absolute pointer-events-none size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-[4px] ring-background"
              style={{
                left: "100%",
                top: `${(currentChart.yLast / 132) * 100}%`,
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="relative mt-[10px] mb-[18px] h-[18px] w-full text-[12px] text-muted-foreground tabular-nums select-none">
          {ranges.map((range, i) => {
            const opacity = Math.min(1, Math.max(0, 1 - 2 * Math.abs(safeIndex - i)));
            return (
              <div
                key={range.id}
                data-axis-set={i}
                style={{ opacity }}
                className="absolute inset-0 grid grid-cols-3 items-center pointer-events-none"
              >
                <span className="text-left">{range.axis[0]}</span>
                <span className="text-center">{range.axis[1]}</span>
                <span className="text-right">{range.axis[2]}</span>
              </div>
            );
          })}
        </div>

        <div
          role="tablist"
          aria-label={`${title} range`}
          className="relative h-[42px] w-full rounded-full border border-border bg-muted p-[3px] touch-pan-y"
        >
          <div className="relative h-full w-full">
            <div
              className="absolute top-0 bottom-0 rounded-full border border-border bg-card dark:bg-input shadow-xs"
              style={{
                width: `${100 / ranges.length}%`,
                transform: `translateX(${safeIndex * 100}%)`,
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
                    className={cn(
                      "relative flex h-full w-full items-center justify-center rounded-full text-[14px] font-medium transition-colors select-none focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <span>{range.label}</span>
                    <span
                      className="pointer-events-none absolute bottom-1 size-[3px] rounded-full bg-foreground opacity-0"
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
