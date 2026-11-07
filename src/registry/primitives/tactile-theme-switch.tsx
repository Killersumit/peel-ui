"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TactileThemeSwitchProps {
  theme?: "dark" | "light";
  defaultTheme?: "dark" | "light";
  onThemeChange?: (theme: "dark" | "light") => void;
  showLabels?: boolean;
  className?: string;
}

export function TactileThemeSwitch({
  theme: explicitTheme,
  defaultTheme = "dark",
  onThemeChange,
  showLabels = true,
  className,
}: TactileThemeSwitchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Internal theme state for standalone usage
  const [internalTheme, setInternalTheme] = useState<"dark" | "light">(
    explicitTheme ?? defaultTheme
  );

  // Sync internal state when controlled explicitTheme changes
  useEffect(() => {
    if (explicitTheme !== undefined) {
      setInternalTheme(explicitTheme);
    }
  }, [explicitTheme]);

  // If inside Peel UI stage with data-stage-theme and explicitTheme is undefined, listen for stage theme
  useEffect(() => {
    if (explicitTheme !== undefined) return;

    const parent = containerRef.current?.closest("[data-stage-theme]");
    if (parent) {
      const val = parent.getAttribute("data-stage-theme");
      if (val === "light" || val === "dark") {
        setInternalTheme(val);
      }
    }
  }, [explicitTheme]);

  const activeTheme = explicitTheme ?? internalTheme;

  const handleSelectTheme = useCallback(
    (newTheme: "dark" | "light") => {
      if (newTheme === activeTheme) return;
      if (explicitTheme === undefined) {
        setInternalTheme(newTheme);
      }
      onThemeChange?.(newTheme);
    },
    [activeTheme, explicitTheme, onThemeChange]
  );

  const toggleTheme = useCallback(() => {
    const next = activeTheme === "dark" ? "light" : "dark";
    handleSelectTheme(next);
  }, [activeTheme, handleSelectTheme]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSelectTheme("light");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSelectTheme("dark");
    }
  };

  const isDark = activeTheme === "dark";

  return (
    <div
      ref={containerRef}
      role="switch"
      tabIndex={0}
      aria-label="Toggle color theme"
      aria-checked={isDark}
      onKeyDown={handleKeyDown}
      onClick={toggleTheme}
      className={cn(
        "h-[46px] p-1 rounded-[16px] inline-flex items-center relative select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors duration-200",
        isDark
          ? "bg-[#0B0C0E] shadow-[inset_0_2px_5px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.06),0_1px_0_rgba(255,255,255,0.05)] focus-visible:ring-indigo-500/50 focus-visible:ring-offset-[#060709]"
          : "bg-[#DED8CE] shadow-[inset_0_2px_4px_rgba(28,25,23,0.16),inset_0_0_0_1px_rgba(28,25,23,0.08),0_1px_0_rgba(255,255,255,0.8)] focus-visible:ring-amber-500/50 focus-visible:ring-offset-[#F5F3EF]",
        className
      )}
    >
      {/* Detent 1: Light (Left) */}
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectTheme("light");
        }}
        className="h-[38px] px-3.5 rounded-[12px] inline-flex items-center justify-center gap-2 relative z-10 cursor-pointer focus:outline-none"
      >
        {/* Sliding Raised Hardware Thumb when Light is Active */}
        {!isDark && (
          <motion.div
            layoutId="tactile-switch-thumb"
            transition={
              shouldReduceMotion
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 520, damping: 34, mass: 0.6 }
            }
            whileTap={{ scale: 0.96 }}
            className="absolute inset-0 rounded-[12px] bg-gradient-to-b from-[#FFFFFF] to-[#F4F1EA] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_4px_10px_-2px_rgba(28,25,23,0.15),0_0_0_1px_rgba(28,25,23,0.06)] pointer-events-none -z-10"
          >
            {/* Embedded Micro-LED Indicator Dot for Light mode (Solar Amber) */}
            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]"
              aria-hidden="true"
            />
          </motion.div>
        )}

        {/* Custom 16x16 SVG Sun Icon */}
        <span
          className={cn(
            "relative shrink-0 flex items-center justify-center transition-all duration-200",
            !isDark ? "ml-1" : ""
          )}
          style={{
            filter: !isDark
              ? "drop-shadow(0 0 6px rgba(245,158,11,0.35))"
              : "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Center Sun Core */}
            <circle
              cx="8"
              cy="8"
              r="3.2"
              fill={!isDark ? "#F59E0B" : isDark ? "#555961" : "#8C857B"}
              className="transition-colors duration-200"
            />
            {/* 8 Radial Spring Rays */}
            <motion.g
              animate={
                !isDark
                  ? { scale: 1, rotate: 0 }
                  : { scale: 0.85, rotate: -30 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.1 }
                  : { type: "spring", stiffness: 480, damping: 26 }
              }
              style={{ originX: "8px", originY: "8px" }}
              stroke={!isDark ? "#F59E0B" : isDark ? "#555961" : "#8C857B"}
              strokeWidth="1.35"
              strokeLinecap="round"
              className="transition-colors duration-200"
            >
              <line x1="8" y1="1.5" x2="8" y2="3.2" />
              <line x1="8" y1="12.8" x2="8" y2="14.5" />
              <line x1="1.5" y1="8" x2="3.2" y2="8" />
              <line x1="12.8" y1="8" x2="14.5" y2="8" />
              <line x1="3.4" y1="3.4" x2="4.6" y2="4.6" />
              <line x1="11.4" y1="11.4" x2="12.6" y2="12.6" />
              <line x1="3.4" y1="12.6" x2="4.6" y2="11.4" />
              <line x1="11.4" y1="4.6" x2="12.6" y2="3.4" />
            </motion.g>
          </svg>
        </span>

        {/* Text Label: Light */}
        {showLabels && (
          <span
            className={cn(
              "text-[13px] font-medium tracking-[-0.015em] transition-colors duration-200 whitespace-nowrap",
              !isDark
                ? "text-[#1C1917]"
                : isDark
                  ? "text-[#686C75]"
                  : "text-[#8C857B]"
            )}
          >
            Light
          </span>
        )}
      </button>

      {/* Detent 2: Dark (Right) */}
      <button
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          handleSelectTheme("dark");
        }}
        className="h-[38px] px-3.5 rounded-[12px] inline-flex items-center justify-center gap-2 relative z-10 cursor-pointer focus:outline-none"
      >
        {/* Sliding Raised Hardware Thumb when Dark is Active */}
        {isDark && (
          <motion.div
            layoutId="tactile-switch-thumb"
            transition={
              shouldReduceMotion
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 520, damping: 34, mass: 0.6 }
            }
            whileTap={{ scale: 0.96 }}
            className="absolute inset-0 rounded-[12px] bg-gradient-to-b from-[#23262E] to-[#17191E] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_12px_-2px_rgba(0,0,0,0.75),0_0_0_1px_rgba(0,0,0,0.6)] pointer-events-none -z-10"
          >
            {/* Embedded Micro-LED Indicator Dot for Dark mode (Lunar Indigo) */}
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-[#818CF8] shadow-[0_0_6px_#818CF8]"
              aria-hidden="true"
            />
          </motion.div>
        )}

        {/* Custom 16x16 SVG Moon Icon + 2 Micro-Stars */}
        <span
          className={cn(
            "relative shrink-0 flex items-center justify-center transition-all duration-200",
            isDark ? "mr-1" : ""
          )}
          style={{
            filter: isDark
              ? "drop-shadow(0 0 6px rgba(129,140,248,0.35))"
              : "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Crescent Moon Path */}
            <path
              d="M13.2 9.4C12.8 12.3 10.3 14.5 7.3 14.5C3.8 14.5 1 11.7 1 8.2C1 5.2 3.2 2.7 6.1 2.3C5.7 3.3 5.5 4.4 5.5 5.5C5.5 9.4 8.6 12.5 12.5 12.5C12.7 12.5 13 12.5 13.2 12.4V9.4Z"
              fill={isDark ? "#818CF8" : !isDark ? "#8C857B" : "#555961"}
              className="transition-colors duration-200"
            />
            {/* Star 1 (Top Right) */}
            <motion.path
              d="M12.5 2L13 3.5L14.5 4L13 4.5L12.5 6L12 4.5L10.5 4L12 3.5L12.5 2Z"
              fill="#A5B4FC"
              animate={
                isDark
                  ? { scale: 1, rotate: 0 }
                  : { scale: 0, rotate: -25 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.1 }
                  : { type: "spring", stiffness: 480, damping: 24 }
              }
              style={{ originX: "12.5px", originY: "4px" }}
            />
            {/* Star 2 (Bottom Right) */}
            <motion.path
              d="M13.5 8L13.8 8.8L14.6 9.1L13.8 9.4L13.5 10.2L13.2 9.4L12.4 9.1L13.2 8.8L13.5 8Z"
              fill="#A5B4FC"
              animate={
                isDark
                  ? { scale: 1, rotate: 0 }
                  : { scale: 0, rotate: -25 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.1 }
                  : { type: "spring", stiffness: 480, damping: 24, delay: 0.04 }
              }
              style={{ originX: "13.5px", originY: "9.1px" }}
            />
          </svg>
        </span>

        {/* Text Label: Dark */}
        {showLabels && (
          <span
            className={cn(
              "text-[13px] font-medium tracking-[-0.015em] transition-colors duration-200 whitespace-nowrap",
              isDark
                ? "text-[#F5F5F7]"
                : "text-[#8C857B]"
            )}
          >
            Dark
          </span>
        )}
      </button>
    </div>
  );
}
