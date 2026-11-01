"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "dark";

export interface BarData {
  day: string;
  dayFull: string;
  height: number;
  value: number;
  delta: number;
}

export const DEFAULT_BARS: BarData[] = [
  { day: "Mon", dayFull: "Monday", height: 74, value: 3210, delta: 8.2 },
  { day: "Tue", dayFull: "Tuesday", height: 110, value: 3940, delta: 12.1 },
  { day: "Wed", dayFull: "Wednesday", height: 86, value: 3480, delta: -4.6 },
  { day: "Thu", dayFull: "Thursday", height: 144, value: 4820, delta: 18.4 },
  { day: "Fri", dayFull: "Friday", height: 168, value: 5340, delta: 24.8 },
  { day: "Sat", dayFull: "Saturday", height: 96, value: 3610, delta: -2.1 },
  { day: "Sun", dayFull: "Sunday", height: 124, value: 4190, delta: 9.5 },
];

function getFaceColors(isSelected: boolean, isHovered: boolean, isDark: boolean) {
  if (isDark) {
    if (isSelected) {
      return { top: "#383B42", front: "#24262B", side: "#141519" };
    }
    return { top: "#22242A", front: isHovered ? "#1D1F24" : "#17181C", side: "#101114" };
  }
  if (isSelected) {
    return { top: "#3A3530", front: "#24201D", side: "#141210" };
  }
  return { top: "#E6E1D8", front: isHovered ? "#D0C9BC" : "#DCD6CB", side: "#C7C0B3" };
}

export interface Tactile3DBarProps {
  bars?: BarData[];
  theme?: ThemeMode;
  onSelectBar?: (day: string, value: number) => void;
  replayKey?: number;
  className?: string;
}

