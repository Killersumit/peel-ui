"use client";

import * as React from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface SlideToConfirmProps {
  /** Label displayed in idle state */
  label?: string;
  /** Label displayed upon successful confirmation */
  confirmedLabel?: string;
  /** Callback fired when slide passes 75% and locks */
  onConfirm?: () => void;
  /** Callback fired when state resets back to idle */
  onReset?: () => void;
  /** Optional milliseconds before auto-resetting (0 to disable) */
  autoResetTimeout?: number;
  /** Additional classes applied to wrapper */
  className?: string;
  /** Disable user interaction */
  disabled?: boolean;
}

export function SlideToConfirm({
  label = "Slide to deploy",
  confirmedLabel = "Executed",
  onConfirm,
  onReset,
  autoResetTimeout = 0,
  className,
  disabled = false,
}: SlideToConfirmProps) {
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Dynamic drag constraint: trackWidth - puckWidth(40) - padding*2(12)
  const [maxDrag, setMaxDrag] = React.useState<number>(288);

  // Hardware-accelerated drag coordinate (zero React state updates during drag)
  const x = useMotionValue(0);

  // Measure track width dynamically to calculate precise physical boundaries
  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const calculateBounds = () => {
      const width = el.clientWidth;
      const calculatedMax = Math.max(0, width - 40 - 12);
      setMaxDrag(calculatedMax);
      if (isConfirmed) {
        x.set(calculatedMax);
      }
    };

    calculateBounds();

    const resizeObserver = new ResizeObserver(() => {
      calculateBounds();
    });

    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, [isConfirmed, x]);

  // Center label opacity fades smoothly from 1 to 0 as the puck advances
  const idleLabelOpacity = useTransform(x, [0, maxDrag * 0.75 || 1], [1, 0]);

  // Progress fill expands horizontally behind the puck, capped to inner track width
  const fillWidth = useTransform(x, (currentX) => {
    const innerTrackWidth = (maxDrag || 288) + 40;
    const target = Math.max(40, currentX + 40);
    return `${Math.min(innerTrackWidth, target)}px`;
  });

  const reset = React.useCallback(() => {
    setIsConfirmed(false);
    animate(x, 0, {
      type: "spring",
      stiffness: shouldReduceMotion ? 1000 : 450,
      damping: shouldReduceMotion ? 100 : 35,
      mass: 0.8,
    });
    onReset?.();
  }, [x, shouldReduceMotion, onReset]);

  // Optional auto-reset timer
  React.useEffect(() => {
    if (isConfirmed && autoResetTimeout > 0) {
      const timer = setTimeout(() => {
        reset();
      }, autoResetTimeout);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, autoResetTimeout, reset]);

  const handleDragEnd = () => {
    if (disabled || isConfirmed) return;

    const currentX = x.get();
    const threshold = maxDrag * 0.75; // 75% Magnetic Gravity Pocket

    if (currentX >= threshold) {
      // Magnetically pull into lock position
      x.set(maxDrag);
      setIsConfirmed(true);
      onConfirm?.();
    } else {
      // Released under 75%: snap back to 0 with elastic recoil
      animate(x, 0, {
        type: "spring",
        stiffness: shouldReduceMotion ? 1000 : 450,
        damping: shouldReduceMotion ? 100 : 35,
        mass: 0.8,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (isConfirmed) {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        reset();
      }
      return;
    }
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      x.set(maxDrag);
      setIsConfirmed(true);
      onConfirm?.();
    }
  };

  return (
    <div className={cn("flex flex-col items-center w-full max-w-[340px]", className)}>
      {/* ── Outer Track Container (Decisive Track Latch) ── */}
      <div
        ref={trackRef}
        role="group"
        aria-label="Slide to confirm"
        className={cn(
          "w-full h-[52px] rounded-full p-1.5 relative overflow-hidden flex items-center select-none transition-colors duration-200",
          isConfirmed
            ? "border border-zinc-700 bg-zinc-900/90 shadow-sm"
            : "border border-zinc-800/80 bg-zinc-950/90",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        {/* ── Progress Fill Layer (Matte, zero outer glow) ── */}
        <motion.div
          style={{ width: fillWidth }}
          className={cn(
            "absolute left-1.5 top-1.5 bottom-1.5 rounded-full pointer-events-none transition-colors duration-200",
            isConfirmed ? "bg-[#84ff00]/15" : "bg-zinc-800/60"
          )}
        />

        {/* ── Center Label: Idle / Sliding ── */}
        <motion.div
          style={{ opacity: isConfirmed ? 0 : idleLabelOpacity }}
          className="absolute inset-0 flex items-center justify-center text-xs font-medium text-zinc-400 tracking-tight pointer-events-none select-none z-10"
        >
          {label}
        </motion.div>

        {/* ── Center Label: Confirmed ── */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center text-xs font-medium text-white pointer-events-none select-none z-10 transition-opacity duration-200",
            isConfirmed ? "opacity-100" : "opacity-0"
          )}
        >
          {confirmedLabel}
        </div>

        {/* ── Tactile Draggable Puck (Zero CSS transitions to prevent drag jitter) ── */}
        <motion.div
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={maxDrag > 0 ? Math.round((x.get() / maxDrag) * 100) : 0}
          aria-label={isConfirmed ? confirmedLabel : label}
          title={isConfirmed ? "Confirmed" : "Slide to confirm"}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          drag={!isConfirmed && !disabled ? "x" : false}
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={
            isConfirmed && !shouldReduceMotion
              ? { scale: [1, 1.12, 1] }
              : { scale: 1 }
          }
          transition={{
            duration: 0.22,
            times: [0, 0.45, 1],
            ease: "easeOut",
          }}
          style={{ x }}
          className={cn(
            "w-10 h-10 rounded-full z-20 flex items-center justify-center touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
            isConfirmed
              ? "bg-[#84ff00] text-zinc-950 shadow-sm"
              : "bg-zinc-100 text-zinc-950 cursor-grab active:cursor-grabbing shadow-sm"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isConfirmed ? (
              <motion.div
                key="check"
                initial={shouldReduceMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="flex items-center justify-center"
              >
                <Check className="size-4 stroke-[2.5]" />
              </motion.div>
            ) : (
              <motion.div
                key="arrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex items-center justify-center"
              >
                <ArrowRight className="size-4 stroke-[2.2]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Showcase Reset Trigger ── */}
      <div className="h-6 flex items-center justify-center mt-2.5">
        <AnimatePresence>
          {isConfirmed && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer select-none uppercase focus:outline-none"
            >
              <RotateCcw className="size-3" />
              <span>Reset demo</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
