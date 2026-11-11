"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type AiStatusPhase = "thinking" | "searching" | "writing" | "done";

export interface AiInlineStatusProps {
  theme?: "dark" | "light";
  replayKey?: number;
  onPhaseChange?: (phase: AiStatusPhase) => void;
  className?: string;
}

interface PhaseConfig {
  label: string;
  duration: number; // in milliseconds
  color: string;
}

const PHASES: Record<AiStatusPhase, PhaseConfig> = {
  thinking: {
    label: "Analyzing request...",
    duration: 1800,
    color: "#F59E0B", // Solar Amber
  },
  searching: {
    label: "Searching documentation...",
    duration: 2200, // 1800ms -> 4000ms
    color: "#38BDF8", // Sky Blue
  },
  writing: {
    label: "Synthesizing response...",
    duration: 1800, // 4000ms -> 5800ms
    color: "#818CF8", // Lunar Indigo
  },
  done: {
    label: "Thought for 5.8s",
    duration: 0,
    color: "#10B981", // Signal Emerald
  },
};

const RESPONSE_WORDS = [
  "Hardware-accelerated",
  "compositor",
  "layers",
  "prevent",
  "layout",
  "thrashing.",
  "Leverage",
  "CSS",
  "__TOKEN_TRANSFORM__",
  "and",
  "__TOKEN_PRESERVE__",
  "for",
  "fluid",
  "120fps",
  "spatial",
  "projection",
  "without",
  "repainting",
  "the",
  "surrounding",
  "DOM",
  "tree.",
];

