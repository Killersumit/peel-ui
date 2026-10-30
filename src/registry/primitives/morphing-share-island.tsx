import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";
import {
  ShareNetwork,
  LinkSimple,
  XLogo,
  PaperPlaneTilt,
  QrCode,
  X,
  CheckCircle,
  DotsSixVertical,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ShareIslandTheme = "obsidian" | "paper" | "titanium";
export type ShareAction = "copy" | "post" | "send" | "qr";

export interface MorphingShareIslandProps {
  defaultTheme?: ShareIslandTheme;
  shareUrl?: string;
  onAction?: (action: ShareAction) => void;
  showControls?: boolean;
  className?: string;
  /** Peel UI Registry standard preview props */
  theme?: "dark" | "light";
  replayKey?: number;
}

interface ActionDef {
  id: ShareAction;
  label: string;
  confirmation: string;
  icon: typeof LinkSimple;
  stiffness: number;
}

const ACTIONS: ActionDef[] = [
  {
    id: "copy",
    label: "Copy",
    confirmation: "Copied",
    icon: LinkSimple,
    stiffness: 400,
  },
  {
    id: "post",
    label: "Post",
    confirmation: "Posted",
    icon: XLogo,
    stiffness: 360,
  },
  {
    id: "send",
    label: "Send",
    confirmation: "Sent",
    icon: PaperPlaneTilt,
    stiffness: 320,
  },
  {
    id: "qr",
    label: "QR",
    confirmation: "Saved QR",
    icon: QrCode,
    stiffness: 280,
  },
];

export function MorphingShareIsland({
  defaultTheme = "obsidian",
  shareUrl = "https://peel-ui.vercel.app",
  onAction,
  showControls = true,
  className,
  theme: outerTheme,
  replayKey,
}: MorphingShareIslandProps) {
  const shouldReduceMotion = useReducedMotion();

  // Active theme (obsidian | paper | titanium)
  const [activeTheme, setActiveTheme] = useState<ShareIslandTheme>(() => {
    if (outerTheme === "light") return "paper";
    return defaultTheme;
  });

  // State: "idle" | "expanded" | "confirmed"
  const [state, setState] = useState<"idle" | "expanded" | "confirmed">("idle");
  const [confirmedAction, setConfirmedAction] = useState<ActionDef | null>(null);
  const [hoveredAction, setHoveredAction] = useState<ShareAction | null>(null);

  // Timeouts ref for cleanup
  const timeoutRefs = useRef<number[]>([]);
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach((id) => window.clearTimeout(id));
    timeoutRefs.current = [];
  }, []);

  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Sync with outer Peel UI theme toggle ONLY when the outerTheme prop changes
  const prevOuterThemeRef = useRef(outerTheme);
  useEffect(() => {
    if (prevOuterThemeRef.current !== outerTheme) {
      prevOuterThemeRef.current = outerTheme;
      if (outerTheme === "light") {
        setActiveTheme("paper");
      } else if (outerTheme === "dark") {
        setActiveTheme("obsidian");
      }
    }
  }, [outerTheme]);

  // Handle Action Trigger
  const handleAction = useCallback(
    (actionDef: ActionDef) => {
      clearAllTimeouts();

      if (actionDef.id === "copy" && typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).catch(() => {
          // Ignore clipboard permission errors
        });
      }

      onAction?.(actionDef.id);
      setConfirmedAction(actionDef);
      setState("confirmed");

      // Auto-revert back to idle after 1400ms
      const resetTimer = window.setTimeout(() => {
        setState("idle");
        setConfirmedAction(null);
      }, 1400);
      timeoutRefs.current.push(resetTimer);
    },
    [clearAllTimeouts, onAction, shareUrl]
  );

  // Automated hands-free replay sequence
  const handleReplay = useCallback(() => {
    clearAllTimeouts();
    setState("idle");
    setConfirmedAction(null);
    setHoveredAction(null);

    const step1 = window.setTimeout(() => {
      setState("expanded");
    }, 180);

    const step2 = window.setTimeout(() => {
      setHoveredAction("copy");
    }, 700);

    const step3 = window.setTimeout(() => {
      setHoveredAction(null);
      handleAction(ACTIONS[0]);
    }, 1300);

    timeoutRefs.current.push(step1, step2, step3);
  }, [clearAllTimeouts, handleAction]);

  // External replay key trigger from StageControlBar / Workspace
  useEffect(() => {
    if (replayKey && replayKey > 0) {
      handleReplay();
    }
  }, [replayKey, handleReplay]);

  // Theme-specific styling classes
  const themeClasses = {
    obsidian: {
      stageBg: "bg-[#0A0A0B] border-white/[0.05]",
      pillBg: "bg-[#18181B] text-[#F5F5F7] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09),0_10px_24px_-6px_rgba(0,0,0,0.6)]",
      actionBtn: "bg-[#222226] text-[#F5F5F7] hover:bg-[#2A2A30] active:scale-95",
      closeBtn: "bg-[#222226] text-[#8E9299] hover:text-[#F5F5F7] hover:bg-[#2A2A30]",
      divider: "bg-white/10",
      tooltip: "bg-[#222226] text-[#F5F5F7] border border-white/[0.08] shadow-[0_6px_16px_rgba(0,0,0,0.7)]",
      accent: "text-[#5E9E5A]",
    },
    paper: {
      stageBg: "bg-[#FFFFFF] border-black/[0.08] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]",
      pillBg: "bg-[#F4F4F6] text-[#0A0A0B] border border-black/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,1),0_10px_24px_-6px_rgba(0,0,0,0.08)]",
      actionBtn: "bg-[#FFFFFF] text-[#0A0A0B] border border-black/[0.08] hover:bg-[#EBEBEF] shadow-[0_1px_3px_rgba(0,0,0,0.06)] active:scale-95",
      closeBtn: "bg-[#FFFFFF] text-[#71717A] border border-black/[0.08] hover:text-[#0A0A0B] hover:bg-[#EBEBEF] shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
      divider: "bg-black/10",
      tooltip: "bg-[#18181B] text-[#F5F5F7] border border-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.25)]",
      accent: "text-[#16A34A]",
    },
    titanium: {
      stageBg: "bg-[#08090A] border-white/[0.07]",
      pillBg: "bg-gradient-to-b from-[#1E2024] to-[#141518] text-[#F5F5F7] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_10px_24px_-6px_rgba(0,0,0,0.7)]",
      actionBtn: "bg-gradient-to-b from-[#2A2D34] to-[#1F2126] text-[#F5F5F7] hover:from-[#32363E] hover:to-[#26282E] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] active:scale-95",
      closeBtn: "bg-[#1F2126] text-[#8E9299] hover:text-[#F5F5F7] hover:bg-[#2A2D34]",
      divider: "bg-white/10",
      tooltip: "bg-[#2A2D34] text-[#F5F5F7] border border-white/[0.1] shadow-[0_6px_16px_rgba(0,0,0,0.8)]",
      accent: "text-[#84FF00]",
    },
  }[activeTheme];

  return (
    <div
      className={cn(
        "relative w-full max-w-[420px] min-h-[180px] sm:min-h-[240px] rounded-[20px] p-4 sm:p-6 flex flex-col items-center justify-between border transition-colors duration-300 select-none",
        themeClasses.stageBg,
        className
      )}
    >
      {/* ── 1. Center Stage: Morphing Share Island ── */}
      <div className="flex-1 w-full flex items-center justify-center relative">
        <motion.div
          layout
          transition={
            shouldReduceMotion
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 420, damping: 28, mass: 0.75 }
          }
          className={cn(
            "relative z-10 transition-colors duration-200",
            state === "expanded"
              ? cn("p-1.5 rounded-full flex items-center gap-1.5", themeClasses.pillBg)
              : cn(
                  "rounded-full px-4 py-2.5 inline-flex items-center gap-2 cursor-pointer",
                  themeClasses.pillBg
                )
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {/* ==============================================================
                STATE 1: IDLE (Resting Pill)
                ============================================================== */}
            {state === "idle" && (
              <motion.button
                key="idle"
                type="button"
                onClick={() => setState("expanded")}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="inline-flex items-center gap-2 cursor-pointer focus:outline-none"
                aria-label="Open share options"
              >
                <ShareNetwork size={16} weight="bold" />
                <span className="font-sans text-[13.5px] font-medium tracking-[-0.015em] whitespace-nowrap">
                  Share
                </span>
              </motion.button>
            )}

            {/* ==============================================================
                STATE 2: EXPANDED (Action Dock)
                ============================================================== */}
            {state === "expanded" && (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                {ACTIONS.map((act, index) => {
                  const Icon = act.icon;
                  const isHovered = hoveredAction === act.id;

                  return (
                    <div key={act.id} className="relative flex flex-col items-center">
                      {/* Floating Micro-Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            layoutId="share-island-tooltip"
                            initial={{ opacity: 0, y: 4, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 2, scale: 0.9 }}
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 30,
                            }}
                            className={cn(
                              "absolute -top-8 px-2 py-0.5 rounded-[6px] text-[11px] font-mono tracking-tight pointer-events-none whitespace-nowrap z-30",
                              themeClasses.tooltip
                            )}
                          >
                            {act.label}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tactile Action Button */}
                      <motion.button
                        type="button"
                        onClick={() => handleAction(act)}
                        onMouseEnter={() => setHoveredAction(act.id)}
                        onMouseLeave={() => setHoveredAction(null)}
                        onFocus={() => setHoveredAction(act.id)}
                        onBlur={() => setHoveredAction(null)}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { scale: 0.5, y: 5, opacity: 0 }
                        }
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { scale: 1, y: 0, opacity: 1 }
                        }
                        whileHover={
                          shouldReduceMotion
                            ? undefined
                            : { y: -2, scale: 1.06 }
                        }
                        whileTap={
                          shouldReduceMotion ? undefined : { scale: 0.92 }
                        }
                        transition={{
                          type: "spring",
                          stiffness: act.stiffness,
                          damping: 24,
                          mass: 0.7,
                          delay: index * 0.025,
                        }}
                        aria-label={`Share via ${act.label}`}
                        className={cn(
                          "size-9 rounded-full flex items-center justify-center relative cursor-pointer focus:outline-none transition-colors",
                          themeClasses.actionBtn
                        )}
                      >
                        <Icon size={16} weight="bold" />
                      </motion.button>
                    </div>
                  );
                })}

                {/* Hairline Divider */}
                <div
                  className={cn("w-[1px] h-4 mx-0.5", themeClasses.divider)}
                  aria-hidden="true"
                />

                {/* Circular Close Button */}
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  aria-label="Close share menu"
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center cursor-pointer focus:outline-none transition-colors",
                    themeClasses.closeBtn
                  )}
                >
                  <X size={13} weight="bold" />
                </button>
              </motion.div>
            )}

            {/* ==============================================================
                STATE 3: CONFIRMED (Confirmation Morph)
                ============================================================== */}
            {state === "confirmed" && confirmedAction && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{
                  type: "spring",
                  stiffness: 460,
                  damping: 30,
                  mass: 0.7,
                }}
                className="inline-flex items-center gap-2 cursor-default select-none"
              >
                <span className={cn("inline-flex items-center", themeClasses.accent)}>
                  <CheckCircle size={16} weight="fill" />
                </span>
                <span className="font-sans text-[13.5px] font-medium tracking-[-0.015em] whitespace-nowrap">
                  {confirmedAction.confirmation}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── 2. Stage-Contained Playground Dock Pill (NO fixed bottom-8!) ── */}
      {showControls && (
        <div className="rounded-full px-3 py-1.5 bg-[#121214] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.5)] flex items-center gap-2.5 border border-white/[0.04] relative z-20">
          {/* Grip Icon */}
          <span className="text-[#555961] inline-flex items-center" aria-hidden="true">
            <DotsSixVertical size={16} weight="bold" />
          </span>

          {/* Theme Swatches (STRICTLY NO BLUE) */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Theme presets">
            {/* 1. Obsidian */}
            <button
              type="button"
              onClick={() => setActiveTheme("obsidian")}
              aria-label="Obsidian Dark theme"
              className={cn(
                "size-5 rounded-[6px] bg-[#18181B] transition-transform cursor-pointer",
                activeTheme === "obsidian"
                  ? "ring-2 ring-white/70 scale-105"
                  : "ring-1 ring-white/20 hover:scale-105"
              )}
            />

            {/* 2. White Mode */}
            <button
              type="button"
              onClick={() => setActiveTheme("paper")}
              aria-label="White theme"
              className={cn(
                "size-5 rounded-[6px] bg-[#FFFFFF] border border-black/25 transition-transform cursor-pointer",
                activeTheme === "paper"
                  ? "ring-2 ring-[var(--peel-lime)] scale-105 shadow-[0_0_8px_rgba(132,255,0,0.4)]"
                  : "ring-1 ring-white/20 hover:scale-105"
              )}
            />

            {/* 3. Titanium Lime */}
            <button
              type="button"
              onClick={() => setActiveTheme("titanium")}
              aria-label="Anodized Titanium Lime theme"
              className={cn(
                "size-5 rounded-[6px] bg-[#262930] flex items-center justify-center transition-transform cursor-pointer",
                activeTheme === "titanium"
                  ? "ring-2 ring-white/70 scale-105"
                  : "ring-1 ring-white/20 hover:scale-105"
              )}
            >
              <span className="size-1.5 rounded-full bg-[#84FF00]" />
            </button>
          </div>

          <div className="h-3.5 w-[1px] bg-white/[0.08]" aria-hidden="true" />

          {/* Replay Sequence Button */}
          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay animation sequence"
            className="size-6 rounded-full bg-[#18181B] hover:bg-[#222226] text-[#8E9299] hover:text-[#F5F5F7] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ArrowCounterClockwise size={13} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
}

export default MorphingShareIsland;