export function Tactile3DBar({
  bars = DEFAULT_BARS,
  theme: explicitTheme,
  onSelectBar,
  replayKey,
  className,
}: Tactile3DBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [domTheme, setDomTheme] = useState<ThemeMode>("dark");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Detect parent stage theme if explicitTheme is not provided
  useEffect(() => {
    if (explicitTheme) return;
    const parent = containerRef.current?.closest("[data-stage-theme]");
    if (parent) {
      const val = parent.getAttribute("data-stage-theme");
      if (val === "light" || val === "dark") {
        setDomTheme(val);
      }
    }
  }, [explicitTheme]);

  const theme = explicitTheme || domTheme || "dark";
  const isDark = theme === "dark";

  // Replay key resets selection
  useEffect(() => {
    if (replayKey !== undefined) {
      setSelectedIndex(null);
      setHoveredIndex(null);
    }
  }, [replayKey]);

  // Toggle selection
  const handleBarClick = useCallback(
    (index: number) => {
      setSelectedIndex((prev) => {
        const next = prev === index ? null : index;
        if (next !== null && bars[next]) {
          onSelectBar?.(bars[next].day, bars[next].value);
        }
        return next;
      });
    },
    [bars, onSelectBar]
  );

  // Keyboard navigation when a bar is selected
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedIndex === null) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedIndex((curr) => {
          if (curr === null) return null;
          const next = curr > 0 ? curr - 1 : bars.length - 1;
          onSelectBar?.(bars[next].day, bars[next].value);
          return next;
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedIndex((curr) => {
          if (curr === null) return null;
          const next = curr < bars.length - 1 ? curr + 1 : 0;
          onSelectBar?.(bars[next].day, bars[next].value);
          return next;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, bars, onSelectBar]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-[420px] min-h-[270px] flex flex-col justify-end select-none",
        isDark ? "text-[#F5F5F7]" : "text-[#1C1917]",
        className
      )}
    >
      {/* ── Background Veil (Click outside to dismiss selection) ── */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setSelectedIndex(null)}
            className="absolute inset-0 z-10 cursor-pointer pointer-events-auto"
            aria-label="Deselect active bar"
          />
        )}
      </AnimatePresence>

      {/* ── 7-Pillar Architectural Stage ── */}
      <div className="flex items-end justify-between w-full px-2 relative z-20">
        {bars.map((bar, index) => {
          const isSelected = selectedIndex === index;
          const isDimmed = selectedIndex !== null && !isSelected;
          const isHovered = selectedIndex === null && hoveredIndex === index;
          const faceColors = getFaceColors(isSelected, isHovered, isDark);

          return (
            <div
              key={bar.day}
              className={cn(
                "flex flex-col items-center flex-1 h-full justify-end relative",
                isSelected ? "z-30" : "z-10"
              )}
            >
              {/* ── DIRECT FLOATING TYPOGRAPHY ABOVE THE BAR (Zero Pin, Zero Line, Zero Box) ── */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    key="bar-readout"
                    layoutId="bar-readout"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{
                      position: "absolute",
                      bottom: bar.height + 14,
                      zIndex: 50,
                    }}
                    className={cn(
                      "pointer-events-none flex flex-col whitespace-nowrap",
                      index === 0
                        ? "items-start left-0"
                        : index >= 5
                          ? "items-end right-0"
                          : "items-center left-1/2 -translate-x-1/2"
                    )}
                  >
                    {/* Line 1 (Primary Value) */}
                    <div className="flex items-baseline gap-1">
                      <span
                        className={cn(
                          "font-sans text-[20px] font-semibold tracking-[-0.03em] leading-none tabular-nums",
                          isDark ? "text-[#F5F5F7]" : "text-[#1C1917]"
                        )}
                      >
                        {bar.value.toLocaleString()}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[11px]",
                          isDark ? "text-[#8E9299]" : "text-[#78716C]"
                        )}
                      >
                        req/s
                      </span>
                    </div>

                    {/* Line 2 (Muted Meta + Subtle Delta) */}
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] leading-none tabular-nums">
                      <span className={isDark ? "text-[#8E9299]" : "text-[#78716C]"}>
                        {bar.dayFull}
                      </span>
                      <span className={isDark ? "text-[#555961]" : "text-[#A8A29E]"}>·</span>
                      <span
                        className={
                          bar.delta >= 0
                            ? "text-[#76B872]"
                            : isDark
                              ? "text-[#8E9299]"
                              : "text-[#78716C]"
                        }
                      >
                        {bar.delta >= 0 ? `+${bar.delta}%` : `${bar.delta}%`}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── LAYER 1: Outer Blur & Opacity Wrapper (2D — handles focus dimming outside 3D space) ── */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? {
                        opacity: isDimmed ? 0.35 : 1,
                        scale: isDimmed ? 0.94 : 1,
                      }
                    : {
                        opacity: isDimmed ? 0.35 : 1,
                        scale: isDimmed ? 0.94 : 1,
                      }
                }
                style={{
                  filter: !shouldReduceMotion && isDimmed ? "blur(1.5px)" : "none",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="flex flex-col items-center justify-end"
              >
                {/* ── LAYER 2: Dedicated Per-Bar Perspective Camera (Guarantees identical vanishing angle) ── */}
                <div
                  style={{
                    perspective: "600px",
                    paddingTop: "16px",
                    paddingBottom: "6px",
                  }}
                  className="flex flex-col items-center justify-end"
                >
                  {/* ── LAYER 3: Pure 3D Cuboid Rig — ONLY transformStyle: "preserve-3d" and 3D rotations!
                      STRICT RULE: NEVER put opacity, filter, or overflow:hidden on this motion.div! ── */}
                  <motion.div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleBarClick(index)}
                    onMouseEnter={() => {
                      if (selectedIndex === null) setHoveredIndex(index);
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleBarClick(index);
                      }
                    }}
                    aria-label={`${bar.dayFull}: ${bar.value.toLocaleString()} req/s, ${bar.delta >= 0 ? `+${bar.delta}%` : `${bar.delta}%`}`}
                    aria-pressed={isSelected}
                    animate={
                      shouldReduceMotion
                        ? {
                            y: isSelected ? -8 : 0,
                          }
                        : {
                            rotateX: isSelected ? -18 : isHovered ? -10 : 0,
                            rotateY: isSelected
                              ? index >= 4 ? 28 : -28
                              : isHovered ? -14 : 0,
                            z: isSelected ? 28 : isHovered ? 8 : 0,
                            y: isSelected ? -8 : isHovered ? -3 : 0,
                          }
                    }
                    transition={{ type: "spring", stiffness: 360, damping: 26, mass: 0.75 }}
                    style={{
                      width: 36,
                      height: bar.height,
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transformOrigin: "50% 100%",
                    }}
                    className="cursor-pointer focus:outline-none pointer-events-auto"
                  >
                    {/* 1. FRONT FACE (36px x bar.height, translateZ(12px)) */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        transform: "translateZ(12px)",
                        backgroundColor: faceColors.front,
                      }}
                      className="rounded-[1px] transition-colors duration-150"
                    />

                    {/* 2. TOP ROOF FACE (36px x 24px, centered at y = 0, rotateX(90deg)) */}
                    <div
                      style={{
                        position: "absolute",
                        top: -12,
                        left: 0,
                        width: 36,
                        height: 24,
                        transform: "rotateX(90deg)",
                        backgroundColor: faceColors.top,
                      }}
                      className="rounded-[1px] transition-colors duration-150"
                    />

                    {/* 3. RIGHT SIDE WALL (24px x bar.height, pushed +18px to x = 36px) */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 6,
                        width: 24,
                        height: "100%",
                        transform: "rotateY(90deg) translateZ(18px)",
                        backgroundColor: faceColors.side,
                      }}
                      className="rounded-[1px] transition-colors duration-150"
                    />

                    {/* 4. LEFT SIDE WALL (24px x bar.height, pushed -18px to x = 0px) */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 6,
                        width: 24,
                        height: "100%",
                        transform: "rotateY(-90deg) translateZ(18px)",
                        backgroundColor: faceColors.side,
                      }}
                      className="rounded-[1px] transition-colors duration-150"
                    />
                  </motion.div>

                  {/* Floor Shadow */}
                  <motion.div
                    style={{
                      width: 30,
                      height: 6,
                      borderRadius: 3,
                    }}
                    animate={{
                      opacity: isSelected ? 0.5 : isDimmed ? 0.08 : 0.2,
                      scale: isSelected ? 1.25 : 1,
                    }}
                    className={cn(
                      "mt-1 pointer-events-none transition-opacity",
                      isDark ? "bg-black/90 blur-[3px]" : "bg-[#1C1917]/25 blur-[3px]"
                    )}
                  />
                </div>
              </motion.div>

              {/* Quiet Baseline Day Label */}
              <span
                className={cn(
                  "mt-1.5 font-mono text-[11px] tabular-nums transition-colors duration-150 leading-none select-none",
                  isSelected
                    ? isDark
                      ? "text-[#F5F5F7] font-semibold"
                      : "text-[#1C1917] font-semibold"
                    : isDark
                      ? "text-[#8E9299]"
                      : "text-[#78716C]"
                )}
              >
                {bar.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Tactile3DBar;
