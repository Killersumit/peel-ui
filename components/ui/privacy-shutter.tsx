"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import { Lock, Unlock, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PrivacyShutterProps {
  /** The sensitive key to conceal/reveal (default: "sk_live_51M0x9F4kL2026peel") */
  apiKey?: string;
  /** Masked representation shown when covered (default: "sk_live_••••••••38f2") */
  maskedKey?: string;
  /** Section label (default: "Production Key") */
  label?: string;
  /** Callback fired when key is copied */
  onCopy?: (key: string) => void;
  /** Callback fired when lock state toggles */
  onToggleLock?: (isLockedOpen: boolean) => void;
  /** Additional container styling */
  className?: string;
}

const DEFAULT_KEY = "sk_live_51M0x9F4kL2026peel";
const DEFAULT_MASKED = "sk_live_••••••••38f2";

export function PrivacyShutter({
  apiKey = DEFAULT_KEY,
  maskedKey = DEFAULT_MASKED,
  label = "Production Key",
  onCopy,
  onToggleLock,
  className,
}: PrivacyShutterProps) {
  const [isLockedOpen, setIsLockedOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Hardware-accelerated drag coordinate (zero React state updates in the drag loop)
  const x = useMotionValue(0);

  // Dynamic travel distance: trackWidth - copyButtonArea - gripHandleWidth
  const [maxDrag, setMaxDrag] = React.useState<number>(170);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const calculateBounds = () => {
      const width = el.clientWidth;
      // Copy button takes ~44px on right, leave ~54px grip tab visible at max drag
      // so the user can easily pull it back shut
      const calculatedMax = Math.max(80, width - 44 - 54);
      setMaxDrag(calculatedMax);
      if (isLockedOpen) {
        x.set(calculatedMax);
      }
    };

    calculateBounds();

    const resizeObserver = new ResizeObserver(() => {
      calculateBounds();
    });

    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, [isLockedOpen, x]);

  // Shutter label smoothly fades out as the plate moves right
  const labelOpacity = useTransform(x, [0, 45], [1, 0]);

  // Spring physics specification (strict tactile mechanical transition)
  const springConfig = React.useMemo(
    () => ({
      type: "spring" as const,
      stiffness: shouldReduceMotion ? 1000 : 500,
      damping: shouldReduceMotion ? 100 : 32,
      mass: 0.8,
    }),
    [shouldReduceMotion]
  );

  const snapOpen = React.useCallback(() => {
    setIsLockedOpen(true);
    animate(x, maxDrag, springConfig);
    onToggleLock?.(true);
  }, [x, maxDrag, springConfig, onToggleLock]);

  const snapShut = React.useCallback(() => {
    setIsLockedOpen(false);
    animate(x, 0, springConfig);
    onToggleLock?.(false);
  }, [x, springConfig, onToggleLock]);

  const toggleLock = React.useCallback(() => {
    if (isLockedOpen) {
      snapShut();
    } else {
      snapOpen();
    }
  }, [isLockedOpen, snapOpen, snapShut]);

  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();
    const threshold = maxDrag * 0.8; // 80% Latch Detent

    if (currentX >= threshold) {
      snapOpen();
    } else {
      snapShut();
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(apiKey);
      }
      setCopied(true);
      onCopy?.(apiKey);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleLock();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      snapOpen();
    } else if (e.key === "ArrowLeft" || e.key === "Escape") {
      e.preventDefault();
      snapShut();
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-[440px] mx-auto select-none",
        className
      )}
    >
      {/* ── Chassis Container ── */}
      <div className="relative flex flex-col gap-2 p-3.5 rounded-2xl bg-[#121212]/95 border border-[#262626] shadow-inner">
        {/* ── Top Label Row ── */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            <span className="text-[11px] font-medium text-neutral-400 tracking-tight">
              {label}
            </span>
          </div>

          {/* Quick Lock/Unlock Toggle Button */}
          <button
            type="button"
            onClick={toggleLock}
            title={isLockedOpen ? "Lock key (shut shutter)" : "Unlock key (open shutter)"}
            aria-label={isLockedOpen ? "Lock key" : "Unlock key"}
            className="size-6 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444444] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
          >
            {isLockedOpen ? (
              <Unlock className="size-3 text-neutral-200" />
            ) : (
              <Lock className="size-3 text-neutral-400" />
            )}
          </button>
        </div>

        {/* ── Key Track & Sliding Shutter Stage ── */}
        <div
          ref={trackRef}
          role="region"
          aria-label="API key secret track"
          className={cn(
            "relative h-11 w-full rounded-xl bg-[#09090b] border flex items-center px-1.5 overflow-hidden transition-colors duration-200",
            isLockedOpen ? "border-[#3a3a3a]" : "border-[#222222]"
          )}
        >
          {/* ── Underlying Revealed Key Text (Base Layer) ── */}
          <div className="absolute left-3.5 right-12 inset-y-0 flex items-center overflow-hidden pointer-events-none select-none">
            <span className="font-mono text-xs text-neutral-200 tracking-wider truncate select-all">
              {isLockedOpen || isDragging ? apiKey : maskedKey}
            </span>
          </div>

          {/* ── The Sliding Shutter Plate (Physical Chamfered Cover) ── */}
          <motion.div
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={maxDrag > 0 ? Math.round((x.get() / maxDrag) * 100) : 0}
            aria-label="Drag shutter to reveal key"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            drag="x"
            dragConstraints={{ left: 0, right: maxDrag }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            onClick={() => {
              if (isLockedOpen && !isDragging) {
                snapShut();
              }
            }}
            style={{ x }}
            className={cn(
              "absolute inset-y-1 left-1 right-12 rounded-lg bg-[#1e1e1e] border border-[#3a3a3a] shadow-md flex items-center justify-between px-3 z-20 touch-none select-none outline-none focus-visible:ring-1 focus-visible:ring-neutral-400",
              isDragging ? "cursor-grabbing" : "cursor-grab",
              "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/10"
            )}
          >
            {/* Shutter Label (Fades out when sliding) */}
            <motion.div
              style={{ opacity: labelOpacity }}
              className="flex items-center gap-1.5 pointer-events-none select-none"
            >
              <Lock className="size-3 text-neutral-400 shrink-0" />
              <span className="text-[10px] text-neutral-400 font-sans font-medium uppercase tracking-wider">
                Slide to reveal
              </span>
            </motion.div>

            {/* Shutter Finger Grip Ribs (3 vertical etched lines) */}
            <div
              className="flex items-center gap-1 py-1 px-0.5 ml-auto pointer-events-none"
              title="Grip ribs"
            >
              <div className="w-[1.5px] h-3.5 rounded-full bg-[#4a4a4a]" />
              <div className="w-[1.5px] h-3.5 rounded-full bg-[#4a4a4a]" />
              <div className="w-[1.5px] h-3.5 rounded-full bg-[#4a4a4a]" />
            </div>
          </motion.div>

          {/* ── Integrated Right Copy Action Button (Always Accessible, z-30) ── */}
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copied to clipboard" : "Copy API key"}
            aria-label={copied ? "Copied" : "Copy API key"}
            className={cn(
              "w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#333333] hover:border-[#555555] flex items-center justify-center text-neutral-400 hover:text-white transition-all active:scale-95 ml-auto z-30 shrink-0 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-neutral-400",
              copied && "border-[#84ff00]/60 text-[#84ff00] bg-[#84ff00]/10"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="size-3.5 stroke-[2.5]" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Copy className="size-3.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
}