export function AiInlineStatus({
  theme: explicitTheme,
  replayKey,
  onPhaseChange,
  className,
}: AiInlineStatusProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Internal theme detection with parent stage theme support
  const [domTheme, setDomTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (explicitTheme) return;

    const updateFromContext = () => {
      const parent = containerRef.current?.closest("[data-stage-theme]");
      if (parent) {
        const val = parent.getAttribute("data-stage-theme");
        if (val === "light" || val === "dark") {
          setDomTheme(val);
          return;
        }
      }
      const isDocDark = document.documentElement.classList.contains("dark");
      setDomTheme(isDocDark ? "dark" : "light");
    };

    updateFromContext();
    const observer = new MutationObserver(updateFromContext);
    if (containerRef.current) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-stage-theme"],
      });
    }
    return () => observer.disconnect();
  }, [explicitTheme]);

  const activeTheme = explicitTheme ?? domTheme;
  const isDark = activeTheme === "dark";

  // Phase & Time State
  const [phase, setPhase] = useState<AiStatusPhase>("thinking");
  const [elapsed, setElapsed] = useState(0);
  const [cycleId, setCycleId] = useState(0);

  const resetSequence = useCallback(() => {
    setPhase("thinking");
    setElapsed(0);
    setCycleId((c) => c + 1);
  }, []);

  // React to replayKey changes from workspace
  useEffect(() => {
    if (replayKey !== undefined && replayKey > 0) {
      resetSequence();
    }
  }, [replayKey, resetSequence]);

  // Notify parent of phase change
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  // Sequence timer orchestration
  useEffect(() => {
    let timer1: ReturnType<typeof setTimeout>;
    let timer2: ReturnType<typeof setTimeout>;
    let timer3: ReturnType<typeof setTimeout>;

    const startTime = performance.now();

    const totalDuration =
      (PHASES.thinking.duration +
        PHASES.searching.duration +
        PHASES.writing.duration) /
      1000;

    // Elapsed counter interval (75ms ticks)
    const interval = setInterval(() => {
      const diff = (performance.now() - startTime) / 1000;
      if (diff >= totalDuration) {
        setElapsed(totalDuration);
        clearInterval(interval);
      } else {
        setElapsed(diff);
      }
    }, 75);

    timer1 = setTimeout(() => {
      setPhase("searching");
    }, PHASES.thinking.duration);

    timer2 = setTimeout(() => {
      setPhase("writing");
    }, PHASES.thinking.duration + PHASES.searching.duration);

    timer3 = setTimeout(() => {
      setPhase("done");
      setElapsed(totalDuration);
    }, PHASES.thinking.duration + PHASES.searching.duration + PHASES.writing.duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(interval);
    };
  }, [cycleId]);

  const isDone = phase === "done";

  // Glint gradient definition
  const glintGradient = useMemo(() => {
    return isDark
      ? "linear-gradient(110deg, #686E7A 0%, #686E7A 36%, #FFFFFF 50%, #686E7A 64%, #686E7A 100%)"
      : "linear-gradient(110deg, #8C857B 0%, #8C857B 36%, #1C1917 50%, #8C857B 64%, #8C857B 100%)";
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-[380px] flex flex-col items-start gap-2.5 select-none",
        className
      )}
    >
      {/* ── A. The Inline Status Line ── */}
      <button
        type="button"
        disabled={!isDone}
        onClick={isDone ? resetSequence : undefined}
        title={isDone ? "Click to replay generation sequence" : undefined}
        className={cn(
          "inline-flex items-center gap-2.5 h-6 text-left group transition-opacity focus:outline-none",
          isDone ? "cursor-pointer" : "cursor-default"
        )}
      >
        {/* 1. Kinetic 16×16 Multi-Phase SVG Icon */}
        <div className="relative size-4 shrink-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {phase === "thinking" && (
              <motion.div
                key="thinking"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.55, rotate: -30 }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.55, rotate: 30 }
                }
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="size-4 flex items-center justify-center"
              >
                {/* 4-Point Star / Sparkle in Solar Amber with continuous 360 rotation */}
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { rotate: 360 }
                  }
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="size-4 text-[#F59E0B]"
                >
                  <path
                    d="M8 0.5C8 4.64 4.64 8 0.5 8C4.64 8 8 11.36 8 15.5C8 11.36 11.36 8 15.5 8C11.36 8 8 4.64 8 0.5Z"
                    fill="currentColor"
                  />
                </motion.svg>
              </motion.div>
            )}

            {phase === "searching" && (
              <motion.div
                key="searching"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.55, rotate: -30 }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.55, rotate: 30 }
                }
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="size-4 flex items-center justify-center"
              >
                {/* Globe / Radar SVG in Sky Blue with orbital scale pulse */}
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { scale: [0.92, 1.08, 0.92] }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="size-4 text-[#38BDF8]"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                  <ellipse
                    cx="8"
                    cy="8"
                    rx="2.8"
                    ry="6.5"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                  <line
                    x1="1.5"
                    y1="8"
                    x2="14.5"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  />
                </motion.svg>
              </motion.div>
            )}

            {phase === "writing" && (
              <motion.div
                key="writing"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.55, rotate: -30 }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.55, rotate: 30 }
                }
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="size-4 flex items-center justify-center"
              >
                {/* Dual-Sparkle / Synthesis SVG in Lunar Indigo with breathing scale */}
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { scale: [0.94, 1.06, 0.94] }
                  }
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="size-4 text-[#818CF8]"
                >
                  <path
                    d="M6 1C6 3.76 3.76 6 1 6C3.76 6 6 8.24 6 11C6 8.24 8.24 6 11 6C8.24 6 6 3.76 6 1Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.5 9.5C12.5 11 11 12.5 9.5 12.5C11 12.5 12.5 14 12.5 15.5C12.5 14 14 12.5 15.5 12.5C14 12.5 12.5 11 12.5 9.5Z"
                    fill="currentColor"
                  />
                </motion.svg>
              </motion.div>
            )}

            {phase === "done" && (
              <motion.div
                key="done"
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.55, rotate: -30 }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.55, rotate: 30 }
                }
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="size-4 flex items-center justify-center"
              >
                {/* Self-drawing checkmark stroke in Signal Emerald */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-[#10B981]"
                >
                  <motion.path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Middle — Vertical Slot-Rolled Glinting Text */}
        <div className="relative h-6 flex items-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={phase}
              initial={shouldReduceMotion ? { opacity: 0 } : { y: 8, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { y: -8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 460, damping: 32 }}
              className="inline-flex items-center"
            >
              {isDone ? (
                /* Settled Solid Text */
                <span
                  className={cn(
                    "text-[13.5px] font-medium tracking-[-0.015em] transition-colors inline-flex items-center gap-1.5",
                    isDark
                      ? "text-[#8E9299] group-hover:text-[#F5F5F7]"
                      : "text-[#78716C] group-hover:text-[#1C1917]"
                  )}
                >
                  <span>{PHASES.done.label}</span>
                  {/* Subtle ↻ replay icon on hover */}
                  <span
                    className={cn(
                      "opacity-0 group-hover:opacity-100 transition-all duration-150 inline-flex items-center transform group-hover:rotate-45",
                      isDark ? "text-[#8E9299]" : "text-[#78716C]"
                    )}
                    aria-hidden="true"
                  >
                    <ArrowCounterClockwise size={12} weight="bold" />
                  </span>
                </span>
              ) : (
                /* Travelling Light Glinting Text Shader */
                <motion.span
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { backgroundPosition: ["120% 0%", "-120% 0%"] }
                  }
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundImage: glintGradient,
                    backgroundSize: "220% 100%",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  className="text-[13.5px] font-medium tracking-[-0.015em] whitespace-nowrap inline-block"
                >
                  {PHASES[phase].label}
                </motion.span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. Live Elapsed Timer */}
        {!isDone && (
          <span
            className={cn(
              "font-mono text-[11.5px] tabular-nums transition-opacity duration-150",
              isDark ? "text-[#8E9299] opacity-55" : "text-[#78716C] opacity-60"
            )}
          >
            {elapsed.toFixed(1)}s
          </span>
        )}
      </button>

      {/* ── B. Unboxed Inline Streamed Response ── */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-full text-[14px] leading-[1.65] tracking-[-0.01em] text-pretty",
              isDark ? "text-[#ECEEF2]" : "text-[#1C1917]"
            )}
          >
            {RESPONSE_WORDS.map((token, i) => {
              if (token === "__TOKEN_TRANSFORM__") {
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.16,
                      delay: shouldReduceMotion ? 0 : i * 0.018,
                    }}
                    className={cn(
                      "font-mono text-[13px] mr-1 inline-block",
                      isDark ? "text-[#38BDF8]" : "text-[#0284C7]"
                    )}
                  >
                    transform
                  </motion.span>
                );
              }

              if (token === "__TOKEN_PRESERVE__") {
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.16,
                      delay: shouldReduceMotion ? 0 : i * 0.018,
                    }}
                    className={cn(
                      "font-mono text-[13px] mr-1 inline-block",
                      isDark ? "text-[#38BDF8]" : "text-[#0284C7]"
                    )}
                  >
                    preserve-3d
                  </motion.span>
                );
              }

              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.16,
                    delay: shouldReduceMotion ? 0 : i * 0.018,
                  }}
                  className="mr-1 inline-block"
                >
                  {token}
                </motion.span>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
